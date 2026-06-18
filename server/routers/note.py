"""笔记路由"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.note import NoteGenerateRequest, NoteGenerateResponse
from ..services.note_service import NoteService
from ..config import settings

router = APIRouter()
note_service = NoteService()


async def optional_auth():
    if settings.APP_ENV == "production":
        from ..dependencies import get_current_user
        return await get_current_user(None)  # type: ignore
    return "dev-user"


@router.post("/generate", response_model=NoteGenerateResponse)
async def generate_note(
    request: NoteGenerateRequest,
    user_id: str = Depends(optional_auth),
):
    try:
        return await note_service.generate_note(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"笔记生成异常: {str(e)}")