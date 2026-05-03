from datetime import UTC, datetime, timedelta

import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_registro_morador_chave_expirada(client):
    """
    Verifica se o sistema rejeita o registro de um morador caso a
    chave de acesso utilizada já esteja com a data de validade no passado.
    """
    # 1. Preparar o cenário: Buscar o condomínio e o perfil criados no conftest
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil_morador = await db.perfil.find_unique(where={"nome": "MORADOR"})

    # 2. Criar manualmente uma chave com validade no passado (ontem)
    validade_passada = datetime.now(UTC) - timedelta(days=1)

    chave_expirada = await db.chaveacesso.create(
        data={
            "validade": validade_passada,
            "usada": False,
            "perfil_id": perfil_morador.id,
            "condominio_id": condo.id,
        }
    )

    # 3. Tentar registrar um novo morador com essa chave
    dados_morador = {
        "nome_completo": "Morador Atrasado",
        "celular": "(11) 99999-9999",
        "rg": "12.345.678-9",
        "cpf": "111.222.333-44",
        "data_nascimento": "1990-01-01T00:00:00",
        "email": "atrasado@exemplo.com",
        "senha": "Senha123!",
        "confirmacao_senha": "Senha123!",
        "chave_acesso": chave_expirada.chave,
    }
    resp = await client.post("/api/moradores/registrar", json=dados_morador)

    # 4. Validar se o sistema bloqueou o registro
    assert resp.status_code == 400
    assert resp.json()["nome"] == "chave_expirada"
    assert "expirou" in resp.json()["mensagem"]

    # Limpeza
    await db.chaveacesso.delete(where={"id": chave_expirada.id})
