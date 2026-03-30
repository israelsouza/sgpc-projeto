import pytest


@pytest.mark.anyio
async def test_health_check_retorna_200(client):
    """Verifica se o endpoint /health retorna status 200."""
    response = await client.get("/api/health")

    assert response.status_code == 200


@pytest.mark.anyio
async def test_health_check_retorna_status_ok(client):
    """Verifica se o endpoint /health retorna o body correto."""
    response = await client.get("/api/health")

    assert response.json() == {"status": "ok"}
