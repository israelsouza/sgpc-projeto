from app.modules.bilhetes.bilhetes_schema import BilheteCreate
from app.modules.bilhetes.bilhetes_service import BilhetesService
from app.modules.core.core_exception import NotFoundError
from prisma import Prisma


class BilheteController:
    @staticmethod
    async def criar_bilhetes(dados: BilheteCreate, autor: str, db: Prisma):
        return await BilhetesService.criar_bilhetes(dados=dados, autor=autor, db=db)
    
    @staticmethod
    async def listar_bilhetes(db: Prisma):
        return await BilhetesService.listar_bilhetes(db)
    
    @staticmethod
    async def deletar_bilhetes(bilhete_id: int, db: Prisma):
        bilhete = await BilhetesService.deletar_bilhetes(bilhete_id, db)
    
        if not bilhete:

            raise NotFoundError(
            mensagem="Bilhete não econtrado.",
            acao="Verifique o id informado."
        )
        return {
            "message": "Bilhete deletado com sucesso!"
        }
    
    