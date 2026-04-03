import pytest
from httpx import ASGITransport, AsyncClient

from app.db.prisma_client import connect_db, db, disconnect_db
from index import app


@pytest.fixture(autouse=True)
async def setup_db():
    """Conecta ao banco de dados, prepara perfis e condomínio de teste."""
    await connect_db()

    # 1. Limpeza global (opcional dependendo da estratégia)
    # await db.chaveacesso.delete_many()
    # await db.morador.delete_many()

    # 2. Criar Permissões e Perfis Padrão
    funcionalidades = [
        "condominio",
        "unidade",
        "morador",
        "funcionario",
        "chave_acesso",
        "veiculo",
        "aviso",
    ]
    acoes = ["criar", "ler", "atualizar", "deletar"]

    for func in funcionalidades:
        for acao in acoes:
            nome_perm = f"{acao}:{func}"
            await db.permissao.upsert(
                where={"nome": nome_perm},
                data={"create": {"nome": nome_perm}, "update": {"nome": nome_perm}},
            )

    perfis_config = {
        "ADMIN": [f"{a}:{f}" for f in funcionalidades for a in acoes],
        "SINDICO": [
            "ler:condominio",
            "atualizar:condominio",
            "criar:unidade",
            "ler:unidade",
            "atualizar:unidade",
            "deletar:unidade",
        ],
        "MORADOR": ["ler:condominio", "ler:unidade", "ler:morador"],
        "PORTEIRO": [
            "ler:condominio",
            "ler:unidade",
            "ler:morador",
            "criar:chave_acesso",
        ],
    }

    for nome, perms in perfis_config.items():
        permissoes_objs = await db.permissao.find_many(where={"nome": {"in": perms}})
        await db.perfil.upsert(
            where={"nome": nome},
            data={
                "create": {
                    "nome": nome,
                    "permissoes": {"connect": [{"id": p.id} for p in permissoes_objs]},
                },
                "update": {
                    "permissoes": {"set": [{"id": p.id} for p in permissoes_objs]}
                },
            },
        )

    # 3. Criar Condomínio de Teste se não existir
    await db.condominio.upsert(
        where={"cnpj": "00.000.000/0001-99"},
        data={
            "create": {
                "nome": "Condomínio de Teste",
                "cnpj": "00.000.000/0001-99",
                "endereco": "Rua de Teste, 123",
            },
            "update": {"nome": "Condomínio de Teste"},
        },
    )

    # 4. Criar Usuário Admin de Teste para o Controller
    perfil_admin = await db.perfil.find_unique(where={"nome": "ADMIN"})
    await db.usuario.upsert(
        where={"email": "admin@teste.com"},
        data={
            "create": {
                "email": "admin@teste.com",
                "senha": "senha",
                "status": "ATIVO",
                "perfis": {"connect": [{"id": perfil_admin.id}]},
            },
            "update": {"email": "admin@teste.com"},
        },
    )

    yield

    await disconnect_db()


@pytest.fixture()
async def client():
    """Client de teste assíncrono para a API FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test", timeout=60.0
    ) as ac:
        yield ac
