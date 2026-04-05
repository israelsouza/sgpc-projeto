from fastapi import status

from app.modules.core.core_schema import StandardResponse
from app.modules.funcionario.funcionario_schema import FuncionarioRegistroCreate
from app.modules.funcionario.funcionario_service import FuncionarioService
from prisma import Prisma


class FuncionarioController:
    @staticmethod
    async def registrar_funcionario(dados: FuncionarioRegistroCreate, db: Prisma):
        funcionario = await FuncionarioService.registrar_funcionario(dados, db)
        return StandardResponse(
            message="Cadastro de funcionário realizado com sucesso. Aguarde aprovação.",
            status_code=status.HTTP_201_CREATED,
            data=funcionario,
        )

    @staticmethod
    async def aprovar_funcionario(id_funcionario: int, db: Prisma):
        resultado = await FuncionarioService.aprovar_funcionario(id_funcionario, db)
        return StandardResponse(
            message="Funcionário aprovado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=resultado,
        )
