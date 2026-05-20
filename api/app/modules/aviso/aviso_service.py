from datetime import UTC, datetime, timedelta

import structlog

from app.core.websocket_manager import manager
from app.modules.aviso.aviso_model import AvisoModel
from app.modules.aviso.aviso_schema import AvisoCreate, AvisoUpdate
from app.modules.core.core_exception import ValidationError
from app.modules.core.interfaces import (
    PdfServiceInterface,
    PushServiceInterface,
    StorageServiceInterface,
)
from prisma import Prisma

logger = structlog.get_logger()


class AvisoService:
    def __init__(
        self,
        db: Prisma,
        pdf_service: PdfServiceInterface,
        storage_service: StorageServiceInterface,
        push_service: PushServiceInterface,
    ):
        self.db = db
        self.pdf_service = pdf_service
        self.storage_service = storage_service
        self.push_service = push_service

    async def criar_aviso(
        self,
        dados: AvisoCreate,
        condominio_id: int,
        usuario_id: int,
        arquivo_pdf: bytes | None = None,
        filename: str | None = None,
    ):
        anexo_url = None

        # 1. Processamento de Anexo (se houver)
        if arquivo_pdf:
            pdf_comprimido = self.pdf_service.compress_pdf(arquivo_pdf)

            # Upload via Interface
            folder = f"condominio_{condominio_id}/avisos"
            anexo_url = await self.storage_service.upload_private_file(
                pdf_comprimido,
                filename or f"aviso_{datetime.now().timestamp()}",
                folder,
            )

        # 2. Persistência no Banco
        novo_aviso = await AvisoModel.criar(
            self.db,
            {
                "titulo": dados.titulo,
                "descricao": dados.descricao,
                "categoria": dados.categoria,
                "anexo_url": anexo_url,
                "condominio_id": condominio_id,
                "quem_criou": usuario_id,
            },
        )

        # 3. Notificações (Híbridas)

        # A. WebSocket para o Porteiro (Web)
        aviso_json = {
            "type": "NEW_AVISO",
            "data": {
                "id": novo_aviso.id,
                "titulo": novo_aviso.titulo,
                "categoria": novo_aviso.categoria,
                "criado_em": novo_aviso.criado_em.isoformat(),
            },
        }
        await manager.broadcast_to_condominio(aviso_json, condominio_id)

        # B. Push Notification para Moradores (Mobile) via Interface
        topic = f"condominio_{condominio_id}"
        await self.push_service.send_topic_push(
            topic=topic,
            title=f"{novo_aviso.titulo}",
            body="",
            data={"aviso_id": str(novo_aviso.id), "categoria": novo_aviso.categoria},
        )

        return novo_aviso

    async def listar_avisos(
        self,
        condominio_id: int,
        categoria: str | None = None,
        limit: int = 10,
        offset: int = 0,
    ):
        total, items = await AvisoModel.listar(
            self.db, condominio_id, categoria, limit, offset
        )

        # Adiciona flag 'is_recente' (campo virtual)
        agora = datetime.now(UTC)
        avisos_com_flag = []
        for item in items:
            criado_em = item.criado_em
            if criado_em.tzinfo is None:
                criado_em = criado_em.replace(tzinfo=UTC)

            is_recente = (agora - criado_em) < timedelta(days=3)

            # Convertemos para dicionário para permitir o campo extra is_recente
            aviso_dict = item.model_dump()
            aviso_dict["is_recente"] = is_recente
            avisos_com_flag.append(aviso_dict)

        return total, avisos_com_flag

    async def obter_detalhes(self, aviso_id: int, condominio_id: int):
        aviso = await AvisoModel.buscar_por_id(aviso_id, self.db)

        if not aviso or aviso.deletado_em:
            raise ValidationError(
                nome="aviso_nao_encontrado", mensagem="Aviso não localizado."
            )

        if aviso.condominio_id != condominio_id:
            raise ValidationError(
                nome="acesso_negado",
                mensagem="Você não tem permissão para ver este aviso.",
            )

        # Adiciona flag is_recente
        agora = datetime.now(UTC)
        criado_em = aviso.criado_em
        if criado_em.tzinfo is None:
            criado_em = criado_em.replace(tzinfo=UTC)

        is_recente = (agora - criado_em) < timedelta(days=3)

        aviso_dict = aviso.model_dump()
        aviso_dict["is_recente"] = is_recente

        return aviso_dict

    async def gerar_url_anexo(self, aviso_id: int, condominio_id: int):
        aviso = await self.obter_detalhes(aviso_id, condominio_id)

        if not aviso.get("anexo_url"):
            raise ValidationError(
                nome="sem_anexo", mensagem="Este aviso não possui anexo."
            )

        return self.storage_service.generate_signed_url(aviso["anexo_url"])

    async def deletar_aviso(self, aviso_id: int, condominio_id: int):
        aviso = await self.obter_detalhes(aviso_id, condominio_id)
        await AvisoModel.deletar_logico(aviso["id"], self.db)
        return True

    async def atualizar_aviso(
        self, aviso_id: int, condominio_id: int, dados: AvisoUpdate, usuario_id: int
    ):
        # 1. Valida existência e escopo
        await self.obter_detalhes(aviso_id, condominio_id)

        # 2. Persistência
        # Remove campos None para não sobrescrever com null no banco
        update_data = dados.model_dump(exclude_none=True)

        aviso_atualizado = await AvisoModel.atualizar(aviso_id, self.db, update_data)

        # 3. Notificações (WebSocket)
        aviso_json = {
            "type": "UPDATE_AVISO",
            "data": {
                "id": aviso_atualizado.id,
                "titulo": aviso_atualizado.titulo,
                "categoria": aviso_atualizado.categoria,
                "criado_em": aviso_atualizado.criado_em.isoformat(),
            },
        }
        await manager.broadcast_to_condominio(aviso_json, condominio_id)

        # Otimização de Cache: o retorno deve conter o is_recente para o front poupar processamento
        return await self.obter_detalhes(aviso_id, condominio_id)
