from enum import StrEnum

from pydantic import BaseModel, ConfigDict, model_validator

from app.modules.unidade.unidade_schema import UnidadeResponse


# DEFINE OS TIPOS EM DOIS QUE SÃO ESTÁTICOS
class TipoCondominio(StrEnum):
    PREDIO = "PREDIO"
    HORIZONTAL = "HORIZONTAL"  # SERÁ UTILIZADO EM CONDS RESIDENCIAIS


# CLASSE PAI QUE OS PREDIOS HERDARÃO
class ConfigPredio(BaseModel):
    andar_inicio: int
    andar_fim: int
    sufixos: list[str]
    bloco: str | None = None

    @model_validator(mode="after")
    def validar(self):
        if self.andar_fim < self.andar_inicio:
            raise ValueError("andar_fim deve ser maior que andar_inicio")
        if not self.sufixos:
            raise ValueError("Informa um sufixo")
        return self


# CLASSE PAI DOS CONDS RESIDENCIAIS
class ConfigHorizontal(BaseModel):
    prefixo: str = "Casa/Lote"
    numero_inicio: int = 1
    numero_fim: int

    @model_validator(mode="after")
    def validar(self):
        if self.numero_fim < self.numero_inicio:
            raise ValueError("numero_fim deve ser maior que numero_inicio")
        return self


# ESTRUTURA BASE PARA QUALQUER COND QUE SERÁ ADICIONADO
class CondominioBase(BaseModel):
    nome: str
    cnpj: str | None = None
    endereco: str | None = None
    tipoCond: TipoCondominio = TipoCondominio.PREDIO


class CondominioCreate(CondominioBase):
    pass


# PARA ATUALIZAR INFOS
class CondominioUpdate(BaseModel):
    nome: str | None = None
    cnpj: str | None = None
    endereco: str | None = None
    tipoCond: TipoCondominio | None = None


class CondominioResponse(CondominioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# CADASTRO MASSIVO COM DADOS DEF NO SCHEMA DO CONDOMINIO
class UnidMassCreation(BaseModel):
    condominio_id: int
    config_predio: ConfigPredio | None = None
    config_horizontal: ConfigHorizontal | None = None

    @model_validator(mode="after")
    def config_validacao(self):
        ambos = self.config_predio and self.config_horizontal
        nenhum = not self.config_predio and not self.config_horizontal
        if ambos or nenhum:
            raise ValueError(
                "Informe exatamente uma config: config_predio ou config_horizontal"
            )
        return self


# COMO O RESULTADO SERÁ EXIBIDO
class UnidadeMassResultado(BaseModel):
    total_solicitado: int
    total_criado: int
    total_ignorado: int
    criadas: list[UnidadeResponse]
    ignoradas: list[str]
