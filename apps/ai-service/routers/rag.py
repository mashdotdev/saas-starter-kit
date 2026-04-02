from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from middleware.auth import verify_internal_secret
from services import rag

router = APIRouter()


class IngestRequest(BaseModel):
    orgId: str
    docId: str
    filename: str
    content: str
    isPdf: bool = False


class RetrieveRequest(BaseModel):
    orgId: str
    query: str
    k: int = 5


class DeleteRequest(BaseModel):
    orgId: str
    docId: str


@router.post("/rag/ingest")
async def ingest(
    req: IngestRequest,
    _: None = Depends(verify_internal_secret),
):
    chunks = await rag.ingest(req.orgId, req.docId, req.content, req.filename, req.isPdf)
    return {"docId": req.docId, "chunks": chunks}


@router.post("/rag/retrieve")
async def retrieve(
    req: RetrieveRequest,
    _: None = Depends(verify_internal_secret),
):
    results = await rag.retrieve(req.orgId, req.query, req.k)
    return {"results": results}


@router.get("/rag/list")
def list_docs(
    orgId: str = Query(...),
    _: None = Depends(verify_internal_secret),
):
    docs = rag.list_docs(orgId)
    return docs


@router.delete("/rag/delete")
def delete_doc(
    req: DeleteRequest,
    _: None = Depends(verify_internal_secret),
):
    rag.delete_doc(req.orgId, req.docId)
    return {"success": True}
