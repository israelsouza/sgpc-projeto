from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/sgpc"
    DIRECT_URL: str | None = None
    SECRET_KEY: str = "changeme"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # Permite variáveis extras no .env sem travar a aplicação
    )


settings = Settings()
