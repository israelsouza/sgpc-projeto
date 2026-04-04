import pytest

from app.db.prisma_client import db
from app.modules.core.auth import create_access_token


@pytest.mark.anyio
async def test_sindico_nao_pode_gerar_chave_admin(client):
    """
    Testa a hierarquia de segurança:
    Um Síndico não deve conseguir gerar uma chave para o perfil ADMIN.
    """
    # 1. Preparar o cenário: Buscar o condomínio e os perfis já criados no conftest
    condo = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil_sindico = await db.perfil.find_unique(where={"nome": "SINDICO"})
    perfil_admin = await db.perfil.find_unique(where={"nome": "ADMIN"})

    # Criar um usuário Síndico para o teste
    sindico_user = await db.usuario.upsert(
        where={"email": "sindico_teste@exemplo.com"},
        data={
            "create": {
                "email": "sindico_teste@exemplo.com",
                "senha": "senha123",
                "status": "ATIVO",
                "perfis": {"connect": [{"id": perfil_sindico.id}]},
            },
            "update": {"email": "sindico_teste@exemplo.com"},
        },
    )

    # Vincular o Síndico ao Condomínio
    await db.funcionario.upsert(
        where={"usuario_id": sindico_user.id},
        data={
            "create": {
                "usuario_id": sindico_user.id,
                "condominio_id": condo.id,
                "cargo": "SINDICO",
                "status": "ATIVO",
            },
            "update": {"condominio_id": condo.id},
        },
    )

    # Gerar token para o Síndico
    token = create_access_token(
        data={
            "sub": str(sindico_user.id),
            "email": sindico_user.email,
            "roles": ["SINDICO"],
        }
    )

    # 2. Tentar gerar uma chave para ADMIN
    payload = {
        "validade_em_horas": 1,
        "perfil_id": perfil_admin.id,
        "condominio_id": condo.id,
    }

    resp = await client.post(
        "/api/auth/chave-acesso",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )

    # 3. Validar que a ação foi bloqueada
    assert resp.status_code == 400
    assert resp.json()["nome"] == "permissao_negada"
    assert "não tem permissão" in resp.json()["mensagem"]


@pytest.mark.anyio
async def test_sindico_nao_pode_gerar_chave_outro_condominio(client):
    """
    Testa o isolamento de condomínios:
    Um Síndico não deve conseguir gerar uma chave para um condomínio diferente do seu.
    """
    # 1. Preparar o cenário: Criar um segundo condomínio
    outro_condo = await db.condominio.upsert(
        where={"cnpj": "11.111.111/1111-11"},
        data={
            "create": {
                "nome": "Outro Prédio",
                "cnpj": "11.111.111/1111-11",
                "endereco": "Rua B, 456",
            },
            "update": {"nome": "Outro Prédio"},
        },
    )

    condo_base = await db.condominio.find_unique(where={"cnpj": "00.000.000/0001-99"})
    perfil_sindico = await db.perfil.find_unique(where={"nome": "SINDICO"})
    perfil_morador = await db.perfil.find_unique(where={"nome": "MORADOR"})

    # Criar o Síndico do Condomínio Base
    sindico_user = await db.usuario.upsert(
        where={"email": "sindico_base@exemplo.com"},
        data={
            "create": {
                "email": "sindico_base@exemplo.com",
                "senha": "senha123",
                "status": "ATIVO",
                "perfis": {"connect": [{"id": perfil_sindico.id}]},
            },
            "update": {"email": "sindico_base@exemplo.com"},
        },
    )

    await db.funcionario.upsert(
        where={"usuario_id": sindico_user.id},
        data={
            "create": {
                "usuario_id": sindico_user.id,
                "condominio_id": condo_base.id,
                "cargo": "SINDICO",
                "status": "ATIVO",
            },
            "update": {"condominio_id": condo_base.id},
        },
    )

    # Gerar token para o Síndico
    token = create_access_token(
        data={
            "sub": str(sindico_user.id),
            "email": sindico_user.email,
            "roles": ["SINDICO"],
        }
    )

    # 2. Tentar gerar uma chave para o Outro Condomínio
    payload = {
        "validade_em_horas": 1,
        "perfil_id": perfil_morador.id,
        "condominio_id": outro_condo.id,
    }

    resp = await client.post(
        "/api/auth/chave-acesso",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )

    # 3. Validar que foi bloqueado
    assert resp.status_code == 400
    assert resp.json()["nome"] == "permissao_negada"
    assert "só pode gerar chaves para o condomínio onde atua" in resp.json()["mensagem"]
