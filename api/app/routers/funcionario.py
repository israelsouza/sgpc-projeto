from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.core_schema import StandardResponse
from app.modules.usuario.usuario_controller import UsuarioController
from app.modules.usuario.usuario_schema import (
    FuncionarioRegistroCreate,
)
from prisma import Prisma

router = APIRouter(prefix="/funcionarios", tags=["Funcionários"])


@router.post(
    "/registrar", response_model=StandardResponse, status_code=status.HTTP_201_CREATED
)
async def registrar_funcionario(
    dados: FuncionarioRegistroCreate, db: Prisma = Depends(get_prisma)
):
    """
    Realiza o registro de um funcionário (Porteiro, Síndico, etc) usando uma chave de acesso.
    """
    return await UsuarioController.registrar_funcionario(dados, db)
