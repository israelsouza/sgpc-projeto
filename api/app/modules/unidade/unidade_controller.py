from app.modules.condominio.condominio_schema import UnidMassCreation
from app.modules.unidade.unidade_schema import (
    UnidadeCreate,
    UnidadeUpdate,
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

    #ANTES BUSCAVA TUDO EM TODOS OS CONDOMINIOS, AGORA APENAS NO COND QUE DESEJAMOS. USAR O ID PRA BUSCA
    @staticmethod
    async def listar_unidades(condominio_id: int, db: Prisma):
        return await UnidadeService.listar_unidades(condominio_id, db)

    #LISTAR UNIDADES
    @staticmethod
    async def buscar_unidades(unid_id: int, db: Prisma):
        return await UnidadeService.buscar_unidade_por_id(unid_id, db)

    @staticmethod
    async def cadastro_massivo(dados: UnidMassCreation, db: Prisma, quem_criou: int ):
        return await UnidadeService.cadastro_massivo(dados, db, quem_criou)

    @staticmethod
    async def _gerar_nomes_unidades(tipoCond: str, dados: UnidMassCreation, db: Prisma):
        return await UnidadeService._gerar_nomes_unidades(tipoCond, dados, db)
    