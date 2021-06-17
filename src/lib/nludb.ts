import { NludbApiBase } from './api_base';
import { EmbeddingIndex } from './embedding_index';
import { Models } from './models';
import {
  CreateIndexRequest,
  CreateIndexResult,
  EmbedAndSearchRequest,
  EmbedAndSearchResult,
  EmbedRequest,
  EmbedResult,
} from './types/embedding';
import { ParseRequest, ParseResponse } from './types/parsing';
import { ParsingModel } from './types/parsing_model'

export class NLUDB extends NludbApiBase {
  models: Models;

  constructor(apiKey: string, endpoint = 'https://api.nludb.com/api/v1') {
    super(apiKey, endpoint);
    this.models = new Models(this);
  }

  async embed(params: EmbedRequest): Promise<EmbedResult> {
    return this.post('embedding/create', params) as Promise<EmbedResult>;
  }

  async embedAndSearch(
    params: EmbedAndSearchRequest
  ): Promise<EmbedAndSearchResult> {
    return this.post(
      'embedding/search',
      params
    ) as Promise<EmbedAndSearchResult>;
  }

  async createIndex(params: CreateIndexRequest): Promise<EmbeddingIndex> {
    const res = (await this.post(
      'embedding-index/create',
      params
    )) as CreateIndexResult;
    return new EmbeddingIndex(this, params.name, params.model, res.id);
  }

  async parse(params: ParseRequest): Promise<ParseResponse> {
    return await this.post(
      'parser/parse',
      {
        model: ParsingModel.EN_DEFAULT,
        ...params
      }
    ) as ParseResponse;
  }
}
