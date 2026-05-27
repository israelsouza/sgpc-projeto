import secrets
from datetime import UTC, datetime, timedelta

from app.config import settings
from app.modules.convite.convite_schema import (
    ConviteCreate,
    VisitanteCreate,
    VisitanteUpdate,
)
from app.modules.core.adapters import FcmPushAdapter
from app.modules.core.core_exception import NotFoundError, ValidationError
from app.modules.core.logger import logger
from prisma import Prisma


class ConviteService:
    @staticmethod
    async def gerar_convite(db: Prisma, morador_id: int, dados: ConviteCreate):
        token = secrets.token_urlsafe(32)
        expiracao = datetime.now(UTC) + timedelta(hours=24)

        convite = await db.convite.create(
            data={
                "token": token,
                "morador_id": morador_id,
                "tipo": dados.tipo,
                "data_expiracao": expiracao,
                "status": "PENDENTE",
            }
        )

        url = f"{settings.BASE_URL}/api/convites/{token}"

        # O Prisma Python usa Pydantic internamente.
        # Transformamos em dict para o FastAPI retornar como JSON corretamente.
        convite_dict = convite.model_dump()
        return {**convite_dict, "url": url}

    @staticmethod
    async def validar_token(db: Prisma, token: str):
        convite = await db.convite.find_unique(
            where={"token": token}, include={"morador": True}
        )

        if not convite:
            return None

        if convite.status != "PENDENTE":
            return None

        if convite.data_expiracao.replace(tzinfo=UTC) < datetime.now(UTC):
            await db.convite.update(where={"token": token}, data={"status": "EXPIRADO"})
            return None

        return convite

    @staticmethod
    async def registrar_visitante(db: Prisma, token: str, dados: VisitanteCreate):
        convite = await ConviteService.validar_token(db, token)
        if not convite:
            raise ValidationError(
                nome="convite_invalido",
                mensagem="Este convite é inválido ou já expirou.",
                acao="Peça ao morador para gerar um novo convite.",
            )

        # Criar visitante e vincular ao morador, preservando o tipo do convite
        visitante = await db.visitante.create(
            data={
                "nome_completo": dados.nome_completo,
                "documento": dados.documento,
                "celular": dados.celular,
                "tipo": convite.tipo,
                "morador_id": convite.morador_id,
            }
        )

        # Atualizar status do convite
        await db.convite.update(where={"token": token}, data={"status": "UTILIZADO"})

        # Notificar morador
        try:
            tokens = await db.fcmtoken.find_many(
                where={"usuario_id": convite.morador.usuario_id}
            )

            if tokens:
                push_service = FcmPushAdapter()
                tipo_label = (
                    "Visitante"
                    if convite.tipo == "VISITANTE"
                    else "Prestador de Serviço"
                )
                for t in tokens:
                    await push_service.send_direct_push(
                        token=t.token,
                        title=f"Novo {tipo_label} Cadastrado",
                        body=f"{dados.nome_completo} preencheu os dados e já está na sua rede!",
                        data={
                            "tipo": "VISITANTE_CADASTRADO",
                            "visitante_id": str(visitante.id),
                        },
                    )
        except Exception as e:
            logger.error("erro_notificar_morador", error=str(e))

        return visitante

    @staticmethod
    async def atualizar_visitante(
        db: Prisma, visitante_id: int, dados: VisitanteUpdate
    ):
        visitante = await db.visitante.find_unique(where={"id": visitante_id})
        if not visitante:
            raise NotFoundError("Visitante não encontrado.")

        update_data = dados.model_dump(exclude_unset=True)
        return await db.visitante.update(where={"id": visitante_id}, data=update_data)

    @staticmethod
    async def excluir_visitante(db: Prisma, visitante_id: int):
        visitante = await db.visitante.find_unique(where={"id": visitante_id})
        if not visitante:
            raise NotFoundError("Visitante não encontrado.")

        await db.visitante.delete(where={"id": visitante_id})
        return True
