import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogItemCard } from './components/LogItemCard';
import type { SystemLogItem } from './types';
import { ShieldAlert, Clock, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminSystemSummary, useAdminSystemAuditLogs } from '@/hooks/queries/useNotificationQueries';

export default function SystemLogs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cron');
  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit, setAuditLimit] = useState(50);
  const [auditAction, setAuditAction] = useState<string>('all');
  
  const { data: systemSummary, isLoading, refetch, isFetching } = useAdminSystemSummary();
  const { data: auditLogsRes, isLoading: isLoadingAudit, refetch: refetchAudit, isFetching: isFetchingAudit } = useAdminSystemAuditLogs({ 
    page: auditPage, 
    limit: auditLimit,
    action: auditAction !== 'all' ? auditAction : undefined 
  });

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
        <Button variant="outline" className="gap-2" onClick={() => { refetch(); refetchAudit(); }} disabled={isFetching || isFetchingAudit}>
          {(isFetching || isFetchingAudit) ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
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

        <TabsContent value="audit" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center bg-muted/30 p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Action:</label>
              <select 
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
                value={auditAction}
                onChange={(e) => { setAuditAction(e.target.value); setAuditPage(1); }}
              >
                <option value="all">All</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Limit:</label>
              <select 
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
                value={auditLimit}
                onChange={(e) => { setAuditLimit(Number(e.target.value)); setAuditPage(1); }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="flex-1"></div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={auditPage === 1 || isLoadingAudit}
                onClick={() => setAuditPage(p => p - 1)}
              >
                Prev
              </Button>
              <span className="text-sm font-medium min-w-[4rem] text-center">
                {auditPage} {auditLogsRes?.data?.pagination?.totalPages ? `/ ${auditLogsRes.data.pagination.totalPages}` : ''}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!auditLogsRes?.data?.pagination?.hasNextPage || isLoadingAudit}
                onClick={() => setAuditPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {isLoadingAudit ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-4">Loading audit logs...</p>
            </div>
          ) : auditLogsRes?.data?.rows && auditLogsRes.data.rows.length > 0 ? (
            <div className="rounded-md border overflow-x-auto bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="border-b">
                    <th className="p-3 text-left font-medium text-muted-foreground">Time</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Resource</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Method / Path</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Status / Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogsRes.data.rows.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="p-3">User #{log.actorUserId}</td>
                      <td className="p-3 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.action === 'create' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          log.action === 'update' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          log.action === 'delete' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-medium capitalize">{log.resourceType} {log.resourceId ? `#${log.resourceId}` : ''}</td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs">{log.method}</span>
                          <span className="text-xs text-muted-foreground">{log.path}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className={`${log.statusCode >= 400 ? 'text-destructive' : 'text-green-500'} font-medium`}>{log.statusCode}</span>
                          <span className="text-xs text-muted-foreground">{log.durationMs}ms</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/20">
              <ShieldAlert className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium">{t("adminPage.systemLogs.auditLogsData", "Audit Logs Data")}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                No audit logs found for the selected filters.
              </p>
            </div>
          )}
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
