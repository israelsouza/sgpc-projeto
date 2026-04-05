from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.chave.chave_controller import ChaveController
from app.modules.chave.chave_schema import ChaveAcessoCreate
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import RequirePermission, get_current_user
from app.modules.usuario.usuario_controller import UsuarioController
from app.modules.usuario.usuario_schema import (
    LoginSchema,
)
from prisma import Prisma, models

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT.
    """
    return await UsuarioController.login(dados, db)


@router.post(
    "/chave-acesso",
    status_code=status.HTTP_201_CREATED,
    response_model=StandardResponse,
    dependencies=[Depends(RequirePermission("criar:chave_acesso"))],
)
async def gerar_chave_acesso(
    dados: ChaveAcessoCreate,
    db: Prisma = Depends(get_prisma),
    usuario: models.Usuario = Depends(get_current_user),
):
    """
    Gera uma chave de acesso UUID única e temporária.
    Restrita a usuários com permissão 'criar:chave_acesso'.
    """
    return await ChaveController.gerar_chave_acesso(dados, db, usuario.id)
