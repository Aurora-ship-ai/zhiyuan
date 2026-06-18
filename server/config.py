"""
配置管理 — 所有敏感值从环境变量加载，绝不出现在代码或仓库中
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # 应用
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    # 数据库
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/zhiyuan"
    REDIS_URL: str = "redis://localhost:6379"

    # JWT
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_EXPIRE_MINUTES: int = 1440

    # AI 服务（绝不暴露给前端）
    OPENAI_API_KEY: Optional[str] = None
    CLAUDE_API_KEY: Optional[str] = None
    OLLAMA_HOST: str = "http://localhost:11434"

    # 搜索服务
    TAVILY_API_KEY: Optional[str] = None
    SERPAPI_API_KEY: Optional[str] = None

    # 安全
    MAX_REQUEST_SIZE: int = 10 * 1024 * 1024  # 10 MB

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
