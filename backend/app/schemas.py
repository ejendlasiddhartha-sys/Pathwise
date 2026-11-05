from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    application: str


class TestResponse(BaseModel):
    message: str
