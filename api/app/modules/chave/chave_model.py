from prisma import Prisma


class ChaveModel:
    @staticmethod
    async def buscar_por_codigo(
        chave_str: str, db: Prisma, includes: dict | None = None
    ):
        """Busca uma chave pelo código UUID."""
        return await db.chaveacesso.find_unique(
            where={"chave": chave_str}, include=includes
        )

    @staticmethod
    async def criar(data: dict, db: Prisma):
        """Persiste uma nova chave de acesso no banco."""
        return await db.chaveacesso.create(data=data)

    @staticmethod
    async def marcar_como_usada(chave_id: str, db: Prisma):
        """Atualiza o status da chave para utilizada."""
        return await db.chaveacesso.update(where={"id": chave_id}, data={"usada": True})

    @staticmethod
    async def buscar_perfil_por_id(perfil_id: int, db: Prisma):
        """Busca dados de um perfil para validações."""
        return await db.perfil.find_unique(where={"id": perfil_id})
