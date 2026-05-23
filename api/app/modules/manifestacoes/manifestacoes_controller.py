from prisma import Prisma
from app.modules.manifestacoes.manifestacoes_schema import ManifestacaoCreate
from app.modules.core.core_exception import NotFoundError

#CRIAÇÃO DAS MANIFESTAÇÕES
class ManifestacaoController:

    @staticmethod
    async def criar_manifestacao(dados: ManifestacaoCreate, autor: str, db: Prisma):
        return await ManifestacaoService.criar_manifestacao(dados=dados, autor=autor,db=db)
    
    
    async def atualizar_manifestacao(dados: ManifestacaoUpdate, autor: str, db: Prisma):
        return await ManifestacaoService.atualizar_manifestacao(dados=dados, autor=autor,db=db)
    

    async def listar_manifestacao(db: Prisma):
        return await ManifestacaoService.listar_manifestacao(db)


    async def deletar_manifestacao(manifestacao_id: int, db: Prisma):
        manifestacao = await ManifestacaoService.deletar_manifestacao(manifestacao_id, db)
    
        if not manifestacao:

            raise NotFoundError(
            mensagem="Manifestação não encontrada.",
            acao="Verifique o id informado."
        )
        return {
            "message": "Manifestação deletada com sucesso!"
        }    