from fastapi import APIRouter, Depends, Request, status

from app.modules.convite.convite_controller import ConviteController
from app.modules.convite.convite_schema import (
    ConviteResponse,
    VisitanteCreate,
)
from app.modules.core.core_schema import StandardResponse
from app.modules.core.limiter import limiter
from app.modules.core.security import get_current_user
from prisma import models

router = APIRouter(prefix="/convites", tags=["Convites de Visitantes"])


@router.post(
    "/gerar",
    status_code=status.HTTP_201_CREATED,
    response_model=StandardResponse[ConviteResponse],
)
async def gerar_convite(usuario: models.Usuario = Depends(get_current_user)):
    """
    Gera um link de convite para um visitante preencher seus dados.
    """
    resultado = await ConviteController.gerar(usuario.id)
    return StandardResponse(
        message="Convite gerado com sucesso.",
        status_code=status.HTTP_201_CREATED,
        data=resultado,
    )


@router.get(
    "/visitantes",
    response_model=StandardResponse[list],
)
async def listar_visitantes(usuario: models.Usuario = Depends(get_current_user)):
    """
    Lista os visitantes vinculados ao morador logado.
    """
    resultado = await ConviteController.listar_visitantes(usuario.id)
    return StandardResponse(
        message="Visitantes listados com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )


@router.get("/{token}")
async def renderizar_formulario(token: str, request: Request):
    """
    Renderiza o formulário web para o visitante cadastrar seus dados.
    """
    return await ConviteController.renderizar_formulario(token, request)


@router.post("/{token}/registrar")
@limiter.limit("5/minute")
async def registrar_visitante(token: str, dados: VisitanteCreate, request: Request):
    """
    Processa o cadastro do visitante via formulário web.
    """
    resultado = await ConviteController.registrar(token, dados)
    return StandardResponse(
        message="Cadastro realizado com sucesso! Você já pode entrar no condomínio.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )
