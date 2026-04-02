import os
from typing import Any

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointIdsList
from qdrant_client.models import Filter, FieldCondition, MatchValue

EMBEDDING_MODEL = "models/text-embedding-004"
VECTOR_SIZE = 768  # text-embedding-004 output dimension
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def _collection_name(org_id: str) -> str:
    return f"org_{org_id}"


def _get_client() -> QdrantClient:
    return QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY"),
    )


def _get_embeddings() -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )


def _ensure_collection(client: QdrantClient, collection_name: str) -> None:
    existing = [c.name for c in client.get_collections().collections]
    if collection_name not in existing:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )


async def ingest(org_id: str, doc_id: str, content: str, filename: str, is_pdf: bool = False) -> int:
    """Split, embed, and upsert document chunks. Returns chunk count."""
    if is_pdf:
        import base64
        import io
        from pypdf import PdfReader
        pdf_bytes = base64.b64decode(content)
        reader = PdfReader(io.BytesIO(pdf_bytes))
        content = "\n".join(page.extract_text() or "" for page in reader.pages)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_text(content)

    client = _get_client()
    collection_name = _collection_name(org_id)
    _ensure_collection(client, collection_name)

    store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=_get_embeddings(),
    )

    metadatas = [
        {"doc_id": doc_id, "filename": filename, "org_id": org_id, "chunk_index": i}
        for i in range(len(chunks))
    ]

    await store.aadd_texts(chunks, metadatas=metadatas)
    return len(chunks)


async def retrieve(org_id: str, query: str, k: int = 5) -> list[dict[str, Any]]:
    """Embed query and return top-k similar chunks."""
    client = _get_client()
    collection_name = _collection_name(org_id)

    existing = [c.name for c in client.get_collections().collections]
    if collection_name not in existing:
        return []

    store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=_get_embeddings(),
    )

    results = await store.asimilarity_search_with_score(query, k=k)
    return [
        {
            "content": doc.page_content,
            "metadata": doc.metadata,
            "score": float(score),
        }
        for doc, score in results
    ]


def list_docs(org_id: str) -> list[dict[str, Any]]:
    """Return deduplicated list of documents in this org's collection."""
    client = _get_client()
    collection_name = _collection_name(org_id)

    existing = [c.name for c in client.get_collections().collections]
    if collection_name not in existing:
        return []

    seen: dict[str, dict[str, Any]] = {}
    offset = None

    while True:
        result, next_offset = client.scroll(
            collection_name=collection_name,
            with_payload=True,
            limit=100,
            offset=offset,
        )
        for point in result:
            payload = point.payload or {}
            doc_id = payload.get("doc_id")
            if doc_id and doc_id not in seen:
                seen[doc_id] = {
                    "docId": doc_id,
                    "filename": payload.get("filename", ""),
                }
        if next_offset is None:
            break
        offset = next_offset

    # Count chunks per doc
    for doc_id, info in seen.items():
        count = client.count(
            collection_name=collection_name,
            count_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            ),
            exact=True,
        )
        info["chunks"] = count.count

    return list(seen.values())


def delete_doc(org_id: str, doc_id: str) -> None:
    """Delete all chunks for a document from the org's collection."""
    client = _get_client()
    collection_name = _collection_name(org_id)

    existing = [c.name for c in client.get_collections().collections]
    if collection_name not in existing:
        return

    client.delete(
        collection_name=collection_name,
        points_selector=Filter(
            must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
        ),
    )
