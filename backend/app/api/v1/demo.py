import os
import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.analysis import AnalysisResponse
from app.services.matching_service import matching_service

router = APIRouter()

class DemoLoadRequest(BaseModel):
    demo_id: str  # ml_engineer, backend_developer, data_analyst

@router.post("/demo/load", response_model=AnalysisResponse)
def load_demo(req: DemoLoadRequest, db: Session = Depends(get_db)):
    """
    Execute full ML matching pipeline on pre-built sample datasets.
    Supported IDs: 'ml_engineer', 'backend_developer', 'data_analyst'.
    """
    # Look for data/sample_data relative to monorepo root or current working directory
    file_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(file_dir, "..", "..", "..", "..", "data", "sample_data"),
        os.path.join(os.getcwd(), "data", "sample_data"),
        os.path.join(os.getcwd(), "..", "data", "sample_data")
    ]
    
    sample_dir = None
    for cand in candidates:
        norm = os.path.normpath(cand)
        if os.path.exists(norm):
            sample_dir = norm
            break
            
    if not sample_dir:
        raise HTTPException(status_code=500, detail="Sample data directory 'data/sample_data' not found.")
        
    resumes_path = os.path.join(sample_dir, "sample_resumes.json")
    jobs_path = os.path.join(sample_dir, "sample_jobs.json")

    with open(resumes_path, "r", encoding="utf-8") as f:
        resumes_data = json.load(f)
        
    with open(jobs_path, "r", encoding="utf-8") as f:
        jobs_data = json.load(f)

    # Find matching resume and job description
    res_obj = next((r for r in resumes_data if r["id"] == req.demo_id), None)
    job_key = f"{req.demo_id}_job"
    job_obj = next((j for j in jobs_data if j["id"] == job_key), None)
    
    if not res_obj or not job_obj:
        raise HTTPException(
            status_code=404, 
            detail=f"Demo profile '{req.demo_id}' not found. Available demos: ml_engineer, backend_developer, data_analyst"
        )
        
    result = matching_service.run_pipeline(
        resume_text=res_obj["text"],
        job_text=job_obj["description"],
        job_title=job_obj["title"],
        candidate_name=res_obj["candidate_name"],
        resume_filename=f"Demo_{res_obj['candidate_name'].replace(' ', '_')}.pdf",
        db=db
    )
    
    return result
