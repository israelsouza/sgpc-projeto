import asyncio
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
        print(f"ID {u.id}: {u.unidade} - Bloco {u.bloco} ({u.condominio.nome})")

    print("\n--- USUÁRIOS ---")
    for u in await db.usuario.find_many():
        print(f"ID {u.id}: {u.email} ({u.status})")

    print("\n--- MORADORES ---")
    for m in await db.morador.find_many():
        print(f"ID {m.id}: {m.nome_completo} (CPF: {m.cpf})")

    print("\n--- FUNCIONÁRIOS ---")
    for f in await db.funcionario.find_many():
        print(f"ID {f.id}: {f.nome_completo} - Cargo: {f.cargo}")

    print("\n--- CHAVES DE ACESSO ---")
    for c in await db.chaveacesso.find_many():
        print(f"key: {c.chave} | Usada: {c.usada} | Validade: {c.validade} ")

    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
