from fastapi import APIRouter

from app.config import settings
from app.modules.autenticacao.autenticacao_router import router as auth_router
from app.modules.chave.chave_router import router as chave_router
from app.modules.core.dev_router import router as dev_router
from app.modules.core.router import router as core_router
from app.modules.funcionario.funcionario_router import router as funcionario_router
from app.modules.morador.morador_router import router as morador_router

# Agregador de rotas (Main Router)
router = APIRouter()

# Registrar roteadores dos módulos
router.include_router(core_router)
router.include_router(morador_router)
router.include_router(funcionario_router)
router.include_router(chave_router)
router.include_router(auth_router)

# Rotas exclusivas de desenvolvimento
if settings.ENVIRONMENT == "development":
    router.include_router(dev_router)
