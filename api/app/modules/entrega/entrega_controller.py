from fastapi import status

from app.modules.core.core_schema import StandardResponse
from app.modules.entrega.entrega_schema import EntregaCreate, EntregaStatusUpdate
from app.modules.entrega.entrega_service import EntregaService


class EntregaController:
    @staticmethod
    async def criar_entrega(
        morador_id: int,
        dados: EntregaCreate,
        usuario_id: int,
        condominio_id: int | None,
        service: EntregaService,
    ):
        nova_entrega = await service.criar_entrega(
            morador_id=morador_id,
            dados=dados,
            quem_criou=usuario_id,
            condominio_id=condominio_id,
        )

        return StandardResponse(
            message="Entrega criada com sucesso.",
            status_code=status.HTTP_201_CREATED,
            data=nova_entrega,
        )

    @staticmethod
    async def listar_entregas_morador(
        morador_id: int,
        limit: int,
        offset: int,
        service: EntregaService,
    ):
        total, items = await service.listar_entregas_morador(morador_id, limit, offset)
        return StandardResponse(
            message="Entregas listadas com sucesso.",
            status_code=status.HTTP_200_OK,
            data={"total": total, "items": items},
        )

    @staticmethod
    async def listar_entregas_condominio(
        condominio_id: int,
        limit: int,
        offset: int,
        service: EntregaService,
    ):
        total, items = await service.listar_entregas_condominio(
            condominio_id, limit, offset
        )
        return StandardResponse(
            message="Entregas listadas com sucesso.",
            status_code=status.HTTP_200_OK,
            data={"total": total, "items": items},
        )

    @staticmethod
    async def atualizar_status(
        entrega_id: int,
        dados: EntregaStatusUpdate,
        usuario_id: int,
        service: EntregaService,
    ):
        entrega = await service.atualizar_status(entrega_id, dados, usuario_id)
        return StandardResponse(
            message="Status da entrega atualizado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=entrega,
        )

    @staticmethod
    async def deletar_entrega(
        entrega_id: int,
        service: EntregaService,
    ):
        await service.deletar_entrega(entrega_id)
        return StandardResponse(
            message="Entrega deletada com sucesso.",
            status_code=status.HTTP_200_OK,
        )
