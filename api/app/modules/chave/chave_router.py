from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.chave.chave_controller import ChaveController
from app.modules.chave.chave_schema import ChaveAcessoCreate, ChaveValidacaoResponse
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import RequirePermission, get_current_user
from prisma import Prisma, models

router = APIRouter(prefix="/chaves", tags=["Chaves de Acesso"])


@router.get(
    "/validar/{chave_uuid}",
    response_model=StandardResponse[ChaveValidacaoResponse],
    status_code=status.HTTP_200_OK,
)
async def validar_chave(chave_uuid: str, db: Prisma = Depends(get_prisma)):
    """
    Inspeciona uma chave de acesso UUID (Público).
    Retorna o Perfil, Condomínio e Unidade vinculados para orientar o registro.
    (Implementar Rate Limiting futuramente).
    """
    return await ChaveController.validar_chave(chave_uuid, db)


@router.post(
    "/gerar",
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
