
"""笔记生成服务 — 三遍法重构 + 质量闸门"""
import time, hashlib, json, asyncio
from typing import Optional
from ..config import settings
from ..models.note import NoteGenerateRequest, NoteGenerateResponse, KeyConcept, CardItem

# ===== 三遍法 Prompt =====
NOTE_PROMPT = """你是一位资深学习导师。请用三遍法为以下学习资料生成深度复习笔记。

## 资料
标题: {title}
内容: {content}

## 第一遍：结构拆解
识别资料包含的所有主题和子话题，输出结构大纲。
要求：覆盖所有段落，不遗漏任何知识点。

## 第二遍：逐段深挖
对每个主题：
- 提取核心论点（3-5 条）
- 定义关键术语（每个术语一句话精确定义）
- 找出与其他主题的关联
- 提炼支撑证据和案例

## 第三遍：整合输出
生成完整笔记，包括：
1. logic_chain: 核心逻辑链，3-6步，每步一句话，用 → 连接
2. key_concepts: 6-10个关键概念，每概念含 term（术语）和 definition（精准定义）
3. extension_questions: 5-8个深度思考问题，要求有思辨性
4. cards: 5-8张问答卡片(Anki式)，覆盖所有核心知识点
5. mindmap: 思维导图JSON，3层结构，root+children
6. tags: 5-8个分类标签

## 质量闸门
- 关键概念数 >= ceil(原文字数/500) 且 >= 5
- 问答卡片数 >= 关键概念数 * 0.8
- 所有内容用中文，专有名词可保留英文

请直接输出 JSON，格式如下：
{{
  "logic_chain": "...",
  "key_concepts": [{{"term": "...", "definition": "..."}}],
  "extension_questions": ["..."],
  "cards": [{{"question": "...", "answer": "..."}}],
  "mindmap": {{"root": "...", "children": [...]}},
  "tags": ["..."]
}}"""


class MockNoteGenerator:
    """增强版模拟生成器 — 更丰富的输出"""

    def generate(self, req: NoteGenerateRequest) -> NoteGenerateResponse:
        txt = (req.material_title + " " + req.material_content).lower()
        word_count = len(req.material_content)
        concept_count = max(5, min(10, word_count // 500))

        # Agent 专题
        if "agent" in txt:
            logic = "LLM基础推理能力 → Tool Use赋予外部交互能力 → Workflow编排多步骤 → Multi-Agent协作 → Guardrails安全兜底"
            concepts = [
                KeyConcept(term="Agent", definition="具备自主感知、推理、决策和执行能力的AI系统，能在不确定环境中完成复杂目标"),
                KeyConcept(term="Tool Use", definition="LLM通过Function Calling或MCP协议调用外部API、数据库和代码执行器的能力"),
                KeyConcept(term="Workflow", definition="将多个独立的工具调用或子任务编排为有序、可追踪、可回滚的执行链路"),
                KeyConcept(term="Multi-Agent", definition="多个Agent通过通信协议协作完成单个Agent无法处理的复杂任务"),
                KeyConcept(term="Guardrails", definition="防护机制层：输入验证、输出过滤、操作权限控制与人工审核节点"),
                KeyConcept(term="ReAct模式", definition="Reasoning + Acting：Agent交替进行推理和行动，每一步都基于上一步结果动态决策"),
            ][:concept_count]
            questions = [
                "如何量化一个任务是否需要Agent？能否建立决策树来判断？",
                "Tool Use的Function Calling和MCP协议各有什么优劣？什么场景选哪种？",
                "多Agent协作时，信息如何在Agent间传递而不丢失上下文？",
                "Guardrails设计中最容易被忽略的安全漏洞是什么？",
                "Agent的自主决策权和人类监督权如何做精细化切分？",
                "当前Agent架构最大的瓶颈是什么？未来可能的突破方向？",
            ]
            cards = [
                CardItem(question="Agent和传统RPA的本质区别是什么？", answer="Agent具备推理和自主决策能力，能根据环境变化动态调整行为；RPA仅执行预设固定规则。关键在于Agent拥有'判断力'。"),
                CardItem(question="Tool Use的两种主流实现方式？", answer="Function Calling：LLM直接输出结构化函数调用。MCP协议：标准化的工具接口规范，实现LLM与工具的松耦合集成。"),
                CardItem(question="什么场景下应该用Workflow而非完整Agent？", answer="当任务步骤固定、不依赖动态决策时，Workflow更简单可靠。Agent适用于需要根据中间结果调整策略的复杂场景。"),
                CardItem(question="Agent的自主决策如何做权限分级？", answer="Level1-只读查询/Level2-内部操作/Level3-外部通信/Level4-资金操作/Level5-系统级变更。每级需要不同的审核机制。"),
                CardItem(question="Agent的记忆机制如何设计？", answer="短期记忆（上下文窗口）+ 长期记忆（向量数据库）+ 工作记忆（当前任务状态）。关键是记忆的检索精度和遗忘策略。"),
            ][:max(5, concept_count-1)]
            mindmap = {"root":"Agent系统","children":[
                {"name":"核心能力","children":[{"name":"推理"},{"name":"工具调用"},{"name":"记忆"}]},
                {"name":"架构模式","children":[{"name":"单Agent"},{"name":"Multi-Agent"},{"name":"人机协作"}]},
                {"name":"安全机制","children":[{"name":"输入验证"},{"name":"输出过滤"},{"name":"权限分级"},{"name":"人工兜底"}]},
            ]}
            tags = ["Agent","LLM","Tool Use","Workflow","AI安全","架构设计"]
        # 机器学习专题
        elif "machine" in txt or "learning" in txt or "机器" in txt:
            logic = "数据准备与特征工程 → 模型选择与训练 → 超参数调优 → 评估与验证 → 部署与监控"
            concepts = [
                KeyConcept(term="监督学习", definition="使用带标签的数据训练模型，学习输入到输出的映射关系"),
                KeyConcept(term="过拟合", definition="模型在训练数据上表现极好但在新数据上表现差的现像，通常由模型过于复杂或数据不足引起"),
                KeyConcept(term="特征工程", definition="从原始数据中提取、转换和选择有用特征的过程，决定模型性能的上限"),
                KeyConcept(term="交叉验证", definition="将数据分成K份，轮流用K-1份训练、1份验证，减少单次划分的偶然性"),
                KeyConcept(term="梯度下降", definition="通过计算损失函数的梯度来迭代更新模型参数的优化算法"),
            ][:concept_count]
            questions = ["如何判断一个问题是监督学习还是无监督学习？","特征工程的自动化程度有多高？未来会被AutoML完全取代吗？"]
            cards = [CardItem(question="过拟合如何检测和解决？", answer="检测：训练集和验证集性能差距大。解决：增加数据、正则化(L1/L2)、Dropout、早停、减少模型复杂度。")]
            mindmap = {"root":"机器学习","children":[{"name":"监督学习","children":[{"name":"分类"},{"name":"回归"}]},{"name":"模型优化","children":[{"name":"正则化"},{"name":"超参数调优"}]}]}
            tags = ["机器学习","ML","特征工程","模型优化"]
        # 系统设计专题
        elif "system" in txt or "design" in txt or "系统" in txt:
            logic = "需求澄清 → 容量估算 → 接口设计 → 数据模型 → 架构选型 → 深度讨论"
            concepts = [
                KeyConcept(term="CAP定理", definition="分布式系统中，一致性(C)、可用性(A)、分区容错(P)三者不可兼得，最多同时满足两个"),
                KeyConcept(term="分片", definition="将大数据集水平切分到多个数据库节点，实现横向扩展和提高并发能力"),
                KeyConcept(term="缓存策略", definition="Cache-Aside/Read-Through/Write-Through/Write-Behind，不同场景选不同策略"),
            ][:concept_count]
            questions = ["CAP定理在实际工程中如何做取舍？","微服务拆分粒度如何判断是否合理？"]
            cards = [CardItem(question="Redis适合做什么不适合做什么？", answer="适合：缓存、计数器、分布式锁、消息队列。不适合：大value存储（内存贵）、需要复杂查询的数据。")]
            mindmap = {"root":"系统设计","children":[{"name":"数据层","children":[{"name":"分库分表"},{"name":"缓存"}]},{"name":"服务层","children":[{"name":"微服务"},{"name":"API设计"}]}]}
            tags = ["系统设计","分布式","架构"]
        else:
            logic = "背景与动机 → 核心方法论 → 关键实现 → 实践验证 → 局限与展望"
            concepts = [KeyConcept(term="核心概念", definition="这是从资料中提取的关键定义的示例，实际使用时由AI自动生成")]
            questions = ["如何将本文的方法应用到实际项目中？"]
            cards = [CardItem(question="本文最重要的一个观点是什么？", answer="请结合原文内容深入理解")]
            mindmap = {"root":req.material_title[:20],"children":[{"name":"核心观点","children":[{"name":"论点1"}]}]}
            tags = ["学习笔记"]

        return NoteGenerateResponse(
            id=f"note-{hashlib.md5(req.material_content.encode()).hexdigest()[:12]}",
            material_title=req.material_title,
            logic_chain=logic,
            key_concepts=concepts,
            extension_questions=questions,
            cards=cards,
            mindmap=mindmap,
            tags=tags,
            took_ms=300 + (hash(req.material_content) % 700),
        )


class NoteService:
    """笔记服务 — 自动选择生成器"""
    def __init__(self):
        self.mock = MockNoteGenerator()

    async def generate_note(self, req: NoteGenerateRequest) -> NoteGenerateResponse:
        key = settings.CLAUDE_API_KEY
        if key and key != "sk-ant-your-key":
            # TODO: 真实Claude三遍法调用
            return self.mock.generate(req)
        return self.mock.generate(req)
