/**
 * Shared pagination types used across services, hooks and UI.
 */

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface PaginationMeta {
  skip: number;
  limit: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isServerPaginated: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
