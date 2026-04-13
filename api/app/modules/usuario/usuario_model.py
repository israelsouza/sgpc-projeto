from prisma import Prisma


class UsuarioModel:
    @staticmethod
    async def buscar_por_id(usuario_id: int, db: Prisma, includes: dict | None = None):
        """Busca um usuário por ID com filtros de segurança."""
        return await db.usuario.find_unique(
            where={"id": usuario_id, "deletado_em": None}, include=includes
        )

    @staticmethod
    async def buscar_por_email(email: str, db: Prisma, includes: dict | None = None):
        """Busca um usuário por e-mail para validação de unicidade."""
        return await db.usuario.find_unique(
            where={"email": email, "deletado_em": None}, include=includes
        )

    @staticmethod
    async def criar(data: dict, db: Prisma):
        """Cria um novo usuário base (credenciais)."""
        return await db.usuario.create(data=data)
