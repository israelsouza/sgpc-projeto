from unittest.mock import AsyncMock, MagicMock

import pytest

from app.modules.aviso.aviso_schema import AvisoCreate, CategoriaAviso
from app.modules.aviso.aviso_service import AvisoService
from app.modules.core.interfaces import (
    PdfServiceInterface,
    PushServiceInterface,
    StorageServiceInterface,
)


@pytest.fixture
def mock_pdf_service():
    service = MagicMock(spec=PdfServiceInterface)
    service.compress_pdf.return_value = b"compressed_pdf_content"
    return service


@pytest.fixture
def mock_storage_service():
    service = MagicMock(spec=StorageServiceInterface)
    service.upload_private_file = AsyncMock(return_value="cloudinary_id_123")
    service.generate_signed_url.return_value = "https://signed.url/anexo.pdf"
    return service


@pytest.fixture
def mock_push_service():
    service = MagicMock(spec=PushServiceInterface)
    service.send_topic_push = AsyncMock(return_value=True)
    return service


@pytest.mark.anyio
async def test_criar_aviso_com_sucesso(
    db_client, mock_pdf_service, mock_storage_service, mock_push_service
):
    # Setup
    service = AvisoService(
        db=db_client,
        pdf_service=mock_pdf_service,
        storage_service=mock_storage_service,
        push_service=mock_push_service,
    )

    dados = AvisoCreate(
        titulo="Teste Aviso",
        descricao="Descricao do aviso de teste com mais de dez caracteres",
        categoria=CategoriaAviso.GERAL,
    )

    # Execução
    novo_aviso = await service.criar_aviso(
        dados=dados,
        condominio_id=1,
        usuario_id=1,
        arquivo_pdf=b"original_pdf_content",
        filename="test.pdf",
    )

    # Verificações
    assert novo_aviso.titulo == "Teste Aviso"
    assert novo_aviso.anexo_url == "cloudinary_id_123"

    # Verificar se as interfaces foram chamadas corretamente
    mock_pdf_service.compress_pdf.assert_called_once_with(b"original_pdf_content")
    mock_storage_service.upload_private_file.assert_called_once()
    mock_push_service.send_topic_push.assert_called_once()


@pytest.mark.anyio
async def test_listar_avisos_flag_recente(
    db_client, mock_pdf_service, mock_storage_service, mock_push_service
):
    service = AvisoService(
        db_client, mock_pdf_service, mock_storage_service, mock_push_service
    )

    # Criar um aviso via service
    await service.criar_aviso(
        dados=AvisoCreate(
            titulo="Aviso Recente",
            descricao="Descricao longa o suficiente",
            categoria=CategoriaAviso.URGENTE,
        ),
        condominio_id=1,
        usuario_id=1,
    )

    total, items = await service.listar_avisos(condominio_id=1)

    assert total >= 1
    assert items[0]["is_recente"] is True
