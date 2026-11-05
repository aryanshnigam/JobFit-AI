import json
import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.nlp.text_cleaner import clean_text
from app.nlp.section_extractor import extract_sections
from app.nlp.skill_extractor import extractor
from app.ml.scoring_engine import scoring_engine
from app.services.llm_service import llm_service
from app.db.models import Resume, JobDescription, Analysis, MatchResult, AnalysisEvidence, Recommendation

class MatchingService:
    def run_pipeline(
        self, 
        resume_text: str, 
        job_text: str, 
        job_title: str = "Target Position",
        candidate_name: str = "Candidate",
        resume_filename: str = "Pasted Resume",
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """
        Complete end-to-end execution of the JobFit AI ML pipeline.
        """
        # Step 1: Text Cleaning & Section Splitting
        c_resume_text = clean_text(resume_text)
        c_job_text = clean_text(job_text)
        
        sections = extract_sections(c_resume_text)
        
        # Step 2: Skill Extraction & Normalization
        resume_skills = extractor.extract_skills(c_resume_text)
        job_skills = extractor.extract_skills(c_job_text)
        
        # Step 3: Embeddings & Scoring Engine Comparison
        match_analysis = scoring_engine.analyze(
            resume_text=c_resume_text,
            resume_sections=sections,
            resume_skills=resume_skills,
            job_text=c_job_text,
            job_skills=job_skills
        )
        
        # Step 4: LLM Explanation & Personalized Recommendation Generation
        rec_data = llm_service.generate_recommendations({
            "compatibility_score": match_analysis["compatibility_score"],
            "label": match_analysis["label"],
            "score_breakdown": match_analysis["score_breakdown"],
            "matched_skills": match_analysis["matched_skills"],
            "partial_skills": match_analysis["partial_skills"],
            "missing_skills": match_analysis["missing_skills"],
            "job_title": job_title
        })

        now_str = datetime.datetime.utcnow().isoformat()
        
        # Format response
        result_payload = {
            "analysis_id": "temp-id",
            "created_at": now_str,
            "job_title": job_title,
            "candidate_name": candidate_name,
            "compatibility_score": match_analysis["compatibility_score"],
            "label": match_analysis["label"],
            "score_breakdown": match_analysis["score_breakdown"],
            "matched_skills": match_analysis["matched_skills"],
            "partial_skills": match_analysis["partial_skills"],
            "missing_skills": match_analysis["missing_skills"],
            "evidence": match_analysis["evidence"],
            "recommendations": rec_data
        }
        
        # Step 5: Save to Database if session provided
        if db:
            try:
                db_resume = Resume(
                    filename=resume_filename,
                    file_type="txt",
                    raw_text=c_resume_text,
                    sections_json=sections
                )
                db_job = JobDescription(
                    title=job_title,
                    company="Target Company",
                    description_text=c_job_text,
                    skills_json=job_skills
                )
                db.add(db_resume)
                db.add(db_job)
                db.flush()
                
                db_analysis = Analysis(
                    resume_id=db_resume.id,
                    job_id=db_job.id,
                    compatibility_score=match_analysis["compatibility_score"],
                    label=match_analysis["label"],
                    score_breakdown_json=match_analysis["score_breakdown"]
                )
                db.add(db_analysis)
                db.flush()
                
                db_match = MatchResult(
                    analysis_id=db_analysis.id,
                    matched_skills_json=match_analysis["matched_skills"],
                    partial_skills_json=match_analysis["partial_skills"],
                    missing_skills_json=match_analysis["missing_skills"]
                )
                db.add(db_match)
                
                for ev in match_analysis["evidence"]:
                    db_ev = AnalysisEvidence(
                        analysis_id=db_analysis.id,
                        requirement_text=ev["requirement"],
                        status=ev["status"],
                        evidence_quote=ev["evidence_quote"],
                        relevance_score=ev["relevance_score"]
                    )
                    db.add(db_ev)
                    
                db_rec = Recommendation(
                    analysis_id=db_analysis.id,
                    provider_used=rec_data.get("provider_used", "Rule Engine"),
                    explanation=rec_data.get("explanation", ""),
                    skill_gap_summary_json=rec_data.get("skill_gap_summary", []),
                    learning_path_json=rec_data.get("recommended_learning_path", []),
                    projects_json=rec_data.get("suggested_projects", [])
                )
                db.add(db_rec)
                db.commit()
                
                result_payload["analysis_id"] = db_analysis.id
                result_payload["created_at"] = db_analysis.created_at.isoformat()
            except Exception as e:
                db.rollback()
                print(f"[MatchingService] DB save warning: {e}")
                import uuid
                result_payload["analysis_id"] = str(uuid.uuid4())

        return result_payload

matching_service = MatchingService()
