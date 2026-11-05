import pytest
from app.nlp.text_cleaner import clean_text
from app.nlp.section_extractor import extract_sections
from app.nlp.skill_normalizer import normalizer
from app.nlp.skill_extractor import extractor

def test_clean_text():
    raw = "  Hello   World!\n\n\u2022 Skill 1\n\u2022 Skill 2  "
    cleaned = clean_text(raw)
    assert "Hello World!" in cleaned
    assert "- Skill 1" in cleaned

def test_section_extractor():
    text = """
    SUMMARY
    Senior developer with 5 years experience.
    
    TECHNICAL SKILLS
    Python, FastAPI, Docker
    
    WORK EXPERIENCE
    Software Engineer at Acme Corp.
    
    EDUCATION
    BS in Computer Science.
    """
    sections = extract_sections(text)
    assert "summary" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "education" in sections
    assert "Senior developer" in sections["summary"]
    assert "Python" in sections["skills"]

def test_skill_normalization():
    assert normalizer.normalize_skill("ml") == "Machine Learning"
    assert normalizer.normalize_skill("fastapi") == "FastAPI"
    assert normalizer.normalize_skill("postgres") == "PostgreSQL"
    assert normalizer.normalize_skill("aws") == "AWS"

def test_skill_extraction():
    text = "We are seeking a Python developer proficient in FastAPI, Docker, and PostgreSQL with experience in PyTorch and Machine Learning."
    skills = extractor.extract_skills(text)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "Docker" in skills
    assert "PostgreSQL" in skills
    assert "PyTorch" in skills
    assert "Machine Learning" in skills
