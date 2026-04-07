from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.security import RequirePermission
from app.modules.usuario.usuario_controller import UsuarioController
from app.modules.usuario.usuario_schema import MoradorCreate, MoradorResponse
from prisma import Prisma

router = APIRouter(prefix="/moradores", tags=["Moradores"])


@router.post(
    "/registrar", response_model=MoradorResponse, status_code=status.HTTP_201_CREATED
)
async def registrar_morador(dados: MoradorCreate, db: Prisma = Depends(get_prisma)):
    """
    Realiza o pré-cadastro de um morador usando uma chave de acesso UUID.
    O morador fica com status PENDENTE até a aprovação do síndico.
    """
    return await UsuarioController.registrar_morador(dados, db)


@router.patch(
    "/{id_morador}/aprovar",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(RequirePermission("atualizar:morador"))],
)
async def aprovar_morador(id_morador: int, db: Prisma = Depends(get_prisma)):
    """
    Aprova um cadastro de morador pendente.
    A unidade e o perfil já são vinculados automaticamente no ato do registro via chave.
    Restrito a usuários com permissão 'atualizar:morador'.
    """
    return await UsuarioController.aprovar_morador(id_morador, db)
