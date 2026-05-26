from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class HistoricoItem(BaseModel):
    id: str
    titulo: str
    subtitulo: str
    tipo: str # 'VISITANTE', 'BILHETE', 'RESERVA', 'MANIFESTACAO'
    data: datetime
    icon_name: str
    icon_library: str # 'Feather', 'MaterialCommunityIcons', etc.
    icon_bg: str
    icon_color: str
