from prisma import Prisma
from app.modules.visitante.visitante_schema import VisitanteCreate

class VisitanteService:
    @staticmethod
    async def get_all(db: Prisma):
        return await db.visitante.find_many()
