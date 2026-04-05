import asyncio
import os
from typing import AsyncGenerator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
from pydantic import BaseModel

from middleware.auth import verify_internal_secret
from services.metering import record_usage
from services import rag

router = APIRouter()
client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

MODEL = "gemini-2.5-flash"


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    userId: str = ""
    orgId: str = ""


async def build_messages(req: ChatRequest) -> list[dict]:
    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    print(f"[RAG] orgId='{req.orgId}'")

    if not req.orgId:
        print("[RAG] no orgId — skipping retrieval")
        return messages

    user_messages = [m for m in req.messages if m.role == "user"]
    if not user_messages:
        return messages

    query = user_messages[-1].content
    print(f"[RAG] query='{query}'")

    try:
        results = await rag.retrieve(req.orgId, query, k=5)
        print(f"[RAG] retrieved {len(results)} chunks")
    except Exception as e:
        print(f"[RAG] error retrieving: {e}")
        return messages

    if not results:
        print("[RAG] no results — check orgId matches the one used during upload")
        return messages

    for i, r in enumerate(results):
        print(
            f"[RAG] chunk {i}: score={r['score']:.3f} file={r['metadata'].get('filename')}"
        )

    context = "\n\n---\n\n".join(
        f"Source: {r['metadata'].get('filename', 'unknown')}\n{r['content']}"
        for r in results
    )

    # Check for existing system message
    existing_system = next((m for m in messages if m["role"] == "system"), None)
    if existing_system:
        existing_system["content"] += (
            "\n\nYou are a helpful assistant. Use the following context from the "
            "organisation's knowledge base to answer the user's question. "
            "If the answer is not in the context, say so — do not make things up.\n\n"
            f"Context:\n{context}"
        )
    else:
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful assistant. Use the following context from the "
                "organisation's knowledge base to answer the user's question. "
                "If the answer is not in the context, say so — do not make things up.\n\n"
                f"Context:\n{context}"
            ),
        }
        messages = [system_message] + messages
    return messages


async def stream_tokens(req: ChatRequest) -> AsyncGenerator[str, None]:
    input_tokens = 0
    output_tokens = 0

    try:
        messages = await build_messages(req)

        stream = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
            stream=True,
            stream_options={"include_usage": True},
        )

        async for chunk in stream:
            if chunk.usage:
                input_tokens = chunk.usage.prompt_tokens
                output_tokens = chunk.usage.completion_tokens

            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

        # Fire-and-forget usage recording after stream completes
        if req.userId or req.orgId:
            asyncio.create_task(
                record_usage(req.orgId, req.userId, MODEL, input_tokens, output_tokens)
            )
    except Exception as e:
        yield f"\n\n[Error: {str(e)}]"


@router.post("/chat")
async def chat(
    req: ChatRequest,
    _: None = Depends(verify_internal_secret),
):
    return StreamingResponse(
        stream_tokens(req),
        media_type="text/plain; charset=utf-8",
        headers={"X-Accel-Buffering": "no"},
    )
