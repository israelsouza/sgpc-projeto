# Schemas de exemplo — remova ou adapte conforme os modelos do projeto
from pydantic import BaseModel


class Message(BaseModel):
    message: str
