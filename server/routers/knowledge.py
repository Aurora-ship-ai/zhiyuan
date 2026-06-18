"""知识库路由"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.knowledge import SaveNoteRequest, KnowledgeSearchRequest, KnowledgeSearchResponse, KnowledgeEntry
from ..services.knowledge_service import KnowledgeService
from ..dependencies import get_current_user

router = APIRouter()
kb = KnowledgeService()


@router.post("/save", response_model=KnowledgeEntry)
async def save_note(req: SaveNoteRequest, user_id: str = Depends(get_current_user)):
    try: return await kb.save_note(req)
    except Exception as e: raise HTTPException(502, f"保存失败: {e}")


@router.post("/search", response_model=KnowledgeSearchResponse)
async def search(req: KnowledgeSearchRequest, user_id: str = Depends(get_current_user)):
    return await kb.search(req)


@router.get("/tags")
async def tags():
    return {"tags": kb.get_tags()}


@router.get("/stats")
async def stats():
    return kb.get_stats()
