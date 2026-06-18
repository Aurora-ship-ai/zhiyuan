"""
知识库路由
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/search")
async def search_knowledge():
    """占位 — Phase 2 后续实现语义搜索"""
    return {"message": "知识库搜索模块待实现", "phase": 2}
