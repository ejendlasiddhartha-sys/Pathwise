import datetime
import json
import logging
import os
import re
from typing import Any

from app.schemas import PrioritySkill, RecommendationData, RecommendedCertification

logger = logging.getLogger("pathwise.gemini")

# Cost-efficient supported model as specified
PREFERRED_MODEL = "gemini-2.5-flash-lite"
FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"]


def get_verified_baseline_recommendation(
    target_career_name: str,
    target_career_id: str,
    education: str,
    calculated_skill_gaps: list[dict[str, Any]],
    readiness_score: int,
    changes_detected: list[str] | None = None,
    custom_notice: str | None = None,
) -> RecommendationData:
    """Generate high-quality verified recommendation data based on careers.json.

    Used when:
    - GEMINI_API_KEY is not configured
    - Gemini quota is exhausted
    - Live search grounding is temporarily unavailable
    """
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    changes = changes_detected or []

    # Sort skill gaps by gap descending and weight
    critical_gaps = [s for s in calculated_skill_gaps if s.get("gap", 0) > 0]
    critical_gaps.sort(key=lambda s: (s.get("gap", 0), s.get("weight", 0.5)), reverse=True)
    top_3_gaps = critical_gaps[:3]

    priority_skills: list[PrioritySkill] = []
    for gap in top_3_gaps:
        name = gap.get("name", "Key Competency")
        gap_val = gap.get("gap", 1)
        priority = gap.get("priority", "High")
        priority_skills.append(
            PrioritySkill(
                skill=name,
                reason=f"Current level ({gap.get('current_level', 0)}) is below industry benchmark ({gap.get('required_level', 3)}). Closing this gap of {gap_val} significantly increases your readiness score.",
                priority=priority,
                suggested_action=f"Complete hands-on practice modules, documentation guides, and mini-projects focused on {name}.",
            )
        )

    # Fallback to top skills if student has no gaps
    if not priority_skills:
        for s in calculated_skill_gaps[:3]:
            priority_skills.append(
                PrioritySkill(
                    skill=s.get("name", "Competency"),
                    reason="Benchmark core skill for maintainability and advanced professional performance.",
                    priority="Medium",
                    suggested_action=f"Advance from standard proficiency to advanced mastery in {s.get('name')}.",
                )
            )

    # Curated official certifications mapped to target careers
    career_cert_catalogue = {
        "frontend_developer": [
            RecommendedCertification(
                name="Meta Certified Frontend Developer",
                provider="Meta / Coursera",
                reason="Covers React, client-side routing, responsive UI architecture, and modern JavaScript standards.",
                official_url="https://www.coursera.org/professional-certificates/meta-front-end-developer",
                relevant_skills=["React", "JavaScript", "HTML", "CSS"],
            ),
            RecommendedCertification(
                name="Responsive Web Design Certification",
                provider="freeCodeCamp",
                reason="Verifies hands-on proficiency in responsive layouts, Flexbox, CSS Grid, and accessibility (a11y).",
                official_url="https://www.freecodecamp.org/learn/2022/responsive-web-design/",
                relevant_skills=["CSS", "Responsive Web Design", "HTML"],
            ),
            RecommendedCertification(
                name="AWS Certified Cloud Practitioner",
                provider="Amazon Web Services",
                reason="Validates fundamental cloud deployment, hosting, and DNS/storage services for modern frontend apps.",
                official_url="https://aws.amazon.com/certification/certified-cloud-practitioner/",
                relevant_skills=["REST APIs & HTTP", "Version Control (Git)"],
            ),
        ],
        "data_analyst": [
            RecommendedCertification(
                name="Google Data Analytics Professional Certificate",
                provider="Google / Coursera",
                reason="Industry-standard credential for SQL queries, spreadsheets, data cleaning, and Tableau dashboards.",
                official_url="https://www.coursera.org/professional-certificates/google-data-analytics",
                relevant_skills=["SQL", "Spreadsheets (Excel / Google Sheets)", "BI & Data Visualization Tools (Tableau / Power BI)"],
            ),
            RecommendedCertification(
                name="Microsoft Certified: Power BI Data Analyst Associate",
                provider="Microsoft",
                reason="Recognized enterprise certification for data modeling, DAX formulas, and stakeholder reporting.",
                official_url="https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
                relevant_skills=["BI & Data Visualization Tools (Tableau / Power BI)", "Data Cleaning & Quality Assurance"],
            ),
            RecommendedCertification(
                name="IBM Data Analyst Professional Certificate",
                provider="IBM / Coursera",
                reason="Focuses on Python data manipulation with Pandas, NumPy, and statistical hypothesis testing.",
                official_url="https://www.coursera.org/professional-certificates/ibm-data-analyst",
                relevant_skills=["Python", "Data Manipulation (Pandas & NumPy)", "Applied Statistics"],
            ),
        ],
        "cloud_engineer": [
            RecommendedCertification(
                name="AWS Certified Solutions Architect - Associate",
                provider="Amazon Web Services",
                reason="Comprehensive coverage of resilient compute, VPC networking, security groups, and storage architectures.",
                official_url="https://aws.amazon.com/certification/certified-solutions-architect-associate/",
                relevant_skills=["Cloud Core Services (AWS / Azure / GCP)", "Networking Fundamentals (TCP/IP, DNS, VPC)", "Cloud Security Basics"],
            ),
            RecommendedCertification(
                name="Associate Cloud Engineer",
                provider="Google Cloud",
                reason="Verifies hands-on skills in deploying virtual machines, configuring Kubernetes clusters, and monitoring.",
                official_url="https://cloud.google.com/learn/certification/cloud-engineer",
                relevant_skills=["Cloud Core Services (AWS / Azure / GCP)", "Containerization (Docker)", "Linux & Command Line"],
            ),
            RecommendedCertification(
                name="HashiCorp Certified: Terraform Associate",
                provider="HashiCorp",
                reason="Standard credential for declarative Infrastructure as Code (IaC) and cloud resource automation.",
                official_url="https://www.hashicorp.com/certification/terraform-associate",
                relevant_skills=["Infrastructure as Code (Terraform)", "CI/CD Pipelines (e.g. GitHub Actions / GitLab CI)"],
            ),
        ],
        "machine_learning_engineer": [
            RecommendedCertification(
                name="DeepLearning.AI Machine Learning Specialization",
                provider="DeepLearning.AI / Stanford / Coursera",
                reason="Covers foundational supervised algorithms, neural networks, regularisation, and gradient descent optimization.",
                official_url="https://www.coursera.org/specializations/machine-learning-introduction",
                relevant_skills=["Classical Machine Learning (Scikit-Learn)", "Python", "Applied Mathematics & Linear Algebra"],
            ),
            RecommendedCertification(
                name="TensorFlow Developer Certificate",
                provider="Google / TensorFlow",
                reason="Validates practical deep learning workflow, convolutional neural networks, and model training pipelines.",
                official_url="https://www.tensorflow.org/certificate",
                relevant_skills=["Deep Learning Fundamentals (PyTorch / TensorFlow)", "Data Processing & Feature Engineering"],
            ),
            RecommendedCertification(
                name="AWS Certified Machine Learning - Specialty",
                provider="Amazon Web Services",
                reason="Validates model packaging, SageMaker deployment endpoints, and enterprise ML pipeline engineering.",
                official_url="https://aws.amazon.com/certification/certified-machine-learning-specialty/",
                relevant_skills=["Model Serving & APIs (FastAPI / Flask)", "Model Evaluation & Validation"],
            ),
        ],
    }

    # Normalize target key
    key = target_career_id.lower().replace("-", "_").replace(" ", "_")
    matched_certs = career_cert_catalogue.get(key)
    if not matched_certs:
        # Fallback to frontend developer certifications
        matched_certs = career_cert_catalogue["frontend_developer"]

    notice = custom_notice or "Generated using Pathwise verified career requirement repository and benchmark analysis."
    summary_text = (
        f"Based on your background ({education}) and target role as {target_career_name}, your calculated career "
        f"readiness score is {readiness_score}%. {notice} "
        f"Focusing on the top priority competencies below will yield the highest return toward target benchmark readiness."
    )

    next_steps = [
        f"Target the highest priority gap ({priority_skills[0].skill if priority_skills else 'Core skills'}) with dedicated project work.",
        f"Review curriculum prerequisites for {matched_certs[0].name} to validate your learning path.",
        "Track weekly milestone completions in your personalized Pathwise Roadmap.",
    ]

    sources = [
        {"title": f"Pathwise Career Benchmark Catalogue — {target_career_name}", "url": "local://careers.json"},
        {"title": f"Official Curriculum: {matched_certs[0].provider}", "url": matched_certs[0].official_url},
    ]

    return RecommendationData(
        summary=summary_text,
        changes_detected=changes,
        priority_skills=priority_skills[:3],
        certifications=matched_certs[:3],
        next_steps=next_steps,
        sources=sources,
        generated_at=now_iso,
    )


def extract_json_from_text(text: str) -> dict[str, Any] | None:
    """Extract valid JSON dictionary from raw model text response."""
    text = text.strip()
    # Try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Extract JSON inside markdown code blocks
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass

    # Look for opening and closing braces
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except Exception:
            pass

    return None


async def generate_ai_career_recommendation(
    target_career_name: str,
    target_career_id: str,
    education: str,
    experience: str | None,
    calculated_skill_gaps: list[dict[str, Any]],
    readiness_score: int,
    completed_certifications: list[dict[str, Any]],
    changes_detected: list[str] | None = None,
) -> tuple[RecommendationData, bool]:
    """Generate career recommendations using Google Gemini API with Google Search grounding.

    Returns:
        (RecommendationData, grounding_used: bool)

    Reliability & safety:
    - No personal student identifiers (name, email, DOB) are sent to Gemini.
    - Official readiness score is calculated by the backend and passed as immutable context.
    - Uses Google Search grounding when available to fetch official URLs and current certifications.
    - Gracefully falls back to verified career data on quota limits or network errors.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # If no API key configured, use verified baseline
    if not api_key:
        logger.info("GEMINI_API_KEY not configured. Using verified baseline career database.")
        return (
            get_verified_baseline_recommendation(
                target_career_name=target_career_name,
                target_career_id=target_career_id,
                education=education,
                calculated_skill_gaps=calculated_skill_gaps,
                readiness_score=readiness_score,
                changes_detected=changes_detected,
                custom_notice="Live AI research is offline (GEMINI_API_KEY not configured in backend/.env). Generated from verified career standards.",
            ),
            False,
        )

    # Prepare privacy-safe prompt (no name, email, or personal identifiers)
    skills_summary = [
        {
            "skill": s.get("name"),
            "current_level": s.get("current_level", 0),
            "required_level": s.get("required_level", 3),
            "gap": s.get("gap", 0),
            "priority": s.get("priority", "Medium"),
        }
        for s in calculated_skill_gaps
    ]

    completed_certs_summary = [
        c.get("name") for c in (completed_certifications or []) if isinstance(c, dict) and c.get("name")
    ]

    changes_info = changes_detected or []

    prompt = f"""You are the Pathwise AI Career Advisor. Analyze this student's profile and provide structured career guidance.

CRITICAL RULES:
1. Do NOT recalculate or alter the student's official career readiness score. The backend has officially calculated it as {readiness_score}%.
2. Limit priority_skills to exactly 3 items. Focus on the most impactful skill gaps.
3. Limit certifications to exactly 3 officially recognized, industry-standard certifications for this role.
4. Provide authentic official URLs for certifications. Do not hallucinate URLs.
5. Use Google Search grounding to verify the current official certification names and official provider URLs.
6. Return your response strictly as valid JSON adhering to this exact schema:

{{
  "summary": "Short personalised analysis (2-3 sentences)",
  "changes_detected": ["List of detected changes affecting readiness"],
  "priority_skills": [
    {{
      "skill": "Skill Name",
      "reason": "Why this skill is high priority",
      "priority": "Critical | High | Medium",
      "suggested_action": "Specific actionable learning step"
    }}
  ],
  "certifications": [
    {{
      "name": "Official Certification Name",
      "provider": "Issuing Organization",
      "reason": "Why this certification is relevant to the student",
      "official_url": "https://official-link...",
      "relevant_skills": ["Skill1", "Skill2"]
    }}
  ],
  "next_steps": ["Step 1", "Step 2", "Step 3"],
  "sources": ["List of official provider links or citations"],
  "generated_at": "{datetime.datetime.now(datetime.timezone.utc).isoformat()}"
}}

STUDENT PROFILE DATA (ANONYMIZED):
- Target Career: {target_career_name}
- Academic Background: {education}
- Professional Experience: {experience or "Student / Entry-level"}
- Official Career Readiness Score: {readiness_score}%
- Calculated Skill Gaps: {json.dumps(skills_summary)}
- Completed Certifications: {json.dumps(completed_certs_summary)}
- Significant Profile Changes: {json.dumps(changes_info)}
"""

    # Attempt calling official google-genai SDK
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        models_to_try = [PREFERRED_MODEL] + [m for m in FALLBACK_MODELS if m != PREFERRED_MODEL]
        last_error = None

        # First try with Google Search grounding
        for model_name in models_to_try:
            try:
                logger.info(f"Invoking Gemini model {model_name} with Google Search grounding...")
                config = types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.2,
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )

                if response and response.text:
                    parsed_json = extract_json_from_text(response.text)
                    if parsed_json:
                        # Extract search grounding sources if available
                        grounding_sources = []
                        try:
                            if hasattr(response, "candidates") and response.candidates:
                                candidate = response.candidates[0]
                                if hasattr(candidate, "grounding_metadata") and candidate.grounding_metadata:
                                    g_meta = candidate.grounding_metadata
                                    if hasattr(g_meta, "grounding_chunks") and g_meta.grounding_chunks:
                                        for chunk in g_meta.grounding_chunks:
                                            if hasattr(chunk, "web") and chunk.web:
                                                grounding_sources.append({
                                                    "title": getattr(chunk.web, "title", "Official Source"),
                                                    "url": getattr(chunk.web, "uri", ""),
                                                })
                        except Exception as e:
                            logger.debug(f"Grounding source extraction note: {e}")

                        if grounding_sources:
                            parsed_json["sources"] = grounding_sources
                        elif not parsed_json.get("sources"):
                            parsed_json["sources"] = [{"title": "Google Search Grounded", "url": "https://google.com"}]

                        parsed_json["generated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                        validated = RecommendationData.model_validate(parsed_json)
                        return validated, True
            except Exception as exc:
                last_error = exc
                logger.warning(f"Search-grounded call on {model_name} failed: {exc}. Retrying standard...")
                break

        # If search grounding failed or hit limitations, try standard generation without search tool
        for model_name in models_to_try:
            try:
                logger.info(f"Invoking Gemini model {model_name} (standard mode)...")
                config = types.GenerateContentConfig(
                    temperature=0.2,
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )

                if response and response.text:
                    parsed_json = extract_json_from_text(response.text)
                    if parsed_json:
                        parsed_json["generated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                        validated = RecommendationData.model_validate(parsed_json)
                        return validated, False
            except Exception as exc:
                last_error = exc
                logger.warning(f"Standard call on {model_name} failed: {exc}")

        # If all live model attempts failed (e.g. quota 429), return verified baseline
        logger.error(f"Gemini API calls failed: {last_error}. Falling back to verified baseline.")
        return (
            get_verified_baseline_recommendation(
                target_career_name=target_career_name,
                target_career_id=target_career_id,
                education=education,
                calculated_skill_gaps=calculated_skill_gaps,
                readiness_score=readiness_score,
                changes_detected=changes_detected,
                custom_notice="Live AI quota temporarily exhausted or network offline. Showing verified career benchmarks.",
            ),
            False,
        )

    except ImportError:
        logger.warning("google-genai package not installed. Using verified career baseline data.")
        return (
            get_verified_baseline_recommendation(
                target_career_name=target_career_name,
                target_career_id=target_career_id,
                education=education,
                calculated_skill_gaps=calculated_skill_gaps,
                readiness_score=readiness_score,
                changes_detected=changes_detected,
                custom_notice="google-genai SDK not installed in environment. Showing verified career baseline.",
            ),
            False,
        )
    except Exception as exc:
        logger.error(f"Unexpected error in Gemini service: {exc}")
        return (
            get_verified_baseline_recommendation(
                target_career_name=target_career_name,
                target_career_id=target_career_id,
                education=education,
                calculated_skill_gaps=calculated_skill_gaps,
                readiness_score=readiness_score,
                changes_detected=changes_detected,
            ),
            False,
        )
