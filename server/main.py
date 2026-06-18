"""
知源 — FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .middleware.logging import LoggingMiddleware

app = FastAPI(
    title="知源 API",
    version="0.1.0",
    docs_url="/api/docs" if settings.APP_ENV == "development" else None,
)

# CORS（开发环境允许移动端访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 审计日志中间件
app.add_middleware(LoggingMiddleware)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


# 延迟注册路由（避免循环导入）
def register_routers():
    from .routers import auth, search, note, knowledge
    app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
    app.include_router(search.router, prefix="/api/search", tags=["搜索"])
    app.include_router(note.router, prefix="/api/notes", tags=["笔记"])
    app.include_router(knowledge.router, prefix="/api/knowledge", tags=["知识库"])


register_routers()
