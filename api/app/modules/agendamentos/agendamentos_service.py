from fastapi import HTTPException

from app.modules.agendamentos.agendamentos_schema import (
    EspacoCreate,
    ReservaCreate,
    ReservaUpdate,
)
from prisma import Prisma


class AgendamentoService:
    # SERVICE PARA ESPAÇOS
    @staticmethod
    async def listar_espacos(db: Prisma):
        espaco = await db.espaco.find_many()
        return espaco

    @staticmethod
    async def criar_espaco(dados: EspacoCreate, db: Prisma):
        espaco = await db.espaco.create(
            data={"nome": dados.nome, "icone": dados.icone, "cor": dados.cor}
        )

        return espaco

    @staticmethod
    async def criar_reserva(dados: ReservaCreate, db: Prisma):
        # regra de negócio para nmão agendar a mesma data/hora no espaço
        conflito = await db.reserva.find_first(
            where={
                "espaco_id": dados.espaco_id,
                "usuario_id": dados.usuario_id,
                "data_reserva": dados.data_reserva,
            }
        )

        if conflito:
            raise ValueError(
                "Usuário já possui reserva para este espaço na data/hora selecionada. Agende outro horário!"
            )

        reserva = await db.reserva.create(
            data={
                "espaco_id": dados.espaco_id,
                "usuario_id": dados.usuario_id,
                "data_reserva": dados.data_reserva,
            }
        )

        return reserva

    @staticmethod
    async def atualizar_reserva(reserva_id: int, dados: ReservaUpdate, db: Prisma):
        reserva = await db.reserva.find_unique(where={"id": reserva_id})

        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva não encontrada")

        reserva_atualizada = await db.reserva.update(
            where={"id": reserva_id},
            data={
                "espaco_id": dados.espaco_id,
                "usuario_id": dados.usuario_id,
                "data_reserva": dados.data_reserva,
            },
        )

        return reserva_atualizada

    @staticmethod
    async def listar_reserva(db: Prisma):
        return await db.reserva.find_many()

    @staticmethod
    async def deletar_reserva(reserva_id: int, db: Prisma):
        reserva = await db.reserva.find_unique(where={"id": reserva_id})

        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva não encontrada")

        return await db.reserva.delete(where={"id": reserva_id})
