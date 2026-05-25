from prisma import Prisma
from app.modules.visitante.visitante_schema import VisitanteCreate

class VisitanteService:
    @staticmethod
    async def create(data: VisitanteCreate, db: Prisma):
        return await db.visitante.create(data=data.model_dump())
