from pydantic import BaseModel

from app.modules.morador.morador_schema import MoradorResponse


#CRIAR UNIDADE E MODELO PRINCIPAL
class UnidadeBase(BaseModel):
    unidade: str
    andar: int | None = None
    bloco: str | None = None

class UnidadeCreate(UnidadeBase):
    condominio_id: int
#RECEBE DA CLASSE PAI TUDO SEM ADICIONAR NADA A MAIS

#ATUALIZAR UNIDADE
class UnidadeUpdate(BaseModel):
    unidade: str | None = None
    andar: int | None = None
    bloco: str | None = None
    condominio_id: int | None = None

#GET DA UNIDADE
class UnidadeResponse(UnidadeBase):
    id: int
    condominio_id: int
    moradores:  list[MoradorResponse] | None = []

    class Config:
        from_attributes = True
