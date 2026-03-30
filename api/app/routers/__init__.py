from fastapi import APIRouter

from app.routers.auth import router as auth_router
from app.routers.morador import router as morador_router

# Agregador de rotas
router = APIRouter()

router.include_router(morador_router)
router.include_router(auth_router)
