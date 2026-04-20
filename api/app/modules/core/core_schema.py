from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class HealthResponse(BaseModel):
    status: str


class StandardResponse(BaseModel, Generic[T]):
    message: str
    status_code: int
    data: T | None = None