from datetime import datetime
from prisma import Prisma
from app.modules.bilhetes.bilhetes_schema import (
    BilheteCreate,
)
from app.modules.core.core_exception import ValidationError
from fastapi import HTTPException

#CRIAR OS BILHETES
class BilhetesService:
    @staticmethod
    async def criar_bilhetes(dados: BilheteCreate, autor: str, db: Prisma):
        if not dados.assunto or not dados.mensagem:
            raise ValidationError(
                nome="Dados_Incompletos",
                mensagem="Os dados não foram preenchidos completamente.",
                acao="Preencha todos os campos corretamente."
            )
            
        return await db.bilhetes.create(
            data={
                **dados.model_dump(),
                
                "autor": autor,
                "data_criacao": datetime.now(),
                "hora_criacao": datetime.now().strftime("%H:%M")
                }
        )
    
    @staticmethod
    async def listar_bilhetes(db: Prisma):
        return await db.bilhetes.find_many(
            order={
                "data_criacao": "desc"
            }
        )

    @staticmethod
    async def deletar_bilhetes(bilhete_id: int, db: Prisma):
        bilhete = await db.bilhetes.find_unique(
            where={
                "id": bilhete_id
            }
        )

        if not bilhete:
            raise HTTPException(
                status_code=404,
                detail="Bilhete não encontrado"
            )

        return await db.bilhetes.delete(
            where={
                "id": bilhete_id
            }
        )