import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { useCronLogDetail, useSystemApiLogDetail } from '@/hooks/queries/useSystemQueries';
import { useAdminSystemAuditLogDetail } from '@/hooks/queries/useNotificationQueries';
import { ScrollArea } from '@/components/ui/scroll-area';

export type SelectedLog = {
  type: 'cron' | 'audit' | 'api';
  id: number;
} | null;

interface LogDetailSheetProps {
  selectedLog: SelectedLog;
  onClose: () => void;
}

export function LogDetailSheet({ selectedLog, onClose }: LogDetailSheetProps) {
  const { t } = useTranslation();
  const isOpen = !!selectedLog;

  // Render content based on type
  const renderContent = () => {
    if (!selectedLog) return null;

    if (selectedLog.type === 'cron') {
      return <CronLogDetailContent id={selectedLog.id} />;
    }
    if (selectedLog.type === 'audit') {
      return <AuditLogDetailContent id={selectedLog.id} />;
    }
    if (selectedLog.type === 'api') {
      return <ApiLogDetailContent id={selectedLog.id} />;
    }

    return null;
  };

  const getTitle = () => {
    if (!selectedLog) return '';
    switch (selectedLog.type) {
      case 'cron':
        return t('adminPage.systemLogs.details.cronLogDetail');
      case 'audit':
        return t('adminPage.systemLogs.details.auditLogDetail');
      case 'api':
        return t('adminPage.systemLogs.details.apiLogDetail');
      default:
        return t('adminPage.systemLogs.details.logDetail');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl w-full flex flex-col h-full">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>{getTitle()} #{selectedLog?.id}</SheetTitle>
          <SheetDescription>
            {t('adminPage.systemLogs.details.detailDesc')}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="px-6 pb-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ----------------------------------------------------------------------
// Sub Components for each log type
// ----------------------------------------------------------------------

function CronLogDetailContent({ id }: { id: number }) {
  const { t } = useTranslation();
  const { data: res, isLoading, error } = useCronLogDetail(id);

  if (isLoading) return <LoadingIndicator />;
  if (error || !res?.data) return <ErrorIndicator error={error} />;

  const data = res.data;

  return (
    <div className="space-y-4 text-sm pb-8">
      <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.id} />
      <DetailRow label={t('adminPage.systemLogs.details.jobName')} value={data.jobName} />
      <DetailRow label={t('adminPage.systemLogs.details.status')} value={data.status} />
      <DetailRow label={t('adminPage.systemLogs.details.level')} value={data.level} />
      <DetailRow label={t('adminPage.systemLogs.details.message')} value={data.message} />
      <DetailRow label={t('adminPage.systemLogs.details.durationMs')} value={`${data.durationMs}ms`} />
      <DetailRow label={t('adminPage.systemLogs.details.startedAt')} value={new Date(data.startedAt).toLocaleString()} />
      <DetailRow label={t('adminPage.systemLogs.details.finishedAt')} value={new Date(data.finishedAt).toLocaleString()} />
      
      {data.tournament && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.tournamentInfo')}</h4>
          <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.tournament.id} />
          <DetailRow label={t('adminPage.systemLogs.details.name')} value={data.tournament.name} />
          <DetailRow label={t('adminPage.systemLogs.details.status')} value={data.tournament.status} />
          <DetailRow label={t('adminPage.systemLogs.details.location')} value={data.tournament.location} />
        </div>
      )}

      {data.meta && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.metaData')}</h4>
          <JsonViewer data={data.meta} />
        </div>
      )}
    </div>
  );
}

function AuditLogDetailContent({ id }: { id: number }) {
  const { t } = useTranslation();
  const { data: res, isLoading, error } = useAdminSystemAuditLogDetail(id);

  if (isLoading) return <LoadingIndicator />;
  if (error || !res?.data) return <ErrorIndicator error={error} />;

  const data = res.data;

  return (
    <div className="space-y-4 text-sm pb-8">
      <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.id} />
      <DetailRow label={t('adminPage.systemLogs.details.action')} value={data.action} />
      <DetailRow label={t('adminPage.systemLogs.details.resourceType')} value={data.resourceType} />
      <DetailRow label={t('adminPage.systemLogs.details.resourceId')} value={data.resourceId} />
      <DetailRow label={t('adminPage.systemLogs.details.method')} value={data.method} />
      <DetailRow label={t('adminPage.systemLogs.details.path')} value={data.path} />
      <DetailRow label={t('adminPage.systemLogs.details.statusCode')} value={data.statusCode} />
      <DetailRow label={t('adminPage.systemLogs.details.ip')} value={data.ip} />
      <DetailRow label={t('adminPage.systemLogs.details.userAgent')} value={data.userAgent} />
      <DetailRow label={t('adminPage.systemLogs.details.durationMs')} value={`${data.durationMs}ms`} />
      <DetailRow label={t('adminPage.systemLogs.details.createdAt')} value={new Date(data.createdAt).toLocaleString()} />

      {data.actor && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.actorUser')}</h4>
          <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.actor.id} />
          <DetailRow label={t('adminPage.systemLogs.details.name')} value={`${data.actor.firstName} ${data.actor.lastName}`} />
          <DetailRow label={t('adminPage.systemLogs.details.email')} value={data.actor.email} />
        </div>
      )}
    </div>
  );
}

function ApiLogDetailContent({ id }: { id: number }) {
  const { t } = useTranslation();
  const { data: res, isLoading, error } = useSystemApiLogDetail(id);

  if (isLoading) return <LoadingIndicator />;
  if (error || !res?.data) return <ErrorIndicator error={error} />;

  const data = res.data;

  return (
    <div className="space-y-4 text-sm pb-8">
      <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.id} />
      <DetailRow label={t('adminPage.systemLogs.details.requestId')} value={data.requestId} />
      <DetailRow label={t('adminPage.systemLogs.details.method')} value={data.method} />
      <DetailRow label={t('adminPage.systemLogs.details.path')} value={data.path} />
      <DetailRow label={t('adminPage.systemLogs.details.route')} value={data.route} />
      <DetailRow label={t('adminPage.systemLogs.details.statusCode')} value={data.statusCode} />
      <DetailRow label={t('adminPage.systemLogs.details.success')} value={data.success ? 'True' : 'False'} />
      {data.errorCode && <DetailRow label={t('adminPage.systemLogs.details.errorCode')} value={data.errorCode} />}
      {data.errorMessage && <DetailRow label={t('adminPage.systemLogs.details.errorMessage')} value={data.errorMessage} />}
      <DetailRow label={t('adminPage.systemLogs.details.ip')} value={data.ip} />
      <DetailRow label={t('adminPage.systemLogs.details.userAgent')} value={data.userAgent} />
      <DetailRow label={t('adminPage.systemLogs.details.durationMs')} value={`${data.durationMs}ms`} />
      <DetailRow label={t('adminPage.systemLogs.details.startedAt')} value={new Date(data.startedAt).toLocaleString()} />

      {data.user && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.user')}</h4>
          <DetailRow label={t('adminPage.systemLogs.details.id')} value={data.user.id} />
          <DetailRow label={t('adminPage.systemLogs.details.name')} value={`${data.user.firstName} ${data.user.lastName}`} />
          <DetailRow label={t('adminPage.systemLogs.details.email')} value={data.user.email} />
        </div>
      )}

      {data.requestMeta && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.requestMeta')}</h4>
          <JsonViewer data={data.requestMeta} />
        </div>
      )}

      {data.responseMeta && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">{t('adminPage.systemLogs.details.responseMeta')}</h4>
          <JsonViewer data={data.responseMeta} />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-1 border-b border-border/50 last:border-0">
      <span className="font-medium text-muted-foreground sm:w-1/3 shrink-0">{label}</span>
      <span className="font-medium sm:w-2/3 break-all">{value}</span>
    </div>
  );
}

function JsonViewer({ data }: { data: any }) {
  return (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs text-muted-foreground whitespace-pre-wrap word-break">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function ErrorIndicator({ error }: { error: any }) {
  const { t } = useTranslation();
  const errorMsg = error?.response?.data?.error?.message || error?.message || t('adminPage.systemLogs.details.errorLoading');
  return (
    <div className="p-4 bg-destructive/10 text-destructive rounded-md">
      {t('adminPage.systemLogs.details.errorPrefix')}: {errorMsg}
    </div>
  );
}
