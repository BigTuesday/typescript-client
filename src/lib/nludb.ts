import {NludbApiBase} from './api_base'
import { EmbeddingIndex } from "./embedding_index";
import {
  CreateIndexRequest,
  CreateIndexResult,
  EmbedAndSearchRequest,
  EmbedAndSearchResult,
  EmbedRequest,
  EmbedResult,
} from './types'

export class NLUDB extends NludbApiBase {
  constructor(apiKey: string, endpoint = "https://api.nludb.com/api/v1") {
    super(apiKey, endpoint)
  }

  async embed(params: EmbedRequest): Promise<EmbedResult> {
    return (this.post("embedding/create", params)) as Promise<EmbedResult>
  }

  async embedAndSearch(params: EmbedAndSearchRequest): Promise<EmbedAndSearchResult> {
    return (this.post("embedding/search", params)) as Promise<EmbedAndSearchResult>
  }

  async createIndex(params: CreateIndexRequest): Promise<EmbeddingIndex> {
    const res = (await this.post("embedding-index/create", params)) as CreateIndexResult;
    return new EmbeddingIndex(this, params.name, params.model, res.id);
  }
}
