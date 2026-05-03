import io

import cloudinary
import cloudinary.uploader
import cloudinary.utils
import firebase_admin
import fitz  # PyMuPDF
import structlog
from firebase_admin import credentials, messaging

from app.config import settings
from app.modules.core.interfaces import (
    PdfServiceInterface,
    PushServiceInterface,
    StorageServiceInterface,
)

logger = structlog.get_logger()


class PyMuPdfAdapter(PdfServiceInterface):
    def compress_pdf(self, file_bytes: bytes) -> bytes:
        """
        Comprime PDF reduzindo a qualidade das imagens e otimizando o lixo.
        """
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            output_buffer = io.BytesIO()

            # Otimização básica: Garbage collection e compressão de objetos
            doc.save(output_buffer, garbage=4, deflate=True, clean=True)

            compressed_bytes = output_buffer.getvalue()
            doc.close()

            logger.info(
                "pdf_compressed",
                original_size=len(file_bytes),
                compressed_size=len(compressed_bytes),
            )

            return compressed_bytes
        except Exception as e:
            logger.error("pdf_compression_failed", error=str(e))
            return file_bytes  # Retorna o original em caso de falha


class CloudinaryAdapter(StorageServiceInterface):
    def __init__(self):
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )

    async def upload_private_file(
        self, file_bytes: bytes, filename: str, folder: str
    ) -> str:
        """
        Upload para o Cloudinary com access_mode='authenticated'.
        """
        try:
            upload_result = cloudinary.uploader.upload(
                file_bytes,
                public_id=filename,
                folder=folder,
                access_mode="authenticated",
                resource_type="auto",
            )
            return upload_result["public_id"]
        except Exception as e:
            logger.error("cloudinary_upload_failed", error=str(e))
            raise e

    def generate_signed_url(self, file_id: str, expires_in: int = 3600) -> str:
        """
        Gera URL assinada para recursos privados.
        """
        try:
            url, _ = cloudinary.utils.cloudinary_url(
                file_id, sign_url=True, type="authenticated", secure=True
            )
            return url
        except Exception as e:
            logger.error("cloudinary_sign_url_failed", error=str(e))
            raise e


class FcmPushAdapter(PushServiceInterface):
    def __init__(self):
        try:
            # Tenta obter o app padrão, se não existir, inicializa
            firebase_admin.get_app()
        except ValueError:
            # Inicializa usando a conta de serviço configurada
            try:
                cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
                firebase_admin.initialize_app(cred)
            except Exception as e:
                logger.warning(
                    "fcm_init_failed",
                    error=str(e),
                    msg="Push notifications may not work. Check your firebase-service-account.json",
                )

    async def send_topic_push(
        self, topic: str, title: str, body: str, data: dict | None = None
    ) -> bool:
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=data or {},
                topic=topic,
                # Configuração para forçar Heads-up no Android
                android=messaging.AndroidConfig(
                    priority="high",
                    notification=messaging.AndroidNotification(
                        channel_id="sgpc_avisos_urgentes",  # O Mobile DEVE criar este canal
                        sound="default",
                    ),
                ),
                # Configuração para forçar entrega imediata no iOS
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            sound="default",
                            content_available=True,
                        )
                    ),
                    headers={"apns-priority": "10"},  # 10 = Prioridade máxima
                ),
            )
            response = messaging.send(message)
            logger.info("push_sent_successfully", topic=topic, message_id=response)
            return True
        except Exception as e:
            logger.error("push_send_failed", topic=topic, error=str(e))
            return False
