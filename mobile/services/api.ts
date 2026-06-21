import axios, { AxiosError } from "axios";
import type { ApiError, SearchRequest, SearchResponse, NoteGenerateRequest, NoteGenerateResponse, KnowledgeEntry, KnowledgeSearchResponse } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";
const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const client = axios.create({ baseURL: BASE_URL, timeout: 30000, headers: { "Content-Type": "application/json" } });

client.interceptors.request.use((config) => {
  const token = "";
  if (token) { config.headers.Authorization = `Bearer ${token}`; }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => { return Promise.reject(error); }
);

// ===== Mock Data =====
const MOCK_RESULTS: SearchResponse = {
  results: [
    { id: "ant1", title: "Building Effective Agents", url: "https://anthropic.com/engineering/building-effective-agents", source: "Anthropic", source_type: "web", score: 9.2, summary: "Anthropic guide on building effective AI agents.", tags: ["Agent", "LLM", "Architecture"], reachable: true },
    { id: "tds1", title: "AI Coding Best Practices", url: "https://towardsdatascience.com/ai-coding-best-practices-2025", source: "Towards Data Science", source_type: "web", score: 4.8, summary: "Five levels of AI-assisted coding with real examples.", tags: ["AI", "Coding", "Prompt"], reachable: true },
    { id: "lc1", title: "Building AI Agents with LangChain", url: "https://docs.langchain.com/agents", source: "LangChain", source_type: "web", score: 4.6, summary: "Agent design patterns: ReAct, Planning, Multi-Agent.", tags: ["Agent", "LangChain"], reachable: true },
  ],
  total: 3, page: 1, page_size: 10, has_more: false, query: "", took_ms: 0,
};

function getMockResults(query: string): SearchResponse {
  return { ...MOCK_RESULTS, query, took_ms: 5 };
}

// ===== Search =====
export async function searchMaterials(req: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCK) { await new Promise((r) => setTimeout(r, 400 + Math.random() * 600)); return getMockResults(req.query); }
  const { data } = await client.post<SearchResponse>("/api/search/", req);
  return data;
}

// ===== Note Generation =====
export async function generateNote(req: NoteGenerateRequest): Promise<NoteGenerateResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      id: `mock-${Date.now()}`, material_title: req.material_title,
      logic_chain: "Core concept -> Method -> Practice -> Validation -> Future",
      key_concepts: [{ term: "Key Concept", definition: "Definition from the material." }],
      extension_questions: ["How to apply this in practice?"],
      cards: [{ question: "What is the main point?", answer: req.material_content.slice(0, 100) }],
      tags: ["learning", "notes"], reflection_zone: "",
      generated_at: new Date().toISOString(), took_ms: 500,
    };
  }
  const { data } = await client.post<NoteGenerateResponse>("/api/notes/generate", req);
  return data;
}

// ===== Knowledge Base =====
const _mockKB: KnowledgeEntry[] = [];

export async function saveNoteToKnowledge(note: any): Promise<KnowledgeEntry> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const entry: KnowledgeEntry = {
      id: `kn-${Date.now()}`, material_title: note.material_title,
      note_title: note.material_title, logic_chain: note.logic_chain,
      key_concepts: note.key_concepts, extension_questions: note.extension_questions,
      cards: note.cards, reflection_zone: note.reflection_zone || "",
      tags: note.tags || [], material_count: 1,
      saved_at: new Date().toISOString(), note_preview: note.logic_chain.slice(0, 100),
    };
    _mockKB.push(entry);
    return entry;
  }
  const { data } = await client.post("/api/knowledge/save", note);
  return data;
}

export async function searchKnowledge(query: string, tags?: string[]): Promise<KnowledgeSearchResponse> {
  const all = [..._mockKB,
    { id:"kn-1", material_title:"Building Effective Agents", note_title:"Building Effective Agents", logic_chain:"LLM -> Tool Use -> Workflow -> Agent -> Guardrails", key_concepts:[{term:"Agent",definition:"Autonomous AI system"}], extension_questions:["When to use Workflow vs Agent?"], cards:[], reflection_zone:"", tags:["Agent","LLM"], material_count:1, saved_at:"2025-06-18", note_preview:"LLM -> Tool Use..." },
  ];
  let r = all.filter((e) => !query || e.material_title.toLowerCase().includes(query.toLowerCase()));
  if (tags?.length) r = r.filter((e) => tags.every((t) => e.tags.includes(t)));
  return { results: r, total: r.length, page: 1, has_more: false, tags_available: [...new Set(all.flatMap((e) => e.tags))].sort(), categories: [] };
}

export default client;
