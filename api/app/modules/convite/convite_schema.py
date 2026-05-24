from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class TipoConvite(StrEnum):
    VISITANTE = "VISITANTE"
    PRESTADOR_SERVICO = "PRESTADOR_SERVICO"


class ConviteCreate(BaseModel):
    tipo: TipoConvite = TipoConvite.VISITANTE


class ConviteResponse(BaseModel):
    id: int
    token: str
    url: str
    tipo: str
    data_expiracao: datetime
    status: str

    class Config:
        from_attributes = True


class VisitanteCreate(BaseModel):
    nome_completo: str = Field(..., min_length=3, max_length=100)
    documento: str = Field(..., min_length=5, max_length=20)
    celular: str = Field(..., min_length=10, max_length=15)


class VisitanteUpdate(BaseModel):
    nome_completo: str | None = Field(None, min_length=3, max_length=100)
    documento: str | None = Field(None, min_length=5, max_length=20)
    celular: str | None = Field(None, min_length=10, max_length=15)
    tipo: TipoConvite | None = None


class VisitanteResponse(BaseModel):
    id: int
    nome_completo: str
    documento: str
    celular: str
    tipo: str
    morador_id: int
    criado_em: datetime

    class Config:
        from_attributes = True
