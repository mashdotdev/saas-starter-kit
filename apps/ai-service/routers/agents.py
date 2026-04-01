import os
from typing import Any

from agents import Runner
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from middleware.auth import verify_internal_secret
from services.agent import demo_agent
from services.metering import record_usage

router = APIRouter()


class AgentRequest(BaseModel):
    task: str
    userId: str = ""
    orgId: str = ""


class ToolCallLog(BaseModel):
    tool: str
    input: Any
    output: Any


class AgentResponse(BaseModel):
    result: str
    toolCalls: list[ToolCallLog]
    inputTokens: int
    outputTokens: int


@router.post("/agents/run", response_model=AgentResponse)
async def run_agent(
    req: AgentRequest,
    _: None = Depends(verify_internal_secret),
):
    result = await Runner.run(demo_agent, req.task)

    # Extract tool calls from run history
    tool_calls: list[ToolCallLog] = []
    input_tokens = 0
    output_tokens = 0

    for item in result.raw_responses:
        if hasattr(item, "usage") and item.usage:
            input_tokens += getattr(item.usage, "input_tokens", 0)
            output_tokens += getattr(item.usage, "output_tokens", 0)

    for item in result.new_items:
        item_type = type(item).__name__
        if "ToolCall" in item_type:
            tool_calls.append(
                ToolCallLog(
                    tool=getattr(item, "name", "unknown"),
                    input=getattr(item, "arguments", {}),
                    output=None,
                )
            )
        elif "ToolResult" in item_type:
            # Update last tool call with its output
            if tool_calls:
                tool_calls[-1].output = getattr(item, "output", None)

    final_output = str(result.final_output) if result.final_output else ""

    # Record usage
    if req.userId or req.orgId:
        await record_usage(
            req.orgId, req.userId, "gpt-4o-mini", input_tokens, output_tokens
        )

    return AgentResponse(
        result=final_output,
        toolCalls=tool_calls,
        inputTokens=input_tokens,
        outputTokens=output_tokens,
    )
