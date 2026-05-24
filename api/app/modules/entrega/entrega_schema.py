from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict


class StatusEntrega(StrEnum):
    AGUARDANDO = "AGUARDANDO"
    RECEBIDA = "RECEBIDA"
    RETIRADA = "RETIRADA"
    CANCELADA = "CANCELADA"


class CategoriaEntrega(StrEnum):
    CARTA = "CARTA"
    PACOTE = "PACOTE"


class EntregaCreate(BaseModel):
    tipo: CategoriaEntrega
    prazo_retirada: datetime
    mensagem: str | None = None

    model_config = ConfigDict(from_attributes=True)


class EntregaStatusUpdate(BaseModel):
    status: StatusEntrega
    justificativa_cancelamento: str | None = None
    observacao_porteiro: str | None = None

    model_config = ConfigDict(from_attributes=True)


class EntregaResponse(BaseModel):
    id: int
    morador_id: int
    tipo: CategoriaEntrega
    status: StatusEntrega
    prazo_retirada: datetime
    mensagem: str | None
    observacao_porteiro: str | None
    justificativa_cancelamento: str | None
    criado_em: datetime
    atualizado_em: datetime
    quem_recebeu: int | None

    model_config = ConfigDict(from_attributes=True)
