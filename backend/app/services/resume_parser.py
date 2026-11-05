import io
import os
from typing import Tuple, Dict
from app.nlp.text_cleaner import clean_text
from app.nlp.section_extractor import extract_sections

try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes using PyMuPDF."""
    if not HAS_PYMUPDF:
        raise RuntimeError("PyMuPDF is not installed for PDF extraction.")
        
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text() + "\n"
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract raw text from DOCX bytes using python-docx."""
    if not HAS_DOCX:
        raise RuntimeError("python-docx is not installed for DOCX extraction.")
        
    doc = docx.Document(io.BytesIO(file_bytes))
    full_text = []
    for para in doc.paragraphs:
        if para.text:
            full_text.append(para.text)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text:
                    full_text.append(cell.text)
    return "\n".join(full_text)

def parse_resume_file(file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, str]]:
    """
    Parse uploaded file (PDF, DOCX, TXT) and return (cleaned_text, sections_dict).
    """
    ext = os.path.splitext(filename)[1].lower()
    raw_text = ""
    
    if ext == ".pdf":
        raw_text = extract_text_from_pdf(file_bytes)
    elif ext in [".docx", ".doc"]:
        raw_text = extract_text_from_docx(file_bytes)
    elif ext in [".txt", ".md"]:
        raw_text = file_bytes.decode("utf-8", errors="ignore")
    else:
        raise ValueError(f"Unsupported file format: '{ext}'. Supported formats: .pdf, .docx, .txt")

    cleaned = clean_text(raw_text)
    if not cleaned or len(cleaned.strip()) < 20:
        raise ValueError("The uploaded resume document appears to be empty or unreadable.")

    sections = extract_sections(cleaned)
    return cleaned, sections
