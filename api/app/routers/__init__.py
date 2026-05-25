from fastapi import APIRouter

from app.config import settings
from app.modules.autenticacao.autenticacao_router import router as auth_router
from app.modules.aviso.aviso_router import router as aviso_router
from app.modules.chave.chave_router import router as chave_router
from app.modules.convite.convite_router import router as convite_router
from app.modules.core.dev_router import router as dev_router
from app.modules.core.router import router as core_router
from app.modules.documento.documento_router import router as documento_router
from app.modules.entrega.entrega_router import router as entrega_router
from app.modules.funcionario.funcionario_router import router as funcionario_router
from app.modules.morador.morador_router import router as morador_router
from app.modules.notificacao.notificacao_router import router as notificacao_router
from app.routers.agendamentos import router as agendamentos_router
from app.routers.bilhetes import router as bilhete_router
from app.routers.condominio import router as condominio_router
from app.routers.manifestacoes import router as manifestacao_router
from app.routers.unidade import router as unidade_router

# Agregador de rotas (Main Router)
router = APIRouter()

# Registrar roteadores dos módulos
router.include_router(core_router)
router.include_router(morador_router)
router.include_router(chave_router)
router.include_router(auth_router)
router.include_router(condominio_router)
router.include_router(aviso_router)
router.include_router(notificacao_router)
router.include_router(documento_router)
router.include_router(convite_router)
router.include_router(entrega_router)
router.include_router(funcionario_router)

# Rotas exclusivas de desenvolvimento
if settings.ENVIRONMENT == "development":
    router.include_router(dev_router)
router.include_router(unidade_router)
router.include_router(bilhete_router)
router.include_router(manifestacao_router)
router.include_router(agendamentos_router)
