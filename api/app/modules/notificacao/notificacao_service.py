from firebase_admin import messaging

from app.modules.notificacao.notificacao_schema import FCMTokenCreate
from prisma import Prisma


class NotificacaoService:
    @staticmethod
    async def salvar_token(db: Prisma, usuario_id: int, dados: FCMTokenCreate):
        # 1. Persistência do token no banco
        token_record = await db.fcmtoken.upsert(
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

        # 2. Inscrição automática no tópico do condomínio
        try:
            # Busca o condomínio do usuário (via morador ou funcionário)
            usuario = await db.usuario.find_unique(
                where={"id": usuario_id},
                include={
                    "morador": {"include": {"unidade": True}},
                    "funcionario": True,
                },
            )

            condo_id = None
            if usuario.funcionario:
                condo_id = usuario.funcionario.condominio_id
            elif usuario.morador and usuario.morador.unidade:
                condo_id = usuario.morador.unidade.condominio_id

            if condo_id:
                topic = f"condominio_{condo_id}"
                messaging.subscribe_to_topic([dados.token], topic)
        except Exception:
            # Falha na inscrição não deve travar o registro do token
            pass

        return token_record

    @staticmethod
    async def remover_token(db: Prisma, token: str):
        try:
            await db.fcmtoken.delete(where={"token": token})
        except Exception:
            pass
