from app.modules.agendamentos.agendamentos_service import AgendamentoService
from app.modules.agendamentos.agendamentos_schema import EspacoCreate, ReservaCreate, ReservaResponse
from prisma import Prisma
from app.modules.core.core_exception import NotFoundError
from fastapi import HTTPException

class AgendamentoController:

    @staticmethod
    async def listar_espacos(db: Prisma):
        return await AgendamentoService.listar_espacos(db)
    
    @staticmethod
    async def criar_espaco(dados: EspacoCreate, db: Prisma):
        return await AgendamentoService.criar_espaco(dados, db)
    
    @staticmethod
    async def criar_reserva(dados: ReservaCreate, db: Prisma):
        try:
            return await AgendamentoService.criar_reserva(dados, db)
        except ValueError as e:
            raise HTTPException(status_code=409, detail=str(e))
    
    @staticmethod
    async def listar_reserva(db: Prisma):
        return await AgendamentoService.listar_reserva(db)
    
    @staticmethod
    async def deletar_reserva(reserva_id: int, db: Prisma):
        reserva = await AgendamentoService.deletar_reserva(reserva_id, db)

        if not reserva:

            raise NotFoundError(
            mensagem="Reserva não encontrado.",
            acao="Verifique o id informado."
        )
        return {
            "message": "Reserva deletado com sucesso!"
        }