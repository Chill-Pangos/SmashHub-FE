export interface SystemHealthResponse {
  success: boolean;
  data: {
    app: string;
    db: string;
    redis: string;
    socket: string;
    cron: string;
    cpuPercent: number;
    ramPercent: number;
    diskPercent: number;
    generatedAt: string;
  };
}

export interface SystemMetricsParams {
  window?: '1m' | '5m' | '15m';
}

export interface SystemMetricsResponse {
  success: boolean;
  data: {
    window: string;
    requestCount: number;
    statusGroups: {
      "2xx": number;
      "3xx": number;
      "4xx": number;
      "5xx": number;
    };
    errorCount: number;
    errorRate: number;
    latency: {
      avgMs: number;
      p50Ms: number;
      p95Ms: number;
    };
    slowRoutes: {
      route: string;
      count: number;
      avgMs: number;
      maxMs: number;
    }[];
    generatedAt: string;
  };
}

export interface SystemEventsParams {
  type?: 'error' | 'alert' | 'cron' | 'api';
  limit?: number;
}

export interface SystemErrorEvent {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  errorCode: string;
  message: string;
}

export interface SystemAlertEvent {
  key: string;
  severity: string;
  message: string;
  createdAt: string;
  data: any;
}

export interface SystemCronEvent {
  id: number;
  jobName: string;
  tournamentId: number | null;
  level: string;
  status: string;
  message: string;
  meta: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemApiEvent {
  id: number;
  requestId: string | null;
  userId: number | null;
  method: string;
  path: string;
  route: string;
  statusCode: number;
  success: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  ip: string;
  userAgent: string;
  requestMeta: string | null;
  responseMeta: string | null;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemEventsResponse {
  success: boolean;
  data: {
    errors?: SystemErrorEvent[];
    alerts?: SystemAlertEvent[];
    cronLogs?: SystemCronEvent[];
    apiRequestLogs?: SystemApiEvent[];
  };
}
