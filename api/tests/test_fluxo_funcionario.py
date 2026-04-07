import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_registro_porteiro_completo(client, admin_token):
    """
    Verifica se o uso de uma chave de PORTEIRO cria o vínculo
    correto na tabela FUNCIONARIOS e não cria nada na MORADORES.
    """
    # 1. Preparar o cenário
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil_porteiro = await db.perfil.find_unique(where={"nome": "PORTEIRO"})

    email_teste = "novo_porteiro@example.com"
    cpf_teste = "555.666.777-88"

    # Limpeza prévia
    await db.funcionario.delete_many(where={"usuario": {"is": {"email": email_teste}}})
    await db.usuario.delete_many(where={"email": email_teste})

    # 2. Gerar Chave
    resp_chave = await client.post(
        "/api/auth/chave-acesso",
        json={
            "validade_em_horas": 24,
            "perfil_id": perfil_porteiro.id,
            "condominio_id": condo.id,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    chave_uuid = resp_chave.json()["chave"]

    # 3. Registrar Funcionário
    dados_porteiro = {
        "nome_completo": "Porteiro João Silva",
        "celular": "(11) 91234-5678",
        "rg": "MG-12.345.678",
        "cpf": cpf_teste,
        "data_nascimento": "1985-10-20T00:00:00",
        "email": email_teste,
        "senha": "SenhaForte123!",
        "confirmacao_senha": "SenhaForte123!",
        "chave_acesso": chave_uuid,
    }

    resp_registro = await client.post(
        "/api/funcionarios/registrar", json=dados_porteiro
    )
    assert resp_registro.status_code == 201

    # 4. Validações no Banco
    usuario_criado = await db.usuario.find_unique(
        where={"email": email_teste},
        include={"funcionario": True, "morador": True},
    )

    assert usuario_criado is not None

    # Validar Funcionário
    assert usuario_criado.funcionario is not None
    assert usuario_criado.funcionario.nome_completo == "Porteiro João Silva"
    assert usuario_criado.funcionario.cpf == cpf_teste
    assert usuario_criado.funcionario.status == "PENDENTE"

    # GARANTIR que não criou morador
    assert usuario_criado.morador is None
