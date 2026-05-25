from datetime import datetime

from app.modules.core.core_exception import ValidationError
from app.modules.manifestacoes.manifestacoes_schema import (
    ManifestacaoCreate,
    ManifestacaoUpdate,
)
from prisma import Prisma


# CRIAR MANIFESTAÇÕES
class ManifestacaoService:
    @staticmethod
    async def criar_manifestacao(
        dados: ManifestacaoCreate,
        autor: str,
        db: Prisma,
        morador_id: int | None = None,
        unidade_id: int | None = None,
    ):
        if not dados.assunto or not dados.mensagem:
            raise ValidationError(
                nome="Dados_Incompletos",
                mensagem="Os dados não foram preenchidos completamente.",
                acao="Preencha todos os campos corretamente.",
            )

        manifestacao = await db.manifestacao.create(
            data={
                **dados.model_dump(),
                "autor": autor,
                "data_criacao": datetime.now(),
                "hora_criacao": datetime.now().strftime("%H:%M"),
                "morador_id": morador_id,
                "unidade_id": unidade_id,
            }
        )

        return await db.manifestacao.find_unique(
            where={"id": manifestacao.id},
            include={"movimentacoes": True}
        )

    @staticmethod
    async def listar_manifestacao(db: Prisma):
        return await db.manifestacao.find_many(order={"data_criacao": "desc"})

    @staticmethod
    async def deletar_manifestacao(manifestacao_id: int, db: Prisma):
        manifestacao = await db.manifestacao.find_unique(where={"id": manifestacao_id})

        if not manifestacao:
            return None

        return await db.manifestacao.delete(where={"id": manifestacao_id})

    @staticmethod
    async def atualizar_manifestacao(
        manifestacao_id: int, dados: ManifestacaoUpdate, autor: str, db: Prisma
    ):
        manifestacao = await db.manifestacao.find_unique(where={"id": manifestacao_id})

        if not manifestacao:
            return None

        # O Prisma espera o valor do enum (ex: EM_ANDAMENTO), 
        # garantimos que esteja em maiúsculo para bater com o schema.prisma
        status_enum = dados.status.upper()

        manifestacao_atualizada = await db.manifestacao.update(
            where={"id": manifestacao_id}, data={"status": status_enum}
        )

        await db.manifestacaomovimentacao.create(
            data={
                "titulo": status_enum,
                "comentario": dados.comentario,
                "status": status_enum,
                "autor_role": dados.autor_role,
                "manifestacao": {"connect": {"id": manifestacao_id}},
            }
        )

        return await db.manifestacao.find_unique(
            where={"id": manifestacao_id},
            include={"movimentacoes": True}
        )
