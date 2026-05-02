from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field, field_validator


class CategoriaAviso(StrEnum):
    MANUTENCAO = "MANUTENCAO"
    ASSEMBLEIA = "ASSEMBLEIA"
    URGENTE = "URGENTE"
    GERAL = "GERAL"


class AvisoBase(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=100)
    descricao: str = Field(..., min_length=10)
    categoria: CategoriaAviso

    @field_validator("titulo", "descricao", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("O campo não pode conter apenas espaços em branco.")
        return v


class AvisoCreate(AvisoBase):
    pass


class AvisoUpdate(BaseModel):
    titulo: str | None = Field(None, min_length=3, max_length=100)
    descricao: str | None = Field(None, min_length=10)
    categoria: CategoriaAviso | None = None


class AvisoResponse(AvisoBase):
    id: int
    condominio_id: int
    anexo_url: str | None = None
    criado_em: datetime
    is_recente: bool
    quem_criou: int | None = None

    class Config:
        from_attributes = True


class AvisoListResponse(BaseModel):
    total: int
    items: list[AvisoResponse]
