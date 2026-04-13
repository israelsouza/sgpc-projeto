from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class MoradorBase(BaseModel):
    nome_completo: str
    celular: str
    rg: str
    cpf: str
    data_nascimento: datetime


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


class MoradorResponse(MoradorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    criado_em: datetime
