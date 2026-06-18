"""
知源 — FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from .config import settings
from .middleware.logging import LoggingMiddleware

app = FastAPI(
    title="知源 API",
    version="0.1.0",
    docs_url="/api/docs" if settings.APP_ENV == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


@app.get("/", response_class=HTMLResponse)
async def root():
    return """<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>知源 · 服务端</title>
<style>body{font-family:-apple-system,sans-serif;background:#F9F6F0;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
.box{text-align:center;padding:40px}h1{font-family:Georgia,serif;font-size:32px;color:#1A1512;margin-bottom:8px}
p{color:#5A5045;margin-bottom:24px}.links{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
a{display:inline-block;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;transition:all .2s}
a.primary{background:#C0774E;color:#fff}a.primary:hover{background:#A85F3B}
a.secondary{background:#F3EEE4;color:#3A5A45;border:1px solid #E8E1D4}a.secondary:hover{background:#fff}
.status{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;background:#E4EDE3;color:#3A5A45;font-size:12px;font-weight:600;margin-bottom:20px}
.status .dot{width:7px;height:7px;border-radius:50%;background:#3A5A45}</style></head><body>
<div class="box"><div class="status"><span class="dot"></span>服务运行中</div><h1>知源 API</h1><p>学习工具后端服务 · v0.1.0</p>
<div class="links"><a class="primary" href="/api/docs">📖 API 文档</a><a class="secondary" href="/api/health">❤ 健康检查</a></div></div></body></html>"""


def register_routers():
    from .routers import auth, search, note, knowledge
    app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
    app.include_router(search.router, prefix="/api/search", tags=["搜索"])
    app.include_router(note.router, prefix="/api/notes", tags=["笔记"])
    app.include_router(knowledge.router, prefix="/api/knowledge", tags=["知识库"])


register_routers()