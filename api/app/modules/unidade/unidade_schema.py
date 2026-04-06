from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from typing import List, Optional
from app.modules.usuario.usuario_schema import MoradorResponse

#CRIAR UNIDADE E MODELO PRINCIPAL
class UnidadeBase(BaseModel):
    unidade: str
    andar: Optional[int] = None
    bloco: Optional[str] = None

class UnidadeCreate(UnidadeBase):
    condominio_id: int
#RECEBE DA CLASSE PAI TUDO SEM ADICIONAR NADA A MAIS

#ATUALIZAR UNIDADE
class UnidadeUpdate(BaseModel):
    unidade: Optional[str] = None
    andar: Optional[int] = None
    bloco: Optional[str] = None
    condominio_id: Optional[int] = None

#GET DA UNIDADE
class UnidadeResponse(UnidadeBase):
    id: int
    condominio_id: int
    moradores:  Optional[List[MoradorResponse]] = []

    class Config:
        from_attributes = True