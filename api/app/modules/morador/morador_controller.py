from fastapi import status

from app.modules.core.core_schema import StandardResponse
from app.modules.morador.morador_schema import MoradorCreate
from app.modules.morador.morador_service import MoradorService
from prisma import Prisma


class MoradorController:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        morador = await MoradorService.registrar_morador(dados, db)
        return StandardResponse(
            message="Cadastro de morador realizado com sucesso. Aguarde aprovação.",
            status_code=status.HTTP_201_CREATED,
            data=morador,
        )

    @staticmethod
    async def aprovar_morador(id_morador: int, db: Prisma):
        resultado = await MoradorService.aprovar_morador(id_morador, db)
        return StandardResponse(
            message="Cadastro aprovado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=resultado,
        )
