from fastapi import status

from app.modules.core.core_schema import StandardResponse
from app.modules.usuario.usuario_schema import (
    FuncionarioRegistroCreate,
    LoginSchema,
    MoradorCreate,
)
from app.modules.usuario.usuario_service import UsuarioService
from prisma import Prisma


class UsuarioController:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        morador = await UsuarioService.registrar_morador(dados, db)
        return StandardResponse(
            message="Cadastro de morador realizado com sucesso. Aguarde aprovação.",
            status_code=status.HTTP_201_CREATED,
            data=morador,
        )

    @staticmethod
    async def registrar_funcionario(dados: FuncionarioRegistroCreate, db: Prisma):
        funcionario = await UsuarioService.registrar_funcionario(dados, db)
        return StandardResponse(
            message="Cadastro de funcionário realizado com sucesso. Aguarde aprovação.",
            status_code=status.HTTP_201_CREATED,
            data=funcionario,
        )

    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        token_data = await UsuarioService.login(dados, db)
        return StandardResponse(
            message="Login realizado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=token_data,
        )

    @staticmethod
    async def aprovar_morador(id_morador: int, db: Prisma):
        resultado = await UsuarioService.aprovar_morador(id_morador, db)
        return StandardResponse(
            message="Cadastro aprovado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=resultado,
        )
