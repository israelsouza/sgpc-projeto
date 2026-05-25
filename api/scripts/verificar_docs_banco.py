import asyncio
import os
import sys

# Adiciona a raiz da API ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("📊 Verificando documentos no banco...")
    try:
        docs = await db.documento.find_many(
            include={"condominio": True}, where={"deletado_em": None}
        )
        print(f"Total de documentos ativos: {len(docs)}")
        print(f"{'ID':<5} | {'TITULO':<30} | {'CONDO_ID':<8} | {'CATEGORIA'}")
        print("-" * 60)
        for d in docs:
            print(
                f"{d.id:<5} | {d.titulo[:30]:<30} | {d.condominio_id:<8} | {d.categoria}"
            )

        if not docs:
            print("Nenhum documento encontrado.")

    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
