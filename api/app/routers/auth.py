from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, status

from app.db.prisma_client import get_prisma
from app.modules.core.auth import create_access_token
from app.modules.core.exceptions import ValidationError
from app.modules.core.security import verificar_senha
from app.modules.usuario.schemas import ChaveAcessoCreate, LoginSchema, TokenSchema
from prisma import Prisma

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=TokenSchema)
async def login(dados: LoginSchema, db: Prisma = Depends(get_prisma)):
    """
    Realiza o login e gera um token JWT.
    """
    # 1. Buscar usuário e incluir os perfis (roles)
    usuario = await db.usuario.find_unique(
        where={"email": dados.email}, include={"perfis": True, "morador": True}
    )

    if not usuario:
        raise ValidationError(
            nome="login_invalido",
            mensagem="E-mail ou senha incorretos.",
            acao="Verifique os dados ou tente recuperar sua senha.",
        )

    # 2. Validar Hash da Senha
    if not verificar_senha(dados.senha, usuario.senha):
        raise ValidationError(
            nome="login_invalido",
            mensagem="E-mail ou senha incorretos.",
            acao="Verifique os dados ou tente recuperar sua senha.",
        )

    # 3. Gerar Token com Payload (ID do Usuário e Lista de Perfis)
    roles = [p.nome for p in usuario.perfis]

    # Adicionamos o status do morador para o front saber se ele é pendente ou não
    status_morador = usuario.morador.status if usuario.morador else "N/A"

    access_token = create_access_token(
        data={
            "sub": str(usuario.id),
            "email": usuario.email,
            "roles": roles,
            "morador_status": status_morador,
        }
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/chave-acesso", status_code=status.HTTP_201_CREATED)
async def gerar_chave_acesso(
    dados: ChaveAcessoCreate, db: Prisma = Depends(get_prisma)
):
    """
    Gera uma chave de acesso UUID única e temporária.
    (Futuramente restrita a Síndicos/Admins).
    """
    validade = datetime.now(UTC) + timedelta(hours=dados.validade_em_horas)

    nova_chave = await db.chaveacesso.create(
        data={"validade": validade, "usada": False}
    )

    return {
        "chave": nova_chave.chave,
        "validade": nova_chave.validade,
        "mensagem": "Chave gerada com sucesso. Compartilhe o UUID acima com o morador.",
    }
