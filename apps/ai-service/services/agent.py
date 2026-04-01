from datetime import datetime, timezone
from agents import Agent, function_tool, OpenAIChatCompletionsModel
from openai import AsyncOpenAI


import os

gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

gemini_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash", openai_client=gemini_client
)


@function_tool
def get_current_time() -> str:
    """Returns the current UTC time."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")


# The demo agent — proves tool calling works end-to-end
demo_agent = Agent(
    name="DemoAgent",
    instructions=(
        "You are a helpful assistant. "
        "When asked about the current time, use the get_current_time tool. "
        "Be concise and accurate."
    ),
    tools=[get_current_time],
    model=gemini_model,
)
