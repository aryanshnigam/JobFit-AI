import json
import os
from typing import Dict, List, Optional

class SkillNormalizer:
    def __init__(self, taxonomy_path: Optional[str] = None):
        if not taxonomy_path:
            # Default path relative to monorepo root or current directory
            file_dir = os.path.dirname(os.path.abspath(__file__))
            candidates = [
                os.path.join(file_dir, "..", "..", "..", "data", "taxonomy.json"),
                os.path.join(os.getcwd(), "data", "taxonomy.json"),
                os.path.join(os.getcwd(), "..", "data", "taxonomy.json")
            ]
            for cand in candidates:
                norm = os.path.normpath(cand)
                if os.path.exists(norm):
                    taxonomy_path = norm
                    break
                
        self.alias_to_canonical: Dict[str, str] = {}
        self.skill_to_category: Dict[str, str] = {}
        self.canonical_skills: set = set()
        self._load_taxonomy(taxonomy_path)
        
    def _load_taxonomy(self, filepath: str):
        if not os.path.exists(filepath):
            print(f"[Warning] Taxonomy file not found at {filepath}. Using empty taxonomy.")
            return
            
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        categories = data.get("categories", {})
        for cat_name, skill_list in categories.items():
            for item in skill_list:
                canonical = item["name"]
                self.canonical_skills.add(canonical)
                self.skill_to_category[canonical] = cat_name
                
                # Register canonical name itself
                self.alias_to_canonical[canonical.lower()] = canonical
                
                # Register all aliases
                for alias in item.get("aliases", []):
                    self.alias_to_canonical[alias.lower()] = canonical
                    
    def normalize_skill(self, skill_name: str) -> str:
        """
        Convert a raw skill string to its canonical form if present in taxonomy,
        otherwise return title-cased clean string.
        """
        if not skill_name:
            return ""
        clean = skill_name.strip().lower()
        if clean in self.alias_to_canonical:
            return self.alias_to_canonical[clean]
            
        # Return cleaned title case if not in taxonomy
        return skill_name.strip().title()
        
    def get_category(self, canonical_skill: str) -> str:
        return self.skill_to_category.get(canonical_skill, "other")
        
    def get_all_canonical_skills(self) -> List[str]:
        return sorted(list(self.canonical_skills))

# Global instance
normalizer = SkillNormalizer()
