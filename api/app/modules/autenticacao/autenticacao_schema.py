from pydantic import BaseModel, EmailStr


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
    codigo: str


class ResetarSenhaRequest(BaseModel):
    email: EmailStr
    codigo: str
    nova_senha: str
