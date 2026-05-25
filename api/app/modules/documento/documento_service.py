import base64
import hashlib
import re
from datetime import datetime

import structlog

from app.config import settings
from app.modules.core.core_exception import ValidationError
from app.modules.core.interfaces import PdfServiceInterface, StorageServiceInterface
from app.modules.documento.documento_model import DocumentoLogModel, DocumentoModel
from app.modules.documento.documento_schema import DocumentoCreate
from prisma import Prisma

logger = structlog.get_logger()


class DocumentoService:
    def __init__(
        self,
        db: Prisma,
        pdf_service: PdfServiceInterface,
        storage_service: StorageServiceInterface,
    ):
        self.db = db
        self.pdf_service = pdf_service
        self.storage_service = storage_service

    async def criar_documento(
        self,
        dados: DocumentoCreate,
        arquivo_pdf: bytes,
        filename: str,
        condominio_id: int,
        usuario_id: int,
        ip_address: str | None = None,
    ):
        # 1. Validação de Tamanho
        if len(arquivo_pdf) > 15 * 1024 * 1024:
            raise ValidationError(
                nome="tamanho_invalido", mensagem="Arquivo excede o limite de 15MB"
            )

        # 2. Validação de Tipo (Magic Bytes)
        if not arquivo_pdf.startswith(b"%PDF-"):
            raise ValidationError(
                nome="tipo_invalido", mensagem="Apenas arquivos PDF são permitidos"
            )

        # 3. Integridade e Sanitização
        sha256_hash = hashlib.sha256(arquivo_pdf).hexdigest()
        safe_filename = re.sub(r"[^a-zA-Z0-9_\-\.\s]", "_", filename).strip()

        # 4. Conversão para String Base64 para evitar erros de ASCII no Windows/Prisma
        pdf_b64_str = base64.b64encode(arquivo_pdf).decode("utf-8")

        file_id_fake = f"db_{datetime.now().timestamp()}_{safe_filename}"

        # 5. Salvar no Banco
        novo_doc = await DocumentoModel.criar(
            self.db,
            {
                "titulo": dados.titulo,
                "descricao": dados.descricao,
                "categoria": dados.categoria,
                "file_id": file_id_fake,
                "filename_orig": safe_filename,
                "sha256_hash": sha256_hash,
                "conteudo": pdf_b64_str,
                "condominio_id": condominio_id,
                "quem_criou_id": usuario_id,
            },
        )

        # 6. Registrar Auditoria
        await DocumentoLogModel.criar(
            self.db,
            documento_id=novo_doc.id,
            usuario_id=usuario_id,
            acao="UPLOAD",
            ip_address=ip_address,
        )

        return novo_doc

    async def listar_documentos(
        self,
        condominio_id: int,
        categoria: str | None = None,
        limit: int = 10,
        offset: int = 0,
    ):
        return await DocumentoModel.listar(
            self.db, condominio_id, categoria, limit, offset
        )

    async def obter_detalhes(self, documento_id: int, condominio_id: int):
        documento = await DocumentoModel.buscar_por_id(documento_id, self.db)
        if not documento or documento.deletado_em:
            raise ValidationError(
                nome="documento_nao_encontrado", mensagem="Documento não localizado."
            )
        return documento

    async def gerar_url_download(
        self,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        ip_address: str | None = None,
    ):
        documento = await DocumentoModel.buscar_por_id(documento_id, self.db)
        if not documento:
            raise ValidationError(
                nome="nao_encontrado", mensagem="Documento não encontrado"
            )

        await DocumentoLogModel.criar(
            self.db,
            documento_id=documento.id,
            usuario_id=usuario_id,
            acao="DOWNLOAD",
            ip_address=ip_address,
        )

        return f"{settings.BASE_URL}/api/documentos/{documento.id}/stream"

    async def deletar_documento(
        self,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        ip_address: str | None = None,
    ):
        documento = await self.obter_detalhes(documento_id, condominio_id)
        await DocumentoModel.deletar_logico(documento.id, self.db)
        await DocumentoLogModel.criar(
            self.db,
            documento_id=documento.id,
            usuario_id=usuario_id,
            acao="DELETE",
            ip_address=ip_address,
        )
        return True
