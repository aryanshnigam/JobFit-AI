from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.nlp.text_cleaner import clean_text
from app.nlp.skill_extractor import extractor

router = APIRouter()

class JobInputSchema(BaseModel):
    title: Optional[str] = "Target Role"
    company: Optional[str] = "Target Company"
    description_text: str

@router.post("/jobs")
def create_job(job_in: JobInputSchema):
    if not job_in.description_text or len(job_in.description_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description text is too short or empty.")
        
    cleaned_jd = clean_text(job_in.description_text)
    extracted_skills = extractor.extract_skills(cleaned_jd)
    
    return {
        "title": job_in.title,
        "company": job_in.company,
        "description_text": cleaned_jd,
        "extracted_skills": extracted_skills
    }
