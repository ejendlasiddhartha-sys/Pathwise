import os

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pathwise.db")

# SQLite needs this flag when FastAPI handles more than one request at a time.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def create_db_and_tables() -> None:
    """Create any missing tables. Safe to call every time the server starts."""
    # Importing models registers the Student table with SQLModel before create_all.
    from app import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session():
    """Yield a database session for a single request."""
    with Session(engine) as session:
        yield session
