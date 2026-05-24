from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import RequirePermission, get_current_user
from app.modules.morador.morador_controller import MoradorController
from app.modules.morador.morador_schema import MoradorCreate
from prisma import Prisma, models

router = APIRouter(prefix="/moradores", tags=["Moradores"])


@router.post(
    "/registrar", response_model=StandardResponse, status_code=status.HTTP_201_CREATED
)
async def registrar_morador(dados: MoradorCreate, db: Prisma = Depends(get_prisma)):
    """
    Realiza o pré-cadastro de um morador usando uma chave de acesso UUID.
    O morador fica com status PENDENTE até a aprovação do síndico.
    """
    return await MoradorController.registrar_morador(dados, db)


@router.patch(
    "/{id_morador}/aprovar",
    status_code=status.HTTP_200_OK,
    response_model=StandardResponse,
    dependencies=[Depends(RequirePermission("atualizar:morador"))],
)
async def aprovar_morador(id_morador: int, db: Prisma = Depends(get_prisma)):
    """
    Aprova um cadastro de morador pendente.
    A unidade e o perfil já são vinculados automaticamente no ato do registro via chave.
    Restrito a usuários com permissão 'atualizar:morador'.
    """
    return await MoradorController.aprovar_morador(id_morador, db)


@router.get(
    "/unidade",
    response_model=StandardResponse[list],
)
async def listar_moradores_unidade(
    usuario: models.Usuario = Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    """
    Lista os moradores da mesma unidade do usuário logado.
    """
    resultado = await MoradorController.listar_moradores_unidade(usuario.id, db)
    return StandardResponse(
        message="Moradores listados com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )


@router.get(
    "/condominio",
    response_model=StandardResponse[list],
)
async def listar_moradores_condominio(
    usuario: models.Usuario = Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    """
    Lista todos os moradores do condomínio (Restrito a funcionários).
    """
    resultado = await MoradorController.listar_moradores_condominio(usuario.id, db)
    return StandardResponse(
        message="Moradores do condomínio listados com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )
