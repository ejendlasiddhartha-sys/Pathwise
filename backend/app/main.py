import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import create_db_and_tables
from app.routes.recommendations import router as recommendations_router
from app.routes.students import router as students_router
from app.routes.system import router as system_router

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pathwise")

APP_NAME = os.getenv("APP_NAME", "Pathwise")

# The Vite dev server runs on port 5173. Browsers block the frontend from
# calling this API unless that origin is listed here.
LOCAL_FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    logger.info("SQLite database is ready")
    yield


app = FastAPI(title=APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system_router)
app.include_router(students_router)
app.include_router(recommendations_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Hide internal errors from the browser and log them in the terminal."""
    logger.exception("Unhandled error while handling %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Something went wrong on the Pathwise server. Please try again."
        },
    )
