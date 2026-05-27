from fastapi import APIRouter, Depends

from app.db.prisma_client import get_prisma
from app.modules.agendamentos.agendamentos_controller import AgendamentoController
from app.modules.agendamentos.agendamentos_schema import (
    EspacoCreate,
    EspacoResponse,
    HorarioResponse,
    ReservaCreate,
    ReservaResponse,
    ReservaUpdate,
)
from prisma import Prisma

router = APIRouter(prefix="/agendamentos", tags=["agendamentos"])


@router.get("/listar-espacos", response_model=list[EspacoResponse])
async def listar_espacos(db: Prisma = Depends(get_prisma)):
    return await AgendamentoController.listar_espacos(db)


@router.post("/criar-espacos", response_model=EspacoResponse)
async def criar_espaco(dados: EspacoCreate, db: Prisma = Depends(get_prisma)):
    return await AgendamentoController.criar_espaco(dados, db)


@router.get("/listar-reservas", response_model=list[ReservaResponse])
async def listar_reserva(db: Prisma = Depends(get_prisma)):
    return await AgendamentoController.listar_reserva(db)


@router.post("/criar-reservas", response_model=ReservaResponse)
async def criar_reserva(dados: ReservaCreate, db: Prisma = Depends(get_prisma)):
    return await AgendamentoController.criar_reserva(dados, db)


@router.put("/atualizar-reserva/{reserva_id}", response_model=ReservaResponse)
async def atualizar_reserva(
    reserva_id: int, dados: ReservaUpdate, db: Prisma = Depends(get_prisma)
):
    return await AgendamentoController.atualizar_reserva(
        reserva_id=reserva_id, dados=dados, db=db
    )


@router.get("/listar-horarios/{espaco_id}", response_model=list[HorarioResponse])
async def listar_horarios(espaco_id: int, data: str, db: Prisma = Depends(get_prisma)):
    from app.modules.agendamentos.agendamentos_service import AgendamentoService

    return await AgendamentoService.listar_horarios_disponiveis(espaco_id, data, db)


@router.delete("/deletar-reserva/{reserva_id}")
async def deletar_reserva(reserva_id: int, db: Prisma = Depends(get_prisma)):
    return await AgendamentoController.deletar_reserva(reserva_id=reserva_id, db=db)
