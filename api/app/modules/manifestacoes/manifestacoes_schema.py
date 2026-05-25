from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator


# CRIA O MODELO BASE PARA OS TIPOS DE MANIFESTAÇÃO
class ManifestacaoBase(BaseModel):
    assunto: str
    mensagem: str

    categoria: Literal["solicitacao"] = "solicitacao"

    # PUXAR OS DADOS DE CONDOMÍNIO
    # DADOS PRÉDIO
    unidade: str | None = None
    bloco: str | None = None
    andar: str | None = None

    # DADOS RESIDÊNCIAL - HORIZONTAL
    numero: str | None = None
    prefixo: int | None = None

    # Validar os campos de texto que o usuário pode editar

    @field_validator("assunto")
    @classmethod
    def validar_assunto(cls, value: str):
        assunto = value.strip()
        if len(assunto) < 5:
            raise ValueError(
                "Texto menor que o esperado. O assunto deve conter no mínimo 5 caractéres."
            )

        if len(assunto) > 120:
            raise ValueError(
                "Texto excedeu o limite. O assunto deve conter no máximo 120 caractéres."
            )

        return assunto

    @field_validator("mensagem")
    @classmethod
    def validar_mensagem(cls, value: str):
        mensagem = value.strip()
        if len(mensagem) < 5:
            raise ValueError(
                "Texto menor que o esperado. O assunto deve conter no mínimo 5 caractéres."
            )

        if len(mensagem) > 320:
            raise ValueError(
                "Texto excedeu o limite. A mensagem deve conter no máximo 320 caractéres."
            )

        return mensagem


# CRIAR A MANIFESTAÇÃO
class ManifestacaoCreate(ManifestacaoBase):
    pass


# ATUALIZAR MANIFESTAÇÃO
class ManifestacaoUpdate(BaseModel):
    status: str
    comentario: str | None = None
    autor_role: str | None = None


class ManifestacaoResponse(ManifestacaoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    autor: str
    status: str
    data_criacao: datetime
    hora_criacao: str
