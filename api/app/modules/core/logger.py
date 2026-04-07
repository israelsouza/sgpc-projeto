import os
from typing import Any

import structlog
from axiom_py import Client
from axiom_py.structlog import AxiomProcessor


def setup_logger():
    """
    Configura o structlog para suporte a logs estruturados.
    - Desenvolvimento: Console colorido e legível.
    - Produção (Vercel + Axiom): JSON estruturado enviado via HTTP.
    """

    is_production = os.getenv("VERCEL") is not None
    axiom_token = os.getenv("AXIOM_TOKEN")
    axiom_dataset = os.getenv("AXIOM_DATASET")

    # Processadores base (comuns a todos os ambientes)
    processors: list[Any] = [
        # Permite usar structlog.contextvars para "amarrar" variáveis ao contexto da execução/request
        structlog.contextvars.merge_contextvars,
        # Adiciona o nível do log (info, error, warn, etc)
        structlog.processors.add_log_level,
        # Adiciona timestamp ISO 8601
        structlog.processors.TimeStamper(fmt="iso", key="_time"),
        # Formata exceções automaticamente se exc_info=True for passado
        structlog.processors.format_exc_info,
        # Trata Unicode nos logs
        structlog.processors.UnicodeDecoder(),
    ]

    if is_production and axiom_token and axiom_dataset:
        # --- CONFIGURAÇÃO PRODUÇÃO (AXIOM) ---
        axiom_client = Client(token=axiom_token)
        # O AxiomProcessor envia os logs para o Axiom
        processors.append(AxiomProcessor(axiom_client, axiom_dataset))
        # Renderiza como JSON para ingestão eficiente
        processors.append(structlog.processors.JSONRenderer())
    else:
        # --- CONFIGURAÇÃO DESENVOLVIMENTO (CONSOLE) ---
        # Renderiza logs bonitos e coloridos para o terminal
        processors.append(structlog.dev.ConsoleRenderer(colors=True))

    structlog.configure(
        processors=processors,
        # PrintLoggerFactory é simples e performático para ambientes serverless
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


# Inicializa as configurações ao importar o módulo
setup_logger()
logger = structlog.get_logger()
