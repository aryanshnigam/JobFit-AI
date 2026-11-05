from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class ScoreBreakdown(BaseModel):
    technical_skills: float
    technical_skills_max: int = 50
    semantic_relevance: float
    semantic_relevance_max: int = 25
    experience: float
    experience_max: int = 15
    education: float
    education_max: int = 10

class SkillMatchItem(BaseModel):
    skill: str
    score: float
    match_type: Optional[str] = "exact"
    matched_with: Optional[str] = None
    category: Optional[str] = "other"

class EvidenceItem(BaseModel):
    requirement: str
    status: str
    evidence_quote: str
    relevance_score: float

class LearningStep(BaseModel):
    step: int
    skill: str
    focus: str
    estimated_hours: int
    status: str = "Recommended"

class ProjectIdea(BaseModel):
    title: str
    description: str
    tech_stack: List[str]

class RecommendationData(BaseModel):
    provider_used: str
    explanation: str
    skill_gap_summary: List[str]
    recommended_learning_path: List[LearningStep]
    suggested_projects: List[ProjectIdea]

class AnalyzeRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description_text: str
    job_title: Optional[str] = "Target Role"
    candidate_name: Optional[str] = "Candidate"

class AnalysisResponse(BaseModel):
    analysis_id: str
    created_at: str
    job_title: str
    candidate_name: str
    compatibility_score: int
    label: str
    score_breakdown: ScoreBreakdown
    matched_skills: List[SkillMatchItem]
    partial_skills: List[SkillMatchItem]
    missing_skills: List[SkillMatchItem]
    evidence: List[EvidenceItem]
    recommendations: RecommendationData

class AnalysisSummaryItem(BaseModel):
    analysis_id: str
    created_at: str
    job_title: str
    candidate_name: str
    compatibility_score: int
    label: str
    matched_count: int
    partial_count: int
    missing_count: int
