import React, { useState } from 'react';
import type { SystemLogItem, ResourceMetric } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Server, Activity, Database, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface LogItemCardProps {
  log: SystemLogItem;
}

export const LogItemCard: React.FC<LogItemCardProps> = ({ log }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isRawOpen, setIsRawOpen] = useState(false);
  
  const data = log.data;
  const isCritical = data.status === 'critical' || log.alerts.critical > 0;
  const generatedAtDate = new Date(log.generatedAt);

  const StatusIcon = isCritical ? AlertCircle : CheckCircle2;
  const statusColor = isCritical ? 'text-destructive' : 'text-green-500';

  const formatResource = (res: ResourceMetric) => {
    return `${res.percent}%${res.usedGb ? ` (${res.usedGb}GB/${res.totalGb}GB)` : ''}`;
  };

  return (
    <Card className={cn("mb-2 overflow-hidden transition-all", isCritical ? "border-destructive/50 bg-destructive/5" : "hover:bg-muted/50")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex items-center gap-4">
              <StatusIcon className={cn("h-5 w-5", statusColor)} />
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm">
                  {t("adminPage.systemLogs.systemHealthCheck", "System Health Check")}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(generatedAtDate, { addSuffix: true })}
                  <span className="mx-1">•</span>
                  {t("adminPage.systemLogs.uptime", "Uptime")}: {Math.floor(data.uptimeSeconds / 60)}m {data.uptimeSeconds % 60}s
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Badge variant={log.alerts.total > 0 ? "destructive" : "outline"}>
                  {log.alerts.total} {t("adminPage.systemLogs.alerts", "Alerts")}
                </Badge>
                <Badge variant={data.resources.cpu.status === 'critical' ? 'destructive' : 'outline'}>
                  {t("adminPage.systemLogs.cpu", "CPU")} {data.resources.cpu.percent}%
                </Badge>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 pt-4 border-t">
              {/* Resources */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Server className="h-4 w-4" /> {t("adminPage.systemLogs.resources", "Resources")}
                </h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU:</span>
                    <span className={data.resources.cpu.status === 'critical' ? 'text-destructive font-medium' : ''}>
                      {formatResource(data.resources.cpu)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM:</span>
                    <span className={data.resources.ram.status === 'critical' ? 'text-destructive font-medium' : ''}>
                      {formatResource(data.resources.ram)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disk:</span>
                    <span className={data.resources.disk.status === 'critical' ? 'text-destructive font-medium' : ''}>
                      {formatResource(data.resources.disk)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services & Traffic */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4" /> {t("adminPage.systemLogs.servicesTraffic", "Services & Traffic")}
                </h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPage.systemLogs.dbRedis", "DB / Redis")}:</span>
                    <span>
                      <span className={data.services.db === 'up' ? 'text-green-500' : 'text-destructive'}>DB</span>
                      {' / '}
                      <span className={data.services.redis === 'up' ? 'text-green-500' : 'text-destructive'}>Redis</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPage.systemLogs.socketCron", "Socket / Cron")}:</span>
                    <span>
                      <span className={data.services.socket === 'up' ? 'text-green-500' : 'text-destructive'}>Socket</span>
                      {' / '}
                      <span className={data.services.cron === 'up' ? 'text-green-500' : 'text-destructive'}>Cron</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPage.systemLogs.requests5m", "Requests (5m)")}:</span>
                    <span>{data.traffic.requestCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPage.systemLogs.p95Latency", "p95 Latency")}:</span>
                    <span className={data.traffic.p95LatencyMs > 500 ? 'text-yellow-500 font-medium' : ''}>
                      {data.traffic.p95LatencyMs.toFixed(2)}ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" /> {t("adminPage.systemLogs.alerts", "Alerts")}
                </h4>
                {log.alerts.items.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {log.alerts.items.map((alert, idx) => (
                      <div key={idx} className="text-xs p-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                        <div className="font-medium">{alert.message}</div>
                        <div className="opacity-70 mt-1">{formatDistanceToNow(new Date(alert.createdAt))} ago</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">{t("adminPage.systemLogs.noActiveAlerts", "No active alerts")}</div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
               <Collapsible open={isRawOpen} onOpenChange={setIsRawOpen}>
                 <div className="flex items-center gap-2 mb-2">
                   <h4 className="text-sm font-semibold">{t("adminPage.systemLogs.rawJson", "Raw JSON")}</h4>
                   <CollapsibleTrigger asChild>
                     <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent">
                       {isRawOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                     </Button>
                   </CollapsibleTrigger>
                 </div>
                 <CollapsibleContent>
                   <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto w-full text-muted-foreground font-mono">
                     {JSON.stringify(log, null, 2)}
                   </pre>
                 </CollapsibleContent>
               </Collapsible>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
