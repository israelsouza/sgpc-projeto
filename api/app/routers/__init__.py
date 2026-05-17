from fastapi import APIRouter

from app.config import settings
from app.modules.autenticacao.autenticacao_router import router as auth_router
from app.modules.chave.chave_router import router as chave_router
from app.modules.core.dev_router import router as dev_router
from app.modules.core.router import router as core_router
from app.routers.auth import router as auth_router
from app.routers.morador import router as morador_router
from app.routers.condominio import router as condominio_router
from app.routers.unidade import router as unidade_router

# Agregador de rotas (Main Router)
router = APIRouter()

# Registrar roteadores dos módulos
router.include_router(core_router)
router.include_router(morador_router)
router.include_router(funcionario_router)
router.include_router(chave_router)
router.include_router(auth_router)
router.include_router(condominio_router)
router.include_router(unidade_router)
