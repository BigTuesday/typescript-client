import { NludbApiBase, NludbTask } from "./api_base";
import {
  DeleteResult,
  EmbedIndexResult,
  InsertRequest,
  InsertResult,
  SearchRequest,
SearchResult,
} from "./types";

export class EmbeddingIndex {
  id: string;
  name: string;
  model: string;
  nludb: NludbApiBase;

  constructor(nludb: NludbApiBase, name: string, model: string, id: string) {
    this.name = name;
    this.model = model;
    this.id = id;
    this.nludb = nludb;
  }

  async search(params: SearchRequest): Promise<SearchResult> {
    const res = (await this.nludb.post("embedding-index/search", {
      indexId: this.id,
      ...params
    })) as SearchResult;
    if (typeof res.hits == 'undefined') {
      res.hits = []
    }
    for (let i = 0; i < res.hits.length; i++) {
      try {
        if (res.hits[i].metadata) {
          res.hits[i].metadata = JSON.parse(res.hits[i].metadata as string)
        }
      } catch {
        // pass
      }
    }
    return res
  }

  async insert(params: InsertRequest): Promise<InsertResult> {
    if (typeof params.metadata == 'object') {
      params.metadata = JSON.stringify(params.metadata)
    }
    return (await this.nludb.post("embedding-index/insert", {
      indexId: this.id,
      ...params
    })) as InsertResult;
  }

  async delete(): Promise<DeleteResult> {
    return (await this.nludb.post("embedding-index/delete", {
      indexId: this.id,
    })) as DeleteResult;
  }

  async embed(): Promise<NludbTask<EmbedIndexResult>> {
    return (await this.nludb.post("embedding-index/embed", {
      indexId: this.id,
    }, true)) as NludbTask<EmbedIndexResult>;
  }
}
