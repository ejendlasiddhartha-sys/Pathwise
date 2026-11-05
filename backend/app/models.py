from sqlmodel import Field, SQLModel


class Student(SQLModel, table=True):
    """A student profile stored in the local SQLite database."""

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    education: str
    career_goal: str
