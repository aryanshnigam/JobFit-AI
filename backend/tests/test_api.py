import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_demo_endpoint():
    response = client.post("/api/v1/demo/load", json={"demo_id": "ml_engineer"})
    assert response.status_code == 200
    data = response.json()
    assert "compatibility_score" in data
    assert data["job_title"] == "Senior Machine Learning Engineer (AI & NLP)"
    assert len(data["matched_skills"]) > 0

def test_analyze_endpoint():
    payload = {
        "job_description_text": "We need a Python developer experienced in FastAPI, SQL, and Docker containerization.",
        "job_title": "Backend Developer",
        "candidate_name": "Test User"
    }
    files = {
        "resume_text": (None, "Senior Python engineer with 4 years building REST APIs using FastAPI, PostgreSQL, and Docker.")
    }
    response = client.post("/api/v1/analyze", data=payload, files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["compatibility_score"] > 60
    assert "score_breakdown" in data
