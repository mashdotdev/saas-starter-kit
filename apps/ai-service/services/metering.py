import os
import asyncpg
from decimal import Decimal


# Gemini pricing per 1K tokens (USD)
PRICING = {
    "gemini-2.5-flash": {"input": 0.000150, "output": 0.000600},
    "gemini-2.5-pro":   {"input": 0.001250, "output": 0.010000},
    "gemini-2.0-flash": {"input": 0.000100, "output": 0.000400},
    "gemini-1.5-flash": {"input": 0.000075, "output": 0.000300},
    "gemini-1.5-pro":   {"input": 0.001250, "output": 0.005000},
}


def compute_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    prices = PRICING.get(model, PRICING["gemini-2.5-flash"])
    return (input_tokens * prices["input"] + output_tokens * prices["output"]) / 1000


async def record_usage(
    org_id: str,
    user_id: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
) -> None:
    """Write a row to ai_usage in Supabase (direct connection)."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return

    cost = compute_cost(model, input_tokens, output_tokens)

    try:
        conn = await asyncpg.connect(database_url)
        try:
            await conn.execute(
                """
                INSERT INTO "ai_usage" ("id", "orgId", "userId", "model", "inputTokens", "outputTokens", "cost", "usedAt")
                VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW())
                """,
                org_id,
                user_id,
                model,
                input_tokens,
                output_tokens,
                Decimal(str(cost)),
            )
        finally:
            await conn.close()
    except Exception as e:
        # Log but never let metering failures break the AI response
        print(f"[metering] Failed to record usage: {e}")
