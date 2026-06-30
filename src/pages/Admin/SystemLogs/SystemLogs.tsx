import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, RefreshCw, Loader2, LineChart, List, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useAdminSystemAuditLogs } from '@/hooks/queries/useNotificationQueries';
import { useSystemMetrics, useSystemEvents } from '@/hooks/queries/useSystemQueries';

export default function SystemLogs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('events');
  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit, setAuditLimit] = useState(50);
  const [auditAction, setAuditAction] = useState<string>('all');
  
  const [metricsWindow, setMetricsWindow] = useState<'1m' | '5m' | '15m'>('5m');
  const [eventsType, setEventsType] = useState<'all' | 'error' | 'alert' | 'cron' | 'api'>('all');
  const [eventsLimit, setEventsLimit] = useState(50);

  const { data: auditLogsRes, isLoading: isLoadingAudit, refetch: refetchAudit, isFetching: isFetchingAudit } = useAdminSystemAuditLogs({ 
    page: auditPage, 
    limit: auditLimit,
    action: auditAction !== 'all' ? auditAction : undefined 
  });

  const { data: metricsRes, isLoading: isLoadingMetrics, refetch: refetchMetrics, isFetching: isFetchingMetrics } = useSystemMetrics({ window: metricsWindow });
  const { data: eventsRes, isLoading: isLoadingEvents, refetch: refetchEvents, isFetching: isFetchingEvents } = useSystemEvents({ 
    type: eventsType === 'all' ? undefined : eventsType, 
    limit: eventsLimit 
  });

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("adminPage.systemLogs.title", "System Logs")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("adminPage.systemLogs.description", "Monitor system health, API audit logs, and cron job executions.")}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => { refetchAudit(); refetchMetrics(); refetchEvents(); }} disabled={isFetchingAudit || isFetchingMetrics || isFetchingEvents}>
          {(isFetchingAudit || isFetchingMetrics || isFetchingEvents) ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {t("adminPage.systemLogs.refresh", "Refresh")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto sticky top-[96px] z-30 bg-background/95 backdrop-blur shadow-sm p-1 rounded-lg">
          <TabsTrigger value="events" className="gap-2 py-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{t("adminPage.systemLogs.events", "Events")}</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="gap-2 py-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("adminPage.systemLogs.metrics", "Metrics")}</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2 py-2">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">{t("adminPage.systemLogs.auditLogs", "Nhật ký hành động")}</span>
          </TabsTrigger>
        </TabsList>


        <TabsContent value="metrics" className="mt-6 space-y-4">
          <div className="flex gap-4 mb-4 items-center bg-card p-3 rounded-lg border sticky top-[152px] z-20 shadow-sm">
            <label className="text-sm font-medium">{t("adminPage.systemLogs.window")}</label>
            <Select value={metricsWindow} onValueChange={(v) => setMetricsWindow(v as any)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">{t("adminPage.systemLogs.1m")}</SelectItem>
                <SelectItem value="5m">{t("adminPage.systemLogs.5m")}</SelectItem>
                <SelectItem value="15m">{t("adminPage.systemLogs.15m")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoadingMetrics ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : metricsRes?.data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 bg-card text-center">
                  <div className="text-sm text-muted-foreground">{t("adminPage.systemLogs.totalRequests")}</div>
                  <div className="text-2xl font-bold">{metricsRes.data.requestCount}</div>
                </div>
                <div className="border rounded-lg p-4 bg-card text-center">
                  <div className="text-sm text-muted-foreground">{t("adminPage.systemLogs.errorRate")}</div>
                  <div className={`text-2xl font-bold ${metricsRes.data.errorRate > 0.05 ? 'text-red-500' : 'text-green-500'}`}>
                    {(metricsRes.data.errorRate * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-card text-center">
                  <div className="text-sm text-muted-foreground">{t("adminPage.systemLogs.p95Latency")}</div>
                  <div className="text-2xl font-bold">{metricsRes.data.latency.p95Ms}ms</div>
                </div>
                <div className="border rounded-lg p-4 bg-card text-center">
                  <div className="text-sm text-muted-foreground">{t("adminPage.systemLogs.avgLatency")}</div>
                  <div className="text-2xl font-bold">{metricsRes.data.latency.avgMs}ms</div>
                </div>
              </div>
              {metricsRes.data.slowRoutes?.length > 0 && (
                <div className="border rounded-lg overflow-hidden bg-card">
                  <div className="bg-muted px-4 py-3 font-medium border-b">{t("adminPage.systemLogs.slowRoutes")}</div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>{t("adminPage.systemLogs.route")}</TableHead>
                          <TableHead>{t("adminPage.systemLogs.count")}</TableHead>
                          <TableHead>{t("adminPage.systemLogs.avgMs")}</TableHead>
                          <TableHead>{t("adminPage.systemLogs.maxMs")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metricsRes.data.slowRoutes.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-xs">{r.route}</TableCell>
                            <TableCell>{r.count}</TableCell>
                            <TableCell className="text-orange-500 font-medium">{r.avgMs}</TableCell>
                            <TableCell className="text-red-500 font-medium">{r.maxMs}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          ) : <div className="text-center p-12 text-muted-foreground border rounded-lg border-dashed bg-muted/20">{t("adminPage.systemLogs.noMetricsData")}</div>}
        </TabsContent>

        <TabsContent value="events" className="mt-6 space-y-4">
          <div className="flex gap-4 mb-4 items-center bg-card p-3 rounded-lg border flex-wrap sticky top-[152px] z-20 shadow-sm">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{t("adminPage.systemLogs.type")}</label>
              <Select value={eventsType} onValueChange={(v) => setEventsType(v as any)}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("adminPage.systemLogs.all")}</SelectItem>
                  <SelectItem value="error">{t("adminPage.systemLogs.error")}</SelectItem>
                  <SelectItem value="alert">{t("adminPage.systemLogs.alert")}</SelectItem>
                  <SelectItem value="cron">{t("adminPage.systemLogs.cron")}</SelectItem>
                  <SelectItem value="api">{t("adminPage.systemLogs.api")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{t("adminPage.systemLogs.limit")}</label>
              <Select value={eventsLimit.toString()} onValueChange={(v) => setEventsLimit(Number(v))}>
                <SelectTrigger className="w-[100px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoadingEvents ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : eventsRes?.data ? (
            <div className="space-y-6">
              {(eventsType === 'all' || eventsType === 'error') && eventsRes.data.errors && eventsRes.data.errors.length > 0 && (
                <Collapsible defaultOpen={eventsType !== 'all'} className="border rounded-lg bg-card">
                  <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted px-4 py-3 font-medium border-b hover:bg-muted/80 transition-colors sticky top-[222px] z-10">
                    <span>{t("adminPage.systemLogs.error")}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>{t("adminPage.systemLogs.time")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.methodPath")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.status")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.error")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {eventsRes.data.errors.map((e, i) => (
                            <TableRow key={i}>
                              <TableCell className="whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</TableCell>
                              <TableCell><div className="flex flex-col gap-1"><span className="font-mono text-xs">{e.method}</span> <span className="text-xs text-muted-foreground">{e.path}</span></div></TableCell>
                              <TableCell className="text-red-500 font-medium">{e.statusCode}</TableCell>
                              <TableCell><div className="flex flex-col gap-1"><strong className="text-red-500 text-xs">{e.errorCode}</strong><span className="text-muted-foreground">{e.message}</span></div></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="bg-muted/30 p-2 border-t flex justify-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:bg-muted/50 h-8">
                          <ChevronUp className="h-4 w-4 mr-2" /> {t("adminPage.systemLogs.collapse", "Thu gọn")}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              {(eventsType === 'all' || eventsType === 'alert') && eventsRes.data.alerts && eventsRes.data.alerts.length > 0 && (
                <Collapsible defaultOpen={eventsType !== 'all'} className="border rounded-lg bg-card">
                  <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted px-4 py-3 font-medium border-b hover:bg-muted/80 transition-colors sticky top-[222px] z-10">
                    <span>{t("adminPage.systemLogs.alert")}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>{t("adminPage.systemLogs.time")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.severity")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.message")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.key")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {eventsRes.data.alerts.map((a, i) => (
                            <TableRow key={i}>
                              <TableCell className="whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</TableCell>
                              <TableCell className="capitalize">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                  {a.severity}
                                </span>
                              </TableCell>
                              <TableCell className="font-medium">{a.message}</TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{a.key}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="bg-muted/30 p-2 border-t flex justify-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:bg-muted/50 h-8">
                          <ChevronUp className="h-4 w-4 mr-2" /> {t("adminPage.systemLogs.collapse", "Thu gọn")}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              {(eventsType === 'all' || eventsType === 'cron') && eventsRes.data.cronLogs && eventsRes.data.cronLogs.length > 0 && (
                <Collapsible defaultOpen={eventsType !== 'all'} className="border rounded-lg bg-card">
                  <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted px-4 py-3 font-medium border-b hover:bg-muted/80 transition-colors sticky top-[222px] z-10">
                    <span>{t("adminPage.systemLogs.cron")}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>{t("adminPage.systemLogs.time")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.job")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.status")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.duration")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {eventsRes.data.cronLogs.map((c, i) => (
                            <TableRow key={i}>
                              <TableCell className="whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</TableCell>
                              <TableCell className="font-medium">{c.jobName}</TableCell>
                              <TableCell className="capitalize">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                  {c.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{c.durationMs}ms</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="bg-muted/30 p-2 border-t flex justify-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:bg-muted/50 h-8">
                          <ChevronUp className="h-4 w-4 mr-2" /> {t("adminPage.systemLogs.collapse", "Thu gọn")}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              {(eventsType === 'all' || eventsType === 'api') && eventsRes.data.apiRequestLogs && eventsRes.data.apiRequestLogs.length > 0 && (
                <Collapsible defaultOpen={eventsType !== 'all'} className="border rounded-lg bg-card">
                  <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted px-4 py-3 font-medium border-b hover:bg-muted/80 transition-colors sticky top-[222px] z-10">
                    <span>{t("adminPage.systemLogs.api")}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>{t("adminPage.systemLogs.time")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.methodPath")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.status")}</TableHead>
                            <TableHead>{t("adminPage.systemLogs.duration")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {eventsRes.data.apiRequestLogs.map((a, i) => (
                            <TableRow key={i}>
                              <TableCell className="whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</TableCell>
                              <TableCell><div className="flex flex-col gap-1"><span className="font-mono text-xs">{a.method}</span> <span className="text-xs text-muted-foreground">{a.path}</span></div></TableCell>
                              <TableCell><span className={`${a.success ? 'text-green-500' : 'text-red-500'} font-medium`}>{a.statusCode}</span></TableCell>
                              <TableCell className="text-muted-foreground">{a.durationMs}ms</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="bg-muted/30 p-2 border-t flex justify-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:bg-muted/50 h-8">
                          <ChevronUp className="h-4 w-4 mr-2" /> {t("adminPage.systemLogs.collapse", "Thu gọn")}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              {(!eventsRes.data.errors?.length && !eventsRes.data.alerts?.length && !eventsRes.data.cronLogs?.length && !eventsRes.data.apiRequestLogs?.length) && (
                <div className="text-center p-12 text-muted-foreground border rounded-lg border-dashed bg-muted/20">
                  {t("adminPage.systemLogs.noEventsFound")}
                </div>
              )}
            </div>
          ) : <div className="text-center p-12 text-muted-foreground border rounded-lg border-dashed bg-muted/20">{t("adminPage.systemLogs.noEventsData")}</div>}
        </TabsContent>

        <TabsContent value="audit" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center bg-card p-3 rounded-lg border sticky top-[152px] z-20 shadow-sm">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{t("adminPage.systemLogs.action")}</label>
              <Select value={auditAction} onValueChange={(v) => { setAuditAction(v); setAuditPage(1); }}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("adminPage.systemLogs.all")}</SelectItem>
                  <SelectItem value="create">{t("adminPage.systemLogs.create")}</SelectItem>
                  <SelectItem value="update">{t("adminPage.systemLogs.update")}</SelectItem>
                  <SelectItem value="delete">{t("adminPage.systemLogs.delete")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{t("adminPage.systemLogs.limit")}</label>
              <Select value={auditLimit.toString()} onValueChange={(v) => { setAuditLimit(Number(v)); setAuditPage(1); }}>
                <SelectTrigger className="w-[100px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1"></div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={auditPage === 1 || isLoadingAudit}
                onClick={() => setAuditPage(p => p - 1)}
              >
                {t("adminPage.systemLogs.prev")}
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
                {t("adminPage.systemLogs.next")}
              </Button>
            </div>
          </div>

          {isLoadingAudit ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-4">{t("adminPage.systemLogs.loadingLogs")}</p>
            </div>
          ) : auditLogsRes?.data?.rows && auditLogsRes.data.rows.length > 0 ? (
            <div className="rounded-md border overflow-x-auto bg-card">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>{t("adminPage.systemLogs.time")}</TableHead>
                    <TableHead>{t("adminPage.systemLogs.user")}</TableHead>
                    <TableHead>{t("adminPage.systemLogs.action")}</TableHead>
                    <TableHead>{t("adminPage.systemLogs.resource")}</TableHead>
                    <TableHead>{t("adminPage.systemLogs.methodPath")}</TableHead>
                    <TableHead>{t("adminPage.systemLogs.statusTime")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogsRes.data.rows.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>User #{log.actorUserId}</TableCell>
                      <TableCell className="capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.action === 'create' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          log.action === 'update' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          log.action === 'delete' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {log.action === 'create' ? t("adminPage.systemLogs.create") :
                           log.action === 'update' ? t("adminPage.systemLogs.update") :
                           log.action === 'delete' ? t("adminPage.systemLogs.delete") : log.action}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium capitalize">{log.resourceType} {log.resourceId ? `#${log.resourceId}` : ''}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs">{log.method}</span>
                          <span className="text-xs text-muted-foreground">{log.path}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`${log.statusCode >= 400 ? 'text-destructive' : 'text-green-500'} font-medium`}>{log.statusCode}</span>
                          <span className="text-xs text-muted-foreground">{log.durationMs}ms</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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


      </Tabs>
    </div>
  );
}
