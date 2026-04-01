from datetime import UTC, datetime

import pytest

from app.db.prisma_client import db


@pytest.mark.anyio
async def test_soft_delete_morador():
    """
    Verifica o comportamento de Soft Delete:
    Um registro de morador não deve ser apagado do banco fisicamente,
    mas sim ter o campo 'deletado_em' preenchido.
    """
    cpf_teste = "999.888.777-66"

    # 1. Limpeza e Criação
    await db.morador.delete_many(where={"cpf": cpf_teste})

    morador_criado = await db.morador.create(
        data={
            "nome_completo": "Morador para Deletar",
            "celular": "(11) 90000-0000",
            "cpf": cpf_teste,
            "status": "ATIVO",
        }
    )

    # 2. Simular exclusão via Soft Delete
    agora = datetime.now(UTC)
    morador_deletado = await db.morador.update(
        where={"id": morador_criado.id}, data={"deletado_em": agora}
    )

    assert morador_deletado.deletado_em is not None

    # 3. Validar se o registro ainda existe fisicamente no banco
    morador_banco = await db.morador.find_unique(where={"id": morador_criado.id})
    assert morador_banco is not None
    assert morador_banco.deletado_em is not None

    # Limpeza Física Real
    await db.morador.delete(where={"id": morador_criado.id})
