from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/sgpc"
    DIRECT_URL: str | None = None
    SECRET_KEY: str = "changeme"
    HMAC_SECRET_KEY: str = "changeme-hmac-secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@sgpc.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_FROM_NAME: str = "SGPC"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # Permite variáveis extras no .env sem travar a aplicação
    )


settings = Settings()