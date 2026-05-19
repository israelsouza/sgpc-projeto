from abc import ABC, abstractmethod


class PdfServiceInterface(ABC):
    @abstractmethod
    def compress_pdf(self, file_bytes: bytes) -> bytes:
        """
        Recebe os bytes de um PDF e retorna os bytes do PDF comprimido.
        """
        pass


class StorageServiceInterface(ABC):
    @abstractmethod
    async def upload_private_file(
        self, file_bytes: bytes, filename: str, folder: str
    ) -> str:
        """
        Realiza o upload de um arquivo para armazenamento privado e retorna o ID/URL do arquivo.
        """
        pass

    @abstractmethod
    def generate_signed_url(
        self, file_id: str, expires_in: int = 3600, params: dict | None = None
    ) -> str:
        """
        Gera uma URL assinada e temporária para acesso ao arquivo privado.
        """
        pass

    @abstractmethod
    async def delete_file(self, file_id: str) -> bool:
        """
        Deleta um arquivo do armazenamento privado.
        """
        pass


class PushServiceInterface(ABC):
    @abstractmethod
    async def send_topic_push(
        self, topic: str, title: str, body: str, data: dict | None = None
    ) -> bool:
        """
        Envia uma notificação push para um tópico específico (ex: condominio_id).
        """
        pass
