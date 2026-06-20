from fastapi import APIRouter, Depends, HTTPException
from ..models.search import SearchRequest, SearchResponse
from ..services.search_service import SearchService
from ..dependencies import get_current_user
from ..config import settings
from fastapi.responses import JSONResponse

router = APIRouter()
search_service = SearchService()


async def optional_auth(user_id: str | None = None):
    if settings.APP_ENV == "production":
        return await get_current_user(None)
    return user_id or "dev-user"


@router.post("/", response_model=SearchResponse)
async def search(request: SearchRequest, user_id: str = Depends(optional_auth)):
    try:
        return await search_service.search(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Search error: {str(e)}")


@router.get("/content")
async def get_content(url: str):
    import urllib.request as ur, ssl
    from bs4 import BeautifulSoup
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        req = ur.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        r = ur.urlopen(req, timeout=10, context=ctx)
        html = r.read().decode("utf-8", errors="ignore")
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        content = soup.find("article") or soup.find("main") or soup.find("body")
        text = content.get_text(separator="\n", strip=True) if content else ""
        if len(text) > 8000:
            text = text[:8000] + "\n\n... (truncated)"
        return JSONResponse({"url": url, "content": text, "length": len(text)})
    except Exception as e:
        return JSONResponse({"url": url, "content": "", "length": 0, "error": str(e)})


@router.get("/multimedia")
async def search_multimedia(query: str, source_type: str = "all", page_size: int = 10):
    from ..services.multimedia_service import MultimediaService
    svc = MultimediaService()
    results = svc.search(query, source_type, min(page_size, 20))
    return {"results": results, "total": len(results), "query": query}
