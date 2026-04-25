from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://sgpc_admin:123456@localhost:5432/sgpc_db"
    ENVIRONMENT: str = "development"
    DIRECT_URL: str | None = None
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@sgpc.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_FROM_NAME: str = "SGPC"

    @model_validator(mode="after")
    def validate_email_credentials(self):
        # Em produção, ou quando o ambiente não for "development", obriga credenciais de e-mail válidas
        if self.ENVIRONMENT != "development":
            if not self.MAIL_USERNAME or not self.MAIL_PASSWORD:
                raise ValueError(
                    "MAIL_USERNAME e MAIL_PASSWORD são obrigatórios fora do ambiente de desenvolvimento "
                    "para evitar envio não autenticado."
                )
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # Permite variáveis extras no .env sem travar a aplicação
    )


settings = Settings()
