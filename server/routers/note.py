"""笔记路由"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.note import NoteGenerateRequest, NoteGenerateResponse
from ..services.note_service import NoteService
from ..dependencies import get_current_user

router = APIRouter()
note_service = NoteService()


@router.post("/generate", response_model=NoteGenerateResponse)
async def generate_note(
    request: NoteGenerateRequest,
    user_id: str = Depends(get_current_user),
):
    """
    AI 生成复习笔记

    - 资料内容仅在生成时按需发送云端，不持久化
    - 需要 JWT 鉴权
    """
    try:
        return await note_service.generate_note(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"笔记生成异常: {str(e)}")
