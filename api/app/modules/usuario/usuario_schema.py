from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

# --- Chave de Acesso ---


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


# --- Morador ---


class MoradorBase(BaseModel):
    nome_completo: str
    celular: str
    rg: str | None = None
    cpf: str
    data_nascimento: datetime | None = None


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


# --- Funcionário ---


class FuncionarioBase(BaseModel):
    cargo: str
    status: str = "ATIVO"


class FuncionarioCreate(FuncionarioBase):
    usuario_id: int
    condominio_id: int


class FuncionarioResponse(FuncionarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    condominio_id: int


# --- Usuário ---


class UsuarioBase(BaseModel):
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    senha: str


class UsuarioResponse(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    perfis: list[str] = []


# --- Autenticação ---


class LoginSchema(BaseModel):
    email: EmailStr
    senha: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
