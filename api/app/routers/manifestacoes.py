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
        include={"morador": True, "funcionario": True},
    )

    nome = "Usuário"
    if usuario.morador and usuario.morador.nome_completo:
        nome = usuario.morador.nome_completo
    elif usuario.funcionario and usuario.funcionario.nome_completo:
        nome = usuario.funcionario.nome_completo
    else:
        nome = usuario.email

    morador_id = usuario.morador.id if usuario.morador else None
    unidade_id = usuario.morador.unidade_id if usuario.morador else None

    return await ManifestacaoController.criar_manifestacao(
        dados=dados,
        autor=nome,
        db=db,
        morador_id=morador_id,
        unidade_id=unidade_id,
    )


@router.get("/listar-manifestacoes", response_model=list[ManifestacaoResponse])
async def listar_manifestacao(
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True, "perfis": True},
    )

    roles = [p.nome for p in usuario.perfis]

    # SINDICO e ADMIN veem tudo
    if "SINDICO" in roles or "ADMIN" in roles:
        return await db.manifestacao.find_many(
            include={"movimentacoes": True}, order={"data_criacao": "desc"}
        )

    # PORTEIRO vê apenas as abertas (PENDENTE e EM_ANDAMENTO)
    if "PORTEIRO" in roles:
        return await db.manifestacao.find_many(
            where={"status": {"in": ["PENDENTE", "EM_ANDAMENTO"]}},
            include={"movimentacoes": True},
            order={"data_criacao": "desc"},
        )

    # MORADOR vê apenas as suas
    if usuario.morador:
        return await db.manifestacao.find_many(
            where={"morador_id": usuario.morador.id},
            include={"movimentacoes": True},
            order={"data_criacao": "desc"},
        )

    return []


@router.put(
    "/atualizar-manifestacao/{manifestacao_id}", response_model=ManifestacaoResponse
)
async def atualizar_manifestacao(
    manifestacao_id: int,
    dados: ManifestacaoUpdate,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"perfis": True, "morador": True, "funcionario": True},
    )

    roles = [p.nome for p in usuario.perfis]
    if "SINDICO" not in roles and "ADMIN" not in roles:
        from app.modules.core.core_exception import ForbiddenError

        raise ForbiddenError(
            mensagem="Apenas síndicos ou administradores podem alterar o status de manifestações."
        )

    nome = "Usuário"
    if usuario.morador and usuario.morador.nome_completo:
        nome = usuario.morador.nome_completo
    elif usuario.funcionario and usuario.funcionario.nome_completo:
        nome = usuario.funcionario.nome_completo
    else:
        nome = usuario.email

    return await ManifestacaoController.atualizar_manifestacao(
        manifestacao_id=manifestacao_id, dados=dados, autor=nome, db=db
    )


@router.delete(
    "/deletar-manifestacao/{manifestacao_id}", status_code=status.HTTP_200_OK
)
async def deletar_manifestacao(manifestacao_id: int, db: Prisma = Depends(get_prisma)):
    await ManifestacaoController.deletar_manifestacao(
        manifestacao_id=manifestacao_id, db=db
    )
    return {"message": "Manifestação deletada com sucesso!"}
