import os
import subprocess
import sys
import time
import uuid
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.prisma_client import connect_db, disconnect_db
from app.modules.core.core_exception import AppError
from app.modules.core.logger import logger
from app.routers import router


# Lógica para garantir que o Prisma Client seja gerado no Vercel/Produção
def generate_prisma_client():
    """Gera o Prisma Client se estiver em ambiente Vercel/Produção."""
    try:
        if os.environ.get("VERCEL"):
            logger.info("Ambiente Vercel detectado. Gerando Prisma Client...", module="CORE", action="generate_prisma_client")
            subprocess.run([sys.executable, "-m", "prisma", "generate"], check=True)
    except Exception as e:
        logger.error(f"Erro ao gerar Prisma Client: {e}", module="CORE", action="generate_prisma_client", exc_info=True)


generate_prisma_client()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando aplicação SGPC", module="CORE", action="lifespan_start")
    await connect_db()
    yield
    logger.info("Encerrando aplicação SGPC", module="CORE", action="lifespan_stop")
    await disconnect_db()


app = FastAPI(
    title="SGPC API",
    description="Backend do Sistema de Gerenciamento de Portaria e Controle de Acesso",
    version="0.1.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Middleware para logar tempo de resposta e metadados de cada requisição."""
    start_time = time.perf_counter()
    
    # Geramos um ID único para a requisição para rastrear no Axiom
    request_id = str(uuid.uuid4())
    
    # "Amarramos" o ID e o contexto básico a todos os logs gerados nesta request
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(
        request_id=request_id,
        method=request.method,
        path=request.url.path,
        client_ip=request.client.host if request.client else "unknown",
    )

    try:
        response = await call_next(request)
        
        process_time = time.perf_counter() - start_time
        duration_ms = round(process_time * 1000, 2)
        
        # Log de sucesso da requisição
        logger.info(
            "HTTP Request Processed",
            status_code=response.status_code,
            duration_ms=duration_ms,
            module="HTTP_MIDDLEWARE",
            action="request_finished"
        )
        
        # Adicionamos o request_id no header da resposta (útil para suporte)
        response.headers["X-Request-ID"] = request_id
        return response

    except Exception as e:
        # Em caso de erro não tratado no middleware
        process_time = time.perf_counter() - start_time
        logger.error(
            "HTTP Request Failed",
            error=str(e),
            duration_ms=round(process_time * 1000, 2),
            module="HTTP_MIDDLEWARE",
            action="request_error",
            exc_info=True
        )
        raise e


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    """Capturador de erros conhecidos da aplicação."""
    logger.warn(
        f"Erro de aplicação: {exc.mensagem}",
        nome=exc.nome,
        status_code=exc.status_code,
        module="EXCEPTION_HANDLER",
        action="app_error"
    )
    
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
    logger.error(
        "ERRO NÃO TRATADO",
        error=str(exc),
        module="EXCEPTION_HANDLER",
        action="general_error",
        exc_info=True
    )

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
