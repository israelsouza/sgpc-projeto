from app.modules.core.core_exception import NotFoundError
from app.modules.manifestacoes.manifestacoes_schema import (
    ManifestacaoCreate,
    ManifestacaoUpdate,
)
from app.modules.manifestacoes.manifestacoes_service import ManifestacaoService
from prisma import Prisma


# CRIAÇÃO DAS MANIFESTAÇÕES
class ManifestacaoController:
    @staticmethod
    async def criar_manifestacao(
        dados: ManifestacaoCreate,
        autor: str,
        db: Prisma,
        morador_id: int | None = None,
        unidade_id: int | None = None,
    ):
        return await ManifestacaoService.criar_manifestacao(
            dados=dados,
            autor=autor,
            db=db,
            morador_id=morador_id,
            unidade_id=unidade_id,
        )

    @staticmethod
    async def atualizar_manifestacao(
        manifestacao_id: int, dados: ManifestacaoUpdate, autor: str, db: Prisma
    ):
        manifestacao = await ManifestacaoService.atualizar_manifestacao(
            manifestacao_id=manifestacao_id, dados=dados, autor=autor, db=db
        )
        if not manifestacao:
            raise NotFoundError(
                mensagem="Manifestação não encontrada.",
                acao="Verifique o id informado.",
            )

        return manifestacao

    @staticmethod
    async def listar_manifestacao(db: Prisma):
        return await ManifestacaoService.listar_manifestacao(db)

    @staticmethod
    async def deletar_manifestacao(manifestacao_id: int, db: Prisma):
        manifestacao = await ManifestacaoService.deletar_manifestacao(
            manifestacao_id, db
        )

        if not manifestacao:
            raise NotFoundError(
                mensagem="Manifestação não encontrada.",
                acao="Verifique o id informado.",
            )
        return {"message": "Manifestação deletada com sucesso!"}
