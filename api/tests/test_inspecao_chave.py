import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_inspecao_chave_morador_valida(client, admin_token):
    """Verifica se o endpoint público retorna os dados corretos de uma chave de morador."""
    # 1. Gerar Chave
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil = await db.perfil.find_unique(where={"nome": "MORADOR"})

    resp_gerar = await client.post(
        "/api/chaves/gerar",
        json={
            "validade_em_horas": 1,
            "perfil_id": perfil.id,
            "condominio_id": condo.id,
            "unidade_id": 1,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    chave_uuid = resp_gerar.json()["data"]["chave"]

    # 2. Inspecionar (Endpoint Público)
    resp_valida = await client.get(f"/api/chaves/validar/{chave_uuid}")

    assert resp_valida.status_code == 200
    data = resp_valida.json()["data"]
    assert data["perfil"] == "MORADOR"
    assert data["condominio"] == "Condomínio de Teste"
    assert data["unidade"] == "101"


@pytest.mark.anyio
async def test_inspecao_chave_invalida(client):
    """Verifica erro ao inspecionar chave inexistente."""
    resp = await client.get("/api/chaves/validar/uuid-inexistente")
    assert resp.status_code == 400
    assert resp.json()["nome"] == "chave_invalida"
