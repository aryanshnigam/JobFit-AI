import re
from typing import Dict

SECTION_HEADERS = {
    "summary": [
        r"summary", r"professional summary", r"executive summary", 
        r"profile", r"objective", r"career objective", r"about me"
    ],
    "skills": [
        r"skills", r"technical skills", r"core competencies", 
        r"technologies", r"tools & technologies", r"domain skills", r"key skills"
    ],
    "experience": [
        r"experience", r"work experience", r"professional experience", 
        r"employment history", r"work history", r"career history", r"relevant experience"
    ],
    "education": [
        r"education", r"academic background", r"academic qualifications", 
        r"degrees", r"educational qualifications", r"qualifications"
    ],
    "projects": [
        r"projects", r"key projects", r"technical projects", 
        r"academic projects", r"selected projects"
    ],
    "certifications": [
        r"certifications", r"licenses", r"courses", 
        r"certifications & training", r"credentials"
    ]
}

def extract_sections(text: str) -> Dict[str, str]:
    """
    Split resume text into modular sections using regular expressions and boundary detection.
    """
    if not text:
        return {
            "summary": "",
            "skills": "",
            "experience": "",
            "education": "",
            "projects": "",
            "certifications": "",
            "other": ""
        }

    lines = text.splitlines()
    sections: Dict[str, list] = {
        "summary": [],
        "skills": [],
        "experience": [],
        "education": [],
        "projects": [],
        "certifications": [],
        "other": []
    }
    
    current_section = "summary"
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Check if line looks like a header (e.g. short, uppercase or matches keyword pattern)
        normalized_line = stripped.lower().rstrip(":")
        matched_section = None
        
        if len(stripped) < 40:  # Headers are usually short
            for sec_key, patterns in SECTION_HEADERS.items():
                for pat in patterns:
                    if re.fullmatch(pat, normalized_line):
                        matched_section = sec_key
                        break
                if matched_section:
                    break
                    
        if matched_section:
            current_section = matched_section
        else:
            sections[current_section].append(stripped)
            
    return {k: "\n".join(v).strip() for k, v in sections.items()}
