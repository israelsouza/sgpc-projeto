from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile

from app.modules.autenticacao.autenticacao_service import AutenticacaoService
from app.modules.documento.documento_controller import (
    DocumentoController,
    get_documento_service,
)
from app.modules.documento.documento_service import DocumentoService

router = APIRouter(prefix="/documentos", tags=["Documentos"])


@router.post("")
async def criar_documento(
    request: Request,
    titulo: Annotated[str, Form()],
    categoria: Annotated[str, Form()],
    arquivo: Annotated[UploadFile, File()],
    descricao: Annotated[str | None, Form()] = None,
    service: DocumentoService = Depends(get_documento_service),
    usuario: dict = Depends(
        AutenticacaoService.obter_usuario_logado_com_permissoes(["SINDICO", "ADMIN"])
    ),
):
    return await DocumentoController.criar_documento(
        request=request,
        titulo=titulo,
        descricao=descricao,
        categoria=categoria,
        arquivo=arquivo,
        usuario_id=usuario["id"],
        condominio_id=usuario["condominio_id"],
        service=service,
    )


@router.get("")
async def listar_documentos(
    categoria: str | None = None,
    limit: int = 10,
    offset: int = 0,
    service: DocumentoService = Depends(get_documento_service),
    usuario: dict = Depends(AutenticacaoService.obter_usuario_logado),
):
    return await DocumentoController.listar_documentos(
        condominio_id=usuario["condominio_id"],
        categoria=categoria,
        limit=limit,
        offset=offset,
        service=service,
    )


@router.get("/{documento_id}")
async def obter_detalhes(
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: dict = Depends(AutenticacaoService.obter_usuario_logado),
):
    return await DocumentoController.obter_detalhes(
        documento_id=documento_id,
        condominio_id=usuario["condominio_id"],
        service=service,
    )


@router.get("/{documento_id}/download")
async def obter_url_download(
    request: Request,
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: dict = Depends(AutenticacaoService.obter_usuario_logado),
):
    return await DocumentoController.obter_url_download(
        request=request,
        documento_id=documento_id,
        condominio_id=usuario["condominio_id"],
        usuario_id=usuario["id"],
        service=service,
    )


@router.delete("/{documento_id}")
async def deletar_documento(
    request: Request,
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
    usuario: dict = Depends(
        AutenticacaoService.obter_usuario_logado_com_permissoes(["SINDICO", "ADMIN"])
    ),
):
    return await DocumentoController.deletar_documento(
        request=request,
        documento_id=documento_id,
        condominio_id=usuario["condominio_id"],
        usuario_id=usuario["id"],
        service=service,
    )
