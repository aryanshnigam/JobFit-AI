import pytest
import numpy as np
from app.ml.embeddings import embedding_service
from app.ml.cosine_similarity import compute_cosine_similarity, compute_similarity_matrix
from app.ml.scoring_engine import scoring_engine

def test_embedding_service():
    vec = embedding_service.embed_text("Machine Learning Engineer with Python experience")
    assert isinstance(vec, np.ndarray)
    assert vec.ndim == 1
    assert len(vec) == embedding_service.embedding_dim

def test_cosine_similarity():
    v1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
    v2 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
    v3 = np.array([0.0, 1.0, 0.0], dtype=np.float32)
    
    assert abs(compute_cosine_similarity(v1, v2) - 1.0) < 1e-4
    assert abs(compute_cosine_similarity(v1, v3) - 0.0) < 1e-4

def test_scoring_engine():
    resume_text = "Experienced Python developer with FastAPI, PostgreSQL, Docker and AWS skills."
    resume_sections = {"skills": "Python, FastAPI, PostgreSQL, Docker, AWS", "experience": "Developed REST APIs with FastAPI"}
    resume_skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"]
    
    job_text = "Looking for a Python Backend Engineer with FastAPI, PostgreSQL, and Docker."
    job_skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes"]
    
    res = scoring_engine.analyze(
        resume_text=resume_text,
        resume_sections=resume_sections,
        resume_skills=resume_skills,
        job_text=job_text,
        job_skills=job_skills
    )
    
    assert "compatibility_score" in res
    assert 0 <= res["compatibility_score"] <= 100
    assert "score_breakdown" in res
    assert len(res["matched_skills"]) >= 4
    all_non_exact = [s["skill"] for s in res["missing_skills"] + res["partial_skills"]]
    assert "Kubernetes" in all_non_exact
