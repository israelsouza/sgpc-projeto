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
    async def buscar_por_celular(celular: str, db: Prisma):
        """Busca morador por celular para validação de unicidade."""
        return await db.morador.find_first(
            where={"celular": celular, "deletado_em": None}
        )

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

    @staticmethod
    async def listar_por_unidade(unidade_id: int, db: Prisma):
        """Lista moradores de uma unidade específica."""
        return await db.morador.find_many(
            where={"unidade_id": unidade_id, "deletado_em": None},
            include={"unidade": True},
            order={"nome_completo": "asc"},
        )

    @staticmethod
    async def listar_por_condominio(condominio_id: int, db: Prisma):
        """Lista todos os moradores de um condomínio."""
        return await db.morador.find_many(
            where={
                "unidade": {"condominio_id": condominio_id},
                "deletado_em": None,
                "status": "ATIVO",
            },
            include={"unidade": True},
            order={"nome_completo": "asc"},
        )
