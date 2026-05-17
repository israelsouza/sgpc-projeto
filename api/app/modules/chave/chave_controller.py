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
        """
        Orquestra a geração de uma chave de acesso através do Service.
        """
        chave_res = await ChaveService.gerar_chave_acesso(dados, db, usuario_atual_id)

        return StandardResponse(
            message="Chave de acesso gerada com sucesso.",
            status_code=status.HTTP_201_CREATED,
            data=chave_res,
        )

    @staticmethod
    async def validar_chave(chave_uuid: str, db: Prisma):
        """
        Inspeciona uma chave de acesso para orientar o onboarding.
        """
        dados_chave = await ChaveService.inspecionar_chave(chave_uuid, db)

        return StandardResponse(
            message="Chave validada com sucesso.",
            status_code=status.HTTP_200_OK,
            data=dados_chave,
        )
