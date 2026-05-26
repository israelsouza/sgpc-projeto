from fastapi import APIRouter, Depends
from app.modules.visitante.visitante_service import VisitanteService
from app.modules.visitante.visitante_schema import VisitanteCreate
from app.db.prisma_client import get_prisma
from prisma import Prisma

router = APIRouter(prefix="/visitantes", tags=["Visitantes"])

@router.post("/")
async def create_visitante(data: VisitanteCreate, db: Prisma = Depends(get_prisma)):
    return await VisitanteService.create(data, db)

@router.get("/")
async def get_all_visitantes(db: Prisma = Depends(get_prisma)):
    return await VisitanteService.get_all(db)
