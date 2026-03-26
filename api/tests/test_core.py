def test_health_check_retorna_200(client):
    """Verifica se o endpoint /health retorna status 200."""
    response = client.get("/api/health")

    assert response.status_code == 200


def test_health_check_retorna_status_ok(client):
    """Verifica se o endpoint /health retorna o body correto."""
    response = client.get("/api/health")

    assert response.json() == {"status": "ok"}
