export enum NludbTaskStatus {
  waiting = 'waiting',
  running = 'running',
  succeeded = 'succeeded',
  failed = 'failed',
}
export interface TaskStatusResponse {
  taskId: string;
  taskStatus: string;
  taskCreatedOn: string;
  taskLastModifiedOn: string;
}

export interface SearchHit {
  value: string;
  score: number;
  index?: number;
  externalId?: string;
  externalType?: string;
  metadata?: unknown;
}
