from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Analysis, MatchResult, AnalysisEvidence, Recommendation
from app.schemas.analysis import AnalysisResponse, AnalysisSummaryItem

router = APIRouter()

@router.get("/analyses", response_model=List[AnalysisSummaryItem])
def list_analyses(db: Session = Depends(get_db)):
    """
    List all previous analyses saved in the database.
    """
    records = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    results = []
    
    for item in records:
        matched_cnt = len(item.match_result.matched_skills_json) if item.match_result else 0
        partial_cnt = len(item.match_result.partial_skills_json) if item.match_result else 0
        missing_cnt = len(item.match_result.missing_skills_json) if item.match_result else 0
        
        job_t = item.job.title if item.job and item.job.title else "Target Role"
        cand = "Candidate"
        
        results.append({
            "analysis_id": item.id,
            "created_at": item.created_at.isoformat(),
            "job_title": job_t,
            "candidate_name": cand,
            "compatibility_score": item.compatibility_score,
            "label": item.label,
            "matched_count": matched_cnt,
            "partial_count": partial_cnt,
            "missing_count": missing_cnt
        })
        
    return results

@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    """
    Retrieve full details for a specific historical analysis.
    """
    item = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Analysis ID '{analysis_id}' not found.")
        
    match_res = item.match_result
    rec_res = item.recommendation
    ev_records = item.evidences or []
    
    ev_list = [
        {
            "requirement": ev.requirement_text,
            "status": ev.status,
            "evidence_quote": ev.evidence_quote,
            "relevance_score": ev.relevance_score
        }
        for ev in ev_records
    ]
    
    rec_data = {
        "provider_used": rec_res.provider_used if rec_res else "Rule Engine",
        "explanation": rec_res.explanation if rec_res else "",
        "skill_gap_summary": rec_res.skill_gap_summary_json if rec_res else [],
        "recommended_learning_path": rec_res.learning_path_json if rec_res else [],
        "suggested_projects": rec_res.projects_json if rec_res else []
    }
    
    return {
        "analysis_id": item.id,
        "created_at": item.created_at.isoformat(),
        "job_title": item.job.title if item.job else "Target Role",
        "candidate_name": "Candidate",
        "compatibility_score": item.compatibility_score,
        "label": item.label,
        "score_breakdown": item.score_breakdown_json,
        "matched_skills": match_res.matched_skills_json if match_res else [],
        "partial_skills": match_res.partial_skills_json if match_res else [],
        "missing_skills": match_res.missing_skills_json if match_res else [],
        "evidence": ev_list,
        "recommendations": rec_data
    }
