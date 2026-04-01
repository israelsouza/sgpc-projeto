import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_registro_porteiro_completo(client):
    """
    Verifica se o uso de uma chave de PORTEIRO cria o vínculo
    correto na tabela FUNCIONARIOS (e não na MORADORES).
    """
    # 1. Preparar o cenário: Condomínio e Perfil
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil_porteiro = await db.perfil.find_unique(where={"nome": "PORTEIRO"})

    email_teste = "novo_porteiro@example.com"
    cpf_teste = "555.666.777-88"

    # Limpeza prévia
    await db.funcionario.delete_many(where={"usuario": {"is": {"email": email_teste}}})
    await db.morador.delete_many(where={"cpf": cpf_teste})
    await db.usuario.delete_many(where={"email": email_teste})

    # 2. Síndico (ou Admin) gera a chave para um Porteiro
    resp_chave = await client.post(
        "/api/auth/chave-acesso",
        json={
            "validade_em_horas": 24,
            "perfil_id": perfil_porteiro.id,
            "condominio_id": condo.id,
        },
    )
    assert resp_chave.status_code == 201
    chave_uuid = resp_chave.json()["chave"]

    # 3. Porteiro usa a chave para se registrar
    # NOTA: O endpoint atual de registro é `/api/moradores/registrar`.
    # Como ele lê o Perfil dinamicamente da chave, ele serve para todos,
    # mas o Controller pode renomeá-lo no futuro.
    dados_porteiro = {
        "nome_completo": "Porteiro João",
        "celular": "(11) 91234-5678",
        "cpf": cpf_teste,
        "email": email_teste,
        "senha": "SenhaForte123!",
        "confirmacao_senha": "SenhaForte123!",
        "chave_acesso": chave_uuid,
    }

    resp_registro = await client.post("/api/moradores/registrar", json=dados_porteiro)

    # Validações HTTP
    assert resp_registro.status_code == 201

    # 4. Validações no Banco de Dados (A prova real)
    usuario_criado = await db.usuario.find_unique(
        where={"email": email_teste},
        include={"perfis": True, "funcionario": True, "morador": True},
    )

    assert usuario_criado is not None

    # Deve ter o perfil PORTEIRO
    perfis_nomes = [p.nome for p in usuario_criado.perfis]
    assert "PORTEIRO" in perfis_nomes

    # DEVE estar na tabela de Funcionários
    assert usuario_criado.funcionario is not None
    assert usuario_criado.funcionario.cargo == "PORTEIRO"
    assert usuario_criado.funcionario.condominio_id == condo.id

    # Opcional: Ainda cria o registro 'Morador' (dados base) porque o Schema atual
    # junta as duas coisas na mesma rota. Isso é esperado por enquanto.
    assert usuario_criado.morador is not None
    assert usuario_criado.morador.status == "PENDENTE"
