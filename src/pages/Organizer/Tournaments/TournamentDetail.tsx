import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTournament, useCancelTournament } from "@/hooks/queries"; // Đảm bảo đường dẫn này đúng với project của bạn
import scheduleConfigService from "@/services/scheduleConfig.service";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/useDateFormat";

import { Calendar, MapPin, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EntriesManagement,
  OverviewTab,
  RefereeManagement,
  ScheduleConfig,
  ScheduleTab,
  PaymentManagement,
} from "@/pages/Organizer/Tournaments/TournamentDetailTabs";



export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();

  // Lấy data từ hook API
  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
  } = useTournament(id);

  const tournament = apiData;
  const isLoading = apiLoading;
  const error = apiError;

  const { data: scheduleConfig } = useQuery({
    queryKey: ['schedule-config', id],
    queryFn: () => scheduleConfigService.getScheduleConfigByTournament(id),
    enabled: !!id,
  });

  // State cho Tabs
  const [activeTab, setActiveTab] = useState("Overview");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const cancelMutation = useCancelTournament();
  const tabsMap = [
    { id: "Overview", label: t("tournamentManager.detail.tabs.overview", "Overview") },
    { id: "Referees", label: t("tournamentManager.detail.tabs.referees", "Referees") },
    { id: "Entries", label: t("tournamentManager.detail.tabs.entries", "Entries") },
    { id: "Payments", label: t("tournamentManager.detail.tabs.payments", "Payments") },
    { id: "Schedule", label: t("tournamentManager.detail.tabs.schedule", "Schedule") },
    { id: "Schedule Config", label: t("tournamentManager.detail.tabs.scheduleConfig", "Schedule Config") }
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground animate-pulse">
          {t("tournamentManager.detail.loading", "Loading tournament details...")}
        </p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-destructive/20 bg-card p-6">
        <p className="text-destructive font-medium">
          {error?.message || t("tournamentManager.detail.loadError", "Failed to load tournament")}
        </p>
      </div>
    );
  }

  // --- Hàm hỗ trợ xử lý dữ liệu ---

  // Format Event Date Function
  const formatEventDate = (start?: string, end?: string) => {
    if (!start && !end) return "TBD";
    if (start && end) {
      return `${formatDateTime(start)} - ${formatDateTime(end)}`;
    } else if (start) {
      return formatDateTime(start);
    }
    return "TBD";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab tournament={tournament} scheduleConfig={scheduleConfig} />;
      case "Referees":
        return <RefereeManagement tournamentId={id} />;
      case "Entries":
        return <EntriesManagement tournamentId={id} />;
      case "Payments":
        return <PaymentManagement tournamentId={id} />;
      case "Schedule":
        return <ScheduleTab tournamentId={id} tournament={tournament} />;
      case "Schedule Config":
        return <ScheduleConfig tournamentId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER SECTION */}
      <div className="space-y-4">
        {/* Status & ID Badge */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">{t(`constants.status.tournament.${tournament.status}`, tournament.status) as string}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ID: TRN-{new Date(tournament.createdAt).getFullYear()}-
            {tournament.id.toString().padStart(3, "0")}
          </span>
          {tournament.status !== "cancelled" && tournament.status !== "completed" && (
            <Button
              variant="destructive"
              size="sm"
              className="ml-auto"
              onClick={() => setIsCancelDialogOpen(true)}
              disabled={cancelMutation.isPending}
            >
              <Ban className="h-4 w-4 mr-2" />
              {t("tournamentManager.detail.cancelTournament.button", "Cancel Tournament")}
            </Button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tournament.name}
        </h1>

        {/* Date & Location Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {formatEventDate(scheduleConfig?.startDate, scheduleConfig?.endDate)}
            </span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabsMap.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("tournamentManager.detail.cancelTournament.title", "Cancel Tournament?")}</AlertDialogTitle>
            <AlertDialogDescription dangerouslySetInnerHTML={{ __html: t("tournamentManager.detail.cancelTournament.description", "Are you sure you want to cancel the tournament <strong>{{name}}</strong>? This action cannot be undone. Players' entries will remain, but the tournament status will be changed to cancelled. You can still manually refund payments if needed.", { name: tournament.name }) }} />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>{t("tournamentManager.detail.cancelTournament.close", "Close")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                cancelMutation.mutate(id, {
                  onSuccess: () => {
                    setIsCancelDialogOpen(false);
                    showToast.success(t("tournamentManager.detail.cancelTournament.success", "Tournament cancelled successfully"));
                  },
                  onError: (err: any) => showApiError(err, t("tournamentManager.detail.cancelTournament.error", "Failed to cancel tournament")),
                });
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? t("tournamentManager.detail.cancelTournament.cancelling", "Cancelling...") : t("tournamentManager.detail.cancelTournament.confirm", "Yes, Cancel It")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
