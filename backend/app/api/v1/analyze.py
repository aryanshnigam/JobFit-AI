from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.analysis import AnalyzeRequest, AnalysisResponse
from app.services.matching_service import matching_service
from app.services.resume_parser import parse_resume_file

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_match(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description_text: str = Form(...),
    job_title: Optional[str] = Form("Target Position"),
    candidate_name: Optional[str] = Form("Candidate"),
    db: Session = Depends(get_db)
):
    """
    Run full ML/NLP analysis pipeline comparing candidate resume against job description.
    Accepts resume either as a uploaded PDF/DOCX file OR as plain text.
    """
    final_resume_text = ""
    filename = "Pasted Resume"
    
    if resume_file and resume_file.filename:
        filename = resume_file.filename
        contents = await resume_file.read()
        try:
            final_resume_text, _ = parse_resume_file(contents, filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Resume file parsing error: {str(e)}")
    elif resume_text and resume_text.strip():
        final_resume_text = resume_text.strip()
    else:
        raise HTTPException(status_code=400, detail="Please provide either a resume file upload or resume text.")

    if not job_description_text or len(job_description_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description text is required and must be at least 20 characters.")

    try:
        result = matching_service.run_pipeline(
            resume_text=final_resume_text,
            job_text=job_description_text,
            job_title=job_title or "Target Position",
            candidate_name=candidate_name or "Candidate",
            resume_filename=filename,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Pipeline execution failed: {str(e)}")
