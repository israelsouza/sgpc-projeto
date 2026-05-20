from fastapi import APIRouter, Depends, HTTPException

from app.db.prisma_client import get_prisma
from app.modules.condominio.condominio_schema import (
    UnidadeMassResultado,
    UnidMassCreation,
)
from app.modules.unidade.unidade_controller import UnidadeController
from app.modules.unidade.unidade_schema import (
    UnidadeCreate,
    UnidadeResponse,
    UnidadeUpdate,
)
from prisma import Prisma

router = APIRouter(prefix="/unidade", tags=["Unidades"])


@router.post("/criar-unidade", response_model=UnidadeResponse)
async def registrar_unidade(dados: UnidadeCreate, db: Prisma = Depends(get_prisma)):
    return await UnidadeController.registrar_unidade(dados, db)


# ATUALIZAR UNIDADES
@router.put("/atualizar-unidade/{unid_id}", response_model=UnidadeResponse)
async def atualizar_unidade(
    unid_id: int, dados: UnidadeUpdate, db: Prisma = Depends(get_prisma)
):
    unidade = await UnidadeController.atualizar_unidade(unid_id, dados, db)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    return unidade


# BUSCAR UNIDADES - TODAS
@router.get("/listar-unidades/{condominio_id}", response_model=list[UnidadeResponse])
async def listar_unidades(condominio_id: int, db: Prisma = Depends(get_prisma)):
    return await UnidadeController.listar_unidades(condominio_id, db)


# BUSCAR UNIDADES - POR ID
@router.get("/buscar-unidade/{unid_id}", response_model=UnidadeResponse)
async def buscar_unidades(unid_id: int, db: Prisma = Depends(get_prisma)):
    unidade = await UnidadeController.buscar_unidades(unid_id, db)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    return unidade


# CADASTRAR MASSIVAMENTE AS UNIDADES
@router.post("/cadastro-massivo", response_model=UnidadeMassResultado)
async def cadastro_massivo(dados: UnidMassCreation, db: Prisma = Depends(get_prisma)):
    return await UnidadeController.cadastro_massivo(dados, db, 1)
