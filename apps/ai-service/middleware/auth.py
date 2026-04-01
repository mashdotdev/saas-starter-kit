import os
from fastapi import Header, HTTPException


async def verify_internal_secret(x_internal_secret: str = Header(...)):
    """Verifies the shared secret between Next.js and FastAPI."""
    expected = os.getenv("AI_SERVICE_INTERNAL_SECRET", "")
    if not expected:
        raise HTTPException(status_code=500, detail="AI_SERVICE_INTERNAL_SECRET not configured")
    if x_internal_secret != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")
