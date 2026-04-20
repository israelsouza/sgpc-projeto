import uuid

import pytest
from httpx import AsyncClient

from app.modules.core.security import hash_senha


@pytest.mark.anyio
async def test_solicitar_recuperacao_email_inexistente(client: AsyncClient):
    response = await client.post(
        "/api/auth/recuperar-senha",
        json={"email": f"naoexiste_{uuid.uuid4()}@exemplo.com"},
    )
    assert response.status_code == 200
    assert (
        response.json()["message"]
        == "Se o e-mail existir na base, um código será enviado."
    )


@pytest.mark.anyio
async def test_fluxo_recuperacao_completo(client: AsyncClient, db_client):
    # 1. Criar um usuário ativo com e-mail único para o teste
    email = f"user_{uuid.uuid4().hex[:8]}@teste.com"
    senha_antiga = "senha123"

    usuario = await db_client.usuario.create(
        data={
            "email": email,
            "senha": hash_senha(senha_antiga),
            "status": "ATIVO",
            "morador": {
                "create": {
                    "nome_completo": "Usuário Teste",
                    "celular": f"119{uuid.uuid4().hex[:8]}",
                    "cpf": f"{uuid.uuid4().int}"[:11],
                    "data_nascimento": "1990-01-01",
                    "status": "ATIVO",
                }
            },
        }
    )

    # 2. Solicitar recuperação
    response = await client.post("/api/auth/recuperar-senha", json={"email": email})
    assert response.status_code == 200

    # 3. Buscar o código no banco
    recuperacao = await db_client.recuperacaosenha.find_first(
        where={"usuario_id": usuario.id, "usada": False}
    )
    assert recuperacao is not None
    codigo = recuperacao.codigo

    # 4. Validar código
    response = await client.post(
        "/api/auth/validar-codigo", json={"email": email, "codigo": codigo}
    )
    assert response.status_code == 200
    assert response.json()["data"]["valido"] is True

    # 5. Resetar senha
    nova_senha = "nova_senha_456"
    response = await client.post(
        "/api/auth/resetar-senha",
        json={"email": email, "codigo": codigo, "nova_senha": nova_senha},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Sua senha foi alterada com sucesso."

    # 6. Tentar login com a nova senha
    response = await client.post(
        "/api/auth/login", json={"email": email, "senha": nova_senha}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()["data"]

    # 7. Tentar usar o mesmo código novamente (deve falhar)
    response = await client.post(
        "/api/auth/validar-codigo", json={"email": email, "codigo": codigo}
    )
    assert response.status_code == 400
    assert response.json()["nome"] == "codigo_invalido"
