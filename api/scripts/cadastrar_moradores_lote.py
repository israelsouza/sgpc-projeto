import asyncio
import os
import sys

# Adiciona a raiz da API ao path para permitir imports de 'app' e 'prisma'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()

    print("🚀 Iniciando cadastro de novos moradores e unidades...")

    try:
        # 1. Busca o primeiro condomínio cadastrado
        condominio = await db.condominio.find_first()
        if not condominio:
            print("❌ Erro: Nenhum condomínio encontrado.")
            return

        print(f"🏢 Condomínio selecionado: {condominio.nome}")

        # 2. Dados dos novos moradores e suas unidades (Ajustados para evitar conflitos)
        novos_moradores = [
            {"nome": "Ricardo Oliveira", "unidade": "102", "bloco": "A", "cpf": "11122233344", "celular": "11911112222"},
            {"nome": "Mariana Souza", "unidade": "202", "bloco": "A", "cpf": "55566677788", "celular": "11922223333"},
            {"nome": "Carlos Alberto", "unidade": "303", "bloco": "B", "cpf": "99900011122", "celular": "11933334444"},
            {"nome": "Fernanda Lima", "unidade": "404", "bloco": "B", "cpf": "33344455566", "celular": "11944445555"},
            {"nome": "Juliana Costa", "unidade": "505", "bloco": "C", "cpf": "77788899900", "celular": "11955556666"},
        ]

        for m in novos_moradores:
            # Verifica se a unidade já existe (pela string de unidade)
            unidade = await db.unidade.find_unique(
                where={
                    "unidade": m["unidade"]
                }
            )

            if not unidade:
                unidade = await db.unidade.create(
                    data={
                        "unidade": m["unidade"],
                        "bloco": m["bloco"],
                        "condominio_id": condominio.id,
                        "andar": int(m["unidade"][0]) 
                    }
                )
                print(f"🏠 Unidade {m['unidade']} (Bloco {m['bloco']}) criada.")
            else:
                print(f"ℹ️ Unidade {m['unidade']} já existe.")

            # Verifica se o morador já existe pelo CPF
            existente = await db.morador.find_unique(where={"cpf": m["cpf"]})
            if existente:
                print(f"⚠️ Morador {m['nome']} já está cadastrado.")
                continue

            # Cria o morador
            await db.morador.create(
                data={
                    "nome_completo": m["nome"],
                    "cpf": m["cpf"],
                    "celular": m["celular"],
                    "data_nascimento": "01/01/1990",
                    "status": "ATIVO",
                    "unidade_id": unidade.id
                }
            )
            print(f"👤 Morador {m['nome']} cadastrado com sucesso na unidade {m['unidade']}.")

        print("\n✅ Processo concluído!")

    except Exception as e:
        print(f"❌ Erro ao executar o script: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
