from prisma import Prisma

# Instância única do cliente Prisma
db = Prisma()


async def connect_db():
    if not db.is_connected():
        await db.connect()


async def disconnect_db():
    if db.is_connected():
        await db.disconnect()


# Dependency para injetar o cliente nas rotas FastAPI
async def get_prisma():
    # Nota: Em FastAPI, garantimos a conexão no startup do app.
    # Esta dependency apenas retorna a instância pronta.
    return db
