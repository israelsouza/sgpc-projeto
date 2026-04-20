import asyncio

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    email = "apps.sites.sistematico@gmail.com"

    # Busca o usuário e seus vínculos
    usuario = await db.usuario.find_unique(
        where={"email": email}, include={"morador": True, "funcionario": True}
    )

    if not usuario:
        print(f"❌ Usuário com e-mail '{email}' não encontrado no banco de dados.")
        await db.disconnect()
        return

    # Atualiza o status na tabela principal USUARIOS
    await db.usuario.update(where={"email": email}, data={"status": "ATIVO"})
    print("✅ Status do 'Usuario' atualizado para ATIVO.")

    # Atualiza o status na tabela MORADORES, se existir
    if usuario.morador:
        await db.morador.update(
            where={"id": usuario.morador.id}, data={"status": "ATIVO"}
        )
        print("✅ Status do 'Morador' atualizado para ATIVO.")

    # Atualiza o status na tabela FUNCIONARIOS, se existir
    if usuario.funcionario:
        await db.funcionario.update(
            where={"id": usuario.funcionario.id}, data={"status": "ATIVO"}
        )
        print("✅ Status do 'Funcionario' atualizado para ATIVO.")

    await db.disconnect()
    print("🚀 Alteração concluída com sucesso!")


if __name__ == "__main__":
    asyncio.run(main())