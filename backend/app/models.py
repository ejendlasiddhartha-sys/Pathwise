from sqlmodel import Field, SQLModel


class Student(SQLModel, table=True):
    """A student profile stored in the local SQLite database."""

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    education: str
    career_goal: str
    target_career: str | None = Field(default=None)
    skills: str | None = Field(default="[]")
    certifications: str | None = Field(default="[]")
    experience: str | None = Field(default=None)


class CareerRecommendation(SQLModel, table=True):
    """Cached AI-generated career recommendations and skill gap analysis."""

    id: int | None = Field(default=None, primary_key=True)
    student_id: int = Field(index=True, foreign_key="student.id")
    target_career_id: str = Field(index=True)
    target_career_name: str
    profile_fingerprint: str = Field(index=True)
    readiness_score: int
    skill_gaps: str = Field(default="[]")  # JSON-encoded list of calculated skill gaps
    summary: str
    changes_detected: str = Field(default="[]")  # JSON-encoded list of changes detected
    priority_skills: str = Field(default="[]")  # JSON-encoded list of PrioritySkill objects
    certifications: str = Field(default="[]")  # JSON-encoded list of RecommendedCertification
    next_steps: str = Field(default="[]")  # JSON-encoded list of recommended next steps
    sources: str = Field(default="[]")  # JSON-encoded list of official source URLs
    is_outdated: bool = Field(default=False)
    grounding_used: bool = Field(default=False)
    generated_at: str  # ISO timestamp string
