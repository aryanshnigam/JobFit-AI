from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import parse_resume_file
from app.nlp.skill_extractor import extractor

router = APIRouter()

@router.post("/resumes/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and parse a resume file (PDF, DOCX, TXT).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name cannot be empty.")
        
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")
        
    try:
        raw_text, sections = parse_resume_file(contents, file.filename)
        skills = extractor.extract_skills(raw_text)
        
        return {
            "filename": file.filename,
            "file_size_bytes": len(contents),
            "status": "parsed_successfully",
            "extracted_text": raw_text,
            "sections": sections,
            "extracted_skills": skills
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
