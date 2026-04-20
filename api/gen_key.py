import asyncio
import sys
import uuid
from datetime import UTC, datetime, timedelta

from prisma import Prisma


async def gerar_chave(perfil_nome, db):
    # Mapeamento dinâmico buscando pelo nome do perfil
    perfil = await db.perfil.find_unique(where={"nome": perfil_nome.upper()})
    if not perfil:
        print(f"❌ Perfil {perfil_nome} não encontrado no banco.")
        return None

    chave_uuid = str(uuid.uuid4())
    validade = datetime.now(UTC) + timedelta(hours=48)
    condominio_id = 1
    unidade_id = 1 if perfil_nome.upper() == "MORADOR" else None

    await db.chaveacesso.create(
        data={
            "chave": chave_uuid,
            "validade": validade,
            "perfil_id": perfil.id,
            "condominio_id": condominio_id,
            "unidade_id": unidade_id,
            "usada": False,
        }
    )
    return chave_uuid, perfil_nome


async def main():
    db = Prisma()
    await db.connect()

    perfis_disponiveis = ["ADMIN", "SINDICO", "MORADOR", "PORTEIRO"]

    if len(sys.argv) > 1:
        perfis_alvo = [sys.argv[1].upper()]
    else:
        perfis_alvo = perfis_disponiveis

    print(f"🔑 Gerando chaves para: {', '.join(perfis_alvo)}...")

    for perfil in perfis_alvo:
        resultado = await gerar_chave(perfil, db)
        if resultado:
            uuid_chave, nome = resultado
            print(f"✅ {nome}: {uuid_chave}")

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
