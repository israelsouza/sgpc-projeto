from fastapi import APIRouter

from app.modules.core.core_controller import CoreController
from app.modules.core.core_schema import HealthResponse

router = APIRouter()


@router.get("/health", tags=["Health"], response_model=HealthResponse)
def health_check():
    return CoreController.health_check()
