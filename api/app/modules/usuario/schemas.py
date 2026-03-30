from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator

# --- Chave de Acesso ---


class ChaveAcessoBase(BaseModel):
    chave: str
    validade: datetime


class ChaveAcessoCreate(BaseModel):
    # O síndico só define a validade (ou usamos um padrão)
    validade_em_horas: int = 24


class ChaveAcessoResponse(ChaveAcessoBase):
    id: str
    usada: bool = False

    class Config:
        from_attributes = True


# --- Morador ---


class MoradorBase(BaseModel):
    nome_completo: str
    celular: str
    rg: str | None = None
    cpf: str
    data_nascimento: datetime | None = None


class MoradorCreate(MoradorBase):
    # Dados de acesso (Usuário)
    email: EmailStr
    senha: str
    confirmacao_senha: str
    chave_acesso: str  # O UUID gerado pelo síndico

    @field_validator("confirmacao_senha")
    @classmethod
    def senhas_iguais(cls, v, info):
        if "senha" in info.data and v != info.data["senha"]:
            raise ValueError("As senhas não coincidem")
        return v


class MoradorResponse(MoradorBase):
    id: int
    status: str
    criado_em: datetime

    class Config:
        from_attributes = True


# --- Usuário ---


class UsuarioBase(BaseModel):
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    senha: str


class UsuarioResponse(UsuarioBase):
    id: int
    status: str
    perfis: list[str] = []

    class Config:
        from_attributes = True


# --- Autenticação ---


class LoginSchema(BaseModel):
    email: EmailStr
    senha: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
