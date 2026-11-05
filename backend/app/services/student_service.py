from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.models import Student
from app.schemas import StudentCreate


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

    student = Student(
        name=student_in.name,
        email=normalized_email,
        education=student_in.education,
        career_goal=student_in.career_goal,
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
