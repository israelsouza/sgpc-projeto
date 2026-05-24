from fastapi import APIRouter, Depends, Request, status

from app.modules.convite.convite_controller import ConviteController
from app.modules.convite.convite_schema import (
    ConviteCreate,
    ConviteResponse,
    VisitanteCreate,
    VisitanteResponse,
    VisitanteUpdate,
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
async def gerar_convite(
    dados: ConviteCreate, usuario: models.Usuario = Depends(get_current_user)
):
    """
    Gera um link de convite para um visitante preencher seus dados.
    """
    resultado = await ConviteController.gerar(usuario.id, dados)
    return StandardResponse(
        message="Convite gerado com sucesso.",
        status_code=status.HTTP_201_CREATED,
        data=resultado,
    )


@router.get(
    "/visitantes",
    response_model=StandardResponse[list[VisitanteResponse]],
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


@router.get(
    "/visitantes/condominio",
    response_model=StandardResponse[list[VisitanteResponse]],
)
async def listar_visitantes_condominio(usuario: models.Usuario = Depends(get_current_user)):
    """
    Lista todos os visitantes do condomínio (Restrito a funcionários).
    """
    resultado = await ConviteController.listar_visitantes_condominio(usuario.id)
    return StandardResponse(
        message="Visitantes do condomínio listados com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )


@router.patch(
    "/visitantes/{visitante_id}",
    response_model=StandardResponse[VisitanteResponse],
)
async def atualizar_visitante(
    visitante_id: int,
    dados: VisitanteUpdate,
    usuario: models.Usuario = Depends(get_current_user),
):
    """
    Atualiza os dados de um visitante (Apenas se pertencer à unidade do morador).
    """
    resultado = await ConviteController.atualizar_visitante(
        usuario.id, visitante_id, dados
    )
    return StandardResponse(
        message="Visitante atualizado com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )


@router.delete(
    "/visitantes/{visitante_id}",
    response_model=StandardResponse,
)
async def excluir_visitante(
    visitante_id: int, usuario: models.Usuario = Depends(get_current_user)
):
    """
    Remove um visitante do cadastro (Apenas se pertencer à unidade do morador).
    """
    await ConviteController.excluir_visitante(usuario.id, visitante_id)
    return StandardResponse(
        message="Visitante removido com sucesso.",
        status_code=status.HTTP_200_OK,
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
