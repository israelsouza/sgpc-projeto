from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class FuncionarioBase(BaseModel):
    nome_completo: str
    celular: str
    rg: str
    cpf: str
    data_nascimento: datetime
    cargo: str
    status: str = "PENDENTE"


class FuncionarioCreate(FuncionarioBase):
    usuario_id: int
    condominio_id: int


class FuncionarioRegistroCreate(BaseModel):
    nome_completo: str
    celular: str
    rg: str
    cpf: str
    data_nascimento: datetime
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


class FuncionarioResponse(FuncionarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    condominio_id: int
