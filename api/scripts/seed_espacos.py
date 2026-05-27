import asyncio

from prisma import Prisma


async def seed_espacos():
    db = Prisma()
    await db.connect()

    espacos = [
        {"nome": "Academia", "icone": "dumbbell", "cor": "#9ED99C"},
        {"nome": "Espaço Kids", "icone": "child", "cor": "#FFD700"},
        {"nome": "Área de Lazer", "icone": "tree", "cor": "#87CEEB"},
    ]

    print("Iniciando o seed de espaços...")

    for espaco_data in espacos:
        # Verifica se já existe um espaço com esse nome para evitar duplicidade
        existente = await db.espaco.find_first(where={"nome": espaco_data["nome"]})

        if not existente:
            novo_espaco = await db.espaco.create(data=espaco_data)
            print(f"Espaço criado: {novo_espaco.nome}")
        else:
            print(f"Espaço já existe: {existente.nome}")

    await db.disconnect()
    print("Seed de espaços concluído!")


if __name__ == "__main__":
    asyncio.run(seed_espacos())
