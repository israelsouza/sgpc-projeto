from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class MoradorBase(BaseModel):
    nome_completo: str
    celular: str
    rg: str
    cpf: str
    data_nascimento: str


class MoradorCreate(MoradorBase):
    email: EmailStr
    senha: str
    confirmacao_senha: str
    chave_acesso: str

    @field_validator("confirmacao_senha")
    @classmethod
    def senhas_iguais(cls, v, info):
        if "senha" in info.data and v != info.data["senha"]:
            raise ValueError("As senhas não coincidem")
        return v


class VisitanteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome_completo: str
    cpf: str | None = None
    rg: str | None = None
    celular: str | None = None

class MoradorResponse(MoradorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    criado_em: datetime
    visitantes: list[VisitanteResponse] = []
