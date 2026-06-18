/** 资料类型 */
export type SourceType = "web" | "paper" | "video" | "book" | "podcast";

/** 搜索结果项 */
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  direct_url?: string;
  source: string;
  source_type: SourceType;
  score: number;
  summary: string;
  tags: string[];
  published_date?: string;
  reachable: boolean;
}

/** 搜索请求 */
export interface SearchRequest {
  query: string;
  source_type?: SourceType;
  page?: number;
  page_size?: number;
}

/** 搜索响应 */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
  query: string;
  took_ms: number;
}

/** 笔记 */
export interface Note {
  id: string;
  materialId: string;
  title: string;
  bodyJson: string;
  reflectionZone: string;
  extensionQuestions: string[];
  cards: CardItem[];
  mindmap: unknown;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** 问答卡片 */
export interface CardItem {
  question: string;
  answer: string;
}

/** 知识库条目 */
export interface KnowledgeEntry {
  id: string;
  title: string;
  tags: Tag[];
  materialCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 标签 */
export interface Tag {
  id: string;
  name: string;
  type: "auto" | "manual";
}

/** API 统一错误 */
export interface ApiError {
  code: string;
  message: string;
}
