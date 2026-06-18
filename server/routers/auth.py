"""
认证路由
"""
from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
async def login():
    """占位 — Phase 1 后续实现 JWT 签发"""
    return {"message": "认证模块待实现", "phase": 1}
