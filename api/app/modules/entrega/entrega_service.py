from app.core.websocket_manager import manager
from app.modules.core.adapters import FcmPushAdapter
from app.modules.core.core_exception import NotFoundError, ValidationError
from app.modules.entrega.entrega_model import EntregaModel
from app.modules.entrega.entrega_schema import (
    EntregaCreate,
    EntregaStatusUpdate,
    StatusEntrega,
)
from prisma import Prisma


class EntregaService:
    def __init__(self, db: Prisma, push_adapter: FcmPushAdapter):
        self.model = EntregaModel(db)
        self.push_adapter = push_adapter

    async def criar_entrega(
        self,
        morador_id: int,
        dados: EntregaCreate,
        quem_criou: int,
        condominio_id: int | None = None,
    ):
        nova_entrega = await self.model.criar(morador_id, dados, quem_criou)

        # Disparar evento WebSocket para o condomínio, se fornecido
        if condominio_id:
            await manager.broadcast_to_condominio(
                {
                    "type": "NEW_ENTREGA",
                    "entrega_id": nova_entrega.id,
                    "status": nova_entrega.status,
                },
                condominio_id,
            )

        return nova_entrega

    async def listar_entregas_morador(self, morador_id: int, limit: int, offset: int):
        return await self.model.listar_por_morador(morador_id, limit, offset)

    async def listar_entregas_condominio(
        self, condominio_id: int, limit: int, offset: int
    ):
        return await self.model.listar_por_condominio(condominio_id, limit, offset)

    async def atualizar_status(
        self, entrega_id: int, dados: EntregaStatusUpdate, usuario_id: int
    ):
        if (
            dados.status == StatusEntrega.CANCELADA
            and not dados.justificativa_cancelamento
        ):
            raise ValidationError(
                nome="validacao_cancelamento",
                mensagem="Justificativa é obrigatória para cancelar a entrega.",
            )

        entrega = await self.model.obter_por_id(entrega_id)
        if not entrega:
            raise NotFoundError("Entrega não encontrada.")

        entrega_atualizada = await self.model.atualizar_status(
            entrega_id, dados, usuario_id
        )

        # Enviar Push Notification se alterado para RECEBIDA
        if dados.status == StatusEntrega.RECEBIDA:
            # Precisa obter o usuário atrelado ao morador
            if entrega.morador and entrega.morador.usuario_id:
                mensagem_push = (
                    f"Sua entrega ({entrega.tipo}) acabou de chegar na portaria!"
                )
                await self.push_adapter.send_push(
                    usuario_id=entrega.morador.usuario_id,
                    title="Entrega Recebida",
                    body=mensagem_push,
                    data={"entrega_id": str(entrega.id), "tipo": "ENTREGA_RECEBIDA"},
                )

        # Disparar evento WS para atualizar listas
        if (
            entrega.morador
            and entrega.morador.unidade
            and entrega.morador.unidade.condominio_id
        ):
            await manager.broadcast_to_condominio(
                {
                    "type": "UPDATE_ENTREGA",
                    "entrega_id": entrega.id,
                    "status": entrega_atualizada.status,
                },
                entrega.morador.unidade.condominio_id,
            )

        return entrega_atualizada

    async def deletar_entrega(self, entrega_id: int):
        entrega = await self.model.obter_por_id(entrega_id)
        if not entrega:
            raise NotFoundError("Entrega não encontrada.")

        await self.model.deletar(entrega_id)

        # WS Broadcast
        if (
            entrega.morador
            and entrega.morador.unidade
            and entrega.morador.unidade.condominio_id
        ):
            await manager.broadcast_to_condominio(
                {
                    "type": "UPDATE_ENTREGA",
                    "entrega_id": entrega.id,
                    "status": "DELETADA",
                },
                entrega.morador.unidade.condominio_id,
            )
