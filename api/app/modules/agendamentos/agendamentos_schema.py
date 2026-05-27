from datetime import datetime

from pydantic import BaseModel, ConfigDict


# DEFINIR E CRIAR OS ESPAÇOS
class EspacoBase(BaseModel):
    nome: str
    icone: str
    cor: str


class EspacoCreate(EspacoBase):
    pass


class EspacoResponse(EspacoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# CRIAR AS RESERVAS
class ReservaBase(BaseModel):
    espaco_id: int
    data_reserva: datetime
    usuario_id: int


class ReservaCreate(ReservaBase):
    pass


class ReservaUpdate(BaseModel):
    espaco_id: int | None = None
    data_reserva: datetime | None = None
    usuario_id: int | None = None


class ReservaResponse(ReservaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    espaco: EspacoResponse | None = None


# HORÁRIOS
class HorarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    horario: str
    status: str = "available"
