from pydantic import BaseModel, ConfigDict, EmailStr


class UsuarioBase(BaseModel):
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    senha: str


class UsuarioResponse(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    perfis: list[str] = []
