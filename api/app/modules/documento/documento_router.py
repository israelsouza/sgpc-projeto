from fastapi import APIRouter, Depends, File, Form, Request, UploadFile, status, Response
import base64

from app.db.prisma_client import get_prisma
from app.modules.core.adapters import CloudinaryAdapter, PyMuPdfAdapter
from app.modules.core.core_exception import ForbiddenError
from app.modules.core.core_schema import StandardResponse
from app.modules.core.security import get_current_user
from app.modules.documento.documento_controller import DocumentoController
from app.modules.documento.documento_schema import DocumentoCreate, DocumentoResponse, DocumentosListResponse
from app.modules.documento.documento_service import DocumentoService
from prisma import Prisma, models

router = APIRouter(prefix="/documentos", tags=["Documentos"])


def get_documento_service(db: Prisma = Depends(get_prisma)) -> DocumentoService:
    return DocumentoService(
        db=db, pdf_service=PyMuPdfAdapter(), storage_service=CloudinaryAdapter()
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def criar_documento(
    request: Request,
    titulo: str = Form(...),
    categoria: str = Form(...),
    descricao: str | None = Form(None),
    arquivo: UploadFile = File(...),
    current_user: models.Usuario = Depends(get_current_user),
    service: DocumentoService = Depends(get_documento_service),
):
    """Realiza o upload de um novo documento PDF."""
    if not current_user.funcionario:
        raise ForbiddenError("Apenas síndicos ou administradores podem subir documentos.")

    dados = DocumentoCreate(titulo=titulo, categoria=categoria, descricao=descricao)
    pdf_bytes = await arquivo.read()

    resultado = await DocumentoController.criar(
        dados=dados,
        arquivo_pdf=pdf_bytes,
        filename=arquivo.filename,
        condominio_id=current_user.funcionario.condominio_id,
        usuario_id=current_user.id,
        ip_address=request.client.host if request.client else None,
        service=service,
    )
    return StandardResponse(
        message="Documento criado com sucesso.",
        status_code=status.HTTP_201_CREATED,
        data=resultado,
    )


@router.get("", response_model=StandardResponse[DocumentosListResponse])
async def listar_documentos(
    categoria: str | None = None,
    limit: int = 10,
    offset: int = 0,
    current_user: models.Usuario = Depends(get_current_user),
    service: DocumentoService = Depends(get_documento_service),
):
    """Lista os documentos do condomínio do usuário logado."""
    condominio_id = None
    if current_user.funcionario:
        condominio_id = current_user.funcionario.condominio_id
    elif current_user.morador and current_user.morador.unidade:
        condominio_id = current_user.morador.unidade.condominio_id

    if not condominio_id:
        raise ForbiddenError("Usuário não associado a um condomínio.")

    resultado = await DocumentoController.listar(
        condominio_id=condominio_id,
        categoria=categoria,
        limit=limit,
        offset=offset,
        service=service,
    )
    return StandardResponse(
        message="Documentos listados com sucesso.",
        status_code=status.HTTP_200_OK,
        data=resultado,
    )


@router.get("/{documento_id}/download")
async def obter_url_download(
    request: Request,
    documento_id: int,
    current_user: models.Usuario = Depends(get_current_user),
    service: DocumentoService = Depends(get_documento_service),
):
    """Gera uma URL para visualização/download do documento."""
    condominio_id = None
    if current_user.funcionario:
        condominio_id = current_user.funcionario.condominio_id
    elif current_user.morador and current_user.morador.unidade:
        condominio_id = current_user.morador.unidade.condominio_id

    url = await service.gerar_url_download(
        documento_id=documento_id,
        condominio_id=condominio_id,
        usuario_id=current_user.id,
        ip_address=request.client.host if request.client else None,
    )
    return StandardResponse(
        message="URL gerada com sucesso.", status_code=status.HTTP_200_OK, data={"url": url}
    )


@router.get("/{documento_id}/stream")
async def stream_documento(
    documento_id: int,
    service: DocumentoService = Depends(get_documento_service),
):
    """Endpoint para servir o PDF diretamente do banco de dados (Streaming)."""
    documento = await service.db.documento.find_unique(where={"id": documento_id})
    
    if not documento or not documento.conteudo:
        return Response(status_code=404, content="Documento ou conteúdo não encontrado.")

    # No Prisma Python, o conteúdo Bytes retornado via string b64 precisa ser decodificado
    try:
        if hasattr(documento.conteudo, 'decode'):
            pdf_bytes = documento.conteudo.decode()
        else:
            pdf_bytes = base64.b64decode(documento.conteudo)
    except Exception:
        pdf_bytes = documento.conteudo

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{documento.filename_orig}"'
        }
    )


@router.delete("/{documento_id}")
async def deletar_documento(
    request: Request,
    documento_id: int,
    current_user: models.Usuario = Depends(get_current_user),
    service: DocumentoService = Depends(get_documento_service),
):
    """Deleta um documento (Restrito a funcionários do condomínio)."""
    if not current_user.funcionario:
        raise ForbiddenError("Apenas síndicos ou administradores podem deletar documentos.")

    await service.deletar_documento(
        documento_id=documento_id,
        condominio_id=current_user.funcionario.condominio_id,
        usuario_id=current_user.id,
        ip_address=request.client.host if request.client else None,
    )
    return StandardResponse(
        message="Documento deletado com sucesso.", status_code=status.HTTP_200_OK
    )
