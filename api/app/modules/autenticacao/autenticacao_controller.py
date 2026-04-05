from fastapi import status

from app.modules.autenticacao.autenticacao_schema import LoginSchema
from app.modules.autenticacao.autenticacao_service import AutenticacaoService
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma


class AutenticacaoController:
    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        token_data = await AutenticacaoService.login(dados, db)

        return StandardResponse(
            message="Login realizado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=token_data,
        )
