
import os

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy import text

load_dotenv()

# Use PostgreSQL on Vercel and SQLite locally.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pathwise.db")

# SQLite-specific configuration.
connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

# Connection health checking is useful for hosted databases.
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)


def create_db_and_tables() -> None:
    """Create missing database tables safely."""

    from app import models  # noqa: F401

    if DATABASE_URL.startswith(("postgresql://", "postgresql+")):
        with engine.begin() as connection:
            # Ensure only one serverless instance creates tables at a time.
            connection.execute(
                text("SELECT pg_advisory_xact_lock(72819421)")
            )

            SQLModel.metadata.create_all(connection)
    else:
        SQLModel.metadata.create_all(engine)

def get_session():
    """Provide a database session for a request."""
    with Session(engine) as session:
        yield session

import os

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()

# Use PostgreSQL on Vercel and SQLite locally.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pathwise.db")

# SQLite-specific configuration.
connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

# Connection health checking is useful for hosted databases.
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)


def create_db_and_tables() -> None:
    """Create missing database tables."""
    from app import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session():
    """Provide a database session for a request."""
    with Session(engine) as session:
        yield session
