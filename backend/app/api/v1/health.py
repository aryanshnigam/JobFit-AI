from fastapi import APIRouter
from app.core.config import settings
from app.ml.embeddings import embedding_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "embedding_model": settings.EMBEDDING_MODEL_NAME,
        "embedding_dim": embedding_service.embedding_dim,
        "llm_provider": settings.LLM_PROVIDER
    }
