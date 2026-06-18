"""资料搜索路由"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.search import SearchRequest, SearchResponse
from ..services.search_service import SearchService
from ..dependencies import get_current_user

router = APIRouter()
search_service = SearchService()


@router.post("/", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    user_id: str = Depends(get_current_user),
):
    """
    资料搜索

    - 请求体经过 Pydantic 严格校验
    - 需要 JWT 鉴权
    - API Key 仅在服务端拼接，前端永不可见
    """
    try:
        return await search_service.search(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"搜索服务异常: {str(e)}")
