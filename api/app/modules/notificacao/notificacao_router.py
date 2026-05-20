from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import get_current_user
from app.modules.notificacao.notificacao_schema import FCMTokenCreate
from app.modules.notificacao.notificacao_service import NotificacaoService
from prisma import Prisma, models

router = APIRouter(prefix="/notificacoes", tags=["Notificações"])


@router.post("/tokens", status_code=status.HTTP_200_OK, response_model=StandardResponse)
async def registrar_token_fcm(
    dados: FCMTokenCreate,
    db: Prisma = Depends(get_prisma),
    usuario: models.Usuario = Depends(get_current_user),
):
    """
    Registra ou atualiza o token FCM do dispositivo do usuário logado.
    """
    await NotificacaoService.salvar_token(db, usuario.id, dados)
    return StandardResponse(
        message="Token registrado com sucesso.", status_code=status.HTTP_200_OK
    )


@router.delete(
    "/tokens/{token}", status_code=status.HTTP_200_OK, response_model=StandardResponse
)
async def remover_token_fcm(token: str, db: Prisma = Depends(get_prisma)):
    """
    Remove um token FCM (usado no logout).
    """
    await NotificacaoService.remover_token(db, token)
    return StandardResponse(
        message="Token removido com sucesso.", status_code=status.HTTP_200_OK
    )
