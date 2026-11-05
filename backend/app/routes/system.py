from fastapi import APIRouter

from app.schemas import HealthResponse, TestResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok", "application": "Pathwise"}


@router.get("/api/test", response_model=TestResponse)
def test_connection():
    return {"message": "Frontend successfully connected to Pathwise backend"}
