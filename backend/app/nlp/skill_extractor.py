import re
from typing import Dict, List, Set
from app.nlp.skill_normalizer import normalizer

try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        # Fallback to blank model if en_core_web_sm is not installed
        nlp = spacy.blank("en")
except Exception:
    nlp = None

class SkillExtractor:
    def __init__(self):
        self.normalizer = normalizer

    def extract_skills(self, text: str) -> List[str]:
        """
        Extract unique normalized skills from a block of text.
        """
        if not text:
            return []
            
        found_skills: Set[str] = set()
        lowered_text = text.lower()

        # 1. Taxonomy Phrase & Alias Regex Matcher (Word boundary matching)
        for alias, canonical in self.normalizer.alias_to_canonical.items():
            # Escaped pattern matching full word boundaries or standard delimiters
            # e.g. \bpython\b, \bc\+\+\b, \bci/cd\b
            escaped_alias = re.escape(alias)
            pattern = rf'(?:\b|(?<=\W)){escaped_alias}(?:\b|(?=\W))'
            if re.search(pattern, lowered_text):
                found_skills.add(canonical)

        # 2. spaCy Noun Chunk & Entity Extraction fallback (for novel skills)
        if nlp:
            try:
                doc = nlp(text)
                for ent in doc.ents:
                    if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART"]:
                        norm = self.normalizer.normalize_skill(ent.text)
                        if len(norm) > 1 and len(norm) < 30:
                            found_skills.add(norm)
            except Exception:
                pass

        return sorted(list(found_skills))

    def extract_section_skills(self, sections: Dict[str, str]) -> Dict[str, List[str]]:
        """
        Extract skills grouped by section name.
        """
        result = {}
        for sec_name, sec_text in sections.items():
            result[sec_name] = self.extract_skills(sec_text)
        return result

extractor = SkillExtractor()
