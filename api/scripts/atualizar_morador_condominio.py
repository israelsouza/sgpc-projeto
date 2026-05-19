import argparse
import asyncio

from prisma import Prisma


async def main():
    parser = argparse.ArgumentParser(
        description="Atualiza o nome de um usuário (morador ou funcionário) e o nome do seu condomínio."
    )
    parser.add_argument(
        "--email", type=str, required=True, help="O e-mail da conta do usuário."
    )
    parser.add_argument("--nome", type=str, help="O novo nome completo para o usuário.")
    parser.add_argument("--condominio", type=str, help="O novo nome para o condomínio.")

    args = parser.parse_args()
    email = args.email
    novo_nome = args.nome
    novo_nome_condominio = args.condominio

    if not novo_nome and not novo_nome_condominio:
        print(
            "⚠️  Você precisa fornecer pelo menos um novo nome (--nome) ou novo condomínio (--condominio) para atualizar."
        )
        return

    db = Prisma()
    await db.connect()

    try:
        # Busca o usuário e traz os vínculos (morador com unidade/condomínio, e funcionário com condomínio)
        usuario = await db.usuario.find_unique(
            where={"email": email},
            include={
                "morador": {"include": {"unidade": {"include": {"condominio": True}}}},
                "funcionario": {"include": {"condominio": True}},
            },
        )

        if not usuario:
            print(f"❌ Nenhum usuário encontrado associado ao e-mail '{email}'.")
            return

        if not usuario.morador and not usuario.funcionario:
            print(
                f"❌ O e-mail '{email}' não está vinculado a um morador nem a um funcionário."
            )
            return

        # Lógica para MORADOR
        if usuario.morador:
            print("👤 Vínculo identificado: MORADOR")
            morador = usuario.morador

            if novo_nome:
                await db.morador.update(
                    where={"id": morador.id}, data={"nome_completo": novo_nome}
                )
                print(f"✅ Nome do morador atualizado para: '{novo_nome}'.")

            if novo_nome_condominio:
                if not morador.unidade or not morador.unidade.condominio:
                    print(
                        f"⚠️  O morador (E-mail: {email}) não está vinculado a nenhuma unidade/condomínio para ser atualizado."
                    )
                else:
                    condominio_id = morador.unidade.condominio.id
                    await db.condominio.update(
                        where={"id": condominio_id}, data={"nome": novo_nome_condominio}
                    )
                    print(
                        f"✅ Nome do condomínio (ID: {condominio_id}) atualizado para: '{novo_nome_condominio}'."
                    )

        # Lógica para FUNCIONARIO
        elif usuario.funcionario:
            print("👔 Vínculo identificado: FUNCIONÁRIO")
            funcionario = usuario.funcionario

            if novo_nome:
                await db.funcionario.update(
                    where={"id": funcionario.id}, data={"nome_completo": novo_nome}
                )
                print(f"✅ Nome do funcionário atualizado para: '{novo_nome}'.")

            if novo_nome_condominio:
                if not funcionario.condominio:
                    print(
                        f"⚠️  O funcionário (E-mail: {email}) não está vinculado a nenhum condomínio para ser atualizado."
                    )
                else:
                    condominio_id = funcionario.condominio.id
                    await db.condominio.update(
                        where={"id": condominio_id}, data={"nome": novo_nome_condominio}
                    )
                    print(
                        f"✅ Nome do condomínio (ID: {condominio_id}) atualizado para: '{novo_nome_condominio}'."
                    )

        print("🚀 Processo de atualização finalizado!")
    except Exception as e:
        print(f"❌ Ocorreu um erro durante a atualização: {e}")
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
