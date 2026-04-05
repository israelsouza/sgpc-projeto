from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChaveAcessoBase(BaseModel):
    chave: str
    validade: datetime


class ChaveAcessoCreate(BaseModel):
    perfil_id: int
    condominio_id: int
    unidade_id: int | None = None
    validade_em_horas: int = 48


class ChaveAcessoResponse(ChaveAcessoBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    usada: bool = False
    perfil_id: int
    condominio_id: int
    unidade_id: int | None = None
