import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db
from app.ml.embeddings import embedding_service
from app.api.v1 import upload, jobs, analyze, analyses, demo, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print(f"[Lifespan] Initializing database tables...")
    try:
        init_db()
    except Exception as e:
        print(f"[Lifespan] DB Init Notice: {e}")
        
    print(f"[Lifespan] Loading ML embedding model '{settings.EMBEDDING_MODEL_NAME}'...")
    _ = embedding_service.embedding_dim
    print(f"[Lifespan] Startup complete. JobFit AI is ready.")
    yield
    # Shutdown actions
    print(f"[Lifespan] Shutting down JobFit AI service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["Resume"])
app.include_router(jobs.router, prefix=settings.API_V1_STR, tags=["Jobs"])
app.include_router(analyze.router, prefix=settings.API_V1_STR, tags=["Analysis"])
app.include_router(analyses.router, prefix=settings.API_V1_STR, tags=["History"])
app.include_router(demo.router, prefix=settings.API_V1_STR, tags=["Demo"])

@app.get("/")
def root():
    return {
        "message": "Welcome to JobFit AI - Semantic Resume-Job Matching & Skill Gap Analyzer",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
