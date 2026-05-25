from pydantic import BaseModel, ConfigDict

class VisitanteBase(BaseModel):
    nome_completo: str
    cpf: str | None = None
    rg: str | None = None
    celular: str | None = None

class VisitanteCreate(VisitanteBase):
    morador_id: int

class VisitanteResponse(VisitanteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
