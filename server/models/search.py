"""搜索模块 — 请求/响应 Pydantic 模型"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


SourceType = Literal["web", "paper", "video", "book", "podcast"]


class SearchRequest(BaseModel):
    """搜索请求 — 服务端校验每一项，绝不信前端"""
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="搜索关键词",
    )
    source_type: Optional[SourceType] = Field(
        default=None,
        description="资料类型筛选，None 表示全部",
    )
    page: int = Field(
        default=1,
        ge=1,
        le=20,
        description="页码",
    )
    page_size: int = Field(
        default=10,
        ge=1,
        le=50,
        description="每页数量",
    )


class SearchResult(BaseModel):
    """单条搜索结果"""
    id: str
    title: str
    url: str
    direct_url: Optional[str] = None
    source: str = "未知来源"
    source_type: SourceType = "web"
    score: float = Field(ge=0, le=10, description="AI 质量评分 0-10")
    summary: str = ""
    tags: list[str] = []
    published_date: Optional[str] = None
    reachable: bool = True
    content_snippet: Optional[str] = None


class SearchResponse(BaseModel):
    """搜索响应"""
    results: list[SearchResult]
    total: int
    page: int
    page_size: int
    has_more: bool
    query: str
    took_ms: float = 0
