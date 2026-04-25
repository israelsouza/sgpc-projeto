from prisma import Prisma


class AvisoModel:
    @staticmethod
    async def criar(db: Prisma, data: dict):
        return await db.aviso.create(data=data)

    @staticmethod
    async def buscar_por_id(aviso_id: int, db: Prisma, includes: dict | None = None):
        return await db.aviso.find_unique(where={"id": aviso_id}, include=includes)

    @staticmethod
    async def listar(
        db: Prisma,
        condominio_id: int,
        categoria: str | None = None,
        limit: int = 10,
        offset: int = 0,
    ):
        where = {"condominio_id": condominio_id, "deletado_em": None}
        if categoria:
            where["categoria"] = categoria

        total = await db.aviso.count(where=where)
        items = await db.aviso.find_many(
            where=where, take=limit, skip=offset, order={"criado_em": "desc"}
        )
        return total, items

    @staticmethod
    async def atualizar(aviso_id: int, db: Prisma, data: dict):
        return await db.aviso.update(where={"id": aviso_id}, data=data)

    @staticmethod
    async def deletar_logico(aviso_id: int, db: Prisma):
        from datetime import datetime

        return await db.aviso.update(
            where={"id": aviso_id}, data={"deletado_em": datetime.now()}
        )
