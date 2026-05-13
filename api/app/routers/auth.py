from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.usuario.usuario_controller import UsuarioController
from app.modules.usuario.usuario_schema import (
    ChaveAcessoCreate,
    LoginSchema,
    TokenSchema,
)
from prisma import Prisma
from app.modules.core.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.get("/usuario")
async def get_users(usuario_logado = Depends(get_current_user)):
    return {
        "id": usuario_logado["sub"],
        "email": usuario_logado["email"],
        "nome": usuario_logado["nome"],
        "roles": usuario_logado["roles"]
    }

@router.post("/login", response_model=TokenSchema)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT.
    """
    return await UsuarioController.login(dados, db)


@router.post("/chave-acesso", status_code=status.HTTP_201_CREATED)
async def gerar_chave_acesso(
    dados: ChaveAcessoCreate, db: Prisma = Depends(get_prisma), usuario_id: int = 1
):
    """
    Gera uma chave de acesso UUID única e temporária.
    Restrita a Síndicos/Admins via Controller.
    """
    return await UsuarioController.gerar_chave_acesso(dados, db, usuario_id)
