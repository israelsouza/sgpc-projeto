from datetime import datetime

from pydantic import BaseModel, Field


class ConviteCreate(BaseModel):
    # Por enquanto não precisa de campos, o morador logado é o dono
    pass


class ConviteResponse(BaseModel):
    id: int
    token: str
    url: str
    data_expiracao: datetime
    status: str

    class Config:
        from_attributes = True


class VisitanteCreate(BaseModel):
    nome_completo: str = Field(..., min_length=3, max_length=100)
    documento: str = Field(..., min_length=5, max_length=20)
    celular: str = Field(..., min_length=10, max_length=15)


class VisitanteResponse(BaseModel):
    id: int
    nome_completo: str
    documento: str
    celular: str
    morador_id: int
    criado_em: datetime

    class Config:
        from_attributes = True
