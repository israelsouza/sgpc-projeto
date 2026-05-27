import asyncio
import os
import sys

# Adiciona a raiz da API ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("🧹 Iniciando limpeza da tabela de documentos...")
    try:
        # Deletar todos os registros de documentos
        count = await db.documento.delete_many()
        print(f"✅ {count} documentos deletados com sucesso!")

        # Opcional: Limpar logs relacionados
        await db.documentolog.delete_many()
        print("✅ Logs de documentos limpos.")

    except Exception as e:
        print(f"❌ Erro ao limpar documentos: {e}")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
