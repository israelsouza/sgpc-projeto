from app.modules.entrega.entrega_schema import EntregaCreate, EntregaStatusUpdate
from prisma import Prisma


class EntregaModel:
    def __init__(self, db: Prisma):
        self.db = db

    async def criar(self, morador_id: int, dados: EntregaCreate, quem_criou: int):
        return await self.db.entrega.create(
            data={
                "morador_id": morador_id,
                "tipo": dados.tipo,
                "prazo_retirada": dados.prazo_retirada,
                "mensagem": dados.mensagem,
                "quem_criou": quem_criou,
            }
        )

    async def obter_por_id(self, entrega_id: int):
        return await self.db.entrega.find_unique(
            where={"id": entrega_id},
            include={"morador": {"include": {"unidade": True, "usuario": True}}},
        )

    async def listar_por_morador(
        self, morador_id: int, limit: int = 20, offset: int = 0
    ):
        # Somente entregas não deletadas logicamente
        where_clause = {"morador_id": morador_id, "deletado_em": None}

        total = await self.db.entrega.count(where=where_clause)
        items = await self.db.entrega.find_many(
            where=where_clause,
            skip=offset,
            take=limit,
            order={"criado_em": "desc"},
        )
        return total, items

    async def listar_por_condominio(
        self, condominio_id: int, limit: int = 20, offset: int = 0
    ):
        # Buscar todas as entregas dos moradores que pertencem às unidades do condomínio
        where_clause = {
            "morador": {"is": {"unidade": {"is": {"condominio_id": condominio_id}}}},
            "deletado_em": None,
        }

        total = await self.db.entrega.count(where=where_clause)
        items = await self.db.entrega.find_many(
            where=where_clause,
            include={"morador": {"include": {"unidade": True}}},
            skip=offset,
            take=limit,
            order={"criado_em": "desc"},
        )
        return total, items

    async def atualizar_status(
        self, entrega_id: int, dados: EntregaStatusUpdate, usuario_id: int
    ):
        update_data = {"status": dados.status}
        if dados.status == "CANCELADA" and dados.justificativa_cancelamento:
            update_data["justificativa_cancelamento"] = dados.justificativa_cancelamento

        if dados.status == "RECEBIDA":
            update_data["quem_recebeu"] = usuario_id
            if dados.observacao_porteiro:
                update_data["observacao_porteiro"] = dados.observacao_porteiro

        return await self.db.entrega.update(
            where={"id": entrega_id},
            data=update_data,
        )

    async def deletar(self, entrega_id: int):
        import datetime

        return await self.db.entrega.update(
            where={"id": entrega_id},
            data={"deletado_em": datetime.datetime.now(datetime.UTC)},
        )
