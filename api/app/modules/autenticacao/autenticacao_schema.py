from pydantic import BaseModel, EmailStr, Field


class LoginSchema(BaseModel):
    email: EmailStr
    senha: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RecuperarSenhaRequest(BaseModel):
    email: EmailStr


class ValidarCodigoRequest(BaseModel):
    email: EmailStr
    codigo: str = Field(..., min_length=6, max_length=6)


class ResetarSenhaRequest(BaseModel):
    email: EmailStr
    codigo: str = Field(..., min_length=6, max_length=6)
    nova_senha: str = Field(..., min_length=8)
