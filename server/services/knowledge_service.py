"""知识库服务 — 存储、检索、标签管理"""
import time
import hashlib
import re
from datetime import datetime
from ..models.knowledge import (
    SaveNoteRequest, KnowledgeEntry, KnowledgeSearchRequest, KnowledgeSearchResponse
)


# 内存存储（MVP — 后续迁移至 SQLite/PostgreSQL）
_storage: list[KnowledgeEntry] = []


class KnowledgeService:
    """知识库 CRUD + 搜索"""

    async def save_note(self, req: SaveNoteRequest) -> KnowledgeEntry:
        # 自动标签增强
        auto_tags = self._extract_auto_tags(req)
        all_tags = list(set(req.tags + auto_tags))

        # 生成预览（前 150 字）
        preview = req.logic_chain[:150]
        if len(req.logic_chain) > 150:
            preview += "…"

        entry = KnowledgeEntry(
            id=f"kn-{hashlib.md5((req.material_title+req.logic_chain).encode()).hexdigest()[:12]}",
            material_title=req.material_title,
            material_url=req.material_url,
            note_title=req.material_title,
            logic_chain=req.logic_chain,
            key_concepts=req.key_concepts,
            extension_questions=req.extension_questions,
            cards=req.cards,
            reflection_zone=req.reflection_zone,
            tags=all_tags,
            category=req.category,
            note_preview=preview,
            saved_at=datetime.utcnow().isoformat(),
        )

        # 去重：同 ID 覆盖
        existing = [i for i, e in enumerate(_storage) if e.id == entry.id]
        if existing:
            _storage[existing[0]] = entry
        else:
            _storage.append(entry)

        return entry

    async def search(self, req: KnowledgeSearchRequest) -> KnowledgeSearchResponse:
        t0 = time.monotonic()
        results = _storage.copy()

        # 关键词搜索
        if req.query:
            q = req.query.lower()
            results = [
                e for e in results
                if q in e.material_title.lower()
                or q in e.logic_chain.lower()
                or q in e.reflection_zone.lower()
                or any(q in t.lower() for t in e.tags)
            ]

        # 标签筛选
        if req.tags:
            results = [
                e for e in results
                if all(t in e.tags for t in req.tags)
            ]

        # 分类筛选
        if req.category:
            results = [e for e in results if e.category == req.category]

        # 按保存时间倒序
        results.sort(key=lambda e: e.saved_at, reverse=True)

        total = len(results)
        start = (req.page - 1) * req.page_size
        end = start + req.page_size
        page_results = results[start:end]

        # 收集所有可用标签和分类
        all_tags = sorted(set(t for e in _storage for t in e.tags))
        all_cats = sorted(set(e.category for e in _storage if e.category))

        return KnowledgeSearchResponse(
            results=page_results,
            total=total,
            page=req.page,
            has_more=end < total,
            tags_available=all_tags,
            categories=all_cats,
        )

    def get_tags(self) -> list[str]:
        return sorted(set(t for e in _storage for t in e.tags))

    def get_stats(self) -> dict:
        return {
            "total_notes": len(_storage),
            "total_tags": len(self.get_tags()),
            "total_categories": len(set(e.category for e in _storage if e.category)),
        }

    @staticmethod
    def _extract_auto_tags(req: SaveNoteRequest) -> list[str]:
        """简易自动标签提取"""
        tags = []
        text = (req.material_title + " " + req.logic_chain).lower()
        keywords = [
            "agent", "llm", "ai", "prompt", "编程", "python", "react",
            "架构", "设计模式", "数据库", "算法", "机器学习", "深度学习",
            "前端", "后端", "api", "安全", "测试", "devops", "系统设计",
            "typescript", "javascript", "rust", "go",
        ]
        for kw in keywords:
            if kw in text:
                tags.append(kw.title() if kw.isascii() else kw)
        return tags[:8]
