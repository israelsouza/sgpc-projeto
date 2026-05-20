from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile

from app.modules.core.security import ForbiddenError, get_current_user
from app.modules.documento.documento_controller import (
    DocumentoController,
    get_documento_service,
)
from app.modules.documento.documento_service import DocumentoService
from prisma import models

router = APIRouter(prefix="/documentos", tags=["Documentos"])


def obter_condominio_id(usuario: models.Usuario) -> int:
    if usuario.funcionario:
        return usuario.funcionario.condominio_id
    if usuario.morador and usuario.morador.unidade:
        return usuario.morador.unidade.condominio_id
    raise ForbiddenError(mensagem="Usuário não vinculado a um condomínio.")


def verificar_permissao_escrita(usuario: models.Usuario):
    roles = [p.nome for p in usuario.perfis]
    if "SINDICO" not in roles and "ADMIN" not in roles:
        raise ForbiddenError(
            mensagem="Acesso negado: Apenas síndicos ou administradores podem realizar esta ação."
        )


@router.post("")
async def criar_documento(
    request: Request,
    titulo: Annotated[str, Form()],
    categoria: Annotated[str, Form()],
    arquivo: Annotated[UploadFile, File()],
    descricao: Annotated[str | None, Form()] = None,
    service: DocumentoService = Depends(get_documento_service),
    usuario: models.Usuario = Depends(get_current_user),
):
    verificar_permissao_escrita(usuario)
    condominio_id = obter_condominio_id(usuario)

    return await DocumentoController.criar_documento(
        request=request,
        titulo=titulo,
        descricao=descricao,
        categoria=categoria,
        arquivo=arquivo,
        usuario_id=usuario.id,
        condominio_id=condominio_id,
        service=service,
    )


@router.get("")
async def listar_documentos(
    categoria: str | None = None,
    limit: int = 10,
    offset: int = 0,
    service: DocumentoService = Depends(get_documento_service),
    usuario: models.Usuario = Depends(get_current_user),
):
    condominio_id = obter_condominio_id(usuario)
    return await DocumentoController.listar_documentos(
        condominio_id=condominio_id,
        categoria=categoria,
        limit=limit,
        offset=offset,
        service=service,
    )


@router.get("/{documento_id}")
async def obter_detalhes(
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: models.Usuario = Depends(get_current_user),
):
    condominio_id = obter_condominio_id(usuario)
    return await DocumentoController.obter_detalhes(
        documento_id=documento_id,
        condominio_id=condominio_id,
        service=service,
    )


@router.get("/{documento_id}/download")
async def obter_url_download(
    request: Request,
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: models.Usuario = Depends(get_current_user),
):
    condominio_id = obter_condominio_id(usuario)
    return await DocumentoController.obter_url_download(
        request=request,
        documento_id=documento_id,
        condominio_id=condominio_id,
        usuario_id=usuario.id,
        service=service,
    )


@router.delete("/{documento_id}")
async def deletar_documento(
    request: Request,
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: models.Usuario = Depends(get_current_user),
):
    verificar_permissao_escrita(usuario)
    condominio_id = obter_condominio_id(usuario)

    return await DocumentoController.deletar_documento(
        request=request,
        documento_id=documento_id,
        condominio_id=condominio_id,
        usuario_id=usuario.id,
        service=service,
    )
