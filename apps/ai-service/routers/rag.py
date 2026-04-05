import uuid

from fastapi import APIRouter, Depends, Form, Query, UploadFile, File, HTTPException
from pydantic import BaseModel

from middleware.auth import verify_internal_secret
from services import rag

router = APIRouter()

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10MB


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
    chunks = await rag.ingest(
        req.orgId, req.docId, req.content, req.filename, req.isPdf
    )
    return {"docId": req.docId, "chunks": chunks}


@router.post("/rag/upload", summary="Upload a file (PDF or text) for ingestion")
async def upload(
    orgId: str = Form(...),
    file: UploadFile = File(...),
    _: None = Depends(verify_internal_secret),
):
    """
    Accepts a real file upload (multipart/form-data).
    Supports .pdf, .txt, .md, .csv, and any plain-text file.
    """
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    is_pdf = ext == "pdf"

    raw = b""
    chunk = await file.read(1024 * 1024)  # 1MB chunks
    while chunk:
        raw += chunk
        if len(raw) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File too large")
        chunk = await file.read(1024 * 1024)

    if is_pdf:
        import base64

        content = base64.b64encode(raw).decode("utf-8")
    else:
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400, detail="File must be a PDF or a UTF-8 text file."
            )

    doc_id = str(uuid.uuid4())
    chunks = await rag.ingest(orgId, doc_id, content, filename, is_pdf)
    return {"docId": doc_id, "filename": filename, "chunks": chunks}


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
