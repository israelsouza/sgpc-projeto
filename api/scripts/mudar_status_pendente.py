import argparse
import asyncio

from prisma import Prisma


async def main():
    parser = argparse.ArgumentParser(
        description="Altera o status de um usuário para PENDENTE ou ATIVO."
    )
    parser.add_argument(
        "--email",
        type=str,
        required=True,
        help="O e-mail do usuário cujo status será alterado.",
    )
    parser.add_argument(
        "--status",
        type=str,
        choices=["ATIVO", "PENDENTE", "INATIVO"],
        default="PENDENTE",
        help="O status a ser definido (padrão: PENDENTE).",
    )

    args = parser.parse_args()
    email = args.email
    novo_status = args.status

    db = Prisma()
    await db.connect()

    try:
        # Busca o usuário e seus vínculos
        usuario = await db.usuario.find_unique(
            where={"email": email}, include={"morador": True, "funcionario": True}
        )

        if not usuario:
            print(f"❌ Usuário com e-mail '{email}' não encontrado no banco de dados.")
            return

        # Atualiza o status na tabela principal USUARIOS
        await db.usuario.update(where={"email": email}, data={"status": novo_status})
        print(f"✅ Status do 'Usuario' atualizado para {novo_status}.")

        # Atualiza o status na tabela MORADORES, se existir
        if usuario.morador:
            await db.morador.update(
                where={"id": usuario.morador.id}, data={"status": novo_status}
            )
            print(f"✅ Status do 'Morador' atualizado para {novo_status}.")

        # Atualiza o status na tabela FUNCIONARIOS, se existir
        if usuario.funcionario:
            await db.funcionario.update(
                where={"id": usuario.funcionario.id}, data={"status": novo_status}
            )
            print(f"✅ Status do 'Funcionario' atualizado para {novo_status}.")

        print("🚀 Alteração concluída com sucesso!")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
