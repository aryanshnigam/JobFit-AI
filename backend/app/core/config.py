import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "JobFit AI"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./jobfit.db")
    
    # Embedding Model Settings
    # Default to BAAI/bge-small-en-v1.5 as requested
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "BAAI/bge-small-en-v1.5")
    
    # Similarity Thresholds (Configurable)
    SIMILARITY_MATCH_THRESHOLD: float = 0.78
    SIMILARITY_PARTIAL_THRESHOLD: float = 0.55
    
    # Scoring Engine Conceptual Weights (Configurable)
    WEIGHT_TECHNICAL_SKILLS: float = 0.50
    WEIGHT_SEMANTIC_RELEVANCE: float = 0.25
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_EDUCATION: float = 0.10
    
    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")  # gemini, nemotron, or fallback
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    NEMOTRON_API_KEY: Optional[str] = os.getenv("NEMOTRON_API_KEY", "")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
