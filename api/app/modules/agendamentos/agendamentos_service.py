from datetime import datetime

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
        # 1. Verificar se o horário já está ocupado para aquele espaço
        conflito = await db.reserva.find_first(
            where={
                "espaco_id": dados.espaco_id,
                "data_reserva": dados.data_reserva,
            }
        )

        if conflito:
            raise ValueError("Este horário já está reservado por outro usuário.")

        # 2. Verificar se o usuário já tem uma reserva para o mesmo horário (em qualquer espaço)
        usuario_conflito = await db.reserva.find_first(
            where={
                "usuario_id": dados.usuario_id,
                "data_reserva": dados.data_reserva,
            }
        )

        if usuario_conflito:
            raise ValueError("Você já possui um agendamento para este mesmo horário.")

        try:
            # Garantir que a data está em UTC antes de salvar
            data_utc = dados.data_reserva.replace(tzinfo=None)

            reserva = await db.reserva.create(
                data={
                    "espaco_id": dados.espaco_id,
                    "usuario_id": dados.usuario_id,
                    "data_reserva": data_utc,
                },
                include={"espaco": True},
            )
            return reserva
        except Exception as e:
            print(f"Erro ao criar reserva no banco: {str(e)}")
            raise e

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
            include={"espaco": True},
        )

        return reserva_atualizada

    @staticmethod
    async def listar_reserva(db: Prisma):
        return await db.reserva.find_many(include={"espaco": True})

    @staticmethod
    async def listar_horarios_disponiveis(espaco_id: int, data_str: str, db: Prisma):
        # 1. Normalizar a data recebida (pode vir como DD/MM/YYYY ou YYYY-MM-DD)
        try:
            if "/" in data_str:
                dt_obj = datetime.strptime(data_str, "%d/%m/%Y")
            else:
                dt_obj = datetime.strptime(data_str, "%Y-%m-%d")

            target_date_str = dt_obj.strftime("%Y-%m-%d")
        except Exception as e:
            print(f"Erro ao parsear data {data_str}: {e}")
            target_date_str = data_str

        # 2. Buscar todos os horários cadastrados para o espaço
        horarios = await db.horario.find_many(
            where={"espaco_id": espaco_id}, order={"horario": "asc"}
        )

        # 3. Buscar reservas para este espaço na data informada
        try:
            dt = datetime.strptime(target_date_str, "%Y-%m-%d")
            start_of_day = dt.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = dt.replace(hour=23, minute=59, second=59, microsecond=999999)

            reservas = await db.reserva.find_many(
                where={
                    "espaco_id": espaco_id,
                    "data_reserva": {"gte": start_of_day, "lte": end_of_day},
                }
            )
        except Exception as e:
            print(f"Erro ao buscar reservas: {e}")
            # Fallback para buscar todas se o filtro de data falhar (menos eficiente mas seguro)
            reservas = await db.reserva.find_many(where={"espaco_id": espaco_id})

        # 4. Marcar como busy os horários que já possuem reserva
        resultado = []
        for h in horarios:
            status = "available"
            hora_inicio = h.horario.split(" - ")[0]

            for r in reservas:
                # Com o filtro gte/lte, r.data_reserva já deve ser do dia correto,
                # mas mantemos a verificação de data para segurança se o fallback foi usado
                data_reserva_str = r.data_reserva.strftime("%Y-%m-%d")
                hora_reserva_str = r.data_reserva.strftime("%H:%M")

                if (
                    data_reserva_str == target_date_str
                    and hora_reserva_str == hora_inicio
                ):
                    status = "busy"
                    break

            resultado.append({"id": h.id, "horario": h.horario, "status": status})

        return resultado

    @staticmethod
    async def deletar_reserva(reserva_id: int, db: Prisma):
        reserva = await db.reserva.find_unique(where={"id": reserva_id})

        if not reserva:
            raise HTTPException(status_code=404, detail="Reserva não encontrada")

        return await db.reserva.delete(where={"id": reserva_id})
