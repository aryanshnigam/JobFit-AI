import re
from typing import Dict, List, Any, Tuple
import numpy as np
from app.core.config import settings
from app.ml.embeddings import embedding_service
from app.ml.cosine_similarity import compute_cosine_similarity, compute_similarity_matrix
from app.nlp.skill_normalizer import normalizer

class ScoringEngine:
    def __init__(self):
        self.match_threshold = settings.SIMILARITY_MATCH_THRESHOLD
        self.partial_threshold = settings.SIMILARITY_PARTIAL_THRESHOLD
        
        self.w_tech = settings.WEIGHT_TECHNICAL_SKILLS      # 0.50
        self.w_sem = settings.WEIGHT_SEMANTIC_RELEVANCE      # 0.25
        self.w_exp = settings.WEIGHT_EXPERIENCE              # 0.15
        self.w_edu = settings.WEIGHT_EDUCATION               # 0.10

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences for sentence-level evidence extraction."""
        if not text:
            return []
        raw_sentences = re.split(r'(?<=[.!?])\s+|\n+', text)
        cleaned = [s.strip() for s in raw_sentences if len(s.strip()) > 10]
        return cleaned

    def analyze(
        self, 
        resume_text: str, 
        resume_sections: Dict[str, str], 
        resume_skills: List[str], 
        job_text: str, 
        job_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Execute full matching, skill classification, scoring breakdown, and evidence extraction.
        """
        # 1. Technical Skill Matching & Categorization
        matched_skills = []
        partial_skills = []
        missing_skills = []
        
        resume_skills_set = set(resume_skills)
        
        # Prepare embeddings for skills semantic fallback comparison
        remaining_job_skills = [s for s in job_skills if s not in resume_skills_set]
        
        # Exact taxonomy match
        for s in job_skills:
            if s in resume_skills_set:
                matched_skills.append({
                    "skill": s,
                    "score": 1.0,
                    "match_type": "exact",
                    "category": normalizer.get_category(s)
                })
                
        # Semantic similarity for non-exact job skills
        if remaining_job_skills and resume_skills:
            job_skill_vecs = embedding_service.embed_batch(remaining_job_skills)
            res_skill_vecs = embedding_service.embed_batch(resume_skills)
            sim_matrix = compute_similarity_matrix(job_skill_vecs, res_skill_vecs)
            
            for i, job_skill in enumerate(remaining_job_skills):
                max_sim_idx = np.argmax(sim_matrix[i]) if sim_matrix.shape[1] > 0 else -1
                max_sim = float(sim_matrix[i, max_sim_idx]) if max_sim_idx >= 0 else 0.0
                
                if max_sim >= self.match_threshold:
                    matched_skills.append({
                        "skill": job_skill,
                        "score": round(max_sim, 2),
                        "match_type": "semantic",
                        "matched_with": resume_skills[max_sim_idx],
                        "category": normalizer.get_category(job_skill)
                    })
                elif max_sim >= self.partial_threshold:
                    partial_skills.append({
                        "skill": job_skill,
                        "score": round(max_sim, 2),
                        "match_type": "partial",
                        "matched_with": resume_skills[max_sim_idx],
                        "category": normalizer.get_category(job_skill)
                    })
                else:
                    missing_skills.append({
                        "skill": job_skill,
                        "score": round(max_sim, 2),
                        "category": normalizer.get_category(job_skill)
                    })
        elif remaining_job_skills:
            for job_skill in remaining_job_skills:
                missing_skills.append({
                    "skill": job_skill,
                    "score": 0.0,
                    "category": normalizer.get_category(job_skill)
                })

        # Calculate Tech Skill Match Ratio (0 - 100)
        total_job_skills = len(job_skills) if job_skills else 1
        tech_skill_score_ratio = (len(matched_skills) * 1.0 + len(partial_skills) * 0.5) / float(total_job_skills)
        tech_skill_score_ratio = min(1.0, max(0.0, tech_skill_score_ratio))
        
        # 2. Semantic Resume/JD Relevance Score
        resume_vec = embedding_service.embed_text(resume_text)
        job_vec = embedding_service.embed_text(job_text)
        semantic_sim = compute_cosine_similarity(resume_vec, job_vec)
        # Normalize semantic similarity to 0-1
        semantic_score_ratio = max(0.0, (semantic_sim + 1.0) / 2.0)

        # 3. Experience Relevance Score
        exp_text = resume_sections.get("experience", "") or resume_text
        exp_vec = embedding_service.embed_text(exp_text)
        exp_sim = compute_cosine_similarity(exp_vec, job_vec)
        exp_score_ratio = max(0.0, (exp_sim + 1.0) / 2.0)

        # 4. Education/Qualification Match Score
        edu_text = resume_sections.get("education", "") or resume_text
        edu_keywords = ["degree", "bachelor", "master", "phd", "bs", "ms", "computer science", "engineering"]
        edu_keyword_hits = sum(1 for kw in edu_keywords if kw in edu_text.lower())
        edu_base_score = min(1.0, edu_keyword_hits / 2.0) if edu_text else 0.5
        edu_vec = embedding_service.embed_text(edu_text)
        edu_sim = compute_cosine_similarity(edu_vec, job_vec)
        edu_score_ratio = 0.5 * edu_base_score + 0.5 * max(0.0, (edu_sim + 1.0) / 2.0)

        # 5. Weighted Score Components calculation
        tech_points = round(tech_skill_score_ratio * (self.w_tech * 100), 1)     # Max 50
        sem_points = round(semantic_score_ratio * (self.w_sem * 100), 1)          # Max 25
        exp_points = round(exp_score_ratio * (self.w_exp * 100), 1)              # Max 15
        edu_points = round(edu_score_ratio * (self.w_edu * 100), 1)              # Max 10
        
        overall_score = int(round(tech_points + sem_points + exp_points + edu_points))
        overall_score = min(100, max(0, overall_score))

        # Qualitative Label
        if overall_score >= 80:
            label = "Strong Compatibility"
        elif overall_score >= 65:
            label = "Moderate Match"
        elif overall_score >= 50:
            label = "Partial Fit"
        else:
            label = "Low Match"

        # 6. Evidence Extraction for Matched & Partial Skills/Requirements
        sentences = self._split_into_sentences(resume_text)
        evidence_list = []
        
        if sentences:
            sentence_vecs = embedding_service.embed_batch(sentences)
            
            for item in matched_skills + partial_skills:
                sk = item["skill"]
                sk_vec = embedding_service.embed_text(f"Experience with {sk}")
                sims = compute_similarity_matrix(sk_vec.reshape(1, -1), sentence_vecs)[0]
                
                # Also check direct keyword presence in sentence
                best_idx = int(np.argmax(sims))
                highest_sim = float(sims[best_idx])
                
                # Check for explicit keyword mention first
                exact_kw_sentences = [s for s in sentences if re.search(rf'\b{re.escape(sk.lower())}\b', s.lower())]
                quote = exact_kw_sentences[0] if exact_kw_sentences else sentences[best_idx]
                
                evidence_list.append({
                    "requirement": f"Skill: {sk}",
                    "status": "Matched" if item.get("match_type") != "partial" else "Partial Match",
                    "evidence_quote": quote,
                    "relevance_score": round(max(0.70, highest_sim), 2)
                })

        return {
            "compatibility_score": overall_score,
            "label": label,
            "score_breakdown": {
                "technical_skills": tech_points,
                "technical_skills_max": int(self.w_tech * 100),
                "semantic_relevance": sem_points,
                "semantic_relevance_max": int(self.w_sem * 100),
                "experience": exp_points,
                "experience_max": int(self.w_exp * 100),
                "education": edu_points,
                "education_max": int(self.w_edu * 100)
            },
            "matched_skills": matched_skills,
            "partial_skills": partial_skills,
            "missing_skills": missing_skills,
            "evidence": evidence_list[:8],  # Top evidence quotes
            "metrics": {
                "tech_skill_ratio": round(tech_skill_score_ratio, 2),
                "semantic_sim": round(semantic_sim, 2),
                "exp_sim": round(exp_sim, 2),
                "edu_sim": round(edu_sim, 2)
            }
        }

scoring_engine = ScoringEngine()
