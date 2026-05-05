from fastapi import BackgroundTasks, status

from app.modules.autenticacao.autenticacao_schema import (
    LoginSchema,
    RecuperarSenhaRequest,
    ResetarSenhaRequest,
    ValidarCodigoRequest,
)
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

    @staticmethod
    async def solicitar_recuperacao(
        dados: RecuperarSenhaRequest, background_tasks: BackgroundTasks, db: Prisma
    ):
        resultado = await AutenticacaoService.solicitar_recuperacao(
            dados, background_tasks, db
        )

        return StandardResponse(
            message=resultado.get("mensagem", "Operação concluída"),
            status_code=status.HTTP_200_OK,
        )

    @staticmethod
    async def validar_codigo(dados: ValidarCodigoRequest, db: Prisma):
        resultado = await AutenticacaoService.validar_codigo(dados, db)

        return StandardResponse(
            message="Código validado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=resultado,
        )

    @staticmethod
    async def resetar_senha(dados: ResetarSenhaRequest, db: Prisma):
        resultado = await AutenticacaoService.resetar_senha(dados, db)

        return StandardResponse(
            message=resultado.get("mensagem", "Operação concluída"),
            status_code=status.HTTP_200_OK,
        )
