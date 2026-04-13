from pydantic import BaseModel, ConfigDict


class CondominioBase(BaseModel):
    nome: str
    cnpj: str | None = None
    endereco: str | None = None


class CondominioCreate(CondominioBase):
    pass


class CondominioResponse(CondominioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
