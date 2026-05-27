from fastapi import APIRouter, Depends

from app.db.prisma_client import get_prisma
from app.modules.bilhetes.bilhetes_controller import BilheteController
from app.modules.bilhetes.bilhetes_schema import (
    BilheteCreate,
    BilheteResponse,
)
from app.modules.core.auth import get_current_user
from prisma import Prisma

router = APIRouter(prefix="/bilhete", tags=["Bilhete"])


@router.post("/criar-bilhetes", response_model=BilheteResponse)
async def criar_bilhetes(
    dados: BilheteCreate,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True, "funcionario": True, "perfis": True},
    )

    roles = [p.nome for p in usuario.perfis]
    if "MORADOR" not in roles:
        from app.modules.core.core_exception import ForbiddenError

        raise ForbiddenError(mensagem="Apenas moradores podem criar bilhetes.")

    nome = usuario.morador.nome_completo if usuario.morador else "Morador"
    return await BilheteController.criar_bilhetes(dados=dados, autor=nome, db=db)


@router.get("/listar-bilhetes", response_model=list[BilheteResponse])
async def listar_bilhetes(
    usuario_logado=Depends(get_current_user), db: Prisma = Depends(get_prisma)
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True, "perfis": True},
    )

    roles = [p.nome for p in usuario.perfis]

    # SINDICO, ADMIN e PORTEIRO veem tudo
    if any(r in roles for r in ["SINDICO", "ADMIN", "PORTEIRO"]):
        return await BilheteController.listar_bilhetes(db)

    # MORADOR vê apenas os seus
    if usuario.morador:
        return await db.bilhetes.find_many(
            where={"autor": usuario.morador.nome_completo}, order={"criado_em": "desc"}
        )

    return []


@router.delete("/deletar-bilhetes/{bilhete_id}")
async def deletar_bilhetes(
    bilhete_id: int,
    usuario_logado=Depends(get_current_user),
    db: Prisma = Depends(get_prisma),
):
    usuario = await db.usuario.find_unique(
        where={"id": int(usuario_logado["sub"])},
        include={"morador": True, "perfis": True},
    )

    roles = [p.nome for p in usuario.perfis]

    bilhete = await db.bilhetes.find_unique(where={"id": bilhete_id})
    if not bilhete:
        from app.modules.core.core_exception import NotFoundError

        raise NotFoundError(mensagem="Bilhete não encontrado.")

    # SINDICO e ADMIN podem deletar qualquer um
    if any(r in roles for r in ["SINDICO", "ADMIN"]):
        return await BilheteController.deletar_bilhetes(bilhete_id=bilhete_id, db=db)

    # MORADOR pode deletar apenas o seu
    if usuario.morador and bilhete.autor == usuario.morador.nome_completo:
        return await BilheteController.deletar_bilhetes(bilhete_id=bilhete_id, db=db)

    from app.modules.core.core_exception import ForbiddenError

    raise ForbiddenError(mensagem="Você não tem permissão para deletar este bilhete.")
