from datetime import UTC, datetime

from prisma import Prisma


class DocumentoModel:
    @staticmethod
    async def criar(db: Prisma, dados: dict):
        return await db.documento.create(data=dados)

    @staticmethod
    async def buscar_por_id(documento_id: int, db: Prisma):
        return await db.documento.find_unique(where={"id": documento_id})

    @staticmethod
    async def listar(
        db: Prisma,
        condominio_id: int,
        categoria: str | None = None,
        limit: int = 10,
        offset: int = 0,
    ):
        where_clause = {"condominio_id": condominio_id, "deletado_em": None}
        if categoria:
            where_clause["categoria"] = categoria

        total = await db.documento.count(where=where_clause)
        items = await db.documento.find_many(
            where=where_clause,
            skip=offset,
            take=limit,
            order={"criado_em": "desc"},
        )
        return total, items

    @staticmethod
    async def deletar_logico(documento_id: int, db: Prisma):
        return await db.documento.update(
            where={"id": documento_id}, data={"deletado_em": datetime.now(UTC)}
        )


class DocumentoLogModel:
    @staticmethod
    async def criar(
        db: Prisma,
        documento_id: int,
        usuario_id: int,
        acao: str,
        ip_address: str | None = None,
    ):
        return await db.documentolog.create(
            data={
                "documento_id": documento_id,
                "usuario_id": usuario_id,
                "acao": acao,
                "ip_address": ip_address,
            }
        )
