"""嵌入服务 — 文本向量化 & LanceDB 存储

MVP: 使用云端 Embedding API (text-embedding-3-small)
Phase 2 后期可切换为本地 BGE-M3（隐私优先）
"""
from typing import Optional
import numpy as np
import lancedb
from ..config import settings


# 向量维度
EMBEDDING_DIM = 1536  # OpenAI ada-002 / text-embedding-3-small


class EmbeddingService:
    def __init__(self):
        # LanceDB 本地嵌入式向量库
        self.db = lancedb.connect("data/vectors")
        self._ensure_table()

    def _ensure_table(self):
        """确保向量表存在"""
        try:
            self.table = self.db.open_table("notes")
        except Exception:
            import pyarrow as pa
            schema = pa.schema([
                pa.field("id", pa.string()),
                pa.field("text", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), EMBEDDING_DIM)),
                pa.field("tags", pa.string()),
                pa.field("saved_at", pa.string()),
            ])
            self.db.create_table("notes", schema=schema)
            self.table = self.db.open_table("notes")

    async def embed(self, text: str) -> list[float]:
        """生成文本向量"""
        openai_key = settings.OPENAI_API_KEY
        if openai_key and openai_key.startswith("sk-"):
            import httpx
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers={"Authorization": f"Bearer {openai_key}"},
                    json={"input": text[:8000], "model": "text-embedding-3-small"},
                )
                resp.raise_for_status()
                return resp.json()["data"][0]["embedding"]
        # 降级：简易哈希向量（开发用）
        return self._fallback_embed(text)

    def _fallback_embed(self, text: str) -> list[float]:
        """简易降级向量 — 基于词频的伪嵌入"""
        text = text.lower()
        words = text.split()
        vec = np.zeros(EMBEDDING_DIM, dtype=np.float32)
        for i, ch in enumerate(text):
            vec[hash(ch) % EMBEDDING_DIM] += 1.0
        norm = np.linalg.norm(vec) or 1.0
        return (vec / norm).tolist()

    async def index_note(self, note_id: str, title: str, content: str, tags: list[str]):
        """索引笔记到向量库"""
        text = title + " " + content
        vec = await self.embed(text)
        # 删除旧索引
        try:
            self.table.delete(f"id = '{note_id}'")
        except Exception:
            pass
        # 写入新索引
        self.table.add([{
            "id": note_id,
            "text": text[:500],
            "vector": vec,
            "tags": ",".join(tags),
            "saved_at": "",
        }])

    async def search(self, query: str, top_k: int = 10) -> list[dict]:
        """语义搜索 — 查询向量化 + 最近邻检索"""
        query_vec = await self.embed(query)
        results = self.table.search(query_vec).limit(top_k).to_list()
        return [{"id": r["id"], "text": r["text"], "score": round(1.0 - r["_distance"], 3)} for r in results]
