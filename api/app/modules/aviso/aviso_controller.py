from fastapi import Depends, UploadFile, status
from pydantic import ValidationError as PydanticValidationError

from app.db.prisma_client import get_prisma
from app.modules.aviso.aviso_schema import AvisoCreate, AvisoUpdate, CategoriaAviso
from app.modules.aviso.aviso_service import AvisoService
from app.modules.core.adapters import CloudinaryAdapter, FcmPushAdapter, PyMuPdfAdapter
from app.modules.core.core_exception import ValidationError
from app.modules.core.core_schema import StandardResponse
from prisma import Prisma


# Função de dependência para injetar o AvisoService com seus adapters
def get_aviso_service(db: Prisma = Depends(get_prisma)) -> AvisoService:
    return AvisoService(
        db=db,
        pdf_service=PyMuPdfAdapter(),
        storage_service=CloudinaryAdapter(),
        push_service=FcmPushAdapter(),
    )


class AvisoController:
    @staticmethod
    async def criar_aviso(
        titulo: str,
        descricao: str,
        categoria: CategoriaAviso,
        usuario_id: int,
        condominio_id: int,
        service: AvisoService,
        arquivo: UploadFile | None = None,
    ):
        try:
            dados = AvisoCreate(titulo=titulo, descricao=descricao, categoria=categoria)
        except PydanticValidationError as e:
            # Captura erros do validador (como o strip_whitespace ou min_length)
            # e retorna uma mensagem amigável
            erro = e.errors()[0]
            msg = erro.get("msg", "Dados inválidos.")
            # Remove o prefixo "Value error, " se existir (gerado pelo Pydantic)
            msg = msg.replace("Value error, ", "")
            raise ValidationError(nome="validacao_aviso", mensagem=msg)

        arquivo_bytes = None
        filename = None
        if arquivo:
            arquivo_bytes = await arquivo.read()
            filename = arquivo.filename

        novo_aviso = await service.criar_aviso(
            dados=dados,
            condominio_id=condominio_id,
            usuario_id=usuario_id,
            arquivo_pdf=arquivo_bytes,
            filename=filename,
        )

        return StandardResponse(
            message="Aviso criado com sucesso.",
            status_code=status.HTTP_201_CREATED,
            data=novo_aviso,
        )

    @staticmethod
    async def listar_avisos(
        condominio_id: int,
        categoria: str | None,
        limit: int,
        offset: int,
        service: AvisoService,
    ):
        total, items = await service.listar_avisos(
            condominio_id, categoria, limit, offset
        )

        return StandardResponse(
            message="Avisos listados com sucesso.",
            status_code=status.HTTP_200_OK,
            data={"total": total, "items": items},
        )

    @staticmethod
    async def obter_detalhes(aviso_id: int, condominio_id: int, service: AvisoService):
        aviso = await service.obter_detalhes(aviso_id, condominio_id)

        return StandardResponse(
            message="Detalhes do aviso obtidos.",
            status_code=status.HTTP_200_OK,
            data=aviso,
        )

    @staticmethod
    async def obter_url_anexo(aviso_id: int, condominio_id: int, service: AvisoService):
        url = await service.gerar_url_anexo(aviso_id, condominio_id)

        return StandardResponse(
            message="URL do anexo gerada.",
            status_code=status.HTTP_200_OK,
            data={"url": url},
        )

    @staticmethod
    async def deletar_aviso(aviso_id: int, condominio_id: int, service: AvisoService):
        await service.deletar_aviso(aviso_id, condominio_id)

        return StandardResponse(
            message="Aviso removido com sucesso.", status_code=status.HTTP_200_OK
        )

    @staticmethod
    async def atualizar_aviso(
        aviso_id: int,
        condominio_id: int,
        usuario_id: int,
        dados: AvisoUpdate,
        service: AvisoService,
    ):
        aviso = await service.atualizar_aviso(
            aviso_id=aviso_id,
            condominio_id=condominio_id,
            dados=dados,
            usuario_id=usuario_id,
        )

        return StandardResponse(
            message="Aviso atualizado com sucesso.",
            status_code=status.HTTP_200_OK,
            data=aviso,
        )
