from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma

from app.db.prisma_client import get_prisma
from app.modules.condominio.condominio_schema import (
    CondominioCreate,
    CondominioUpdate,
    CondominioResponse,
)
from app.modules.condominio.condominio_controller import CondominioController

router = APIRouter(prefix="/condominio", tags=["Condomínio"])


@router.post("/criar-condominio", response_model=CondominioResponse)
async def criar_condominio(
    dados: CondominioCreate,
    db: Prisma = Depends(get_prisma)
):
    return await CondominioController.criar_condominio(dados, db)


@router.get("/listar-condominios", response_model=list[CondominioResponse])
async def listar_condominios(db: Prisma = Depends(get_prisma)):
    return await CondominioController.listar_condominios(db)


@router.get("/buscar-condominio/{cond_id}", response_model=CondominioResponse)
async def buscar_condominio(cond_id: int, db: Prisma = Depends(get_prisma)):
    condominio = await CondominioController.buscar_condominio(cond_id, db)
    if not condominio:
        raise HTTPException(status_code=404, detail="Condomínio não encontrado")
    return condominio


@router.put("/atualizar-condominio/{cond_id}", response_model=CondominioResponse)
async def atualizar_condominio(
    cond_id: int,
    dados: CondominioUpdate,
    db: Prisma = Depends(get_prisma)
):
    condominio = await CondominioController.atualizar_condominio(cond_id, dados, db)
    if not condominio:
        raise HTTPException(status_code=404, detail="Condomínio não encontrado")
    return condominio