from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Query,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
    status,
)

from app.core.websocket_manager import manager
from app.modules.aviso.aviso_controller import AvisoController, get_aviso_service
from app.modules.aviso.aviso_schema import (
    AvisoListResponse,
    AvisoResponse,
    CategoriaAviso,
)
from app.modules.aviso.aviso_service import AvisoService
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import (
    ForbiddenError,
    RequirePermission,
    get_current_user,
)
from prisma import models

router = APIRouter(prefix="/avisos", tags=["Mural de Avisos"])


def obter_condominio_id(usuario: models.Usuario) -> int:
    if usuario.funcionario:
        return usuario.funcionario.condominio_id
    if usuario.morador and usuario.morador.unidade:
        return usuario.morador.unidade.condominio_id
    raise ForbiddenError(mensagem="Usuário não vinculado a um condomínio.")


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=StandardResponse,
    dependencies=[Depends(RequirePermission("criar:aviso"))],
)
async def criar_aviso(
    titulo: str = Form(...),
    descricao: str = Form(...),
    categoria: CategoriaAviso = Form(...),
    arquivo: UploadFile | None = File(None),
    usuario: models.Usuario = Depends(get_current_user),
    service: AvisoService = Depends(get_aviso_service),
):
    """
    Cria um novo aviso no mural. Suporta upload de anexo PDF.
    """
    condominio_id = obter_condominio_id(usuario)
    return await AvisoController.criar_aviso(
        titulo=titulo,
        descricao=descricao,
        categoria=categoria,
        usuario_id=usuario.id,
        condominio_id=condominio_id,
        service=service,
        arquivo=arquivo,
    )


@router.get(
    "",
    response_model=StandardResponse[AvisoListResponse],
)
async def listar_avisos(
    categoria: CategoriaAviso | None = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    usuario: models.Usuario = Depends(get_current_user),
    service: AvisoService = Depends(get_aviso_service),
):
    """
    Lista os avisos do condomínio do usuário logado.
    """
    condominio_id = obter_condominio_id(usuario)
    return await AvisoController.listar_avisos(
        condominio_id=condominio_id,
        categoria=categoria,
        limit=limit,
        offset=offset,
        service=service,
    )


@router.get(
    "/{aviso_id}",
    response_model=StandardResponse[AvisoResponse],
)
async def obter_detalhes(
    aviso_id: int,
    usuario: models.Usuario = Depends(get_current_user),
    service: AvisoService = Depends(get_aviso_service),
):
    """
    Obtém detalhes de um aviso específico.
    """
    condominio_id = obter_condominio_id(usuario)
    return await AvisoController.obter_detalhes(aviso_id, condominio_id, service)


@router.get(
    "/{aviso_id}/anexo",
    response_model=StandardResponse,
)
async def obter_url_anexo(
    aviso_id: int,
    usuario: models.Usuario = Depends(get_current_user),
    service: AvisoService = Depends(get_aviso_service),
):
    """
    Gera uma URL assinada para download do anexo do aviso.
    """
    condominio_id = obter_condominio_id(usuario)
    return await AvisoController.obter_url_anexo(aviso_id, condominio_id, service)


@router.delete(
    "/{aviso_id}",
    dependencies=[Depends(RequirePermission("deletar:aviso"))],
)
async def deletar_aviso(
    aviso_id: int,
    usuario: models.Usuario = Depends(get_current_user),
    service: AvisoService = Depends(get_aviso_service),
):
    """
    Remove (soft delete) um aviso.
    """
    condominio_id = obter_condominio_id(usuario)
    return await AvisoController.deletar_aviso(aviso_id, condominio_id, service)


# --- WebSocket Route ---


@router.websocket("/ws/{condominio_id}")
async def websocket_endpoint(websocket: WebSocket, condominio_id: int):
    # TODO: Validar Token JWT na conexão inicial do WebSocket
    # Por enquanto, aceitamos a conexão baseada no ID do condomínio passado na URL
    await manager.connect(websocket, condominio_id)
    try:
        while True:
            # Mantém a conexão viva e aguarda mensagens (se necessário)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, condominio_id)
