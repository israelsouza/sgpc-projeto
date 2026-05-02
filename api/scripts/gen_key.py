import argparse
import asyncio
import uuid
from datetime import UTC, datetime, timedelta

from prisma import Prisma

"""
Formas de executar o script:

- Padrão: gera para todos os perfis padrão:
    poetry run python gen_key.py

- Usando flags específicas:
    poetry run python gen_key.py --perfil=MORADOR --condominio=1 --unidade=23
"""


async def gerar_chave(perfil_nome, db, condominio_id: int = 1, unidade_id: int = None):
    # Mapeamento dinâmico buscando pelo nome do perfil
    perfil = await db.perfil.find_unique(where={"nome": perfil_nome.upper()})
    if not perfil:
        print(f"❌ Perfil {perfil_nome} não encontrado no banco.")
        return None

    chave_uuid = str(uuid.uuid4())
    validade = datetime.now(UTC) + timedelta(hours=48)

    # Se for morador e não informou unidade, assume 1 como padrão (comportamento legado)
    if perfil_nome.upper() == "MORADOR" and unidade_id is None:
        unidade_id = 1

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
    parser = argparse.ArgumentParser(description="Gerador de Chaves de Acesso SGPC")
    parser.add_argument(
        "--perfil", type=str, help="Perfil específico para gerar a chave"
    )
    parser.add_argument(
        "--condominio", type=int, default=1, help="ID do condomínio (padrão: 1)"
    )
    parser.add_argument("--unidade", type=int, help="ID da unidade (opcional)")
    parser.add_argument(
        "perfil_legado",
        nargs="?",
        type=str,
        help="Perfil (argumento posicional para compatibilidade)",
    )

    args = parser.parse_args()

    db = Prisma()
    await db.connect()

    perfis_disponiveis = ["ADMIN", "SINDICO", "MORADOR", "PORTEIRO"]

    # Prioridade: 1. Flag --perfil | 2. Argumento posicional | 3. Todos os perfis
    if args.perfil:
        perfis_alvo = [args.perfil.upper()]
    elif args.perfil_legado:
        perfis_alvo = [args.perfil_legado.upper()]
    else:
        perfis_alvo = perfis_disponiveis

    print(f"🔑 Gerando chaves para: {', '.join(perfis_alvo)}")
    print(f"🏢 Condomínio ID: {args.condominio}")
    if args.unidade:
        print(f"🏠 Unidade ID: {args.unidade}")

    for perfil in perfis_alvo:
        resultado = await gerar_chave(
            perfil, db, condominio_id=args.condominio, unidade_id=args.unidade
        )
        if resultado:
            uuid_chave, nome = resultado
            print(f"✅ {nome}: {uuid_chave}")

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
