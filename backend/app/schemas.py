import json
from typing import Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class HealthResponse(BaseModel):
    status: str
    application: str


class TestResponse(BaseModel):
    message: str


class StudentBase(BaseModel):
    """Shared fields for student profile models."""

    name: str = Field(
        ...,
        min_length=1,
        description="Student's full name",
        examples=["Rahul"],
    )
    email: EmailStr = Field(
        ...,
        description="Student's email address",
        examples=["rahul@example.com"],
    )
    education: str = Field(
        ...,
        min_length=1,
        description="Current education or background",
        examples=["B.Tech CSE, 2nd Year"],
    )
    career_goal: str = Field(
        ...,
        min_length=1,
        description="Target career goal",
        examples=["Frontend Developer"],
    )
    target_career: str | None = Field(
        default=None,
        description="Explicit target career role distinct from current employment",
        examples=["Frontend Developer"],
    )
    skills: list[dict[str, Any]] | None = Field(
        default=None,
        description="List of student skills with current proficiency levels",
        examples=[[{"name": "JavaScript", "current_level": 2}]],
    )
    certifications: list[dict[str, Any]] | None = Field(
        default=None,
        description="List of completed student certifications",
        examples=[[{"name": "Responsive Web Design", "organization": "freeCodeCamp"}]],
    )
    experience: str | None = Field(
        default=None,
        description="Relevant work or internship experience",
        examples=["Junior Software Engineer in Tech Innovations Ltd."],
    )

    @field_validator("name", "education", "career_goal")
    @classmethod
    def check_not_empty_or_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or whitespace only.")
        return stripped

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()


class StudentCreate(StudentBase):
    """Request schema for creating a new student profile."""

    pass


class StudentUpdate(BaseModel):
    """Request schema for updating an existing student profile."""

    name: str | None = None
    email: EmailStr | None = None
    education: str | None = None
    career_goal: str | None = None
    target_career: str | None = None
    skills: list[dict[str, Any]] | None = None
    certifications: list[dict[str, Any]] | None = None
    experience: str | None = None

    @field_validator("name", "education", "career_goal", "target_career", mode="before")
    @classmethod
    def check_optional_whitespace(cls, v: str | None) -> str | None:
        if v is not None:
            stripped = str(v).strip()
            if not stripped:
                raise ValueError("Field cannot be empty or whitespace only.")
            return stripped
        return v

    @field_validator("email", mode="before")
    @classmethod
    def normalize_optional_email(cls, v: str | None) -> str | None:
        if v is not None:
            return str(v).strip().lower()
        return v


class StudentResponse(BaseModel):
    """Response schema for returning student profile data."""

    id: int
    name: str
    email: str
    education: str
    career_goal: str
    target_career: str | None = None
    skills: list[dict[str, Any]] | None = None
    certifications: list[dict[str, Any]] | None = None
    experience: str | None = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("skills", "certifications", mode="before")
    @classmethod
    def parse_json_fields(cls, v: Any) -> list[dict[str, Any]] | None:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v


# --- AI Career Advisor Schemas (Section 7) ---


class PrioritySkill(BaseModel):
    skill: str = Field(description="Name of recommended priority skill")
    reason: str = Field(description="Why this skill is recommended based on target career gap")
    priority: str = Field(description="Priority tier: Critical, High, or Medium")
    suggested_action: str = Field(description="Concrete actionable learning step")


class RecommendedCertification(BaseModel):
    name: str = Field(description="Name of the official certification")
    provider: str = Field(description="Issuing organization e.g. AWS, Meta, Google, freeCodeCamp")
    reason: str = Field(description="Why this certification bridges the student's gap")
    official_url: str = Field(description="Official URL for registration or curriculum")
    relevant_skills: list[str] = Field(default=[], description="Skills targeted by this credential")


class RecommendationData(BaseModel):
    """Pydantic model representing expected AI response structure."""

    summary: str = Field(description="Short personalised analysis of the student's readiness")
    changes_detected: list[str] = Field(
        default=[],
        description="Significant profile changes detected since last analysis",
    )
    priority_skills: list[PrioritySkill] = Field(
        default=[],
        description="Top 3 priority skills to focus on",
    )
    certifications: list[RecommendedCertification] = Field(
        default=[],
        description="Top 3 recommended industry certifications",
    )
    next_steps: list[str] = Field(
        default=[],
        description="Immediate next steps recommended for the student",
    )
    sources: list[Any] = Field(
        default=[],
        description="Grounding search sources and verification links",
    )
    generated_at: str = Field(description="ISO timestamp of generation")


class RecommendationResponse(BaseModel):
    """Full API response shape for student recommendations."""

    id: int | None = None
    student_id: int
    target_career_id: str
    target_career_name: str
    readiness_score: int
    profile_fingerprint: str
    is_outdated: bool = False
    cached: bool = False
    grounding_used: bool = False
    skill_gaps: list[dict[str, Any]] = []
    recommendation: RecommendationData


class RecommendationRefreshRequest(BaseModel):
    """Request schema for manually triggering recommendation refresh."""

    target_career_id: str | None = None
    skills: list[dict[str, Any]] | None = None
    certifications: list[dict[str, Any]] | None = None
    force: bool = False
