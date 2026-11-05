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


class StudentResponse(StudentBase):
    """Response schema for returning student profile data."""

    id: int

    model_config = ConfigDict(from_attributes=True)
