from pydantic import BaseModel


class FCMTokenCreate(BaseModel):
    token: str
    dispositivo: str | None = None
