from prisma import Prisma
from app.modules.core.core_exception import ValidationError
from app.modules.condominio.condominio_schema import (
    CondominioCreate,
    CondominioUpdate,
)

#CRIAR OS CONDOMINIOS
class CondominioService:
    @staticmethod
    async def criar_condominio(dados: CondominioCreate, db: Prisma):
        if dados.cnpj:
            existente = await db.condominio.find_first(
                where={"cnpj": dados.cnpj}
            )
            if existente:
                raise ValidationError(
                    nome="Condominio_Existente",
                    mensagem="Já existe um condomínio com este CNPJ.",
                    acao="Informe outro CNPJ."
                )

        return await db.condominio.create(
            data=dados.model_dump()
        )

    @staticmethod
    async def listar_condominios(db: Prisma):
        return await db.condominio.find_many()

    @staticmethod
    async def buscar_condominio_por_id(cond_id: int, db: Prisma):
        return await db.condominio.find_unique(
            where={"id": cond_id}
        )

    @staticmethod
    async def atualizar_condominio(cond_id: int, dados: CondominioUpdate, db: Prisma):
        existente = await db.condominio.find_unique(
            where={"id": cond_id}
        )
        if not existente:
            return None

        if dados.cnpj:
            outro = await db.condominio.find_first(
                where={"cnpj": dados.cnpj}
            )
            if outro and outro.id != cond_id:
                raise ValidationError(
                    nome="CNPJ_Duplicado",
                    mensagem="Já existe outro condomínio com este CNPJ.",
                    acao="Informe outro CNPJ."
                )

        return await db.condominio.update(
            where={"id": cond_id},
            data=dados.model_dump(exclude_unset=True)
        )