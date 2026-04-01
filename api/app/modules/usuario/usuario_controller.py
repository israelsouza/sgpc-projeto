from app.modules.usuario.usuario_schema import (
    ChaveAcessoCreate,
    LoginSchema,
    MoradorCreate,
)
from app.modules.usuario.usuario_service import UsuarioService
from prisma import Prisma


class UsuarioController:
    @staticmethod
    async def registrar_morador(dados: MoradorCreate, db: Prisma):
        return await UsuarioService.registrar_morador(dados, db)

    @staticmethod
    async def login(dados: LoginSchema, db: Prisma):
        return await UsuarioService.login(dados, db)

    @staticmethod
    async def gerar_chave_acesso(dados: ChaveAcessoCreate, db: Prisma):
        return await UsuarioService.gerar_chave_acesso(dados, db)

    @staticmethod
    async def aprovar_morador(id_morador: int, id_unidade: int | None, db: Prisma):
        return await UsuarioService.aprovar_morador(id_morador, id_unidade, db)
