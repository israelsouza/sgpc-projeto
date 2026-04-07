import os
import subprocess
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.prisma_client import connect_db, disconnect_db
from app.modules.core.core_exception import AppError
from app.routers import router


# Lógica para garantir que o Prisma Client seja gerado no Vercel/Produção
def generate_prisma_client():
    """Gera o Prisma Client se estiver em ambiente Vercel/Produção."""
    try:
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


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    """Capturador de erros conhecidos da aplicação."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "nome": exc.nome,
            "mensagem": exc.mensagem,
            "acao": exc.acao,
            "status_code": exc.status_code,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Capturador de erros inesperados (500).
    Garante que o cliente nunca receba um erro fora do padrão.
    """
    # Aqui, em ambiente de dev, poderíamos logar o stack trace
    print(f"ERRO NÃO TRATADO: {str(exc)}")

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "nome": "erro_interno",
            "mensagem": "Ocorreu um erro inesperado em nosso servidor.",
            "acao": "Tente novamente mais tarde ou contate o suporte se o problema persistir.",
            "status_code": 500,
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
