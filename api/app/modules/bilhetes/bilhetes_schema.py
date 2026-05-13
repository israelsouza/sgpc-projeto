
import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, model_validator, field_validator
#Importar o apartamento morador dono
from app.modules.unidade.unidade_schema import UnidadeResponse
from app.modules.usuario.usuario_schema import UsuarioResponse

class BilheteBase(BaseModel):

    assunto: str
    mensagem: str
    categoria: Literal["bilhete"] = "bilhete"
    #tipoCond: TipoCondominio = TipoCondominio.PREDIO #Importar o tipo de condominio dentro da unidade

    #VALIDAÇÃO PARA PEGAR OS DADOS DA UNIDADE
    #PRÉDIOS
    unidade: Optional[str] = None
    bloco: Optional[str] = None
    andar: Optional[str] = None

    #RESIDENCIAL - HORIZONTAL
    numero: Optional[str] = None
    prefixo: Optional[str] = None

    #Vaidar os campos de texto que o usuário pode editar

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

#Criar o bilhete
class BilheteCreate(BilheteBase):
    pass

class BilheteResponse(BilheteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    autor: str
    data_criacao: datetime
    hora_criacao: str

