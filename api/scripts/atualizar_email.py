import argparse
import asyncio

from prisma.errors import UniqueViolationError

from prisma import Prisma


async def main():
    parser = argparse.ArgumentParser(
        description="Atualiza o endereço de e-mail de um usuário."
    )
    parser.add_argument(
        "--email_antigo",
        type=str,
        required=True,
        help="O e-mail atual cadastrado no sistema.",
    )
    parser.add_argument(
        "--email_novo",
        type=str,
        required=True,
        help="O novo endereço de e-mail para a conta.",
    )

    args = parser.parse_args()
    email_antigo = args.email_antigo
    email_novo = args.email_novo

    if email_antigo == email_novo:
        print(
            "⚠️  O e-mail novo fornecido é igual ao e-mail antigo. Nenhuma alteração foi feita."
        )
        return

    db = Prisma()
    await db.connect()

    try:
        # Verifica se a conta com o e-mail antigo existe
        usuario = await db.usuario.find_unique(where={"email": email_antigo})

        if not usuario:
            print(f"❌ Nenhum usuário encontrado com o e-mail '{email_antigo}'.")
            return

        # Tenta realizar a atualização
        try:
            await db.usuario.update(
                where={"id": usuario.id}, data={"email": email_novo}
            )
            print("✅ E-mail atualizado com sucesso!")
            print(f"   De:  {email_antigo}")
            print(f"   Para: {email_novo}")
        except UniqueViolationError:
            print(
                f"❌ Erro: O e-mail '{email_novo}' já está sendo utilizado por outra conta."
            )

    except Exception as e:
        print(f"❌ Ocorreu um erro inesperado durante a atualização: {e}")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
