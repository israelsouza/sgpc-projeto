from prisma import Prisma
from app.modules.condominio.condominio_schema import ( CondominioCreate, CondominioUpdate )
from app.modules.condominio.condominio_service import CondominioService


class CondominioController:
    @staticmethod
    async def criar_condominio(dados: CondominioCreate, db: Prisma):
        return await CondominioService.criar_condominio(dados, db)

    @staticmethod
    async def listar_condominios(db: Prisma):
        return await CondominioService.listar_condominios(db)

    @staticmethod
    async def buscar_condominio(cond_id: int, db: Prisma):
        return await CondominioService.buscar_condominio_por_id(cond_id, db)

    @staticmethod
    async def atualizar_condominio(cond_id: int, dados: CondominioUpdate, db: Prisma):
        return await CondominioService.atualizar_condominio(cond_id, dados, db)