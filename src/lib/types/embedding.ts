import { SearchHit } from './base'

export interface CreateIndexRequest {
  name: string;
  model: string;
  upsert?: boolean;
}

export interface EmbedRequest {
  texts: string[];
  model: string;
}

export interface EmbedResult {
  embeddings: number[][];
}

export interface EmbedAndSearchRequest {
  docs: string[];
  query: string;
  model: string;
  k?: number;
  includeMetadata?: boolean;
}

export interface EmbedAndSearchResult {
  hits: SearchHit[];
}

export interface CreateIndexResult {
  id: string;
}

export interface SearchRequest {
  query: string;
  k?: number;
  includeMetadata?: boolean;
}

export interface SearchResult {
  hits: SearchHit[];
}

export interface InsertRequest {
  value: string;
  externalId?: string;
  externalType?: string;
  metadata?: unknown;
  reindex?: boolean;
}

export interface InsertResult {
  indexId: string;
  id: string;
}

export interface DeleteResult {
  indexId: string;
}

export interface EmbedIndexResult {
  indexId: string;
}
