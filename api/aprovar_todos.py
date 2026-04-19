import asyncio

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("🔄 Aprovando todos os moradores pendentes...")
    res_moradores = await db.morador.update_many(
        where={"status": "PENDENTE"}, data={"status": "ATIVO"}
    )
    print(f"✅ {res_moradores} moradores atualizados para ATIVO.")

    print("🔄 Aprovando todos os funcionários pendentes...")
    res_funcionarios = await db.funcionario.update_many(
        where={"status": "PENDENTE"}, data={"status": "ATIVO"}
    )
    print(f"✅ {res_funcionarios} funcionários atualizados para ATIVO.")

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
