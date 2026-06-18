"""知识库模块 — 请求/响应模型"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..models.note import KeyConcept, CardItem


class SaveNoteRequest(BaseModel):
    """保存笔记请求"""
    material_title: str = Field(..., max_length=300)
    material_url: Optional[str] = None
    material_summary: Optional[str] = None
    source_type: str = Field(default="web")
    logic_chain: str = Field(..., max_length=10_000)
    key_concepts: list[KeyConcept] = Field(default_factory=list)
    extension_questions: list[str] = Field(default_factory=list)
    cards: list[CardItem] = Field(default_factory=list)
    mindmap: Optional[dict] = None
    reflection_zone: str = Field(default="", max_length=5_000)
    tags: list[str] = Field(default_factory=list)
    category: Optional[str] = None


class KnowledgeEntry(BaseModel):
    """知识库条目"""
    id: str
    material_title: str
    material_url: Optional[str] = None
    note_title: str
    logic_chain: str
    key_concepts: list[KeyConcept]
    extension_questions: list[str]
    cards: list[CardItem] = Field(default_factory=list)
    reflection_zone: str = ""
    tags: list[str] = Field(default_factory=list)
    category: Optional[str] = None
    material_count: int = 1
    saved_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    note_preview: str = ""


class KnowledgeSearchRequest(BaseModel):
    """知识库搜索"""
    query: str = Field(default="", max_length=500)
    tags: list[str] = Field(default_factory=list)
    category: Optional[str] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class KnowledgeSearchResponse(BaseModel):
    """搜索响应"""
    results: list[KnowledgeEntry]
    total: int
    page: int
    has_more: bool
    tags_available: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)
