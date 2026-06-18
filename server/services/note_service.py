"""
笔记生成服务 — AI 将资料转化为深度复习笔记

安全红线：
- AI API Key 从 config.settings 加载，绝不出现在代码中
- 用户资料仅用于生成笔记，处理后不持久化存储
- 请求参数经 Pydantic 严格校验
"""
import time
import hashlib
import json
from typing import Optional

import httpx

from ..config import settings
from ..models.note import (
    NoteGenerateRequest,
    NoteGenerateResponse,
    KeyConcept,
    CardItem,
)


# ============================================================
# Prompt 模板 — 核心：将资料转为结构化深度笔记
# ============================================================
NOTE_GENERATION_PROMPT = """你是一位资深学习导师。请根据以下学习资料，生成一份结构化的深度复习笔记。

## 资料标题
{title}

## 资料内容
{content}

## 输出要求
请严格按照以下 JSON 格式输出（不要输出其他内容）：

{{
  "logic_chain": "用 3-6 个步骤梳理本文的核心逻辑链条，每个步骤一句话，用 → 连接关键转折",
  "key_concepts": [
    {{"term": "概念名称", "definition": "一句话精确定义"}}
  ],
  "extension_questions": [
    "延伸思考问题1？",
    "延伸思考问题2？"
  ],
  "cards": [
    {{"question": "问答卡片正面（问题）", "answer": "问答卡片背面（答案）"}}
  ],
  "mindmap": {{
    "root": "主题",
    "children": [
      {{"name": "分支1", "children": [{{"name": "子点"}}]}}
    ]
  }},
  "tags": ["标签1", "标签2"]
}}

## 质量要求
- 逻辑链要体现因果关系，不只是罗列
- 关键概念 3-6 个，定义精准简洁
- 延伸问题要有思考深度，不是简单回顾
- 问答卡片 3-5 张，覆盖核心知识点
- 思维导图 2-3 层，结构清晰
- 所有内容使用中文（专有名词可保留英文）"""


# ============================================================
# 模拟生成器（无 API Key 时降级）
# ============================================================
class MockNoteGenerator:
    """开发环境模拟笔记生成"""

    MOCK_NOTES = {
        "agent": NoteGenerateResponse(
            id="mock-note-agent",
            material_title="Building Effective Agents",
            logic_chain=(
                "LLM 能力增强 → 工具调用(Tool Use)赋予行动能力 → "
                "工作流编排(Workflow)实现多步骤协作 → Agent 自主决策与执行 → "
                "人工审核兜底确保安全可靠"
            ),
            key_concepts=[
                KeyConcept(term="Agent", definition="具备自主决策和执行能力的 AI 系统，能根据目标选择工具并采取行动"),
                KeyConcept(term="Tool Use", definition="LLM 调用外部工具（API、数据库、代码执行器）获取信息或执行操作的能力"),
                KeyConcept(term="Workflow", definition="将多个 Agent 或工具调用编排成有序的执行流程，实现复杂任务自动化"),
                KeyConcept(term="Guardrails", definition="限制 Agent 行为的防护机制，包括输入验证、输出过滤和人工审核"),
            ],
            extension_questions=[
                "在什么场景下应该使用简单的 Workflow 而非完整的 Agent 架构？如何判断复杂度阈值？",
                "Agent 自主决策的边界在哪里？如何在自动化效率和人工控制之间取得平衡？",
                "多 Agent 协作时，如何设计通信协议确保信息不丢失、不冲突？",
            ],
            cards=[
                CardItem(question="Agent 和传统 RPA 的核心区别是什么？", answer="Agent 具备推理和自主决策能力，能处理模糊目标；RPA 执行固定规则，无法应对变化。"),
                CardItem(question="Tool Use 的典型实现方式有哪些？", answer="Function Calling（LLM 输出结构化函数调用）和 MCP 协议（标准化的工具接口）。"),
                CardItem(question="什么时候应该引入人工审核？", answer="涉及资金操作、对外发布内容、法律合规等高风险场景时必须有人工审核环节。"),
            ],
            mindmap={
                "root": "Building Effective Agents",
                "children": [
                    {"name": "核心能力", "children": [{"name": "推理"}, {"name": "工具调用"}, {"name": "记忆"}]},
                    {"name": "架构模式", "children": [{"name": "单一 Agent"}, {"name": "多 Agent 协作"}, {"name": "人机协作"}]},
                    {"name": "安全机制", "children": [{"name": "输入验证"}, {"name": "输出过滤"}, {"name": "人工兜底"}]},
                ]
            },
            tags=["Agent", "LLM", "架构设计", "AI 安全"],
            took_ms=850,
        ),
    }

    def generate(self, request: NoteGenerateRequest) -> NoteGenerateResponse:
        """根据关键词匹配模拟笔记"""
        q = (request.material_title + " " + request.material_content).lower()
        for key, note in self.MOCK_NOTES.items():
            if key in q:
                note.material_title = request.material_title
                note.took_ms = 400 + (hash(request.material_content) % 600)
                return note

        # 通用模拟
        return NoteGenerateResponse(
            id=f"mock-{hashlib.md5(request.material_content.encode()).hexdigest()[:10]}",
            material_title=request.material_title,
            logic_chain=(
                "问题背景与动机 → 核心方法论提出 → 关键实现细节 → "
                "实践案例与验证 → 局限性与未来方向"
            ),
            key_concepts=[
                KeyConcept(term="核心概念1", definition="这是从资料中提取的第一个关键概念的定义"),
                KeyConcept(term="核心概念2", definition="这是第二个关键概念的精准解释"),
                KeyConcept(term="核心概念3", definition="第三个概念，体现了资料的精华所在"),
            ],
            extension_questions=[
                "这个方法论在其他领域是否同样适用？如何迁移？",
                "如果去掉某个前提条件，结论是否依然成立？",
                "如何验证自己已经真正理解了这些概念？",
            ],
            cards=[
                CardItem(question="本文的核心观点是什么？", answer="核心观点将在此处由 AI 自动提取并生成。"),
                CardItem(question="最关键的一个概念是什么？", answer="关键概念的定义和理解要点将在此处呈现。"),
                CardItem(question="如何将本文的方法应用到实践中？", answer="实践应用的具体步骤和注意事项将在此处列出。"),
            ],
            mindmap={
                "root": request.material_title[:20],
                "children": [
                    {"name": "核心观点", "children": [{"name": "论点1"}, {"name": "论点2"}]},
                    {"name": "关键概念", "children": [{"name": "概念A"}, {"name": "概念B"}]},
                    {"name": "实践应用", "children": [{"name": "场景1"}, {"name": "场景2"}]},
                ]
            },
            tags=["学习笔记", "AI 生成"],
            took_ms=500,
        )


# ============================================================
# Claude 真实生成
# ============================================================
class ClaudeNoteGenerator:
    """Claude API 笔记生成"""

    BASE_URL = "https://api.anthropic.com/v1/messages"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate(self, request: NoteGenerateRequest) -> NoteGenerateResponse:
        prompt = NOTE_GENERATION_PROMPT.format(
            title=request.material_title,
            content=request.material_content[:15_000],  # 截断过长内容
        )

        t0 = time.monotonic()
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                self.BASE_URL,
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 4096,
                    "temperature": 0.3,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            resp.raise_for_status()
            data = resp.json()

        elapsed = (time.monotonic() - t0) * 1000

        # 解析 Claude 返回的 JSON
        content = data["content"][0]["text"]
        # 提取 JSON 块（处理可能的 markdown 包裹）
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        parsed = json.loads(content)

        return NoteGenerateResponse(
            id=f"note-{hashlib.md5(request.material_content.encode()).hexdigest()[:12]}",
            material_title=request.material_title,
            logic_chain=parsed.get("logic_chain", ""),
            key_concepts=[KeyConcept(**c) for c in parsed.get("key_concepts", [])],
            extension_questions=parsed.get("extension_questions", []),
            cards=[CardItem(**c) for c in parsed.get("cards", [])],
            mindmap=parsed.get("mindmap"),
            tags=parsed.get("tags", []),
            took_ms=round(elapsed, 1),
        )


# ============================================================
# 服务编排层
# ============================================================
class NoteService:
    def __init__(self):
        claude_key = settings.CLAUDE_API_KEY
        if claude_key and claude_key != "sk-ant-your-key":
            self.generator = ClaudeNoteGenerator(claude_key)
        else:
            self.generator = MockNoteGenerator()

    async def generate_note(self, request: NoteGenerateRequest) -> NoteGenerateResponse:
        return self.generator.generate(request) if hasattr(self.generator, 'generate') else await self.generator.generate(request)
