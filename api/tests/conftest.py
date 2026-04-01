import pytest
from httpx import ASGITransport, AsyncClient

from app.db.prisma_client import connect_db, disconnect_db
from index import app


@pytest.fixture(autouse=True)
async def setup_db():
    """Conecta ao banco de dados antes de cada teste e desconecta depois."""
    await connect_db()
    yield
    await disconnect_db()


@pytest.fixture()
async def client():
    """Client de teste assíncrono para a API FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test", timeout=60.0
    ) as ac:
        yield ac
