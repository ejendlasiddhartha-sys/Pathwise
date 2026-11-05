from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from app.schemas import StudentCreate, StudentResponse
from app.services import student_service

router = APIRouter(prefix="/api/students", tags=["students"])


@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a student profile",
    responses={
        201: {"description": "Student profile created successfully"},
        400: {"description": "Bad Request"},
        409: {"description": "Conflict: duplicate email address"},
        422: {"description": "Unprocessable Entity: validation error"},
    },
)
def create_student_endpoint(
    student_in: StudentCreate,
    session: Session = Depends(get_session),
):
    """Create a new student profile in the database.

    - **name**: Full name of the student
    - **email**: Valid and unique email address
    - **education**: Current educational degree, program, or year
    - **career_goal**: Target career or job role
    """
    try:
        student = student_service.create_student(session, student_in)
        return student
    except student_service.DuplicateEmailError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )


@router.get(
    "/{id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a student profile",
    responses={
        200: {"description": "Student profile retrieved successfully"},
        404: {"description": "Student not found"},
    },
)
def get_student_endpoint(
    id: int,
    session: Session = Depends(get_session),
):
    """Retrieve an existing student profile by their database ID."""
    student = student_service.get_student_by_id(session, id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {id} not found.",
        )
    return student
