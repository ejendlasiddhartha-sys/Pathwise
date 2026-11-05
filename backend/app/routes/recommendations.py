from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.database import get_session
from app.schemas import RecommendationRefreshRequest, RecommendationResponse
from app.services import recommendation_service, student_service

router = APIRouter(prefix="/api/students", tags=["recommendations"])


@router.get(
    "/{id}/recommendations",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve personalized AI career recommendations",
    responses={
        200: {"description": "Recommendations retrieved successfully (cached or freshly generated)"},
        404: {"description": "Student not found"},
    },
)
async def get_student_recommendations_endpoint(
    id: int,
    target_career_id: str | None = Query(
        default=None,
        description="Target career ID (e.g. frontend_developer, data_analyst). Defaults to student's saved goal.",
    ),
    session: Session = Depends(get_session),
):
    """Retrieve or generate personalized career recommendations.

    Reuses cached recommendations if the student's significant profile factors
    (target career, skills, certifications, education) have not changed.
    """
    student = student_service.get_student_by_id(session, id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {id} not found.",
        )

    recommendations = await recommendation_service.get_or_generate_student_recommendations(
        session=session,
        student=student,
        target_career_id=target_career_id,
        force_refresh=False,
    )
    return recommendations


@router.post(
    "/{id}/recommendations/refresh",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Force refresh AI career recommendations",
    responses={
        200: {"description": "Recommendations regenerated successfully"},
        404: {"description": "Student not found"},
    },
)
async def refresh_student_recommendations_endpoint(
    id: int,
    payload: RecommendationRefreshRequest | None = None,
    session: Session = Depends(get_session),
):
    """Manually regenerate personalized career recommendations.

    Bypasses the fingerprint cache and queries Google Gemini with Google Search
    grounding to produce updated priority skills and certification suggestions.
    """
    student = student_service.get_student_by_id(session, id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {id} not found.",
        )

    target_career_id = payload.target_career_id if payload else None
    skills = payload.skills if payload else None
    certifications = payload.certifications if payload else None

    recommendations = await recommendation_service.get_or_generate_student_recommendations(
        session=session,
        student=student,
        target_career_id=target_career_id,
        custom_skills=skills,
        custom_certifications=certifications,
        force_refresh=True,
    )
    return recommendations
