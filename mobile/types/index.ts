/** 资料类型 */
export type SourceType = "web" | "paper" | "video" | "book" | "podcast";

/** 搜索结果项 */
export interface SearchResult {
  id: string;
  title: string;
  source: string;
  sourceType: SourceType;
  date: string;
  score: number;
  summary: string;
  tags: string[];
  reachable: boolean;
  url: string;
  directUrl?: string;
}

/** 搜索请求 */
export interface SearchRequest {
  query: string;
  type?: SourceType;
  page?: number;
  pageSize?: number;
}

/** 搜索响应 */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  hasMore: boolean;
}

/** 笔记 */
export interface Note {
  id: string;
  materialId: string;
  title: string;
  bodyJson: string;        // 富文本 JSON
  reflectionZone: string;  // 用户自己的理解
  extensionQuestions: string[];
  cards: CardItem[];
  mindmap: unknown;        // 思维导图 JSON
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
