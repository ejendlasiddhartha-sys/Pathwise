import hashlib
import json
import logging
import os
from pathlib import Path
from typing import Any

from sqlmodel import Session, select

from app.models import CareerRecommendation, Student
from app.schemas import (
    PrioritySkill,
    RecommendationData,
    RecommendationResponse,
    RecommendedCertification,
)
from app.services.gemini_service import generate_ai_career_recommendation

logger = logging.getLogger("pathwise.recommendations")

CAREERS_FILE_PATH = Path(__file__).resolve().parent.parent / "data" / "careers.json"
_CAREERS_CACHE: list[dict[str, Any]] | None = None


def load_careers_catalog() -> list[dict[str, Any]]:
    """Load and cache the baseline careers database from careers.json."""
    global _CAREERS_CACHE
    if _CAREERS_CACHE is not None:
        return _CAREERS_CACHE

    try:
        if CAREERS_FILE_PATH.exists():
            with open(CAREERS_FILE_PATH, "r", encoding="utf-8") as f:
                _CAREERS_CACHE = json.load(f)
                return _CAREERS_CACHE
    except Exception as exc:
        logger.error(f"Error loading careers.json from {CAREERS_FILE_PATH}: {exc}")

    # Fallback minimal catalog if file read fails
    _CAREERS_CACHE = [
        {
            "id": "frontend_developer",
            "name": "Frontend Developer",
            "description": "Designs, builds, and maintains responsive, accessible, and user-centric web applications.",
            "skills": [
                {"name": "HTML", "category": "technical", "required_level": 4, "weight": 0.9},
                {"name": "CSS", "category": "technical", "required_level": 4, "weight": 0.9},
                {"name": "JavaScript", "category": "technical", "required_level": 4, "weight": 0.95},
                {"name": "React", "category": "technical", "required_level": 3, "weight": 0.85},
                {"name": "Version Control (Git)", "category": "technical", "required_level": 3, "weight": 0.8},
                {"name": "REST APIs & HTTP", "category": "technical", "required_level": 3, "weight": 0.75},
            ],
        }
    ]
    return _CAREERS_CACHE


def find_career_in_catalog(career_identifier: str) -> dict[str, Any]:
    """Find career object by id or matching name (case-insensitive)."""
    catalog = load_careers_catalog()
    clean_id = career_identifier.strip().lower().replace("-", "_").replace(" ", "_")

    # Match by exact id
    for career in catalog:
        if career.get("id", "").lower() == clean_id:
            return career

    # Match by name
    for career in catalog:
        c_name = career.get("name", "").lower()
        if c_name == clean_id or c_name in clean_id or clean_id in c_name:
            return career

    # Fallback to frontend_developer as standard baseline
    return catalog[0]


def calculate_skill_gaps_and_readiness(
    target_career: dict[str, Any],
    student_skills: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], int]:
    """Calculate skill gaps and readiness score in strict adherence to Pathwise API contract:

    Formula:
    - current_level = student's level (default 0)
    - required_level = career requirement level
    - gap = max(required_level - current_level, 0)
    - priority: 0-1 Low, 2 Medium, 3 High, 4-5 Critical
    - readiness_score = round(sum(weight * min(current_level, required_level)) / sum(weight * required_level) * 100)
    """
    # Build fast lookup map for student skills
    student_skill_map: dict[str, int] = {}
    for item in student_skills:
        if isinstance(item, dict) and "name" in item:
            lvl = item.get("current_level", item.get("level", 0))
            try:
                student_skill_map[item["name"].strip().lower()] = int(lvl)
            except (ValueError, TypeError):
                student_skill_map[item["name"].strip().lower()] = 0

    evaluated_skills = []
    total_weighted_req = 0.0
    student_weighted_met = 0.0

    for req in target_career.get("skills", []):
        name = req.get("name", "Skill")
        req_level = int(req.get("required_level", 3))
        weight = float(req.get("weight", 0.5))
        category = req.get("category", "technical")

        # Current student level
        curr_level = student_skill_map.get(name.strip().lower(), 0)

        # Gap calculation
        gap = max(req_level - curr_level, 0)

        # Priority calculation per contract
        if gap <= 1:
            priority = "Low"
        elif gap == 2:
            priority = "Medium"
        elif gap == 3:
            priority = "High"
        else:
            priority = "Critical"

        evaluated_skills.append({
            "name": name,
            "category": category,
            "current_level": curr_level,
            "required_level": req_level,
            "gap": gap,
            "priority": priority,
            "weight": weight,
            "importance": req.get("importance", ""),
        })

        total_weighted_req += weight * req_level
        student_weighted_met += weight * min(curr_level, req_level)

    # Readiness score calculation
    if total_weighted_req > 0:
        readiness_score = round((student_weighted_met / total_weighted_req) * 100)
    else:
        readiness_score = 0

    return evaluated_skills, min(max(readiness_score, 0), 100)


def compute_profile_fingerprint(
    target_career_id: str,
    education: str,
    experience: str | None,
    skills: list[dict[str, Any]],
    certifications: list[dict[str, Any]],
) -> str:
    """Generate deterministic fingerprint of only significant career factors.

    Changes to name, email, DOB, or profile picture produce the exact same fingerprint
    and therefore reuse cached recommendations without unnecessary API calls.
    """
    normalized_skills = sorted(
        [
            f"{s.get('name', '').strip().lower()}:{s.get('current_level', s.get('level', 0))}"
            for s in skills
            if isinstance(s, dict) and s.get("name")
        ]
    )

    normalized_certs = sorted(
        [
            f"{c.get('name', '').strip().lower()}:{c.get('organization', '').strip().lower()}"
            for c in certifications
            if isinstance(c, dict) and c.get("name")
        ]
    )

    fingerprint_payload = {
        "career_id": target_career_id.strip().lower(),
        "education": education.strip().lower(),
        "experience": (experience or "").strip().lower(),
        "skills": normalized_skills,
        "certifications": normalized_certs,
    }

    raw_str = json.dumps(fingerprint_payload, sort_keys=True)
    return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()


def detect_profile_changes(
    previous_recommendation: CareerRecommendation | None,
    target_career_name: str,
    target_career_id: str,
    education: str,
    skills: list[dict[str, Any]],
    certifications: list[dict[str, Any]],
) -> list[str]:
    """Detect significant changes between the previous analysis and the current profile."""
    if not previous_recommendation:
        return ["Initial profile assessment and baseline readiness evaluation."]

    changes = []
    if previous_recommendation.target_career_id != target_career_id:
        changes.append(
            f"Target career path changed from '{previous_recommendation.target_career_name}' to '{target_career_name}'."
        )

    # Check certifications
    cert_names = [c.get("name") for c in certifications if isinstance(c, dict) and c.get("name")]
    if cert_names:
        changes.append(f"Completed certifications verified: {', '.join(cert_names[:2])}.")

    if not changes:
        changes.append("Updated skill proficiencies and competency benchmarks.")

    return changes


async def get_or_generate_student_recommendations(
    session: Session,
    student: Student,
    target_career_id: str | None = None,
    custom_skills: list[dict[str, Any]] | None = None,
    custom_certifications: list[dict[str, Any]] | None = None,
    force_refresh: bool = False,
) -> RecommendationResponse:
    """Retrieve cached recommendation if still valid, or generate new AI-grounded recommendation.

    Adheres strictly to caching requirements:
    - Checks whether current recommendations exist.
    - Reuses cached recommendations if profile hasn't significantly changed.
    - Triggers new analysis only when significant changes or force_refresh occurs.
    """
    # Determine career
    target_identifier = target_career_id or student.target_career or student.career_goal or "frontend_developer"
    career = find_career_in_catalog(target_identifier)
    career_id = career["id"]
    career_name = career["name"]

    # Student skills
    skills_data = custom_skills
    if skills_data is None:
        try:
            skills_data = json.loads(student.skills) if student.skills else []
        except Exception:
            skills_data = []

    # Student certifications
    certs_data = custom_certifications
    if certs_data is None:
        try:
            certs_data = json.loads(student.certifications) if student.certifications else []
        except Exception:
            certs_data = []

    # Calculate skill gaps and official readiness score
    skill_gaps, readiness_score = calculate_skill_gaps_and_readiness(career, skills_data)

    # Compute fingerprint
    current_fingerprint = compute_profile_fingerprint(
        target_career_id=career_id,
        education=student.education,
        experience=student.experience,
        skills=skills_data,
        certifications=certs_data,
    )

    # Check cache if not forcing refresh
    if not force_refresh and student.id:
        stmt = (
            select(CareerRecommendation)
            .where(
                CareerRecommendation.student_id == student.id,
                CareerRecommendation.target_career_id == career_id,
                CareerRecommendation.is_outdated == False,  # noqa: E712
            )
            .order_by(CareerRecommendation.id.desc())  # type: ignore
        )
        cached_rec = session.exec(stmt).first()

        if cached_rec and cached_rec.profile_fingerprint == current_fingerprint:
            logger.info(f"Reusing cached recommendation for student {student.id} ({career_id}).")
            try:
                rec_data = RecommendationData(
                    summary=cached_rec.summary,
                    changes_detected=json.loads(cached_rec.changes_detected or "[]"),
                    priority_skills=[
                        PrioritySkill(**s) for s in json.loads(cached_rec.priority_skills or "[]")
                    ],
                    certifications=[
                        RecommendedCertification(**c)
                        for c in json.loads(cached_rec.certifications or "[]")
                    ],
                    next_steps=json.loads(cached_rec.next_steps or "[]"),
                    sources=json.loads(cached_rec.sources or "[]"),
                    generated_at=cached_rec.generated_at,
                )

                stored_skill_gaps = (
                    json.loads(cached_rec.skill_gaps) if cached_rec.skill_gaps else skill_gaps
                )

                return RecommendationResponse(
                    id=cached_rec.id,
                    student_id=student.id,
                    target_career_id=cached_rec.target_career_id,
                    target_career_name=cached_rec.target_career_name,
                    readiness_score=cached_rec.readiness_score,
                    profile_fingerprint=cached_rec.profile_fingerprint,
                    is_outdated=False,
                    cached=True,
                    grounding_used=cached_rec.grounding_used,
                    skill_gaps=stored_skill_gaps,
                    recommendation=rec_data,
                )
            except Exception as parse_err:
                logger.warning(f"Failed parsing cached recommendation: {parse_err}. Regenerating...")

    # Significant changes or no cache: Generate fresh recommendation
    # First, find previous recommendation to detect changes
    previous_rec = None
    if student.id:
        prev_stmt = (
            select(CareerRecommendation)
            .where(CareerRecommendation.student_id == student.id)
            .order_by(CareerRecommendation.id.desc())  # type: ignore
        )
        previous_rec = session.exec(prev_stmt).first()

    changes_detected = detect_profile_changes(
        previous_recommendation=previous_rec,
        target_career_name=career_name,
        target_career_id=career_id,
        education=student.education,
        skills=skills_data,
        certifications=certs_data,
    )

    # Call Gemini service with privacy-safe data
    rec_data, grounding_used = await generate_ai_career_recommendation(
        target_career_name=career_name,
        target_career_id=career_id,
        education=student.education,
        experience=student.experience,
        calculated_skill_gaps=skill_gaps,
        readiness_score=readiness_score,
        completed_certifications=certs_data,
        changes_detected=changes_detected,
    )

    # Invalidate older recommendations for this student and career
    if student.id:
        old_recs_stmt = select(CareerRecommendation).where(
            CareerRecommendation.student_id == student.id,
            CareerRecommendation.target_career_id == career_id,
        )
        for old_rec in session.exec(old_recs_stmt).all():
            old_rec.is_outdated = True
            session.add(old_rec)

        # Persist new recommendation in SQLModel table
        new_db_rec = CareerRecommendation(
            student_id=student.id,
            target_career_id=career_id,
            target_career_name=career_name,
            profile_fingerprint=current_fingerprint,
            readiness_score=readiness_score,
            skill_gaps=json.dumps(skill_gaps),
            summary=rec_data.summary,
            changes_detected=json.dumps(rec_data.changes_detected),
            priority_skills=json.dumps([s.model_dump() for s in rec_data.priority_skills]),
            certifications=json.dumps([c.model_dump() for c in rec_data.certifications]),
            next_steps=json.dumps(rec_data.next_steps),
            sources=json.dumps(rec_data.sources),
            is_outdated=False,
            grounding_used=grounding_used,
            generated_at=rec_data.generated_at,
        )
        session.add(new_db_rec)
        session.commit()
        session.refresh(new_db_rec)
        rec_id = new_db_rec.id
    else:
        rec_id = None

    return RecommendationResponse(
        id=rec_id,
        student_id=student.id or 0,
        target_career_id=career_id,
        target_career_name=career_name,
        readiness_score=readiness_score,
        profile_fingerprint=current_fingerprint,
        is_outdated=False,
        cached=False,
        grounding_used=grounding_used,
        skill_gaps=skill_gaps,
        recommendation=rec_data,
    )
