from fastapi import APIRouter, Depends, Query

from app.db.prisma_client import get_prisma
from app.modules.core.adapters import FcmPushAdapter
from app.modules.core.core_exception import ForbiddenError
from app.modules.core.security import get_current_user
from app.modules.entrega.entrega_controller import EntregaController
from app.modules.entrega.entrega_schema import EntregaCreate, EntregaStatusUpdate
from app.modules.entrega.entrega_service import EntregaService
from prisma import Prisma

router = APIRouter(prefix="/entregas", tags=["Entregas"])


def get_entrega_service(db: Prisma = Depends(get_prisma)) -> EntregaService:
    return EntregaService(db=db, push_adapter=FcmPushAdapter())


@router.post("")
async def criar_entrega(
    dados: EntregaCreate,
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """Cria uma nova expectativa de entrega pelo morador."""
    if not current_user.morador:
        raise ForbiddenError("Apenas moradores podem criar avisos de entrega.")

    condominio_id = None
    if current_user.morador.unidade:
        condominio_id = current_user.morador.unidade.condominio_id

    return await EntregaController.criar_entrega(
        morador_id=current_user.morador.id,
        dados=dados,
        usuario_id=current_user.id,
        condominio_id=condominio_id,
        service=service,
    )


@router.get("/morador")
async def listar_entregas_morador(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """Lista as entregas do morador logado."""
    if not current_user.morador:
        raise ForbiddenError("Acesso negado. Usuário não é um morador.")

    return await EntregaController.listar_entregas_morador(
        morador_id=current_user.morador.id,
        limit=limit,
        offset=offset,
        service=service,
    )


@router.get("/condominio")
async def listar_entregas_condominio(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """Lista as entregas do condomínio (para porteiros/síndicos)."""
    condominio_id = None
    if current_user.funcionario:
        condominio_id = current_user.funcionario.condominio_id
    elif current_user.morador and current_user.morador.unidade:
        condominio_id = current_user.morador.unidade.condominio_id

    if not condominio_id:
        raise ForbiddenError("Usuário não associado a um condomínio.")

    return await EntregaController.listar_entregas_condominio(
        condominio_id=condominio_id,
        limit=limit,
        offset=offset,
        service=service,
    )


@router.get("/{entrega_id}")
async def obter_detalhes(
    entrega_id: int,
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """Obtém detalhes de uma entrega."""
    entrega = await service.model.obter_por_id(entrega_id)
    if not entrega:
        raise ForbiddenError("Entrega não encontrada.")
    from fastapi import status

    from app.modules.core.core_schema import StandardResponse

    return StandardResponse(
        message="Entrega obtida com sucesso.",
        status_code=status.HTTP_200_OK,
        data=entrega,
    )


@router.patch("/{entrega_id}/status")
async def atualizar_status(
    entrega_id: int,
    dados: EntregaStatusUpdate,
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """
    Atualiza o status da entrega.
    Pode ser usado pelo porteiro (marcar RECEBIDA) ou morador (marcar RETIRADA/CANCELADA).
    """
    return await EntregaController.atualizar_status(
        entrega_id=entrega_id,
        dados=dados,
        usuario_id=current_user.id,
        service=service,
    )


@router.delete("/{entrega_id}")
async def deletar_entrega(
    entrega_id: int,
    current_user=Depends(get_current_user),
    service: EntregaService = Depends(get_entrega_service),
):
    """Deleta (logicamente) uma entrega."""
    return await EntregaController.deletar_entrega(
        entrega_id=entrega_id,
        service=service,
    )
