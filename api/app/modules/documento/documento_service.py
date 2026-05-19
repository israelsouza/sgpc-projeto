import hashlib
import re
from datetime import datetime

import fitz  # PyMuPDF
import structlog

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
        # 1. Validação de Tamanho (Máximo 15 MB)
        if len(arquivo_pdf) > 15 * 1024 * 1024:
            raise ValidationError(
                nome="tamanho_invalido", mensagem="Arquivo excede o limite de 15MB"
            )

        # 2. Validação de Tipo (Magic Bytes - Simplificado via bytes para evitar libmagic/C)
        if not arquivo_pdf.startswith(b"%PDF-"):
            raise ValidationError(
                nome="tipo_invalido", mensagem="Apenas arquivos PDF são permitidos"
            )

        # 3. Validação de Estrutura do PDF (Arquivo Corrompido/Vazio)
        try:
            doc = fitz.open(stream=arquivo_pdf, filetype="pdf")
            if doc.page_count < 1:
                raise ValueError("PDF vazio")
            doc.close()
        except Exception:
            raise ValidationError(
                nome="arquivo_corrompido", mensagem="PDF inválido ou corrompido"
            )

        # 4. Integridade (SHA-256) e Sanitização
        sha256_hash = hashlib.sha256(arquivo_pdf).hexdigest()
        safe_filename = re.sub(r"[^a-zA-Z0-9_\-\.\s]", "_", filename).strip()

        # 5. Comprimir e Upload
        pdf_comprimido = self.pdf_service.compress_pdf(arquivo_pdf)
        folder = f"condominio_{condominio_id}/documentos"
        
        # Gerar ID com extensão para garantir consistência no Cloudinary 'raw'
        file_id_base = f"doc_{datetime.now().timestamp()}"
        file_id_full = f"{file_id_base}.pdf"

        file_id = await self.storage_service.upload_private_file(
            pdf_comprimido, file_id_full, folder
        )

        # 6. Salvar Metadados
        novo_doc = await DocumentoModel.criar(
            self.db,
            {
                "titulo": dados.titulo,
                "descricao": dados.descricao,
                "categoria": dados.categoria,
                "file_id": file_id,
                "filename_orig": safe_filename,
                "sha256_hash": sha256_hash,
                "condominio_id": condominio_id,
                "quem_criou_id": usuario_id,
            },
        )

        # 7. Registrar Auditoria
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

        if documento.condominio_id != condominio_id:
            raise ValidationError(
                nome="acesso_negado",
                mensagem="Você não tem permissão para acessar este documento.",
            )

        return documento

    async def gerar_url_download(
        self,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        ip_address: str | None = None,
    ):
        # 1. Validação estrita de escopo
        documento = await self.obter_detalhes(documento_id, condominio_id)

        # 2. Registrar Auditoria
        await DocumentoLogModel.criar(
            self.db,
            documento_id=documento.id,
            usuario_id=usuario_id,
            acao="DOWNLOAD",
            ip_address=ip_address,
        )

        # 3. Gerar URL com expiração curta para evitar vazamentos prolongados (15 minutos)
        return self.storage_service.generate_signed_url(
            documento.file_id,
            expires_in=900,
        )

    async def deletar_documento(
        self,
        documento_id: int,
        condominio_id: int,
        usuario_id: int,
        ip_address: str | None = None,
    ):
        # 1. Valida escopo
        documento = await self.obter_detalhes(documento_id, condominio_id)

        # 2. Deletar do Cloudinary físicamente
        await self.storage_service.delete_file(documento.file_id)

        # 3. Deleção Lógica no Banco
        await DocumentoModel.deletar_logico(documento.id, self.db)

        # 4. Auditoria
        await DocumentoLogModel.criar(
            self.db,
            documento_id=documento.id,
            usuario_id=usuario_id,
            acao="DELETE",
            ip_address=ip_address,
        )

        return True
