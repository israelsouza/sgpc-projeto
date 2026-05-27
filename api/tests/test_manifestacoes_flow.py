import pytest

from app.modules.core.auth import create_access_token


@pytest.mark.anyio
async def test_criar_e_listar_manifestacao(client, db_client):
    # Setup token para o usuário admin de teste criado no conftest (ID 1 geralmente)
    # No conftest, o admin é admin@teste.com
    admin = await db_client.usuario.find_unique(where={"email": "admin@teste.com"})
    token = create_access_token(data={"sub": str(admin.id)})
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Criar manifestação
    payload = {
        "assunto": "Assunto de Teste",
        "mensagem": "Mensagem de teste com mais de cinco caracteres",
        "unidade": "101",
        "bloco": "A",
        "andar": 1,
        "categoria": "solicitacao",
        "hora_criacao": "10:00",
    }

    response = await client.post(
        "/api/manifestacao/criar-manifestacao", json=payload, headers=headers
    )
    assert response.status_code == 200

    # 2. Listar manifestações
    response = await client.get(
        "/api/manifestacao/listar-manifestacoes", headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(m["assunto"] == "Assunto de Teste" for m in data)
