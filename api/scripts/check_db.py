import asyncio
import os
import sys

# Adiciona a raiz do projeto ao path para permitir imports de 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("\n--- PERFIS ---")
    for p in await db.perfil.find_many():
        print(f"ID {p.id}: {p.nome}")

    print("\n--- PERMISSÕES ---")
    for p in await db.permissao.find_many():
        print(f"ID {p.id}: {p.nome}")

    print("\n--- CONDOMÍNIOS ---")
    for c in await db.condominio.find_many():
        print(f"ID {c.id}: {c.nome}")

    print("\n--- UNIDADES ---")
    for u in await db.unidade.find_many(include={"condominio": True}):
        print(
            f"ID {u.id}: {u.unidade} - Bloco {u.bloco} (Condo ID {u.condominio_id}: {u.condominio.nome})"
        )

    print("\n--- USUÁRIOS ---")
    for u in await db.usuario.find_many(
        include={"morador": {"include": {"unidade": True}}, "funcionario": True}
    ):
        condo_id = "N/A"
        if u.funcionario:
            condo_id = u.funcionario.condominio_id
        elif u.morador and u.morador.unidade:
            condo_id = u.morador.unidade.condominio_id

        print(f"ID {u.id}: {u.email} ({u.status}) | Condo ID: {condo_id}")

    print("\n--- MORADORES ---")
    # Moradores são vinculados ao condomínio através da unidade
    for m in await db.morador.find_many(include={"unidade": True}):
        condo_id = m.unidade.condominio_id if m.unidade else "N/A"
        print(f"ID {m.id}: {m.nome_completo} (CPF: {m.cpf}) | Condo ID: {condo_id}")

    print("\n--- FUNCIONÁRIOS ---")
    for f in await db.funcionario.find_many():
        print(
            f"ID {f.id}: {f.nome_completo} - Cargo: {f.cargo} | Condo ID: {f.condominio_id}"
        )

    print("\n--- CHAVES DE ACESSO ---")
    for c in await db.chaveacesso.find_many():
        print(
            f"key: {c.chave} | Condo ID: {c.condominio_id} | Usada: {c.usada} | Validade: {c.validade} "
        )

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
