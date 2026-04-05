from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://sgpc_admin:123456@localhost:5432/sgpc_db"
    DIRECT_URL: str | None = None
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # Permite variáveis extras no .env sem travar a aplicação
    )


settings = Settings()
