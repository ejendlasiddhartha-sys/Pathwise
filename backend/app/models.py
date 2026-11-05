from sqlmodel import Field, SQLModel


class Student(SQLModel, table=True):
    """A student profile stored in the local SQLite database."""

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    education: str
    career_goal: str
