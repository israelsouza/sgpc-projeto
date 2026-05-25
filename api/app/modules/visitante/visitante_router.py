from fastapi import APIRouter
from app.modules.visitante import visitante_controller

router = APIRouter()

router.include_router(visitante_controller.router)
