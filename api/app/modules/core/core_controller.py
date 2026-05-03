from app.modules.core.core_service import CoreService


class CoreController:
    @staticmethod
    def health_check():
        return CoreService.health_check()
