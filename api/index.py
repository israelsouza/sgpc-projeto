import os
import subprocess
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.prisma_client import connect_db, disconnect_db
from app.modules.core.core_exception import ValidationError
from app.routers import router


# Lógica para garantir que o Prisma Client seja gerado no Vercel/Produção
def generate_prisma_client():
    """Gera o Prisma Client se estiver em ambiente Vercel/Produção."""
    try:
        # Se estiver na Vercel, o diretório de cache do Prisma pode sumir, então geramos no startup
        if os.environ.get("VERCEL"):
            print("Ambiente Vercel detectado. Gerando Prisma Client...")
            subprocess.run([sys.executable, "-m", "prisma", "generate"], check=True)
    except Exception as e:
        print(f"Erro ao gerar Prisma Client: {e}")


generate_prisma_client()


def generate_prisma_client():
    """Gera o Prisma Client se estiver em ambiente Vercel/Produção."""
    try:
        # Se estiver na Vercel, o diretório de cache do Prisma pode sumir, então geramos no startup
        if os.environ.get("VERCEL"):
            print("Ambiente Vercel detectado. Gerando Prisma Client...")
            subprocess.run([sys.executable, "-m", "prisma", "generate"], check=True)
    except Exception as e:
        print(f"Erro ao gerar Prisma Client: {e}")


generate_prisma_client()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
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

app.include_router(router, prefix="/api")
