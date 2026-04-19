import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()

    print("🌱 Populando banco com dados de teste...")

    # Garante que temos um condomínio e uma unidade
    condominio = await db.condominio.find_first()
    if not condominio:
        condominio = await db.condominio.create(data={"nome": "Condomínio Exemplo"})
    
    unidade = await db.unidade.find_first()
    if not unidade:
        unidade = await db.unidade.create(data={"unidade": "101", "bloco": "A", "condominio_id": condominio.id})

    # Dados de teste
    dados_morador = {
        "nome_completo": "João Silva",
        "celular": "11999999999",
        "rg": "12345678",
        "cpf": "11111111111",
        "data_nascimento": "01011990",
        "unidade_id": unidade.id,
    }

    dados_funcionario_porteiro = {
        "nome_completo": "Maria Souza",
        "celular": "11988888888",
        "rg": "87654321",
        "cpf": "22222222222",
        "data_nascimento": "15051985",
        "cargo": "PORTEIRO",
        "condominio_id": condominio.id,
    }

    dados_funcionario_sindico = {
        "nome_completo": "Carlos Oliveira",
        "celular": "11977777777",
        "rg": "11223344",
        "cpf": "33333333333",
        "data_nascimento": "20101975",
        "cargo": "SINDICO",
        "condominio_id": condominio.id,
    }

    from app.modules.core.security import hash_senha
    
    senha_padrao = hash_senha("senha123")

    # Criar usuários de suporte
    usuario_morador = await db.usuario.create(data={"email": "joao@exemplo.com", "senha": senha_padrao, "status": "ATIVO"})
    usuario_porteiro = await db.usuario.create(data={"email": "maria@exemplo.com", "senha": senha_padrao, "status": "ATIVO"})
    usuario_sindico = await db.usuario.create(data={"email": "carlos@exemplo.com", "senha": senha_padrao, "status": "ATIVO"})

    # Inserir no banco
    await db.morador.create(data={**dados_morador, "usuario_id": usuario_morador.id})
    await db.funcionario.create(data={**dados_funcionario_porteiro, "usuario_id": usuario_porteiro.id})
    await db.funcionario.create(data={**dados_funcionario_sindico, "usuario_id": usuario_sindico.id})

    print("✅ Dados de teste inseridos!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
