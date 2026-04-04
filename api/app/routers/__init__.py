from fastapi import APIRouter

from app.config import settings
from app.modules.core.router import router as core_router
from app.routers.auth import router as auth_router
from app.routers.dev import router as dev_router
from app.routers.funcionario import router as funcionario_router
from app.routers.morador import router as morador_router

# Agregador de rotas
router = APIRouter()

router.include_router(core_router)
router.include_router(morador_router)
router.include_router(funcionario_router)
router.include_router(auth_router)

# Rotas exclusivas de desenvolvimento
if settings.ENVIRONMENT == "development":
    router.include_router(dev_router)
