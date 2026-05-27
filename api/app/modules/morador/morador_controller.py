from fastapi import status

from app.modules.core.core_exception import ForbiddenError
from app.modules.core.core_schema import StandardResponse
from app.modules.morador.morador_model import MoradorModel
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

    @staticmethod
    async def listar_moradores_unidade(usuario_id: int, db: Prisma):
        # Buscar o morador vinculado ao usuário de forma segura
        morador = await db.morador.find_unique(where={"usuario_id": usuario_id})

        if not morador or not morador.unidade_id:
            return []

        moradores = await MoradorModel.listar_por_unidade(morador.unidade_id, db)
        return [m.model_dump() for m in moradores]

    @staticmethod
    async def listar_moradores_condominio(usuario_id: int, db: Prisma):
        # Buscar o funcionário vinculado ao usuário
        usuario = await db.usuario.find_unique(
            where={"id": usuario_id}, include={"funcionario": True}
        )

        if not usuario or not usuario.funcionario:
            raise ForbiddenError(
                "Acesso negado: Apenas funcionários podem ver todos os moradores."
            )

        moradores = await MoradorModel.listar_por_condominio(
            usuario.funcionario.condominio_id, db
        )
        return [m.model_dump() for m in moradores]
