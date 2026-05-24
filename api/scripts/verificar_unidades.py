import asyncio
import os
import sys

# Adiciona a raiz da API ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()

    print("📊 Verificando unidades existentes no banco...")
    try:
        units = await db.unidade.find_many(include={"condominio": True})
        print(f"{'ID':<5} | {'UNIDADE':<10} | {'BLOCO':<10} | {'CONDOMÍNIO'}")
        print("-" * 50)
        for u in units:
            print(f"{u.id:<5} | {u.unidade:<10} | {u.bloco or 'N/A':<10} | {u.condominio.nome}")
        
        if not units:
            print("Nenhuma unidade encontrada.")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
