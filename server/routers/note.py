"""
笔记路由
"""
from fastapi import APIRouter

router = APIRouter()


@router.post("/generate")
async def generate_note():
    """占位 — Phase 1 后续实现 AI 笔记生成"""
    return {"message": "笔记生成模块待实现", "phase": 1}
