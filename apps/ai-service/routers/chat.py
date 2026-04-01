import asyncio
import os
from typing import AsyncGenerator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
from pydantic import BaseModel

from middleware.auth import verify_internal_secret
from services.metering import record_usage

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


async def stream_tokens(req: ChatRequest) -> AsyncGenerator[str, None]:
    input_tokens = 0
    output_tokens = 0

    try:
        stream = await client.chat.completions.create(
            model=MODEL,
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
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
