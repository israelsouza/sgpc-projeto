import structlog
from fastapi import WebSocket

logger = structlog.get_logger()


class ConnectionManager:
    def __init__(self):
        # Gerencia conexões ativas agrupadas por condominio_id
        # { condominio_id: [WebSocket, WebSocket, ...] }
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, condominio_id: int):
        await websocket.accept()
        if condominio_id not in self.active_connections:
            self.active_connections[condominio_id] = []
        self.active_connections[condominio_id].append(websocket)
        logger.info(
            "websocket_connected",
            condominio_id=condominio_id,
            total_connections=len(self.active_connections[condominio_id]),
        )

    def disconnect(self, websocket: WebSocket, condominio_id: int):
        if condominio_id in self.active_connections:
            self.active_connections[condominio_id].remove(websocket)
            if not self.active_connections[condominio_id]:
                del self.active_connections[condominio_id]
            logger.info("websocket_disconnected", condominio_id=condominio_id)

    async def broadcast_to_condominio(self, message: dict, condominio_id: int):
        """
        Envia uma mensagem para todos os usuários conectados de um condomínio específico.
        """
        if condominio_id in self.active_connections:
            for connection in self.active_connections[condominio_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error("websocket_send_failed", error=str(e))
                    # Opcional: remover conexão morta


manager = ConnectionManager()
