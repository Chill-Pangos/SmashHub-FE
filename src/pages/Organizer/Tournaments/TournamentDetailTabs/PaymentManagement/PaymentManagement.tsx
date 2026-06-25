import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import {
  useTournamentCategoriesByTournament,
  usePaymentStatistics,
  usePendingPayments,
  usePaymentsByCategory,
  usePayment,
  useConfirmPayment,
  useRejectPayment,
  useRefundPayment,
} from "@/hooks/queries";
import PaymentStatsCards from "./components/PaymentStatsCards";
import PendingPaymentsList from "./components/PendingPaymentsList";
import PaymentDetailDialog from "./components/PaymentDetailDialog";
import type { Payment } from "@/types/payment.types";
import { showToast, showApiError } from "@/utils/toast.utils";

interface PaymentManagementProps {
  tournamentId: number;
}

type ViewMode = "pending" | "all";

export default function PaymentManagement({
  tournamentId,
}: PaymentManagementProps) {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("pending");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [paymentToRejectId, setPaymentToRejectId] = useState<number | null>(null);
  const [page] = useState(1);

  // Categories
  const { data: categoriesData } = useTournamentCategoriesByTournament(
    tournamentId,
    1,
    50,
  );
  const categories = (categoriesData as any[]) || [];

  // Auto-select first category
  const categoryId = selectedCategoryId
    ? parseInt(selectedCategoryId)
    : categories[0]?.id || 0;

  // Stats
  const { data: statsResponse, isLoading: statsLoading, error: statsError } =
    usePaymentStatistics(categoryId, { enabled: categoryId > 0 });
  const stats = statsResponse?.data;

  // Pending payments
  const { data: pendingResponse, isLoading: pendingLoading, error: pendingError } =
    usePendingPayments(categoryId, page, 20, undefined, {
      enabled: categoryId > 0 && viewMode === "pending",
    });
  const pendingPayments = pendingResponse?.data?.rows || [];

  // All payments (with filter)
  const { data: allResponse, isLoading: allLoading, error: allError } = usePaymentsByCategory(
    categoryId,
    page,
    20,
    statusFilter === "all" ? undefined : statusFilter,
    undefined,
    { enabled: categoryId > 0 && viewMode === "all" },
  );
  const allPayments = allResponse?.data?.rows || [];

  // Payment detail
  const { data: paymentDetailResponse } = usePayment(selectedPaymentId || 0, {
    enabled: !!selectedPaymentId,
  });
  const paymentDetail = paymentDetailResponse?.data || null;

  // Mutations
  const confirmMutation = useConfirmPayment();
  const rejectMutation = useRejectPayment();
  const refundMutation = useRefundPayment();

  const handleConfirm = (paymentId: number) => {
    confirmMutation.mutate(paymentId, {
      onSuccess: () => {
        setSelectedPaymentId(null);
        showToast.success(t("tournamentManager.paymentManagement.confirmSuccess", "Payment confirmed successfully"));
      },
      onError: (err: any) => showApiError(err, t("tournamentManager.paymentManagement.confirmError", "Failed to confirm payment")),
    });
  };

  const handleReject = (paymentId: number) => {
    setPaymentToRejectId(paymentId);
  };

  const confirmReject = () => {
    if (paymentToRejectId !== null) {
      rejectMutation.mutate(paymentToRejectId, {
        onSuccess: () => {
          setSelectedPaymentId(null);
          setPaymentToRejectId(null);
          showToast.success(t("tournamentManager.paymentManagement.rejectSuccess", "Payment rejected successfully"));
        },
        onError: (err: any) => showApiError(err, t("tournamentManager.paymentManagement.rejectError", "Failed to reject payment")),
      });
    }
  };

  const handleRefund = (paymentId: number, file: File) => {
    refundMutation.mutate(
      { paymentId, file },
      { 
        onSuccess: () => {
          setSelectedPaymentId(null);
          showToast.success(t("tournamentManager.paymentManagement.refundSuccess", "Payment refunded successfully"));
        },
        onError: (err: any) => showApiError(err, t("tournamentManager.paymentManagement.refundError", "Failed to refund payment")),
      },
    );
  };

  const statusBadges: { value: string; label: string; color: string }[] = [
    { value: "all", label: t("tournamentManager.paymentManagement.filter.all", "All"), color: "" },
    { value: "pending", label: t("tournamentManager.paymentManagement.filter.pending", "Pending"), color: "text-orange-500" },
    { value: "completed", label: t("tournamentManager.paymentManagement.filter.completed", "Completed"), color: "text-green-500" },
    { value: "failed", label: t("tournamentManager.paymentManagement.filter.failed", "Failed"), color: "text-destructive" },
    { value: "refunded", label: t("tournamentManager.paymentManagement.filter.refunded", "Refunded"), color: "text-blue-500" },
  ];

  useEffect(() => {
    const err: any = statsError || pendingError || allError;
    if (err && err.response?.status === 403) {
      showToast.error(t("tournamentManager.paymentManagement.forbidden", "You do not have permission to view or manage payments for this tournament."));
    }
  }, [statsError, pendingError, allError, t]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header + Category Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("tournamentManager.paymentManagement.title", "Payment Management")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("tournamentManager.paymentManagement.subtitle", "Review and manage tournament entry payments")}
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {t("tournamentManager.paymentManagement.category", "Category")}
          </label>
          <Select
            value={categoryId.toString()}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger className="w-[200px] bg-input border-border">
              <SelectValue
                placeholder={t("tournamentManager.paymentManagement.selectCategory", "Select category")}
              />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
              {categories.length === 0 && (
                <SelectItem value="0" disabled>
                  {t("tournamentManager.paymentManagement.noCategories", "No categories")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <PaymentStatsCards stats={stats} isLoading={statsLoading} />

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setViewMode("pending")}
          className={`px-4 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            viewMode === "pending"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("tournamentManager.paymentManagement.pendingTab", "Pending Review")}
          {stats?.pending ? (
            <Badge variant="secondary" className="ml-2 text-xs">
              {stats.pending}
            </Badge>
          ) : null}
        </button>
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            viewMode === "all"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("tournamentManager.paymentManagement.allTab", "All Payments")}
        </button>
      </div>

      {/* Status Filter (only for "all" view) */}
      {viewMode === "all" && (
        <div className="flex gap-2 flex-wrap">
          {statusBadges.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                statusFilter === s.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Payment List */}
      {viewMode === "pending" ? (
        <PendingPaymentsList
          payments={pendingPayments}
          isLoading={pendingLoading}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onViewDetail={setSelectedPaymentId}
          isConfirming={confirmMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      ) : (
        <PendingPaymentsList
          payments={allPayments}
          isLoading={allLoading}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onViewDetail={setSelectedPaymentId}
          isConfirming={confirmMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      )}

      <PaymentDetailDialog
        payment={paymentDetail as Payment | null}
        open={!!selectedPaymentId}
        onClose={() => setSelectedPaymentId(null)}
        onConfirm={handleConfirm}
        onReject={handleReject}
        onRefund={handleRefund}
        isConfirming={confirmMutation.isPending}
        isRejecting={rejectMutation.isPending}
        isRefunding={refundMutation.isPending}
      />
      <AlertDialog open={paymentToRejectId !== null} onOpenChange={(open) => !open && setPaymentToRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("tournamentManager.paymentManagement.rejectTitle", "Reject Payment?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("tournamentManager.paymentManagement.rejectDesc", "Are you sure you want to reject this payment? This will mark the payment as failed.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectMutation.isPending}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              disabled={rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMutation.isPending ? t("common.rejecting", "Rejecting...") : t("common.reject", "Reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
