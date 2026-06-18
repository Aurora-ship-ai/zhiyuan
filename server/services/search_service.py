"""
搜索服务 — Provider 模式，支持多后端切换

安全红线：
- 所有 API Key 从 config.settings 加载（环境变量），绝不出现在代码或仓库中
- 请求参数经 Pydantic 严格校验后再发送
- 响应内容脱敏后返回前端
"""
import time
import hashlib
from abc import ABC, abstractmethod
from typing import Optional
from urllib.parse import urlparse

import httpx

from ..config import settings
from ..models.search import SearchRequest, SearchResponse, SearchResult, SourceType


# ============================================================
# 权威来源权重表 — 用于 AI 质量评分
# ============================================================
AUTHORITY_DOMAINS: dict[str, float] = {
    # 学术/官方
    "arxiv.org": 0.95,
    "scholar.google.com": 0.90,
    "ieee.org": 0.90,
    "acm.org": 0.90,
    "nature.com": 0.95,
    "science.org": 0.95,
    "github.com": 0.85,
    "stackoverflow.com": 0.80,
    "wikipedia.org": 0.75,
    # 技术社区
    "medium.com": 0.65,
    "towardsdatascience.com": 0.70,
    "dev.to": 0.60,
    "juejin.cn": 0.60,
    "zhihu.com": 0.55,
    "csdn.net": 0.45,
    # 官方文档
    "docs.python.org": 0.90,
    "nodejs.org": 0.90,
    "react.dev": 0.90,
    "expo.dev": 0.85,
    "openai.com": 0.90,
    "anthropic.com": 0.90,
    "langchain.com": 0.85,
}


def compute_quality_score(
    url: str,
    relevance: float = 0.5,
    freshness_days: Optional[int] = None,
) -> float:
    """
    AI 质量评分 (0-10)

    = 权威度(0-5) + 相关度(0-3) + 新鲜度(0-2)
    """
    domain = urlparse(url).netloc.lower()
    authority = 0.0
    for known, weight in AUTHORITY_DOMAINS.items():
        if known in domain:
            authority = weight
            break
    if authority == 0.0:
        authority = 0.35  # 默认中等偏低

    authority_score = authority * 5.0  # 0-5

    relevance_score = max(0.0, min(3.0, relevance * 3.0))  # 0-3

    freshness_score = 2.0
    if freshness_days is not None:
        if freshness_days <= 7:
            freshness_score = 2.0
        elif freshness_days <= 30:
            freshness_score = 1.5
        elif freshness_days <= 180:
            freshness_score = 1.0
        elif freshness_days <= 365:
            freshness_score = 0.5
        else:
            freshness_score = 0.2

    total = authority_score + relevance_score + freshness_score
    return round(min(10.0, max(0.0, total)), 1)


# ============================================================
# Provider 抽象
# ============================================================
class SearchProvider(ABC):
    @abstractmethod
    async def search(self, request: SearchRequest) -> list[dict]:
        """返回原始搜索结果列表 [{title, url, content, ...}]"""
        ...


# ============================================================
# Tavily 实现
# ============================================================
class TavilyProvider(SearchProvider):
    """Tavily Search API — 专为 AI Agent 设计的搜索"""

    BASE_URL = "https://api.tavily.com/search"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, request: SearchRequest) -> list[dict]:
        if not self.api_key:
            return []

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                self.BASE_URL,
                json={
                    "api_key": self.api_key,
                    "query": request.query,
                    "search_depth": "advanced",
                    "include_answer": True,
                    "include_raw_content": False,
                    "max_results": min(request.page_size, 20),
                    "include_domains": [],
                    "exclude_domains": [],
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("results", [])


# ============================================================
# 模拟 Provider（开发用 / 无 Key 降级）
# ============================================================
class MockProvider(SearchProvider):
    """开发环境模拟搜索 — 无 API Key 时自动降级"""

    MOCK_DATA = {
        "AI 编程": [
            {
                "title": "Building Effective Agents — Anthropic",
                "url": "https://www.anthropic.com/engineering/building-effective-agents",
                "content": "Anthropic 工程团队撰写的 Agent 构建权威指南，涵盖从简单工作流到自主 Agent 的完整设计模式。核心观点：最简单的方案往往最有效，不要过早引入复杂 Agent 架构。",
                "score": 9.2,
            },
            {
                "title": "AI 编程最佳实践：从 Prompt Engineering 到 Agent 工作流",
                "url": "https://towardsdatascience.com/ai-coding-best-practices-2025",
                "content": "系统梳理 AI 辅助编程的五个层次：代码补全→对话式编程→上下文感知→Agent 工作流→自主开发。每个阶段的关键突破与代表工具。",
                "score": 4.8,
            },
            {
                "title": "Building Effective AI Agents with LangChain",
                "url": "https://docs.langchain.com/agents",
                "content": "Agent 架构设计模式详解：ReAct、Planning、Multi-Agent 协作。含完整代码示例与最佳实践。",
                "score": 4.6,
            },
            {
                "title": "Cursor 与 Copilot 深度对比：2025 AI 编程工具选型指南",
                "url": "https://juejin.cn/post/ai-coding-tools-comparison-2025",
                "content": "代码质量、上下文理解、多文件编辑三个维度实测对比各工具，附带最佳使用场景推荐。",
                "score": 4.5,
            },
        ],
        "机器学习": [
            {
                "title": "Attention Is All You Need — 原始论文",
                "url": "https://arxiv.org/abs/1706.03762",
                "content": "Transformer 架构的奠基论文，提出自注意力机制替代 RNN，彻底改变了 NLP 和整个深度学习领域。",
                "score": 9.8,
            },
            {
                "title": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
                "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/",
                "content": "公认最佳的 ML 实操入门书，涵盖从线性回归到深度学习的完整路径，含大量代码示例。",
                "score": 9.0,
            },
        ],
        "default": [
            {
                "title": "Building Effective Agents — Anthropic",
                "url": "https://www.anthropic.com/engineering/building-effective-agents",
                "content": "Anthropic 工程团队的 Agent 构建权威指南。",
                "score": 9.2,
            },
            {
                "title": "Designing Data-Intensive Applications",
                "url": "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
                "content": "分布式系统经典，涵盖存储、复制、分区、事务、共识等核心概念。",
                "score": 9.5,
            },
            {
                "title": "The Pragmatic Programmer — 20th Anniversary Edition",
                "url": "https://pragprog.com/titles/tpp20/",
                "content": "软件工程经典，涵盖 DRY、正交性、原型设计等实用原则。",
                "score": 8.8,
            },
        ],
    }

    async def search(self, request: SearchRequest) -> list[dict]:
        q = request.query.lower()
        for key in self.MOCK_DATA:
            if key.lower() in q or q in key.lower():
                return self.MOCK_DATA[key]
        return self.MOCK_DATA["default"]


# ============================================================
# 搜索服务 — 编排层
# ============================================================
class SearchService:
    def __init__(self):
        # 根据是否有 Key 选择 Provider
        tavily_key = settings.TAVILY_API_KEY
        if tavily_key:
            self.provider: SearchProvider = TavilyProvider(tavily_key)
        else:
            self.provider = MockProvider()

    async def search(self, request: SearchRequest) -> SearchResponse:
        t0 = time.monotonic()

        # 1. 调用搜索 Provider
        raw_results = await self.provider.search(request)

        # 2. 格式化为 SearchResult + AI 评分
        results: list[SearchResult] = []
        for i, raw in enumerate(raw_results):
            url = raw.get("url", "")
            score = raw.get("score", None)
            if score is None:
                score = compute_quality_score(
                    url=url,
                    relevance=0.6,
                    freshness_days=None,
                )

            # 推断来源类型
            source_type: SourceType = "web"

            # 提取域名作为来源名
            parsed = urlparse(url)
            source = parsed.netloc.replace("www.", "").split(".")[0].title()

            # 生成摘要
            summary = raw.get("content", "")[:200]
            if len(raw.get("content", "")) > 200:
                summary += "..."

            # 自动标签（简单关键词提取，后续可用 AI 增强）
            tags = self._extract_tags(request.query, raw.get("content", ""))

            results.append(SearchResult(
                id=hashlib.md5(url.encode()).hexdigest()[:12],
                title=raw.get("title", "无标题"),
                url=url,
                source=source,
                source_type=source_type,
                score=round(score, 1),
                summary=summary,
                tags=tags,
                reachable=True,
            ))

        # 3. 分页
        total = len(results)
        start = (request.page - 1) * request.page_size
        end = start + request.page_size
        page_results = results[start:end]

        elapsed = (time.monotonic() - t0) * 1000

        return SearchResponse(
            results=page_results,
            total=total,
            page=request.page,
            page_size=request.page_size,
            has_more=end < total,
            query=request.query,
            took_ms=round(elapsed, 1),
        )

    @staticmethod
    def _extract_tags(query: str, content: str) -> list[str]:
        """简易标签提取 — 后续可由本地 AI 模型增强"""
        tags = set()
        keywords = [
            "AI", "Python", "JavaScript", "TypeScript", "React", "Agent",
            "机器学习", "深度学习", "LLM", "NLP", "架构", "设计模式",
            "数据库", "API", "后端", "前端", "系统设计", "Prompt",
            "Transformer", "RAG", "LangChain", "编程", "算法",
        ]
        text = (query + " " + content).lower()
        for kw in keywords:
            if kw.lower() in text:
                tags.add(kw)
        return list(tags)[:5]
