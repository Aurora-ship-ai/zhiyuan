import time, hashlib, re, ssl
from abc import ABC, abstractmethod
from urllib.parse import urlparse
from typing import Optional
from bs4 import BeautifulSoup

import urllib.request as ur

from ..config import settings
from ..models.search import SearchRequest, SearchResponse, SearchResult, SourceType

_CTX = ssl.create_default_context()
_CTX.check_hostname = False
_CTX.verify_mode = ssl.CERT_NONE
_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

AUTHORITY_DOMAINS = {
    "arxiv.org": 0.95, "github.com": 0.85, "stackoverflow.com": 0.80,
    "wikipedia.org": 0.90, "medium.com": 0.65, "towardsdatascience.com": 0.70,
    "python.org": 0.85, "openai.com": 0.90, "anthropic.com": 0.90,
    "zhihu.com": 0.60, "csdn.net": 0.50, "juejin.cn": 0.65,
}

def compute_quality_score(url, relevance=0.5, freshness_days=None):
    domain = urlparse(url).netloc.lower()
    authority = next((w for k, w in AUTHORITY_DOMAINS.items() if k in domain), 0.35)
    a_s = authority * 5.0
    r_s = max(0.0, min(3.0, relevance * 3.0))
    f_s = 2.0
    if freshness_days is not None:
        if freshness_days <= 7: f_s = 2.0
        elif freshness_days <= 30: f_s = 1.5
        elif freshness_days <= 180: f_s = 1.0
        elif freshness_days <= 365: f_s = 0.5
        else: f_s = 0.2
    return round(min(10.0, max(0.0, a_s + r_s + f_s)), 1)

class SearchProvider(ABC):
    @abstractmethod
    async def search(self, request): ...

class BingProvider(SearchProvider):
    """Bing 搜索 — 国内可用，免费"""

    async def search(self, request):
        results = []
        try:
            import asyncio
            loop = asyncio.get_running_loop()
            return await loop.run_in_executor(None, self._sync_search, request)
        except Exception:
            return results

    def _sync_search(self, request):
        results = []
        try:
            q = request.query.replace(" ", "+")
            url = f"https://www.bing.com/search?q={q}&setlang=zh-cn&count={min(request.page_size, 15)}"
            req = ur.Request(url, headers={"User-Agent": _UA})
            r = ur.urlopen(req, timeout=12, context=_CTX)
            html = r.read().decode("utf-8", errors="ignore")

            soup = BeautifulSoup(html, "html.parser")
            for item in soup.select("li.b_algo")[:request.page_size]:
                title_el = item.select_one("h2 a")
                snippet_el = item.select_one(".b_caption p")
                if not title_el:
                    continue
                results.append({
                    "title": title_el.get_text(strip=True),
                    "url": title_el.get("href", ""),
                    "content": snippet_el.get_text(strip=True) if snippet_el else "",
                })
        except Exception:
            pass
        return results

class TavilyProvider(SearchProvider):
    BASE_URL = "https://api.tavily.com/search"

    def __init__(self, api_key):
        self.api_key = api_key

    async def search(self, request):
        if not self.api_key:
            return []
        import httpx
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(self.BASE_URL, json={
                "api_key": self.api_key, "query": request.query,
                "search_depth": "advanced", "max_results": min(request.page_size, 20),
            })
            resp.raise_for_status()
            return resp.json().get("results", [])

class SearchService:
    def __init__(self):
        key = settings.TAVILY_API_KEY
        if key and key != "tvly-your-key-here":
            self.provider = TavilyProvider(key)
        else:
            self.provider = BingProvider()

    async def search(self, request):
        t0 = time.monotonic()
        raw = await self.provider.search(request)
        results = []
        for r in raw:
            url = r.get("url", "")
            if not url:
                continue
            score = compute_quality_score(url=url, relevance=0.6)
            parsed = urlparse(url)
            source = parsed.netloc.replace("www.", "").split(".")[0].title()
            summary = (r.get("content", "") or "")[:200]
            if len(r.get("content", "") or "") > 200:
                summary += "..."
            results.append(SearchResult(
                id=hashlib.md5(url.encode()).hexdigest()[:12],
                title=r.get("title", ""),
                url=url, source=source, source_type="web",
                score=round(score, 1), summary=summary,
                tags=self._tags(request.query, r.get("content", "")),
                reachable=True,
            ))
        total = len(results)
        start = (request.page - 1) * request.page_size
        end = start + request.page_size
        elapsed = (time.monotonic() - t0) * 1000
        return SearchResponse(
            results=results[start:end], total=total, page=request.page,
            page_size=request.page_size, has_more=end < total,
            query=request.query, took_ms=round(elapsed, 1),
        )

    @staticmethod
    def _tags(query, content):
        kws = ["AI", "Python", "JavaScript", "TypeScript", "React", "Agent",
               "ML", "NLP", "Transformer", "LLM", "RAG", "LangChain",
               "Go", "Rust", "数据库", "API", "架构", "算法", "系统设计"]
        t = (query + " " + (content or "")).lower()
        return [kw for kw in kws if kw.lower() in t][:5]