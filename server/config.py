from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    JWT_SECRET: str = "dev-secret"
    JWT_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: Optional[str] = None
    CLAUDE_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None
    OLLAMA_HOST: str = "http://localhost:11434"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}

settings = Settings()
