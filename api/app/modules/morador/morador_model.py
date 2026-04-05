from prisma import Prisma


class MoradorModel:
    @staticmethod
    async def buscar_por_id(morador_id: int, db: Prisma, includes: dict | None = None):
        """Busca um morador por ID garantindo que não esteja deletado."""
        return await db.morador.find_unique(
            where={"id": morador_id, "deletado_em": None}, include=includes
        )

    @staticmethod
    async def buscar_por_cpf(cpf: str, db: Prisma):
        """Busca morador por CPF para validação de unicidade."""
        return await db.morador.find_unique(where={"cpf": cpf, "deletado_em": None})

    @staticmethod
    async def criar(data: dict, db: Prisma):
        """Persiste um novo morador (pode ser usado dentro de transação)."""
        return await db.morador.create(data=data)

    @staticmethod
    async def atualizar_status(morador_id: int, status: str, db: Prisma):
        """Atualiza o status do morador (ex: ATIVO, PENDENTE)."""
        return await db.morador.update(
            where={"id": morador_id}, data={"status": status}
        )
