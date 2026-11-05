
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
