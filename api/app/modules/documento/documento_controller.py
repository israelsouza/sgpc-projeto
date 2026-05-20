from fastapi import Depends, Request, UploadFile, status
from pydantic import ValidationError as PydanticValidationError

from app.db.prisma_client import get_prisma
from app.modules.core.adapters import CloudinaryAdapter, PyMuPdfAdapter
from app.modules.core.core_exception import ValidationError
from app.modules.core.core_schema import StandardResponse
from app.modules.documento.documento_schema import DocumentoCreate
from app.modules.documento.documento_service import DocumentoService
from prisma import Prisma


def get_documento_service(db: Prisma = Depends(get_prisma)) -> DocumentoService:
    return DocumentoService(
        db=db,
        pdf_service=PyMuPdfAdapter(),
        storage_service=CloudinaryAdapter(),
    )


class DocumentoController:
    @staticmethod
    async def criar_documento(
        request: Request,
        titulo: str,
        categoria: str,
        usuario_id: int,
        condominio_id: int,
        service: DocumentoService,
        arquivo: UploadFile,
        descricao: str | None = None,
    ):
        try:
            dados = DocumentoCreate(
                titulo=titulo, descricao=descricao, categoria=categoria
            )
        except PydanticValidationError as e:
            erro = e.errors()[0]
            msg = erro.get("msg", "Dados inválidos.")
            msg = msg.replace("Value error, ", "")
            raise ValidationError(nome="validacao_documento", mensagem=msg)

        arquivo_bytes = await arquivo.read()
        filename = arquivo.filename or "documento.pdf"
        ip_address = request.client.host if request.client else None

        novo_documento = await service.criar_documento(
            dados=dados,
            arquivo_pdf=arquivo_bytes,
            filename=filename,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            ip_address=ip_address,
        )

        return StandardResponse(
            message="Documento salvo com sucesso.",
            status_code=status.HTTP_201_CREATED,
            data=novo_documento,
        )

    @staticmethod
    async def listar_documentos(
        condominio_id: int,
        categoria: str | None,
        limit: int,
        offset: int,
        service: DocumentoService,
    ):
        total, items = await service.listar_documentos(
            condominio_id, categoria, limit, offset
        )

        return StandardResponse(
            message="Documentos listados com sucesso.",
            status_code=status.HTTP_200_OK,
            data={"total": total, "items": items},
        )

    @staticmethod
    async def obter_detalhes(
        documento_id: int, condominio_id: int, service: DocumentoService
    ):
        documento = await service.obter_detalhes(documento_id, condominio_id)

        return StandardResponse(
            message="Detalhes do documento obtidos.",
            status_code=status.HTTP_200_OK,
            data=documento,
        )

    @staticmethod
    async def obter_url_download(
        request: Request,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        service: DocumentoService,
    ):
        ip_address = request.client.host if request.client else None
        url = await service.gerar_url_download(
            documento_id=documento_id,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            ip_address=ip_address,
        )

        return StandardResponse(
            message="URL de download gerada.",
            status_code=status.HTTP_200_OK,
            data={"url": url},
        )

    @staticmethod
    async def deletar_documento(
        request: Request,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        service: DocumentoService,
    ):
        ip_address = request.client.host if request.client else None
        await service.deletar_documento(
            documento_id=documento_id,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            ip_address=ip_address,
        )

        return StandardResponse(
            message="Documento removido com sucesso.", status_code=status.HTTP_200_OK
        )
