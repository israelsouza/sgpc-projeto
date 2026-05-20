import asyncio
import os
import sys

# Adiciona a raiz do projeto ao path para permitir imports de 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    print("\n🏢 --- GERADOR DE CONDOMÍNIO E UNIDADES --- 🏢")

    # 1. Entrada de Dados
    nome = input("Digite o nome do Condomínio: ").strip()
    cnpj = input("Digite o CNPJ (apenas números): ").strip() or None
    endereco = input("Digite o endereço: ").strip()

    # 2. Localizar ou Criar Condomínio
    condo = None
    if cnpj:
        condo = await db.condominio.find_unique(where={"cnpj": cnpj})

    if not condo:
        # Tenta buscar por nome se o CNPJ não foi dado ou não achou
        condo = await db.condominio.find_first(where={"nome": nome})

    if condo:
        print(f"\n⚠️  Condomínio '{condo.nome}' já existe (ID: {condo.id}).")
        confirmar = input("Deseja apenas ADICIONAR UNIDADES a este condomínio? (s/n): ")
        if confirmar.lower() != "s":
            print("Operação cancelada para evitar duplicidade.")
            await db.disconnect()
            return
    else:
        # Criar novo
        condo = await db.condominio.create(
            data={"nome": nome, "cnpj": cnpj, "endereco": endereco}
        )
        print(f"✅ Condomínio '{condo.nome}' criado com sucesso!")

    # 3. Configuração de Unidades
    print("\n⚙️  Configuração de Unidades:")
    qtd_blocos = int(input("Quantos blocos deseja adicionar? (ex: 2): ") or 1)
    unidades_por_bloco = int(input("Quantas unidades por bloco? (ex: 10): ") or 1)

    letras_blocos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    count_novas = 0
    count_existentes = 0

    print(f"⏳ Processando unidades para o condomínio {condo.id}...")

    for i in range(qtd_blocos):
        bloco = letras_blocos[i] if i < len(letras_blocos) else f"B{i}"
        for num in range(1, unidades_por_bloco + 1):
            andar = (num - 1) // 10 + 1
            unidade_nome = f"{andar}{str((num - 1) % 10 + 1).zfill(2)}"

            # Verifica se a unidade já existe para este condomínio
            existente = await db.unidade.find_first(
                where={
                    "unidade": unidade_nome,
                    "bloco": bloco,
                    "condominio_id": condo.id,
                }
            )

            if not existente:
                await db.unidade.create(
                    data={
                        "unidade": unidade_nome,
                        "bloco": bloco,
                        "andar": andar,
                        "condominio_id": condo.id,
                    }
                )
                count_novas += 1
            else:
                count_existentes += 1

    print("\n✨ Resumo da Operação:")
    print(f"   - Novas unidades criadas: {count_novas}")
    print(f"   - Unidades já existentes (puladas): {count_existentes}")
    print("✅ Operação finalizada com sucesso!")

    await db.disconnect()


if __name__ == "__main__":
    if not sys.stdin.isatty():
        print("Este script precisa de um terminal interativo.")
    else:
        asyncio.run(main())
