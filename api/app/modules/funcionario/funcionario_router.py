from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import RequirePermission
from app.modules.funcionario.funcionario_controller import FuncionarioController
from app.modules.funcionario.funcionario_schema import (
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
    return await FuncionarioController.registrar_funcionario(dados, db)


@router.patch(
    "/{id_funcionario}/aprovar",
    status_code=status.HTTP_200_OK,
    response_model=StandardResponse,
    dependencies=[Depends(RequirePermission("atualizar:funcionario"))],
)
async def aprovar_funcionario(id_funcionario: int, db: Prisma = Depends(get_prisma)):
    """
    Aprova o cadastro de um funcionário pendente.
    Restrito a usuários com permissão 'atualizar:funcionario'.
    """
    return await FuncionarioController.aprovar_funcionario(id_funcionario, db)
