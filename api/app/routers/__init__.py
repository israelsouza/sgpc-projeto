from fastapi import APIRouter

from app.modules.core.router import router as core_router
from app.routers.auth import router as auth_router
from app.routers.morador import router as morador_router
from app.routers.unidade import router as unidade_router

# Agregador de rotas
router = APIRouter()

router.include_router(core_router)
router.include_router(morador_router)
router.include_router(auth_router)
router.include_router(unidade_router)