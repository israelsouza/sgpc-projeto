import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.modules.core.core_exception import ValidationError
from app.modules.core.interfaces import PdfServiceInterface, StorageServiceInterface
from app.modules.documento.documento_schema import DocumentoCreate
from app.modules.documento.documento_service import DocumentoService


@pytest.fixture
def mock_pdf_service():
    service = MagicMock(spec=PdfServiceInterface)
    service.compress_pdf.return_value = b"compressed_pdf_content"
    return service


@pytest.fixture
def mock_storage_service():
    service = MagicMock(spec=StorageServiceInterface)
    # Retorna um ID único para cada chamada para evitar erro de unique constraint no banco
    service.upload_private_file = AsyncMock(
        side_effect=lambda *args, **kwargs: f"cloudinary_id_{uuid.uuid4()}"
    )
    service.generate_signed_url.return_value = "https://signed.url/documento.pdf"
    service.delete_file = AsyncMock(return_value=True)
    return service


@pytest.fixture
def pdf_minimal():
    # Minimal valid PDF structure that fitz can open
    return b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"


@pytest.mark.anyio
async def test_criar_documento_com_sucesso(
    db_client, mock_pdf_service, mock_storage_service, pdf_minimal
):
    # Setup
    service = DocumentoService(
        db=db_client,
        pdf_service=mock_pdf_service,
        storage_service=mock_storage_service,
    )

    dados = DocumentoCreate(
        titulo="Ata de Assembleia",
        descricao="Ata da assembleia realizada em 10/05/2026",
        categoria="Financeiro",
    )

    # Execução
    novo_doc = await service.criar_documento(
        dados=dados,
        arquivo_pdf=pdf_minimal,
        filename="ata.pdf",
        condominio_id=1,
        usuario_id=1,
        ip_address="127.0.0.1",
    )

    # Verificações
    assert novo_doc.titulo == "Ata de Assembleia"
    assert novo_doc.file_id.startswith("cloudinary_id_")
    assert novo_doc.filename_orig == "ata.pdf"

    # Verificar se as interfaces foram chamadas corretamente
    mock_pdf_service.compress_pdf.assert_called_once()
    mock_storage_service.upload_private_file.assert_called_once()


@pytest.mark.anyio
async def test_criar_documento_tamanho_excedido(
    db_client, mock_pdf_service, mock_storage_service
):
    service = DocumentoService(db_client, mock_pdf_service, mock_storage_service)
    dados = DocumentoCreate(titulo="Grande", categoria="Teste")
    arquivo_grande = b"0" * (16 * 1024 * 1024)  # 16MB

    with pytest.raises(ValidationError) as exc:
        await service.criar_documento(dados, arquivo_grande, "big.pdf", 1, 1)

    assert exc.value.nome == "tamanho_invalido"


@pytest.mark.anyio
async def test_criar_documento_tipo_invalido(
    db_client, mock_pdf_service, mock_storage_service
):
    service = DocumentoService(db_client, mock_pdf_service, mock_storage_service)
    dados = DocumentoCreate(titulo="Imagem", categoria="Teste")
    arquivo_fake = b"not a pdf content"

    with pytest.raises(ValidationError) as exc:
        await service.criar_documento(dados, arquivo_fake, "img.jpg", 1, 1)

    assert exc.value.nome == "tipo_invalido"


@pytest.mark.anyio
async def test_gerar_url_download_com_flag_cloudinary(
    db_client, mock_pdf_service, mock_storage_service, pdf_minimal
):
    service = DocumentoService(db_client, mock_pdf_service, mock_storage_service)

    # Mockando a URL de retorno para ser uma do Cloudinary
    mock_storage_service.generate_signed_url.return_value = (
        "https://res.cloudinary.com/demo/image/upload/v1/private_id"
    )

    # Criar um documento para testar o download
    novo_doc = await service.criar_documento(
        DocumentoCreate(titulo="Doc Teste", categoria="Geral"),
        pdf_minimal,
        "teste.pdf",
        1,
        1,
    )

    url = await service.gerar_url_download(novo_doc.id, 1, 1)

    assert "fl_attachment" in url
    assert "cloudinary" in url


@pytest.mark.anyio
async def test_deletar_documento(
    db_client, mock_pdf_service, mock_storage_service, pdf_minimal
):
    service = DocumentoService(db_client, mock_pdf_service, mock_storage_service)

    # Criar documento
    novo_doc = await service.criar_documento(
        DocumentoCreate(titulo="Doc para Delete", categoria="Geral"),
        pdf_minimal,
        "delete.pdf",
        1,
        1,
    )

    # Deletar
    await service.deletar_documento(novo_doc.id, 1, 1)

    # Verificar se foi removido do storage e marcado no banco
    mock_storage_service.delete_file.assert_called_once_with(novo_doc.file_id)

    # Tentar buscar detalhes deve falhar agora
    with pytest.raises(ValidationError) as exc:
        await service.obter_detalhes(novo_doc.id, 1)
    assert exc.value.nome == "documento_nao_encontrado"
