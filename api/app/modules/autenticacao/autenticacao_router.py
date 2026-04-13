from fastapi import APIRouter, Depends

from app.db.prisma_client import get_prisma
from app.modules.autenticacao.autenticacao_controller import AutenticacaoController
from app.modules.autenticacao.autenticacao_schema import LoginSchema
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=StandardResponse)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT.
    """
    return await AutenticacaoController.login(dados, db)
