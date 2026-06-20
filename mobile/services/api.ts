/**
 * API 鐎广垺鍩涚粩?v2 閳?鐎佃甯撮張宥呭缁旑垳婀＄€圭偟顏悙? * 
 * 缁俱垻鍤庨敍娆癙I_KEY 閸愬厖绗夐崙铏瑰箛娴滃孩顒濋弬鍥︽閿涘本澧嶉張?AI/閹兼粎鍌ㄧ拫鍐暏缂佸繒鏁遍張宥呭缁旑垯鍞悶鍡愨偓? * 瀵偓閸欐垹骞嗘晶鍐х瑓閺冪姵婀囬崝锛勵伂閺冩儼鍤滈崝銊╂缁狙傝礋閺堫剙婀村Ο鈩冨珯閵? */
import axios, { AxiosError } from "axios";
import type { ApiError, SearchRequest, SearchResponse } from "../types";

// ============================================================
// 闁板秶鐤?// ============================================================
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

// 閺冪姵婀囬崝锛勵伂閺冩湹濞囬悽銊︽拱閸︾増膩閹风噦绱欏鈧崣鎴犳暏閿?const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 鐠囬攱鐪伴幏锔藉焻閿涙碍鏁為崗?JWT Token
client.interceptors.request.use((config) => {
  // TODO: Phase 1 閸氬海鐢绘禒搴＄暔閸忋劌鐡ㄩ崒銊嚢閸?Token
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 閸濆秴绨查幏锔藉焻閿涙氨绮烘稉鈧柨娆掝嚖婢跺嫮鎮?client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      console.warn("閺堫亝宸块弶鍐跨礉鐠哄疇娴嗛惂璇茬秿");
    }
    return Promise.reject(error);
  }
);

// ============================================================
// 閺堫剙婀村Ο鈩冨珯閹兼粎鍌ㄩ敍鍫熸￥閺堝秴濮熺粩顖涙闂勫秶楠囬敍?// ============================================================
const MOCK_DB: Record<string, SearchResponse> = {
  "ai": {
    results: [
      { id: "ant1", title: "Building Effective Agents", url: "https://anthropic.com/engineering/building-effective-agents", source: "Anthropic", source_type: "web", score: 9.2, summary: "Anthropic engineering team guide on building effective AI agents.", tags: ["Agent", "LLM", "Architecture"], reachable: true },
      { id: "tds1", title: "AI Coding Best Practices 2025", url: "https://towardsdatascience.com/ai-coding-best-practices-2025", source: "Towards Data Science", source_type: "web", score: 4.8, summary: "Five levels of AI-assisted coding with real project examples.", tags: ["AI", "Coding", "Prompt"], reachable: true },
      { id: "lc1", title: "Building AI Agents with LangChain", url: "https://docs.langchain.com/agents", source: "LangChain", source_type: "web", score: 4.6, summary: "Agent design patterns: ReAct, Planning, Multi-Agent.", tags: ["Agent", "LangChain", "ReAct"], reachable: true },
      { id: "jj1", title: "Cursor vs Copilot 2025 Comparison", url: "https://juejin.cn/post/ai-coding-tools-2025", source: "Juejin", source_type: "web", score: 4.5, summary: "Code quality, context understanding, multi-file editing comparison.", tags: ["Tools", "Cursor", "Copilot"], reachable: true },
    ],
    total: 4, page: 1, page_size: 10, has_more: false, query: "", took_ms: 0,
  },
};
  }
  return {
    ...MOCK_DB["ai"]!,
    query,
    took_ms: 5,
  };
}

// ============================================================
// 閸忣剙绱?API
// ============================================================

/** 鐠у嫭鏋￠幖婊呭偍 */
export async function searchMaterials(req: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCK) {
    // 濡剝瀚欏鎯扮箿
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    return getMockResults(req.query);
  }

  const { data } = await client.post<SearchResponse>("/api/search/", req);
  return data;
}

/** 閸嬨儱鎮嶅Λ鈧弻?*/
export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await client.get("/api/health");
  return data;
}

export default client;

import type { KnowledgeEntry, KnowledgeSearchResponse } from "../types";

/** 淇濆瓨绗旇鍒扮煡璇嗗簱 */
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

/** 鎼滅储鐭ヨ瘑搴?*/
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
      { id:"kn-1", material_title:"Building Effective Agents", note_title:"Building Effective Agents", logic_chain:"LLM 鑳藉姏澧炲己 鈫?宸ュ叿璋冪敤璧嬩簣琛屽姩鍔?鈫?宸ヤ綔娴佺紪鎺掑疄鐜板姝ラ鍗忎綔 鈫?Agent 鑷富鍐崇瓥 鈫?浜哄伐瀹℃牳鍏滃簳", key_concepts:[{term:"Agent",definition:"鍏峰鑷富鍐崇瓥鍜屾墽琛岃兘鍔涚殑 AI 绯荤粺"}], extension_questions:["浠€涔堝満鏅敤绠€鍗?Workflow 鑰岄潪瀹屾暣 Agent锛?], cards:[{question:"Agent vs RPA 鍖哄埆锛?,answer:"Agent 鍏峰鎺ㄧ悊鑳藉姏"}], reflection_zone:"", tags:["Agent","LLM","鏋舵瀯璁捐","AI瀹夊叏"], material_count:1, saved_at:"2026-06-18T14:30:00", note_preview:"LLM 鑳藉姏澧炲己 鈫?宸ュ叿璋冪敤璧嬩簣琛屽姩鍔涒€? },
      { id:"kn-2", material_title:"AI 缂栫▼鏈€浣冲疄璺?, note_title:"AI 缂栫▼鏈€浣冲疄璺?, logic_chain:"浠ｇ爜琛ュ叏 鈫?瀵硅瘽寮忕紪绋?鈫?涓婁笅鏂囨劅鐭?鈫?Agent 宸ヤ綔娴?鈫?鑷富寮€鍙?, key_concepts:[{term:"Prompt Engineering",definition:"璁捐鍜屼紭鍖栨彁绀鸿瘝鐨勫伐绋嬫柟娉?}], extension_questions:["濡備綍寤虹珛 AI 浠ｇ爜鐨?Review 娴佺▼锛?], cards:[], reflection_zone:"", tags:["AI","缂栫▼","Prompt","宸ョ▼瀹炶返"], material_count:1, saved_at:"2026-06-17T10:00:00", note_preview:"浠ｇ爜琛ュ叏 鈫?瀵硅瘽寮忕紪绋?鈫?涓婁笅鏂囨劅鐭モ€? },
      { id:"kn-3", material_title:"绯荤粺璁捐闈㈣瘯鎸囧崡", note_title:"绯荤粺璁捐闈㈣瘯鎸囧崡", logic_chain:"闇€姹傛緞娓?鈫?瀹归噺浼扮畻 鈫?鎺ュ彛璁捐 鈫?鏁版嵁妯″瀷 鈫?鏋舵瀯鍥?鈫?娣卞害璁ㄨ", key_concepts:[{term:"CAP瀹氱悊",definition:"涓€鑷存€с€佸彲鐢ㄦ€с€佸垎鍖哄閿欎笉鍙吋寰?}], extension_questions:["濡備綍璁捐涓€涓敮鎸佺櫨涓囧苟鍙戠殑鐭摼鎺ョ郴缁燂紵"], cards:[], reflection_zone:"闇€瑕侀噸鐐圭粌涔犳暟鎹垎鐗囩瓥鐣?, tags:["绯荤粺璁捐","闈㈣瘯","鏋舵瀯"], material_count:1, saved_at:"2026-06-16T09:00:00", note_preview:"闇€姹傛緞娓?鈫?瀹归噺浼扮畻 鈫?鎺ュ彛璁捐鈥? },
    );
  }
  return _mockKB;
}

import type { NoteGenerateRequest, NoteGenerateResponse } from "../types";

/** AI 閻㈢喐鍨氭径宥勭瘎缁楁棁顔?*/
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
      ? "LLM 閼宠棄濮忔晶鐐插繁 閳?瀹搞儱鍙跨拫鍐暏鐠у绨ｇ悰灞藉З閸?閳?瀹搞儰缍斿ù浣虹椽閹烘帒鐤勯悳鏉款樋濮濄儵顎冮崡蹇庣稊 閳?Agent 閼奉亙瀵岄崘宕囩摜 閳?娴滃搫浼愮€光剝鐗抽崗婊冪俺"
      : "闂傤噣顣介懗灞炬珯娑撳骸濮╅張?閳?閺嶇绺鹃弬瑙勭《鐠?閳?閸忔娊鏁€圭偟骞囩紒鍡氬Ν 閳?鐎圭偠杩斿鍫滅伐妤犲矁鐦?閳?鐏炩偓闂勬劖鈧傜瑢閺堫亝娼甸弬鐟版倻",
    key_concepts: isAgent
      ? [
          { term: "Agent", definition: "閸忓嘲顦懛顏冨瘜閸愬磭鐡ラ崪灞惧⒔鐞涘矁鍏橀崝娑氭畱 AI 缁崵绮洪敍宀冨厴閺嶈宓侀惄顔界垼闁瀚ㄥ銉ュ徔楠炲爼鍣伴崣鏍攽閸? },
          { term: "Tool Use", definition: "LLM 鐠嬪啰鏁ゆ径鏍劥瀹搞儱鍙块懢宄板絿娣団剝浼呴幋鏍ㄥ⒔鐞涘本鎼锋担婊呮畱閼宠棄濮? },
          { term: "Workflow", definition: "鐏忓棗顦挎稉?Agent 閹存牕浼愰崗鐤殶閻劎绱幒鎺撳灇閺堝绨惃鍕⒔鐞涘本绁︾粙? },
        ]
      : [
          { term: "閺嶇绺惧鍌氬悍1", definition: "娴犲氦绁弬娆庤厬閹绘劕褰囬惃鍕儑娑撯偓娑擃亜鍙ч柨顔筋洤韫囩數娈戠划鍓р€樼€规矮绠? },
          { term: "閺嶇绺惧鍌氬悍2", definition: "缁楊兛绨╂稉顏勫彠闁款喗顩ц箛纰夌礉娴ｆ挾骞囨禍鍡氱カ閺傛瑧娈戠划鎯у磿" },
        ],
    extension_questions: isAgent
      ? [
          "娴犫偓娑斿牆婧€閺咁垯绗呮惔鏃囶嚉閻劎鐣濋崡?Workflow 閼板矂娼€瑰本鏆?Agent閿涚喎顩ф担鏇炲灲閺傤厼顦查弶鍌氬闂冨牆鈧》绱?,
          "Agent 閼奉亙瀵岄崘宕囩摜閻ㄥ嫯绔熼悾灞芥躬閸濐亪鍣烽敍鐔奉洤娴ｆ洖閽╃悰陇鍤滈崝銊ュ閺佸牏宸奸崪灞兼眽瀹搞儲甯堕崚璁圭吹",
        ]
      : ["鏉╂瑤閲滈弬瑙勭《鐠佸搫婀崗鏈电铂妫板棗鐓欓弰顖氭儊闁倻鏁ら敍鐔奉洤娴ｆ洝绺肩粔浼欑吹", "婵″倷缍嶆宀冪槈閼奉亜绻佸鑼病閻喐顒滈悶鍡毿掓禍鍡氱箹娴滄稒顩ц箛纰夌吹"],
    cards: isAgent
      ? [
          { question: "Agent 閸滃奔绱剁紒?RPA 閻ㄥ嫭鐗宠箛鍐ㄥ隘閸掝偓绱?, answer: "Agent 閸忓嘲顦幒銊ф倞閸滃矁鍤滄稉璇插枀缁涙牞鍏橀崝娑崇礉閼宠棄顦╅悶鍡樐佺化濠勬窗閺嶅浄绱盧PA 閹笛嗩攽閸ュ搫鐣剧憴鍕灟閵? },
          { question: "Tool Use 閻ㄥ嫬鍚€閸ㄥ鐤勯悳鐗堟煙瀵骏绱?, answer: "Function Calling 閸?MCP 閸楀繗顔呴妴? },
        ]
      : [{ question: "閺堫剚鏋冮弽绋跨妇鐟欏倻鍋ｉ弰顖欑矆娑斿牞绱?, answer: "AI 閼奉亜濮╅悽鐔稿灇閻ㄥ嫭鐗宠箛鍐╂喅鐟曚礁鐨㈤崷銊︻劃閸涘牏骞囬妴? }],
    mindmap: isAgent
      ? { root: "Agent 缁崵绮?, children: [{ name: "閺嶇绺鹃懗钘夊", children: [{ name: "閹恒劎鎮? }, { name: "瀹搞儱鍙跨拫鍐暏" }] }, { name: "閺嬭埖鐎Ο鈥崇础", children: [{ name: "閸楁棾gent" }, { name: "婢舵gent閸楀繋缍? }] }] }
      : { root: req.material_title.slice(0, 20), children: [{ name: "閺嶇绺剧憴鍌滃仯", children: [{ name: "鐠佽櫣鍋?" }] }, { name: "鐎圭偠杩旀惔鏃傛暏", children: [{ name: "閸︾儤娅?" }] }] },
    tags: isAgent ? ["Agent", "LLM", "AI鐎瑰鍙?] : ["鐎涳缚绡勭粭鏃囶唶"],
    reflection_zone: "",
    generated_at: new Date().toISOString(),
    took_ms: 600,
  };
}
