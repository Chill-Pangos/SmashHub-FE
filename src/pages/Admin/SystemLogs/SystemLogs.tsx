import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogItemCard } from './components/LogItemCard';
import type { SystemLogItem } from './types';
import { ShieldAlert, Clock, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminSystemSummary } from '@/hooks/queries/useNotificationQueries';

export default function SystemLogs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cron');
  
  const { data: systemSummary, isLoading, refetch, isFetching } = useAdminSystemSummary();

  const realLogs: SystemLogItem[] = systemSummary?.data ? [{
    type: "overview",
    data: systemSummary.data as any,
    alerts: systemSummary.data.alerts as any,
    generatedAt: systemSummary.data.generatedAt
  }] : [];

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("adminPage.systemLogs.title", "System Logs")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("adminPage.systemLogs.description", "Monitor system health, API audit logs, and cron job executions.")}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {t("adminPage.systemLogs.refresh", "Refresh")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="audit" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            {t("adminPage.systemLogs.auditLogs", "Audit Logs")}
          </TabsTrigger>
          <TabsTrigger value="cron" className="gap-2">
            <Clock className="h-4 w-4" />
            {t("adminPage.systemLogs.cronLogs", "Cron Logs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-6">
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/20">
            <ShieldAlert className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">{t("adminPage.systemLogs.auditLogsData", "Audit Logs Data")}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {t("adminPage.systemLogs.auditLogsDesc", "API requests and audit data will appear here. Currently waiting for data source integration.")}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="cron" className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-4">Loading logs...</p>
            </div>
          ) : realLogs.length > 0 ? (
            realLogs.map((log, index) => (
              <LogItemCard key={index} log={log} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/20">
              <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium">{t("adminPage.systemLogs.cronLogsEmpty", "No Cron Logs")}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {t("adminPage.systemLogs.cronLogsEmptyDesc", "There are no cron logs to display at this time.")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
