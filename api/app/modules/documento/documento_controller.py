from app.modules.documento.documento_schema import DocumentoCreate
from app.modules.documento.documento_service import DocumentoService


class DocumentoController:
    @staticmethod
    async def criar(
        dados: DocumentoCreate,
        arquivo_pdf: bytes,
        filename: str,
        usuario_id: int,
        condominio_id: int,
        service: DocumentoService,
        ip_address: str | None = None,
    ):
        novo_documento = await service.criar_documento(
            dados=dados,
            arquivo_pdf=arquivo_pdf,
            filename=filename,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            ip_address=ip_address,
        )

        return novo_documento

    @staticmethod
    async def listar(
        condominio_id: int,
        categoria: str | None,
        limit: int,
        offset: int,
        service: DocumentoService,
    ):
        total, items = await service.listar_documentos(
            condominio_id, categoria, limit, offset
        )
        return {"total": total, "items": items}

    @staticmethod
    async def obter_detalhes(
        documento_id: int, condominio_id: int, service: DocumentoService
    ):
        documento = await service.obter_detalhes(documento_id, condominio_id)
        return documento

    @staticmethod
    async def deletar(
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        service: DocumentoService,
        ip_address: str | None = None,
    ):
        await service.deletar_documento(
            documento_id=documento_id,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            ip_address=ip_address,
        )
        return True
