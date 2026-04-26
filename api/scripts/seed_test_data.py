import asyncio
import os
import sys

# Adiciona a raiz do projeto ao path para permitir imports de 'app'
# Como o script está em api/, o dirname dele já é a raiz api/
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.modules.core.security import hash_senha
from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("🌱 Iniciando seed de dados de teste...")

    # Emails e CPFs que vamos usar (para limpeza e criação)
    test_emails = ["joao@exemplo.com", "maria@exemplo.com", "carlos@exemplo.com"]
    test_cpfs = ["11111111111", "22222222222", "33333333333"]

    print("🧹 Limpando dados de teste antigos para evitar conflitos...")
    try:
        # A ordem de deleção importa por causa das FKs
        await db.morador.delete_many(where={"cpf": {"in": test_cpfs}})
        await db.funcionario.delete_many(where={"cpf": {"in": test_cpfs}})
        await db.usuario.delete_many(where={"email": {"in": test_emails}})
    except Exception as e:
        print(f"⚠️ Aviso durante limpeza: {e}")

    # 1. Condomínio
    condominio = await db.condominio.upsert(
        where={"cnpj": "00000000000199"},
        data={
            "create": {
                "nome": "Condomínio Exemplo",
                "cnpj": "00000000000199",
                "endereco": "Rua de Teste, 123",
            },
            "update": {"nome": "Condomínio Exemplo"},
        },
    )

    # 2. Unidade
    unidade = await db.unidade.upsert(
        where={"id": 1},
        data={
            "create": {
                "id": 1,
                "unidade": "101",
                "bloco": "A",
                "condominio_id": condominio.id,
            },
            "update": {"unidade": "101"},
        },
    )

    # 3. Perfis
    perfil_morador = await db.perfil.find_unique(where={"nome": "MORADOR"})
    perfil_porteiro = await db.perfil.find_unique(where={"nome": "PORTEIRO"})
    perfil_sindico = await db.perfil.find_unique(where={"nome": "SINDICO"})

    if not all([perfil_morador, perfil_porteiro, perfil_sindico]):
        print(
            "❌ Perfis base não encontrados. Certifique-se de que o sistema foi inicializado corretamente."
        )
        await db.disconnect()
        return

    senha_hash = hash_senha("senha123")

    # 4. Criação dos Usuários e Entidades (Morador/Funcionário)

    # Morador
    u_morador = await db.usuario.create(
        data={
            "email": "joao@exemplo.com",
            "senha": senha_hash,
            "status": "ATIVO",
            "perfis": {"connect": [{"id": perfil_morador.id}]},
        }
    )
    await db.morador.create(
        data={
            "nome_completo": "João Silva",
            "celular": "11999999999",
            "rg": "12345678",
            "cpf": "11111111111",
            "data_nascimento": "01011990",
            "status": "ATIVO",
            "usuario_id": u_morador.id,
            "unidade_id": unidade.id,
        }
    )

    # Porteiro
    u_porteiro = await db.usuario.create(
        data={
            "email": "maria@exemplo.com",
            "senha": senha_hash,
            "status": "ATIVO",
            "perfis": {"connect": [{"id": perfil_porteiro.id}]},
        }
    )
    await db.funcionario.create(
        data={
            "nome_completo": "Maria Souza",
            "celular": "11988888888",
            "rg": "87654321",
            "cpf": "22222222222",
            "data_nascimento": "15051985",
            "cargo": "PORTEIRO",
            "status": "ATIVO",
            "usuario_id": u_porteiro.id,
            "condominio_id": condominio.id,
        }
    )

    # Síndico
    u_sindico = await db.usuario.create(
        data={
            "email": "carlos@exemplo.com",
            "senha": senha_hash,
            "status": "ATIVO",
            "perfis": {"connect": [{"id": perfil_sindico.id}]},
        }
    )
    await db.funcionario.create(
        data={
            "nome_completo": "Carlos Oliveira",
            "celular": "11977777777",
            "rg": "11223344",
            "cpf": "33333333333",
            "data_nascimento": "20101975",
            "cargo": "SINDICO",
            "status": "ATIVO",
            "usuario_id": u_sindico.id,
            "condominio_id": 4,
        }
    )

    print("✅ Seed finalizado com sucesso!")
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
