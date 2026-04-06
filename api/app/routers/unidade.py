from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma
from app.db.prisma_client import get_prisma
from app.modules.unidade.unidade_controller import UnidadeController
from app.modules.unidade.unidade_schema import UnidadeCreate, UnidadeResponse, UnidadeUpdate

router = APIRouter(prefix="/unidade", tags=["Unidades"])


@router.post(
    "/criarUnidade", response_model=UnidadeResponse
)
async def registrar_unidade(dados: UnidadeCreate, db: Prisma = Depends(get_prisma)):
    return await UnidadeController.registrar_unidade(dados, db) 



#ATUALIZAR UNIDADES
@router.put(
        "/atualizarUnidade/{unid_id}", response_model=UnidadeResponse
)
async def atualizar_unidade(unid_id: int, dados: UnidadeUpdate, db: Prisma = Depends(get_prisma)):
    unidade = await UnidadeController.atualizar_unidade(unid_id, dados, db) 
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    return unidade

#BUSCAR UNIDADES - TODAS
@router.get(
    "/listarUnidades", response_model=list[UnidadeResponse] 
)
async def listar_unidades(db: Prisma = Depends(get_prisma)):
    return await UnidadeController.listar_unidades(db) 


#BUSCAR UNIDADES - POR ID
@router.get(
    "/buscarUnidade/{unid_id}", response_model=UnidadeResponse
)
async def buscar_unidades(unid_id: int, db: Prisma = Depends(get_prisma)):
    unidade = await UnidadeController.buscar_unidades(unid_id, db)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    return unidade