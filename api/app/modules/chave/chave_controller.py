from fastapi import status

from app.modules.chave.chave_schema import ChaveAcessoCreate
from app.modules.chave.chave_service import ChaveService
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma


class ChaveController:
    @staticmethod
    async def gerar_chave_acesso(
        dados: ChaveAcessoCreate, db: Prisma, usuario_atual_id: int
    ):
        chave_res = await ChaveService.gerar_chave_acesso(dados, db, usuario_atual_id)

        return StandardResponse(
            message="Chave de acesso gerada com sucesso.",
            status_code=status.HTTP_201_CREATED,
            data=chave_res,
        )
