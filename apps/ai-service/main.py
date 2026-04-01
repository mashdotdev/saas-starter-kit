import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.chat import router as chat_router
from routers.agents import router as agents_router

app = FastAPI(title="AI Service", version="1.0.0")

# CORS — allow Next.js dev server and production URL
origins = [
    "http://localhost:3000",
    os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(agents_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
