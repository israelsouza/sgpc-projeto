from fastapi import APIRouter, Depends

from app.db.prisma_client import get_prisma
from app.modules.bilhetes.bilhetes_controller import BilheteController
from app.modules.bilhetes.bilhetes_schema import (
    BilheteCreate,
    BilheteResponse,
)
from app.modules.core.auth import get_current_user
from prisma import Prisma

router = APIRouter(prefix="/bilhete", tags=["Bilhete"])


# bilhetes_router.py
@router.post("/criar-bilhetes", response_model=BilheteResponse)
async def criar_bilhetes(
    dados: BilheteCreate,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True, "funcionario": True},
    )
    nome = (
        usuario.morador.nome_completo
        if usuario.morador
        else usuario.funcionario.nome_completo
        if usuario.funcionario
        else "Usuário"
    )
    return await BilheteController.criar_bilhetes(dados=dados, autor=nome, db=db)


@router.get("/listar-bilhetes", response_model=list[BilheteResponse])
async def listar_bilhetes(db: Prisma = Depends(get_prisma)):
    return await BilheteController.listar_bilhetes(db)


@router.delete("/deletar-bilhetes/{bilhete_id}")
async def deletar_bilhetes(bilhete_id: int, db: Prisma = Depends(get_prisma)):
    return await BilheteController.deletar_bilhetes(bilhete_id=bilhete_id, db=db)
