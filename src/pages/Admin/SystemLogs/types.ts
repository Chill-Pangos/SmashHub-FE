export interface ResourceMetric {
  percent: number;
  status: 'ok' | 'warning' | 'critical';
  label: string;
  usedGb?: number;
  totalGb?: number;
  path?: string;
}

export interface AlertItem {
  key: string;
  severity: 'warning' | 'critical' | 'info';
  message: string;
  createdAt: string;
  data?: any;
}

export interface AlertsSummary {
  total: number;
  critical: number;
  warning: number;
  items: AlertItem[];
}

export interface LogData {
  status: 'ok' | 'warning' | 'critical';
  uptimeSeconds: number;
  resources: {
    cpu: ResourceMetric;
    ram: ResourceMetric;
    disk: ResourceMetric;
  };
  services: {
    db: 'up' | 'down';
    redis: 'up' | 'down';
    socket: 'up' | 'down';
    cron: 'up' | 'down';
  };
  traffic: {
    window: string;
    requestCount: number;
    errorPercent: number;
    p95LatencyMs: number;
  };
  alerts: AlertsSummary;
  generatedAt: string;
}

export interface SystemLogItem {
  type: string;
  data: LogData;
  alerts: AlertsSummary;
  generatedAt: string;
}
