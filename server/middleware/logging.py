"""
审计日志中间件 — 记录所有 API 请求
"""
import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("zhiyuan.audit")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.monotonic()
        response = await call_next(request)
        elapsed = time.monotonic() - start

        logger.info(
            "request",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "elapsed_ms": round(elapsed * 1000, 2),
                "client": request.client.host if request.client else "unknown",
            },
        )
        return response
