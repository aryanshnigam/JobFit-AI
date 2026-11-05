import json
import os
import httpx
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.core.config import settings

class LLMProvider(ABC):
    @abstractmethod
    def generate_recommendations(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class FallbackRuleBasedProvider(LLMProvider):
    """
    Deterministic rule-based provider when no LLM API key is provided or API calls fail.
    Generates structured, domain-accurate learning paths & project recommendations.
    """
    def generate_recommendations(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        missing = [item["skill"] for item in analysis_data.get("missing_skills", [])]
        partial = [item["skill"] for item in analysis_data.get("partial_skills", [])]
        matched = [item["skill"] for item in analysis_data.get("matched_skills", [])]
        score = analysis_data.get("compatibility_score", 0)
        
        priority_skills = missing + partial
        if not priority_skills:
            priority_skills = ["Advanced System Design", "Production Optimization", "Cloud Scaling"]
            
        # Construct sequential learning path
        learning_path = []
        for idx, skill in enumerate(priority_skills[:6], 1):
            learning_path.append({
                "step": idx,
                "skill": skill,
                "focus": f"Master key fundamentals and practical implementation of {skill}.",
                "estimated_hours": 15 + idx * 5,
                "status": "Recommended"
            })
            
        # Project Ideas
        p1_skills = ", ".join(priority_skills[:2]) if len(priority_skills) >= 2 else "Key Stack"
        projects = [
            {
                "title": f"End-to-End {priority_skills[0] if priority_skills else 'Skill'} Production Service",
                "description": f"Build a microservice utilizing {p1_skills} featuring clean REST APIs, automated unit tests, and Docker deployment.",
                "tech_stack": priority_skills[:3] + ["Docker", "GitHub Actions"]
            },
            {
                "title": "Scalable Analytics & Monitoring Pipeline",
                "description": f"Implement a real-time data processing service integrating {priority_skills[-1] if priority_skills else 'Backend'} with automated logging and container orchestration.",
                "tech_stack": [priority_skills[-1] if priority_skills else "Python", "PostgreSQL", "Docker"]
            }
        ]
        
        explanation = (
            f"The candidate demonstrates a {analysis_data.get('label', 'good')} fit with a compatibility score of {score}/100. "
            f"Strongest match points include core competencies in {', '.join(matched[:4]) if matched else 'foundational technical areas'}. "
            f"To increase compatibility to 90%+, the candidate should focus on bridging critical gaps in {', '.join(priority_skills[:3])}."
        )

        return {
            "explanation": explanation,
            "skill_gap_summary": priority_skills,
            "recommended_learning_path": learning_path,
            "suggested_projects": projects,
            "provider_used": "Offline Rule Engine"
        }

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = FallbackRuleBasedProvider()

    def generate_recommendations(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.generate_recommendations(analysis_data)
            
        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)
            
            prompt = f"""
You are an expert AI Career Coach and Engineering Recruiter. Analyze this candidate's resume-job match data:

Match Summary:
- Compatibility Score: {analysis_data.get('compatibility_score')}/100 ({analysis_data.get('label')})
- Matched Skills: {json.dumps([s['skill'] for s in analysis_data.get('matched_skills', [])])}
- Partial Skills: {json.dumps([s['skill'] for s in analysis_data.get('partial_skills', [])])}
- Missing Skills: {json.dumps([s['skill'] for s in analysis_data.get('missing_skills', [])])}

Generate a structured JSON response with EXACTLY the following keys:
{{
  "explanation": "A concise 3-sentence summary explaining candidate fit, key strengths, and overall gaps.",
  "skill_gap_summary": ["List", "of", "missing", "skills", "ordered", "by", "priority"],
  "recommended_learning_path": [
    {{ "step": 1, "skill": "Skill Name", "focus": "Concrete topic to learn", "estimated_hours": 20, "status": "Recommended" }}
  ],
  "suggested_projects": [
    {{ "title": "Project Title", "description": "1-2 sentence description", "tech_stack": ["Tech1", "Tech2"] }}
  ]
}}
Return ONLY valid JSON.
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
                
            parsed = json.loads(raw_text)
            parsed["provider_used"] = "Gemini API (gemini-2.5-flash)"
            return parsed
        except Exception as e:
            print(f"[GeminiProvider] Error: {e}. Falling back to rule-based engine.")
            res = self.fallback.generate_recommendations(analysis_data)
            res["provider_used"] = f"Fallback Engine (Gemini Error: {str(e)[:50]})"
            return res

class NemotronProvider(LLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = FallbackRuleBasedProvider()

    def generate_recommendations(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            return self.fallback.generate_recommendations(analysis_data)
            
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            prompt = f"Analyze match: Matched={analysis_data.get('matched_skills')}, Missing={analysis_data.get('missing_skills')}. Output JSON with keys: explanation, skill_gap_summary, recommended_learning_path, suggested_projects."
            
            payload = {
                "model": "nvidia/nemotron-4-340b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "max_tokens": 1000
            }
            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    parsed["provider_used"] = "NVIDIA Nemotron API"
                    return parsed
        except Exception as e:
            print(f"[NemotronProvider] Error: {e}")
            
        return self.fallback.generate_recommendations(analysis_data)

def get_llm_service() -> LLMProvider:
    provider_type = settings.LLM_PROVIDER.lower()
    if provider_type == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider(settings.GEMINI_API_KEY)
    elif provider_type == "nemotron" and settings.NEMOTRON_API_KEY:
        return NemotronProvider(settings.NEMOTRON_API_KEY)
    else:
        return FallbackRuleBasedProvider()

llm_service = get_llm_service()
