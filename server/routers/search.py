"""
资料搜索路由
"""
from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def search():
    """占位 — Phase 1 后续实现资料搜索"""
    return {"message": "搜索模块待实现", "phase": 1}
