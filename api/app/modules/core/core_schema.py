from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class StandardResponse[T](BaseModel):
    message: str
    status_code: int
    data: T | None = None
