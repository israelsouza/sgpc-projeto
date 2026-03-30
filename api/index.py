from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.prisma_client import connect_db, disconnect_db
from app.modules.core.exceptions import ValidationError
from app.routers import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: conectar ao banco
    await connect_db()
    yield
    # Shutdown: desconectar do banco
    await disconnect_db()


app = FastAPI(
    title="SGPC API",
    description="Backend do Sistema de Gerenciamento de Portaria e Controle de Acesso",
    version="0.1.0",
    lifespan=lifespan,
)


@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "nome": exc.nome,
            "mensagem": exc.mensagem,
            "acao": exc.acao,
        },
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajustar para os domínios corretos em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(router, prefix="/api") # Removed redundant prefix if already in vercel.json or router
app.include_router(router, prefix="/api")
