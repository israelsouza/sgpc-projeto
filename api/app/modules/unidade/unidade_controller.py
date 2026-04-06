from app.modules.core.core_exception import ValidationError
from app.modules.unidade.unidade_schema import (
    UnidadeCreate, 
    UnidadeUpdate 
)
from app.modules.unidade.unidade_service import UnidadeService
from prisma import Prisma

class UnidadeController:
    @staticmethod
    async def registrar_unidade(dados: UnidadeCreate, db: Prisma):
        return await UnidadeService.registrar_unidade(dados, db)
    
    #UPDATE DA UNIDADE
    @staticmethod
    async def atualizar_unidade(unid_id: int, dados: UnidadeUpdate, db: Prisma):
        return await UnidadeService.atualizar_unidade(unid_id, dados, db)
    
    #BUSCAR UNIDADES 
    @staticmethod
    async def listar_unidades(db: Prisma):    
        return await UnidadeService.listar_unidades(db)

    #LISTAR UNIDADES
    @staticmethod
    async def buscar_unidades(unid_id: int, db: Prisma):
        return await UnidadeService.buscar_unidade_por_id(unid_id, db)