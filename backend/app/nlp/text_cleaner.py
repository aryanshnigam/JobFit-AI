import re
import unicodedata

def clean_text(text: str) -> str:
    """
    Clean and normalize raw text extracted from PDF/DOCX or input text fields.
    """
    if not text:
        return ""
    
    # Normalize unicode characters (e.g. smart quotes, bullets)
    text = unicodedata.normalize("NFKC", text)
    
    # Replace common bullet characters with standard dash
    text = re.sub(r'[\u2022\u2023\u25e6\u2043\u2219\u25cf]', '- ', text)
    
    # Replace multiple spaces with a single space (preserving newlines)
    lines = [re.sub(r'[ \t]+', ' ', line.strip()) for line in text.splitlines()]
    
    # Remove empty line clusters (max 2 consecutive newlines)
    cleaned_lines = []
    empty_count = 0
    for line in lines:
        if not line:
            empty_count += 1
            if empty_count <= 1:
                cleaned_lines.append("")
        else:
            empty_count = 0
            cleaned_lines.append(line)
            
    return "\n".join(cleaned_lines).strip()
