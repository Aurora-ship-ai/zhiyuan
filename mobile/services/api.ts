/**
 * API 客户端 v2 — 对接服务端真实端点
 * 
 * 红线：API_KEY 决不出现于此文件，所有 AI/搜索调用经由服务端代理。
 * 开发环境下无服务端时自动降级为本地模拟。
 */
import axios, { AxiosError } from "axios";
import type { ApiError, SearchRequest, SearchResponse } from "../types";

// ============================================================
// 配置
// ============================================================
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

// 无服务端时使用本地模拟（开发用）
const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 请求拦截：注入 JWT Token
client.interceptors.request.use((config) => {
  // TODO: Phase 1 后续从安全存储读取 Token
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：统一错误处理
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      console.warn("未授权，跳转登录");
    }
    return Promise.reject(error);
  }
);

// ============================================================
// 本地模拟搜索（无服务端时降级）
// ============================================================
const MOCK_DB: Record<string, SearchResponse> = {
  "ai": {
    results: [
      { id: "ant1", title: "Building Effective Agents", url: "https://anthropic.com/engineering/building-effective-agents", source: "Anthropic", source_type: "web", score: 9.2, summary: "Anthropic 工程团队撰写的 Agent 构建权威指南——从简单工作流到自主 Agent。", tags: ["Agent", "LLM", "架构模式"], reachable: true },
      { id: "tds1", title: "AI 编程最佳实践：从 Prompt Engineering 到 Agent 工作流", url: "https://towardsdatascience.com/ai-coding-best-practices-2025", source: "Towards Data Science", source_type: "web", score: 4.8, summary: "系统梳理 AI 辅助编程的五个层次，附真实项目案例与 Prompt 模板。", tags: ["AI", "编程", "Prompt"], reachable: true },
      { id: "lc1", title: "Building Effective AI Agents with LangChain", url: "https://docs.langchain.com/agents", source: "LangChain", source_type: "web", score: 4.6, summary: "Agent 架构设计模式详解：ReAct、Planning、Multi-Agent 协作。", tags: ["Agent", "LangChain", "ReAct"], reachable: true },
      { id: "jj1", title: "Cursor 与 Copilot 深度对比：2025 AI 编程工具选型", url: "https://juejin.cn/post/ai-coding-tools-2025", source: "掘金", source_type: "web", score: 4.5, summary: "代码质量、上下文理解、多文件编辑三方面实测对比。", tags: ["工具对比", "Cursor", "Copilot"], reachable: true },
    ],
    total: 4, page: 1, page_size: 10, has_more: false, query: "", took_ms: 0,
  },
  "机器学习": {
    results: [
      { id: "arx1", title: "Attention Is All You Need — Transformer 奠基论文", url: "https://arxiv.org/abs/1706.03762", source: "arXiv", source_type: "paper", score: 9.8, summary: "提出自注意力机制替代 RNN，彻底改变 NLP 和深度学习。", tags: ["Transformer", "注意力机制", "深度学习"], reachable: true },
      { id: "ore1", title: "Hands-On Machine Learning", url: "https://oreilly.com/ml-handson", source: "OReilly", source_type: "book", score: 9.0, summary: "公认最佳的 ML 实操入门书，从线性回归到深度学习。", tags: ["机器学习", "Scikit-Learn", "TensorFlow"], reachable: true },
    ],
    total: 2, page: 1, page_size: 10, has_more: false, query: "", took_ms: 0,
  },
};

function getMockResults(query: string): SearchResponse {
  const q = query.toLowerCase();
  for (const [key, resp] of Object.entries(MOCK_DB)) {
    if (q.includes(key) || key.includes(q)) {
      return { ...resp, query, took_ms: 5 };
    }
  }
  return {
    ...MOCK_DB["ai"]!,
    query,
    took_ms: 5,
  };
}

// ============================================================
// 公开 API
// ============================================================

/** 资料搜索 */
export async function searchMaterials(req: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCK) {
    // 模拟延迟
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    return getMockResults(req.query);
  }

  const { data } = await client.post<SearchResponse>("/api/search/", req);
  return data;
}

/** 健康检查 */
export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await client.get("/api/health");
  return data;
}

export default client;

import type { NoteGenerateRequest, NoteGenerateResponse } from "../types";

/** AI 生成复习笔记 */
export async function generateNote(req: NoteGenerateRequest): Promise<NoteGenerateResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    return getMockNote(req);
  }
  const { data } = await client.post<NoteGenerateResponse>("/api/notes/generate", req);
  return data;
}

function getMockNote(req: NoteGenerateRequest): NoteGenerateResponse {
  const isAgent = req.material_title.toLowerCase().includes("agent");
  return {
    id: `mock-${Date.now()}`,
    material_title: req.material_title,
    logic_chain: isAgent
      ? "LLM 能力增强 → 工具调用赋予行动力 → 工作流编排实现多步骤协作 → Agent 自主决策 → 人工审核兜底"
      : "问题背景与动机 → 核心方法论 → 关键实现细节 → 实践案例验证 → 局限性与未来方向",
    key_concepts: isAgent
      ? [
          { term: "Agent", definition: "具备自主决策和执行能力的 AI 系统，能根据目标选择工具并采取行动" },
          { term: "Tool Use", definition: "LLM 调用外部工具获取信息或执行操作的能力" },
          { term: "Workflow", definition: "将多个 Agent 或工具调用编排成有序的执行流程" },
        ]
      : [
          { term: "核心概念1", definition: "从资料中提取的第一个关键概念的精确定义" },
          { term: "核心概念2", definition: "第二个关键概念，体现了资料的精华" },
        ],
    extension_questions: isAgent
      ? [
          "什么场景下应该用简单 Workflow 而非完整 Agent？如何判断复杂度阈值？",
          "Agent 自主决策的边界在哪里？如何平衡自动化效率和人工控制？",
        ]
      : ["这个方法论在其他领域是否适用？如何迁移？", "如何验证自己已经真正理解了这些概念？"],
    cards: isAgent
      ? [
          { question: "Agent 和传统 RPA 的核心区别？", answer: "Agent 具备推理和自主决策能力，能处理模糊目标；RPA 执行固定规则。" },
          { question: "Tool Use 的典型实现方式？", answer: "Function Calling 和 MCP 协议。" },
        ]
      : [{ question: "本文核心观点是什么？", answer: "AI 自动生成的核心摘要将在此呈现。" }],
    mindmap: isAgent
      ? { root: "Agent 系统", children: [{ name: "核心能力", children: [{ name: "推理" }, { name: "工具调用" }] }, { name: "架构模式", children: [{ name: "单Agent" }, { name: "多Agent协作" }] }] }
      : { root: req.material_title.slice(0, 20), children: [{ name: "核心观点", children: [{ name: "论点1" }] }, { name: "实践应用", children: [{ name: "场景1" }] }] },
    tags: isAgent ? ["Agent", "LLM", "AI安全"] : ["学习笔记"],
    reflection_zone: "",
    generated_at: new Date().toISOString(),
    took_ms: 600,
  };
}
