from fastapi import APIRouter
from app.modules.core.router import router as core_router
from app.modules.users.router import router as users_router

router = APIRouter()

router.include_router(core_router)
router.include_router(users_router, prefix="/users")
