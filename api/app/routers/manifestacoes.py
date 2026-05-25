from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.auth import get_current_user
from app.modules.manifestacoes.manifestacoes_controller import ManifestacaoController
from app.modules.manifestacoes.manifestacoes_schema import (
    ManifestacaoCreate,
    ManifestacaoResponse,
    ManifestacaoUpdate,
)
from prisma import Prisma

router = APIRouter(prefix="/manifestacao", tags=["manifestacao"])


@router.post("/criar-manifestacao", response_model=ManifestacaoResponse)
async def criar_manifestacao(
    dados: ManifestacaoCreate,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True},
    )
    nome = usuario.morador.nome_completo if usuario.morador else "Usuário"
    return await ManifestacaoController.criar_manifestacao(
        dados=dados, autor=nome, db=db
    )


@router.get("/listar-manifestacoes", response_model=list[ManifestacaoResponse])
async def listar_manifestacao(db: Prisma = Depends(get_prisma)):
    return await ManifestacaoController.listar_manifestacao(db)


@router.put(
    "/atualizar-manifestacao/{manifestacao_id}", response_model=ManifestacaoResponse
)
async def atualizar_manifestacao(
    manifestacao_id: int, dados: ManifestacaoUpdate, db: Prisma = Depends(get_prisma)
):
    autor = "sindico"
    return await ManifestacaoController.atualizar_manifestacao(
        manifestacao_id=manifestacao_id, dados=dados, autor=autor, db=db
    )


@router.delete(
    "/deletar-manifestacao/{manifestacao_id}", status_code=status.HTTP_200_OK
)
async def deletar_manifestacao(manifestacao_id: int, db: Prisma = Depends(get_prisma)):
    await ManifestacaoController.deletar_manifestacao(
        manifestacao_id=manifestacao_id, db=db
    )
    return {"message": "Manifestação deletada com sucesso!"}
