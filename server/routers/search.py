"""璧勬枡鎼滅储璺敱"""
from fastapi import APIRouter, Depends, HTTPException
from ..models.search import SearchRequest, SearchResponse
from ..services.search_service import SearchService
from ..dependencies import get_current_user
from ..config import settings

router = APIRouter()
search_service = SearchService()


async def optional_auth(user_id: str | None = None):
    """寮€鍙戠幆澧冨彲閫夐壌鏉?""
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
        raise HTTPException(status_code=502, detail=f"鎼滅储鏈嶅姟寮傚父: {str(e)}")
from fastapi.responses import JSONResponse

@router.get("/content")
async def get_content(url: str):
    """提取网页可读内容（Reader Mode）"""
    import urllib.request as ur
    import ssl
    from bs4 import BeautifulSoup

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        req = ur.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        r = ur.urlopen(req, timeout=10, context=ctx)
        html = r.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")
        
        # 移除脚本和样式
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        
        # 提取正文（优先 article/main 标签，否则 body）
        content = soup.find("article") or soup.find("main") or soup.find("body")
        text = content.get_text(separator="\n", strip=True) if content else ""
        
        # 截断过长内容
        if len(text) > 8000:
            text = text[:8000] + "\n\n... (内容过长，已截断)"
        
        return JSONResponse({"url": url, "content": text, "length": len(text)})
    except Exception as e:
        return JSONResponse({"url": url, "content": "", "length": 0, "error": str(e)})