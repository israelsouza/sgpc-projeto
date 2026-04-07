from prisma import Prisma


class FuncionarioModel:
    @staticmethod
    async def buscar_por_id(
        funcionario_id: int, db: Prisma, includes: dict | None = None
    ):
        """Busca um funcionário por ID garantindo que não esteja deletado."""
        return await db.funcionario.find_unique(
            where={"id": funcionario_id, "deletado_em": None}, include=includes
        )

    @staticmethod
    async def buscar_por_cpf(cpf: str, db: Prisma):
        """Busca funcionário por CPF para validação de unicidade."""
        return await db.funcionario.find_unique(where={"cpf": cpf, "deletado_em": None})

    @staticmethod
    async def criar(data: dict, db: Prisma):
        """Persiste um novo funcionário."""
        return await db.funcionario.create(data=data)

    @staticmethod
    async def atualizar_status(funcionario_id: int, status: str, db: Prisma):
        """Atualiza o status do funcionário (ex: ATIVO, PENDENTE)."""
        return await db.funcionario.update(
            where={"id": funcionario_id}, data={"status": status}
        )
