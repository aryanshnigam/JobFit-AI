import uuid
import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    raw_text = Column(Text, nullable=False)
    sections_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("Analysis", back_populates="resume", cascade="all, delete-orphan")

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    description_text = Column(Text, nullable=False)
    skills_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("Analysis", back_populates="job", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=True)
    job_id = Column(String(36), ForeignKey("job_descriptions.id"), nullable=True)
    
    compatibility_score = Column(Integer, nullable=False)
    label = Column(String(100), nullable=False)
    score_breakdown_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="analyses")
    job = relationship("JobDescription", back_populates="analyses")
    match_result = relationship("MatchResult", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    evidences = relationship("AnalysisEvidence", back_populates="analysis", cascade="all, delete-orphan")
    recommendation = relationship("Recommendation", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    
    matched_skills_json = Column(JSON, nullable=False)
    partial_skills_json = Column(JSON, nullable=False)
    missing_skills_json = Column(JSON, nullable=False)

    analysis = relationship("Analysis", back_populates="match_result")

class AnalysisEvidence(Base):
    __tablename__ = "analysis_evidences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    
    requirement_text = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    evidence_quote = Column(Text, nullable=False)
    relevance_score = Column(Float, nullable=False)

    analysis = relationship("Analysis", back_populates="evidences")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    
    provider_used = Column(String(100), nullable=False)
    explanation = Column(Text, nullable=False)
    skill_gap_summary_json = Column(JSON, nullable=False)
    learning_path_json = Column(JSON, nullable=False)
    projects_json = Column(JSON, nullable=False)

    analysis = relationship("Analysis", back_populates="recommendation")
