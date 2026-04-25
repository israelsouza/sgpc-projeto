from app.modules.notificacao.notificacao_schema import FCMTokenCreate
from prisma import Prisma


class NotificacaoService:
    @staticmethod
    async def salvar_token(db: Prisma, usuario_id: int, dados: FCMTokenCreate):
        # Upsert: se o token já existe, apenas garante que está vinculado ao usuário correto
        # (Na prática, tokens FCM podem mudar, mas aqui simplificamos para vincular o token ao usuário)
        return await db.fcmtoken.upsert(
            where={"token": dados.token},
            data={
                "create": {
                    "token": dados.token,
                    "dispositivo": dados.dispositivo,
                    "usuario_id": usuario_id,
                },
                "update": {"usuario_id": usuario_id, "dispositivo": dados.dispositivo},
            },
        )

    @staticmethod
    async def remover_token(db: Prisma, token: str):
        try:
            await db.fcmtoken.delete(where={"token": token})
        except Exception:
            pass
