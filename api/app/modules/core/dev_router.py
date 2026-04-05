from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.db.prisma_client import get_prisma
from app.modules.core.auth import create_access_token
from prisma import Prisma

router = APIRouter(prefix="/dev", tags=["Desenvolvimento"])


@router.get("/token/{perfil_nome}")
async def gerar_token_dev(perfil_nome: str, db: Prisma = Depends(get_prisma)):
    """
    Endpoint exclusivo de desenvolvimento para obter um token de acesso rápido.
    """
    if settings.ENVIRONMENT != "development":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este endpoint só está disponível em modo de desenvolvimento.",
        )

    # 1. Buscar o perfil
    perfil = await db.perfil.find_unique(
        where={"nome": perfil_nome.upper()}, include={"usuarios": {"take": 1}}
    )

    if not perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Perfil '{perfil_nome}' não encontrado no banco.",
        )

    # 2. Se o perfil não tem usuários, buscar o usuário admin padrão
    if not perfil.usuarios:
        usuario = await db.usuario.find_first(include={"perfis": True})
    else:
        usuario = await db.usuario.find_unique(
            where={"id": perfil.usuarios[0].id}, include={"perfis": True}
        )

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhum usuário encontrado para gerar o token.",
        )

    # 3. Gerar o token
    roles = [p.nome for p in usuario.perfis]
    token = create_access_token(
        data={"sub": str(usuario.id), "email": usuario.email, "roles": roles}
    )

    return {
        "perfil": perfil_nome.upper(),
        "usuario": usuario.email,
        "access_token": token,
        "token_type": "bearer",
        "aviso": "Token gerado via ambiente de dev. Use com moderação.",
    }
