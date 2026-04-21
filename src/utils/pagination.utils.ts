import type { PaginatedResult, PaginationParams } from "@/types";

type JsonRecord = Record<string, unknown>;

const LIST_KEYS = [
  "items",
  "data",
  "rows",
  "results",
  "records",
  "users",
  "roles",
  "permissions",
  "tournaments",
  "entries",
  "matches",
  "schedules",
];

const toObject = (value: unknown): JsonRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const toBoolean = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
};

const normalizePaginationParams = (
  params?: PaginationParams,
): Required<PaginationParams> => {
  const skip = Math.max(0, Number(params?.skip ?? 0));
  const limit = Math.max(1, Number(params?.limit ?? 10));

  return { skip, limit };
};

const getFirstNumber = (
  keys: string[],
  ...sources: Array<JsonRecord | null>
) => {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key of keys) {
      const value = toNumber(source[key]);
      if (value !== null) {
        return value;
      }
    }
  }

  return null;
};

const getFirstBoolean = (
  keys: string[],
  ...sources: Array<JsonRecord | null>
) => {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key of keys) {
      const value = toBoolean(source[key]);
      if (value !== null) {
        return value;
      }
    }
  }

  return null;
};

const extractItemsFromObject = <T>(source: JsonRecord): T[] | null => {
  for (const key of LIST_KEYS) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return null;
};

const buildMeta = <T>(
  items: T[],
  total: number,
  skip: number,
  limit: number,
  isServerPaginated: boolean,
  explicitHasNext?: boolean | null,
  explicitHasPrevious?: boolean | null,
  explicitCurrentPage?: number | null,
  explicitTotalPages?: number | null,
): PaginatedResult<T>["meta"] => {
  const safeLimit = Math.max(1, limit);
  const safeTotal = Math.max(0, total);
  const currentPage = Math.max(
    1,
    explicitCurrentPage ?? Math.floor(skip / safeLimit) + 1,
  );
  const totalPages = Math.max(
    1,
    explicitTotalPages ?? Math.ceil((safeTotal || 1) / safeLimit),
  );
  const hasPrevious =
    explicitHasPrevious ??
    (explicitCurrentPage !== null ? currentPage > 1 : skip > 0);
  const hasNext =
    explicitHasNext ??
    (explicitTotalPages !== null
      ? currentPage < totalPages
      : skip + items.length < safeTotal);

  return {
    skip,
    limit: safeLimit,
    total: safeTotal,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    isServerPaginated,
  };
};

const paginateLocally = <T>(
  items: T[],
  params: Required<PaginationParams>,
): PaginatedResult<T> => {
  const pagedItems = items.slice(params.skip, params.skip + params.limit);

  return {
    items: pagedItems,
    meta: buildMeta(
      pagedItems,
      items.length,
      params.skip,
      params.limit,
      false,
      null,
      null,
      null,
      null,
    ),
  };
};

/**
 * Parse API payload into a stable paginated shape.
 * Supports both current full-array responses and future server-pagination payloads.
 */
export const parsePaginatedResponse = <T>(
  payload: unknown,
  params?: PaginationParams,
): PaginatedResult<T> => {
  const normalizedParams = normalizePaginationParams(params);

  if (Array.isArray(payload)) {
    return paginateLocally(payload as T[], normalizedParams);
  }

  const root = toObject(payload);
  if (!root) {
    return {
      items: [],
      meta: buildMeta(
        [],
        0,
        normalizedParams.skip,
        normalizedParams.limit,
        false,
        false,
        normalizedParams.skip > 0,
        null,
        null,
      ),
    };
  }

  const nestedDataObject = toObject(root.data);
  const rootItems = extractItemsFromObject<T>(root);
  const nestedItems = nestedDataObject
    ? extractItemsFromObject<T>(nestedDataObject)
    : null;
  const items = rootItems ?? nestedItems;

  if (!items) {
    return {
      items: [],
      meta: buildMeta(
        [],
        0,
        normalizedParams.skip,
        normalizedParams.limit,
        false,
        false,
        normalizedParams.skip > 0,
        null,
        null,
      ),
    };
  }

  const nestedMeta = toObject(root.meta) ?? toObject(root.pagination);
  const dataMeta =
    (nestedDataObject &&
      (toObject(nestedDataObject.meta) ??
        toObject(nestedDataObject.pagination))) ||
    null;

  const total = getFirstNumber(
    ["total", "totalCount", "count"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const responseSkip = getFirstNumber(
    ["skip", "offset"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const responseLimit = getFirstNumber(
    ["limit", "pageSize", "size"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const responsePage = getFirstNumber(
    ["page", "currentPage", "pageIndex"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const responseTotalPages = getFirstNumber(
    ["totalPages", "pageCount"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const hasNext = getFirstBoolean(
    ["hasNext", "hasMore", "hasNextPage"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );
  const hasPrevious = getFirstBoolean(
    ["hasPrevious", "hasPrev", "hasPrevPage", "hasPreviousPage"],
    root,
    nestedDataObject,
    nestedMeta,
    dataMeta,
  );

  const hasPaginationMetadata =
    total !== null ||
    responseSkip !== null ||
    responseLimit !== null ||
    responsePage !== null ||
    responseTotalPages !== null ||
    hasNext !== null ||
    hasPrevious !== null;

  if (!hasPaginationMetadata) {
    return paginateLocally(items, normalizedParams);
  }

  const effectiveLimit = Math.max(1, responseLimit ?? normalizedParams.limit);
  const effectiveSkip = Math.max(
    0,
    responseSkip ??
      (responsePage !== null
        ? (Math.max(1, responsePage) - 1) * effectiveLimit
        : normalizedParams.skip),
  );
  const effectiveCurrentPage =
    responsePage !== null
      ? Math.max(1, responsePage)
      : Math.floor(effectiveSkip / effectiveLimit) + 1;
  const effectiveTotal = Math.max(
    0,
    total ??
      (responseTotalPages !== null
        ? responseTotalPages * effectiveLimit
        : effectiveSkip + items.length),
  );
  const effectiveTotalPages =
    responseTotalPages !== null
      ? Math.max(1, responseTotalPages)
      : Math.max(1, Math.ceil((effectiveTotal || 1) / effectiveLimit));

  return {
    items,
    meta: buildMeta(
      items,
      effectiveTotal,
      effectiveSkip,
      effectiveLimit,
      true,
      hasNext,
      hasPrevious,
      effectiveCurrentPage,
      effectiveTotalPages,
    ),
  };
};
