from datetime import datetime

from pydantic import BaseModel, Field


class DocumentoCreate(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=255)
    descricao: str | None = None
    categoria: str = Field(..., max_length=100)


class DocumentoResponse(BaseModel):
    id: int
    titulo: str
    descricao: str | None = None
    categoria: str
    filename_orig: str
    criado_em: datetime
    quem_criou_id: int

    class Config:
        from_attributes = True


class DocumentosListResponse(BaseModel):
    total: int
    items: list[DocumentoResponse]
