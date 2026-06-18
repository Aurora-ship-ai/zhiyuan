"""资料搜索路由"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.search import SearchRequest, SearchResponse
from ..services.search_service import SearchService
from ..dependencies import get_current_user
from ..config import settings

router = APIRouter()
search_service = SearchService()


async def optional_auth(user_id: str | None = None):
    """开发环境可选鉴权"""
    if settings.APP_ENV == "production":
        return await get_current_user(None)  # type: ignore
    return user_id or "dev-user"


@router.post("/", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    user_id: str = Depends(optional_auth),
):
    try:
        return await search_service.search(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"搜索服务异常: {str(e)}")