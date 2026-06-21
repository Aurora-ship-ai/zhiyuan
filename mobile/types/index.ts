export type SourceType = "web" | "paper" | "video" | "book" | "podcast";

export interface SearchResult {
  id: string; title: string; url: string; direct_url?: string;
  source: string; source_type: SourceType; score: number;
  summary: string; tags: string[]; published_date?: string; reachable: boolean;
}

export interface SearchRequest {
  query: string; source_type?: SourceType; page?: number; page_size?: number;
}

export interface SearchResponse {
  results: SearchResult[]; total: number; page: number; page_size: number;
  has_more: boolean; query: string; took_ms: number;
}

export interface KeyConcept { term: string; definition: string; }

export interface CardItem { question: string; answer: string; }

export interface NoteGenerateRequest {
  material_title: string; material_content: string;
  material_url?: string; source_type?: SourceType;
}

export interface NoteGenerateResponse {
  id: string; material_title: string;
  logic_chain: string; key_concepts: KeyConcept[];
  reflection_zone: string; extension_questions: string[];
  cards: CardItem[]; mindmap?: Record<string, unknown>;
  tags: string[]; generated_at: string; took_ms: number;
}

export interface Note {
  id: string; materialId: string; title: string;
  bodyJson: string; reflectionZone: string;
  extensionQuestions: string[]; cards: CardItem[];
  mindmap: unknown; tags: string[];
  createdAt: string; updatedAt: string;
}

export interface KnowledgeEntry {
  id: string; title: string; tags: Tag[]; materialCount: number;
  createdAt: string; updatedAt: string;
}

export interface Tag { id: string; name: string; type: "auto" | "manual"; }

export interface ApiError { code: string; message: string; }
