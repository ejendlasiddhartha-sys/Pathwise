
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv()

from app.database import create_db_and_tables, DATABASE_URL
from app.routes.recommendations import router as recommendations_router
from app.routes.students import router as students_router
from app.routes.system import router as system_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pathwise")

APP_NAME = os.getenv("APP_NAME", "Pathwise")

LOCAL_FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add the deployed frontend URL in Vercel's FRONTEND_URL variable.
deployed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URL", "").split(",")
    if origin.strip()
]

ALLOWED_ORIGINS = list(set(LOCAL_FRONTEND_ORIGINS + deployed_origins))


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    database_type = (
        "PostgreSQL" if DATABASE_URL.startswith(("postgresql://", "postgres://"))
        else "SQLite"
    )
    logger.info("%s database is ready", database_type)

    yield


app = FastAPI(title=APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system_router)
app.include_router(students_router)
app.include_router(recommendations_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error while handling %s", request.url.path)

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Something went wrong on the Pathwise server. Please try again."
        },
    )
