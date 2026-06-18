/**
 * API 瀹㈡埛绔?v2 鈥?瀵规帴鏈嶅姟绔湡瀹炵鐐? * 
 * 绾㈢嚎锛欰PI_KEY 鍐充笉鍑虹幇浜庢鏂囦欢锛屾墍鏈?AI/鎼滅储璋冪敤缁忕敱鏈嶅姟绔唬鐞嗐€? * 寮€鍙戠幆澧冧笅鏃犳湇鍔＄鏃惰嚜鍔ㄩ檷绾т负鏈湴妯℃嫙銆? */
import axios, { AxiosError } from "axios";
import type { ApiError, SearchRequest, SearchResponse } from "../types";

// ============================================================
// 閰嶇疆
// ============================================================
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

// 鏃犳湇鍔＄鏃朵娇鐢ㄦ湰鍦版ā鎷燂紙寮€鍙戠敤锛?const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 璇锋眰鎷︽埅锛氭敞鍏?JWT Token
client.interceptors.request.use((config) => {
  // TODO: Phase 1 鍚庣画浠庡畨鍏ㄥ瓨鍌ㄨ鍙?Token
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 鍝嶅簲鎷︽埅锛氱粺涓€閿欒澶勭悊
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      console.warn("鏈巿鏉冿紝璺宠浆鐧诲綍");
    }
    return Promise.reject(error);
  }
);

// ============================================================
// 鏈湴妯℃嫙鎼滅储锛堟棤鏈嶅姟绔椂闄嶇骇锛?// ============================================================
const MOCK_DB: Record<string, SearchResponse> = {
  "ai": {
    results: [
      { id: "ant1", title: "Building Effective Agents", url: "https://anthropic.com/engineering/building-effective-agents", source: "Anthropic", source_type: "web", score: 9.2, summary: "Anthropic 宸ョ▼鍥㈤槦鎾板啓鐨?Agent 鏋勫缓鏉冨▉鎸囧崡鈥斺€斾粠绠€鍗曞伐浣滄祦鍒拌嚜涓?Agent銆?, tags: ["Agent", "LLM", "鏋舵瀯妯″紡"], reachable: true },
      { id: "tds1", title: "AI 缂栫▼鏈€浣冲疄璺碉細浠?Prompt Engineering 鍒?Agent 宸ヤ綔娴?, url: "https://towardsdatascience.com/ai-coding-best-practices-2025", source: "Towards Data Science", source_type: "web", score: 4.8, summary: "绯荤粺姊崇悊 AI 杈呭姪缂栫▼鐨勪簲涓眰娆★紝闄勭湡瀹為」鐩渚嬩笌 Prompt 妯℃澘銆?, tags: ["AI", "缂栫▼", "Prompt"], reachable: true },
      { id: "lc1", title: "Building Effective AI Agents with LangChain", url: "https://docs.langchain.com/agents", source: "LangChain", source_type: "web", score: 4.6, summary: "Agent 鏋舵瀯璁捐妯″紡璇﹁В锛歊eAct銆丳lanning銆丮ulti-Agent 鍗忎綔銆?, tags: ["Agent", "LangChain", "ReAct"], reachable: true },
      { id: "jj1", title: "Cursor 涓?Copilot 娣卞害瀵规瘮锛?025 AI 缂栫▼宸ュ叿閫夊瀷", url: "https://juejin.cn/post/ai-coding-tools-2025", source: "鎺橀噾", source_type: "web", score: 4.5, summary: "浠ｇ爜璐ㄩ噺銆佷笂涓嬫枃鐞嗚В銆佸鏂囦欢缂栬緫涓夋柟闈㈠疄娴嬪姣斻€?, tags: ["宸ュ叿瀵规瘮", "Cursor", "Copilot"], reachable: true },
    ],
    total: 4, page: 1, page_size: 10, has_more: false, query: "", took_ms: 0,
  },
  "鏈哄櫒瀛︿範": {
    results: [
      { id: "arx1", title: "Attention Is All You Need 鈥?Transformer 濂犲熀璁烘枃", url: "https://arxiv.org/abs/1706.03762", source: "arXiv", source_type: "paper", score: 9.8, summary: "鎻愬嚭鑷敞鎰忓姏鏈哄埗鏇夸唬 RNN锛屽交搴曟敼鍙?NLP 鍜屾繁搴﹀涔犮€?, tags: ["Transformer", "娉ㄦ剰鍔涙満鍒?, "娣卞害瀛︿範"], reachable: true },
      { id: "ore1", title: "Hands-On Machine Learning", url: "https://oreilly.com/ml-handson", source: "OReilly", source_type: "book", score: 9.0, summary: "鍏鏈€浣崇殑 ML 瀹炴搷鍏ラ棬涔︼紝浠庣嚎鎬у洖褰掑埌娣卞害瀛︿範銆?, tags: ["鏈哄櫒瀛︿範", "Scikit-Learn", "TensorFlow"], reachable: true },
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
// 鍏紑 API
// ============================================================

/** 璧勬枡鎼滅储 */
export async function searchMaterials(req: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCK) {
    // 妯℃嫙寤惰繜
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    return getMockResults(req.query);
  }

  const { data } = await client.post<SearchResponse>("/api/search/", req);
  return data;
}

/** 鍋ュ悍妫€鏌?*/
export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await client.get("/api/health");
  return data;
}

export default client;

import type { KnowledgeEntry, KnowledgeSearchResponse } from "../types";

/** 保存笔记到知识库 */
export async function saveNoteToKnowledge(note: {
  material_title: string; material_url?: string;
  logic_chain: string; key_concepts: {term:string;definition:string}[];
  extension_questions: string[]; cards: {question:string;answer:string}[];
  reflection_zone?: string; tags?: string[];
}): Promise<KnowledgeEntry> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return { id: `kn-${Date.now()}`, material_title: note.material_title,
      note_title: note.material_title, logic_chain: note.logic_chain,
      key_concepts: note.key_concepts, extension_questions: note.extension_questions,
      cards: note.cards, reflection_zone: note.reflection_zone || "",
      tags: note.tags || [], material_count: 1,
      saved_at: new Date().toISOString(), note_preview: note.logic_chain.slice(0, 100) };
  }
  const { data } = await client.post("/api/knowledge/save", note);
  return data;
}

/** 搜索知识库 */
export async function searchKnowledge(query: string, tags?: string[]): Promise<KnowledgeSearchResponse> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const all = getMockKnowledge();
    let r = all.filter(e => !query || e.material_title.toLowerCase().includes(query.toLowerCase()) || e.logic_chain.toLowerCase().includes(query.toLowerCase()));
    if (tags?.length) r = r.filter(e => tags.every(t => e.tags.includes(t)));
    const allTags = [...new Set(all.flatMap(e=>e.tags))].sort();
    return { results: r, total: r.length, page: 1, has_more: false, tags_available: allTags, categories: [] };
  }
  const { data } = await client.post("/api/knowledge/search", { query, tags });
  return data;
}

const _mockKB: KnowledgeEntry[] = [];
function getMockKnowledge(): KnowledgeEntry[] {
  if (_mockKB.length === 0) {
    _mockKB.push(
      { id:"kn-1", material_title:"Building Effective Agents", note_title:"Building Effective Agents", logic_chain:"LLM 能力增强 → 工具调用赋予行动力 → 工作流编排实现多步骤协作 → Agent 自主决策 → 人工审核兜底", key_concepts:[{term:"Agent",definition:"具备自主决策和执行能力的 AI 系统"}], extension_questions:["什么场景用简单 Workflow 而非完整 Agent？"], cards:[{question:"Agent vs RPA 区别？",answer:"Agent 具备推理能力"}], reflection_zone:"", tags:["Agent","LLM","架构设计","AI安全"], material_count:1, saved_at:"2026-06-18T14:30:00", note_preview:"LLM 能力增强 → 工具调用赋予行动力…" },
      { id:"kn-2", material_title:"AI 编程最佳实践", note_title:"AI 编程最佳实践", logic_chain:"代码补全 → 对话式编程 → 上下文感知 → Agent 工作流 → 自主开发", key_concepts:[{term:"Prompt Engineering",definition:"设计和优化提示词的工程方法"}], extension_questions:["如何建立 AI 代码的 Review 流程？"], cards:[], reflection_zone:"", tags:["AI","编程","Prompt","工程实践"], material_count:1, saved_at:"2026-06-17T10:00:00", note_preview:"代码补全 → 对话式编程 → 上下文感知…" },
      { id:"kn-3", material_title:"系统设计面试指南", note_title:"系统设计面试指南", logic_chain:"需求澄清 → 容量估算 → 接口设计 → 数据模型 → 架构图 → 深度讨论", key_concepts:[{term:"CAP定理",definition:"一致性、可用性、分区容错不可兼得"}], extension_questions:["如何设计一个支持百万并发的短链接系统？"], cards:[], reflection_zone:"需要重点练习数据分片策略", tags:["系统设计","面试","架构"], material_count:1, saved_at:"2026-06-16T09:00:00", note_preview:"需求澄清 → 容量估算 → 接口设计…" },
    );
  }
  return _mockKB;
}

import type { NoteGenerateRequest, NoteGenerateResponse } from "../types";

/** AI 鐢熸垚澶嶄範绗旇 */
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
      ? "LLM 鑳藉姏澧炲己 鈫?宸ュ叿璋冪敤璧嬩簣琛屽姩鍔?鈫?宸ヤ綔娴佺紪鎺掑疄鐜板姝ラ鍗忎綔 鈫?Agent 鑷富鍐崇瓥 鈫?浜哄伐瀹℃牳鍏滃簳"
      : "闂鑳屾櫙涓庡姩鏈?鈫?鏍稿績鏂规硶璁?鈫?鍏抽敭瀹炵幇缁嗚妭 鈫?瀹炶返妗堜緥楠岃瘉 鈫?灞€闄愭€т笌鏈潵鏂瑰悜",
    key_concepts: isAgent
      ? [
          { term: "Agent", definition: "鍏峰鑷富鍐崇瓥鍜屾墽琛岃兘鍔涚殑 AI 绯荤粺锛岃兘鏍规嵁鐩爣閫夋嫨宸ュ叿骞堕噰鍙栬鍔? },
          { term: "Tool Use", definition: "LLM 璋冪敤澶栭儴宸ュ叿鑾峰彇淇℃伅鎴栨墽琛屾搷浣滅殑鑳藉姏" },
          { term: "Workflow", definition: "灏嗗涓?Agent 鎴栧伐鍏疯皟鐢ㄧ紪鎺掓垚鏈夊簭鐨勬墽琛屾祦绋? },
        ]
      : [
          { term: "鏍稿績姒傚康1", definition: "浠庤祫鏂欎腑鎻愬彇鐨勭涓€涓叧閿蹇电殑绮剧‘瀹氫箟" },
          { term: "鏍稿績姒傚康2", definition: "绗簩涓叧閿蹇碉紝浣撶幇浜嗚祫鏂欑殑绮惧崕" },
        ],
    extension_questions: isAgent
      ? [
          "浠€涔堝満鏅笅搴旇鐢ㄧ畝鍗?Workflow 鑰岄潪瀹屾暣 Agent锛熷浣曞垽鏂鏉傚害闃堝€硷紵",
          "Agent 鑷富鍐崇瓥鐨勮竟鐣屽湪鍝噷锛熷浣曞钩琛¤嚜鍔ㄥ寲鏁堢巼鍜屼汉宸ユ帶鍒讹紵",
        ]
      : ["杩欎釜鏂规硶璁哄湪鍏朵粬棰嗗煙鏄惁閫傜敤锛熷浣曡縼绉伙紵", "濡備綍楠岃瘉鑷繁宸茬粡鐪熸鐞嗚В浜嗚繖浜涙蹇碉紵"],
    cards: isAgent
      ? [
          { question: "Agent 鍜屼紶缁?RPA 鐨勬牳蹇冨尯鍒紵", answer: "Agent 鍏峰鎺ㄧ悊鍜岃嚜涓诲喅绛栬兘鍔涳紝鑳藉鐞嗘ā绯婄洰鏍囷紱RPA 鎵ц鍥哄畾瑙勫垯銆? },
          { question: "Tool Use 鐨勫吀鍨嬪疄鐜版柟寮忥紵", answer: "Function Calling 鍜?MCP 鍗忚銆? },
        ]
      : [{ question: "鏈枃鏍稿績瑙傜偣鏄粈涔堬紵", answer: "AI 鑷姩鐢熸垚鐨勬牳蹇冩憳瑕佸皢鍦ㄦ鍛堢幇銆? }],
    mindmap: isAgent
      ? { root: "Agent 绯荤粺", children: [{ name: "鏍稿績鑳藉姏", children: [{ name: "鎺ㄧ悊" }, { name: "宸ュ叿璋冪敤" }] }, { name: "鏋舵瀯妯″紡", children: [{ name: "鍗旳gent" }, { name: "澶欰gent鍗忎綔" }] }] }
      : { root: req.material_title.slice(0, 20), children: [{ name: "鏍稿績瑙傜偣", children: [{ name: "璁虹偣1" }] }, { name: "瀹炶返搴旂敤", children: [{ name: "鍦烘櫙1" }] }] },
    tags: isAgent ? ["Agent", "LLM", "AI瀹夊叏"] : ["瀛︿範绗旇"],
    reflection_zone: "",
    generated_at: new Date().toISOString(),
    took_ms: 600,
  };
}
