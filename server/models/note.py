"""笔记模块 — 请求/响应 Pydantic 模型"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class KeyConcept(BaseModel):
    """关键概念"""
    term: str
    definition: str


class CardItem(BaseModel):
    """问答卡片（Anki 式）"""
    question: str
    answer: str


class NoteGenerateRequest(BaseModel):
    """笔记生成请求 — 服务端校验，绝不信前端"""
    material_title: str = Field(..., min_length=1, max_length=300)
    material_content: str = Field(..., min_length=10, max_length=50_000)
    material_url: Optional[str] = Field(default=None, max_length=2000)
    source_type: str = Field(default="web", pattern=r"^(web|paper|video|book|podcast)$")


class NoteGenerateResponse(BaseModel):
    """笔记生成响应"""
    id: str
    material_title: str
    logic_chain: str = Field(..., description="核心逻辑链 — Markdown 格式")
    key_concepts: list[KeyConcept] = Field(default_factory=list)
    reflection_zone: str = Field(default="", description="用户理解留白区 — 初始为空")
    extension_questions: list[str] = Field(default_factory=list)
    cards: list[CardItem] = Field(default_factory=list)
    mindmap: Optional[dict] = Field(default=None, description="思维导图 JSON 结构")
    tags: list[str] = Field(default_factory=list)
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    took_ms: float = 0
