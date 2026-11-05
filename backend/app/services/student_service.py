import json
from typing import Any
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.models import Student
from app.schemas import StudentCreate, StudentUpdate


class DuplicateEmailError(Exception):
    """Raised when attempting to register a student with an existing email address."""

    pass


def get_student_by_id(session: Session, student_id: int) -> Student | None:
    """Retrieve a student profile by their database ID."""
    return session.get(Student, student_id)


def get_student_by_email(session: Session, email: str) -> Student | None:
    """Retrieve a student profile by their email address."""
    statement = select(Student).where(Student.email == email)
    return session.exec(statement).first()


def _serialize_json_field(val: Any) -> str:
    """Safely serialize lists/dicts to JSON strings for database persistence."""
    if val is None:
        return "[]"
    if isinstance(val, str):
        return val
    try:
        return json.dumps(val)
    except Exception:
        return "[]"


def create_student(session: Session, student_in: StudentCreate) -> Student:
    """Create and persist a new student profile.

    Validates that the email is not already taken before inserting.

    Raises:
        DuplicateEmailError: If the student's email address is already in use.
    """
    normalized_email = student_in.email.strip().lower()

    # Pre-check for duplicate email
    if get_student_by_email(session, normalized_email):
        raise DuplicateEmailError(f"A student with email '{normalized_email}' is already registered.")

    # Synchronize target_career and career_goal
    target_career = student_in.target_career or student_in.career_goal
    career_goal = student_in.career_goal or target_career

    student = Student(
        name=student_in.name,
        email=normalized_email,
        education=student_in.education,
        career_goal=career_goal,
        target_career=target_career,
        skills=_serialize_json_field(student_in.skills),
        certifications=_serialize_json_field(student_in.certifications),
        experience=student_in.experience,
    )

    session.add(student)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise DuplicateEmailError(
            f"A student with email '{normalized_email}' is already registered."
        ) from exc

    session.refresh(student)
    return student


def update_student(session: Session, student_id: int, student_in: StudentUpdate) -> Student | None:
    """Update an existing student profile.

    Validates that the student exists and email updates do not conflict.
    Preserves existing ID and updates provided fields.
    """
    student = get_student_by_id(session, student_id)
    if not student:
        return None

    # Check email conflict if changing email
    if student_in.email is not None:
        normalized_email = student_in.email.strip().lower()
        if normalized_email != student.email:
            existing = get_student_by_email(session, normalized_email)
            if existing and existing.id != student_id:
                raise DuplicateEmailError(f"A student with email '{normalized_email}' is already registered.")
            student.email = normalized_email

    if student_in.name is not None:
        student.name = student_in.name

    if student_in.education is not None:
        student.education = student_in.education

    if student_in.target_career is not None:
        student.target_career = student_in.target_career
        if student_in.career_goal is None:
            student.career_goal = student_in.target_career

    if student_in.career_goal is not None:
        student.career_goal = student_in.career_goal
        if student.target_career is None:
            student.target_career = student_in.career_goal

    if student_in.skills is not None:
        student.skills = _serialize_json_field(student_in.skills)

    if student_in.certifications is not None:
        student.certifications = _serialize_json_field(student_in.certifications)

    if student_in.experience is not None:
        student.experience = student_in.experience

    session.add(student)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise DuplicateEmailError(
            f"A student with email '{student.email}' is already registered."
        ) from exc

    session.refresh(student)
    return student
