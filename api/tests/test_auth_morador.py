import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_fluxo_registro_morador_completo(client, admin_token):
    """
    Testa o fluxo completo de registro de um morador:
    1. Geração de chave de acesso (Síndico)
    2. Registro do morador usando a chave
    3. Verificação se o usuário e morador foram criados com status correto
    """

    # --- 0. Limpeza prévia ---
    email_teste = "morador_teste@example.com"
    cpf_teste = "123.456.789-00"

    # Limpeza segura usando delete_many
    await db.morador.delete_many(where={"cpf": cpf_teste})
    await db.usuario.delete_many(where={"email": email_teste})

    # --- 1. Gerar Chave de Acesso ---
    # Precisamos buscar o condomínio e o perfil criados no conftest
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil = await db.perfil.find_unique(where={"nome": "MORADOR"})

    resp_chave = await client.post(
        "/api/auth/chave-acesso",
        json={
            "validade_em_horas": 1,
            "perfil_id": perfil.id,
            "condominio_id": condo.id,
            "unidade_id": 1,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp_chave.status_code == 201
    chave_data = resp_chave.json()
    chave_uuid = chave_data["data"]["chave"]
    assert chave_uuid is not None
    # --- 2. Registrar Morador ---
    dados_morador = {
        "nome_completo": "Morador de Teste Silva",
        "celular": "(11) 98888-7777",
        "rg": "12.345.678-9",
        "cpf": cpf_teste,
        "data_nascimento": "1990-01-01T00:00:00",
        "email": email_teste,
        "senha": "SenhaForte123!",
        "confirmacao_senha": "SenhaForte123!",
        "chave_acesso": chave_uuid,
    }

    resp_registro = await client.post("/api/moradores/registrar", json=dados_morador)
    assert resp_registro.status_code == 201
    registro_data = resp_registro.json()
    assert registro_data["data"]["status"] == "PENDENTE"

    # --- 3. Tentar registrar com a mesma chave (deve falhar por chave_usada) ---
    # Usamos outros dados para garantir que o erro seja na chave
    dados_outro = dados_morador.copy()
    dados_outro["email"] = "outro@example.com"
    dados_outro["cpf"] = "999.999.999-99"

    resp_repetida = await client.post("/api/moradores/registrar", json=dados_outro)
    assert resp_repetida.status_code == 400
    assert resp_repetida.json()["nome"] == "chave_usada"

    # --- 4. Tentar Login ---
    login_data = {"email": email_teste, "senha": "SenhaForte123!"}
    resp_login = await client.post("/api/auth/login", json=login_data)
    assert resp_login.status_code == 200
    token_data = resp_login.json()
    assert "access_token" in token_data["data"]


@pytest.mark.anyio
async def test_registro_morador_senhas_diferentes(client):
    """Verifica se o erro de confirmação de senha funciona."""
    dados_morador = {
        "nome_completo": "Morador Erro Senha",
        "celular": "(11) 98888-7777",
        "cpf": "000.000.000-01",
        "email": "erro_senha@example.com",
        "senha": "Senha123!",
        "confirmacao_senha": "SenhaDiferente!",
        "chave_acesso": "qualquer-chave",
    }

    resp = await client.post("/api/moradores/registrar", json=dados_morador)
    assert resp.status_code == 422
