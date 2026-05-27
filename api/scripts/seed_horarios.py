import asyncio

from prisma import Prisma


async def seed_horarios():
    db = Prisma()
    await db.connect()

    espacos = await db.espaco.find_many()

    if not espacos:
        print("Nenhum espaço encontrado. Rode o script seed_espacos.py primeiro.")
        await db.disconnect()
        return

    horarios_padrao = [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
    ]

    print("Iniciando o seed de horários...")

    for espaco in espacos:
        print(f"Gerando horários para: {espaco.nome}")
        for h in horarios_padrao:
            # Verifica se o horário já existe para este espaço
            existente = await db.horario.find_first(
                where={"espaco_id": espaco.id, "horario": h}
            )

            if not existente:
                await db.horario.create(data={"espaco_id": espaco.id, "horario": h})

    print("Seed de horários concluído!")
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(seed_horarios())
