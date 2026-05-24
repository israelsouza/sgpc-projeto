import asyncio

from prisma import Prisma


async def main() -> None:
    db = Prisma()
    await db.connect()

    print("🌱 Iniciando o seed do sistema SGPC...")

    # 1. Definição das permissões (Padrao: <acao>:<funcionalidade>)
    # Ações: criar, ler, atualizar, deletar
    funcionalidades = [
        "condominio",
        "unidade",
        "morador",
        "funcionario",
        "chave_acesso",
        "veiculo",
        "aviso",
        "permissao",
        "perfil",
    ]
    acoes = ["criar", "ler", "atualizar", "deletar"]

    todas_permissoes = []
    for func in funcionalidades:
        for acao in acoes:
            nome_perm = f"{acao}:{func}"
            todas_permissoes.append(
                {"nome": nome_perm, "descricao": f"Permite {acao} em {func}"}
            )

    # Criar permissões de forma idempotente
    print(f"📦 Criando {len(todas_permissoes)} permissões...")
    for perm in todas_permissoes:
        await db.permissao.upsert(
            where={"nome": perm["nome"]},
            data={"create": perm, "update": {"descricao": perm["descricao"]}},
        )

    # 2. Definição dos perfis básicos e suas permissões
    perfis_config = {
        "ADMIN": {
            "permissoes": [p["nome"] for p in todas_permissoes]  # Tudo
        },
        "SINDICO": {
            "permissoes": [
                "ler:condominio",
                "atualizar:condominio",
                "criar:unidade",
                "ler:unidade",
                "atualizar:unidade",
                "deletar:unidade",
                "criar:morador",
                "ler:morador",
                "atualizar:morador",
                "deletar:morador",
                "criar:funcionario",
                "ler:funcionario",
                "atualizar:funcionario",
                "deletar:funcionario",
                "criar:chave_acesso",
                "ler:chave_acesso",
                "atualizar:chave_acesso",
                "deletar:chave_acesso",
                "criar:veiculo",
                "ler:veiculo",
                "atualizar:veiculo",
                "deletar:veiculo",
                "criar:aviso",
                "ler:aviso",
                "atualizar:aviso",
                "deletar:aviso",
            ]
        },
        "PORTEIRO": {
            "permissoes": [
                "ler:condominio",
                "ler:unidade",
                "ler:morador",
                "criar:chave_acesso",
                "ler:chave_acesso",
                "atualizar:chave_acesso",
                "ler:veiculo",
                "ler:aviso",
            ]
        },
        "MORADOR": {
            "permissoes": [
                "ler:condominio",
                "ler:unidade",
                "ler:morador",
                "atualizar:morador",
                "criar:chave_acesso",
                "ler:chave_acesso",
                "atualizar:chave_acesso",
                "criar:veiculo",
                "ler:veiculo",
                "atualizar:veiculo",
                "ler:aviso",
            ]
        },
    }

    # Criar perfis e vincular permissões de forma idempotente
    print(f"👤 Criando {len(perfis_config)} perfis e vinculando permissões...")
    for nome_perfil, config in perfis_config.items():
        # Busca os IDs das permissões configuradas
        permissoes_objs = await db.permissao.find_many(
            where={"nome": {"in": config["permissoes"]}}
        )

        # Conecta as permissões (Prisma Python usa 'connect' para relacionamentos N:N)
        perfil_data = {
            "nome": nome_perfil,
            "permissoes": {"connect": [{"id": p.id} for p in permissoes_objs]},
        }

        # No Prisma Python, o upsert N:N pode ser complexo.
        # Vamos simplificar: busca se existe, se não, cria. Se existe, limpa e reconecta (ou apenas garante existência).
        existente = await db.perfil.find_unique(
            where={"nome": nome_perfil}, include={"permissoes": True}
        )

        if not existente:
            await db.perfil.create(data=perfil_data)
        else:
            # Para atualizar as permissões N:N de forma idempotente:
            # Desconecta as atuais e conecta as novas para garantir sincronia com a matriz
            await db.perfil.update(
                where={"id": existente.id},
                data={
                    "permissoes": {
                        "disconnect": [{"id": p.id} for p in existente.permissoes],
                        "connect": [{"id": p.id} for p in permissoes_objs],
                    }
                },
            )

    print("✅ Seed concluído com sucesso!")
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
