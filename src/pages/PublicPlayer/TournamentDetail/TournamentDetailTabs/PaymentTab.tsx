import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ImageIcon,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/api.utils";
import type { Tournament } from "@/types/tournament.types";
import { showToast, showApiError } from "@/utils/toast.utils";
import {
  useMyEntries,
  usePaymentsByEntry,
  useCreatePayment,
  useUpdatePaymentProof,
} from "@/hooks/queries";

interface PaymentTabProps {
  tournamentId: number;
  tournament: Tournament;
}

export default function PaymentTab({ tournament }: PaymentTabProps) {
  const { t } = useTranslation();
  const categories = tournament?.categories || [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories.length > 0 ? categories[0].id || null : null,
  );

  const { data: myEntriesData, isLoading: isLoadingEntries } = useMyEntries();

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Find user's entry for selected category
  const myEntryRaw = myEntriesData?.rows?.find((row: any) => {
    const catId = row.entry ? row.entry.categoryId : row.categoryId;
    return catId === selectedCategoryId;
  });
  const myEntry: any = myEntryRaw?.entry || myEntryRaw;
  const entryId = myEntry?.id || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("publicPlayer.paymentTab.title", "Payment")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("publicPlayer.paymentTab.subtitle", "Manage your entry payment for this tournament")}
        </p>
      </div>

      {/* Category Selector */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id || null)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border whitespace-nowrap transition-colors ${
                selectedCategoryId === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {isLoadingEntries ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">
          {t("publicPlayer.paymentTab.loading", "Checking payment status...")}
        </div>
      ) : !selectedCategory ? (
        <div className="py-10 text-center text-muted-foreground">
          {t("publicPlayer.paymentTab.noCategory", "Please select a category")}
        </div>
      ) : !myEntry ? (
        <NoEntryView />
      ) : !myEntry.isConfirmed ? (
        <NotConfirmedView />
      ) : (
        <PaymentFlowView
          entryId={entryId}
          entryFee={selectedCategory.entryFee}
          categoryName={selectedCategory.name}
        />
      )}
    </div>
  );
}

function NoEntryView() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
      <h3 className="font-semibold text-lg">
        {t("publicPlayer.paymentTab.noEntry", "No Registration Found")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {t("publicPlayer.paymentTab.noEntryDesc", "You need to register for this category first. Go to the Registration tab to get started.")}
      </p>
    </div>
  );
}

function NotConfirmedView() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-8 text-center space-y-3">
      <Clock className="h-10 w-10 text-orange-500 mx-auto" />
      <h3 className="font-semibold text-lg text-orange-500">
        {t("publicPlayer.paymentTab.notConfirmed", "Lineup Not Confirmed")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {t("publicPlayer.paymentTab.notConfirmedDesc", "You must confirm your lineup before making a payment. Go to the Registration tab to confirm.")}
      </p>
    </div>
  );
}

function PaymentFlowView({
  entryId,
  entryFee,
  categoryName,
}: {
  entryId: number;
  entryFee?: number | null;
  categoryName?: string;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const { data: paymentsResponse, isLoading } = usePaymentsByEntry(entryId, 1, 5);
  const payments = paymentsResponse?.data?.rows || [];
  const latestPayment = payments[0];

  const createMutation = useCreatePayment();
  const uploadProofMutation = useUpdatePaymentProof();

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreatePayment = () => {
    if (!entryFee) return;
    createMutation.mutate({ entryId, amount: entryFee }, {
      onSuccess: () => {
        showToast.success(t("publicPlayer.paymentTab.createSuccess", "Payment request created successfully"));
      },
      onError: (err: any) => {
        showApiError(err, t("publicPlayer.paymentTab.createError", "Failed to create payment request"));
      }
    });
  };

  const handleUploadProof = (file: File) => {
    if (!latestPayment) return;
    uploadProofMutation.mutate(
      { paymentId: latestPayment.id, file },
      {
        onSuccess: () => {
          setProofPreview(null);
          showToast.success(t("publicPlayer.paymentTab.uploadSuccess", "Proof uploaded successfully"));
        },
        onError: (err: any) => {
          setProofPreview(null);
          showApiError(err, t("publicPlayer.paymentTab.uploadError", "Failed to upload proof"));
        }
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onload = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
      handleUploadProof(file);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-muted-foreground animate-pulse">
        {t("publicPlayer.paymentTab.loadingPayment", "Loading payment info...")}
      </div>
    );
  }

  // No payment yet → Create
  if (!latestPayment || latestPayment.status === "failed") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {t("publicPlayer.paymentTab.createPayment", "Create Payment")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {categoryName} — {t("publicPlayer.paymentTab.entryFee", "Entry Fee")}:{" "}
              <span className="font-bold text-primary">{formatCurrency(entryFee)}</span>
            </p>
          </div>
        </div>

        {latestPayment?.status === "failed" && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">
                {t("publicPlayer.paymentTab.previousFailed", "Previous payment was rejected")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("publicPlayer.paymentTab.previousFailedDesc", "You can create a new payment to try again.")}
              </p>
            </div>
          </div>
        )}

        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleCreatePayment}
          disabled={createMutation.isPending || !entryFee}
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {t("publicPlayer.paymentTab.createPaymentBtn", "Create Payment Request")} — {formatCurrency(entryFee)}
        </Button>
      </div>
    );
  }

  // Payment exists
  const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bgColor: string; borderColor: string; label: string }> = {
    pending: {
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      label: t("publicPlayer.paymentTab.statusPending", "Pending Review"),
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      label: t("publicPlayer.paymentTab.statusCompleted", "Payment Confirmed"),
    },
    refunded: {
      icon: RotateCcw,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      label: t("publicPlayer.paymentTab.statusRefunded", "Refunded"),
    },
  };

  const status = latestPayment.status || "pending";
  const info = statusConfig[status] || statusConfig.pending;
  const StatusIcon = info.icon;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`rounded-xl border ${info.borderColor} ${info.bgColor} p-6`}>
        <div className="flex items-center gap-4">
          <StatusIcon className={`h-8 w-8 ${info.color}`} />
          <div>
            <h3 className={`text-lg font-bold ${info.color}`}>{info.label}</h3>
            <p className="text-sm text-muted-foreground">
              {t("publicPlayer.paymentTab.amount", "Amount")}: {formatCurrency(latestPayment.amount)} —{" "}
              {t("publicPlayer.paymentTab.paymentId", "Payment")} #{latestPayment.id}
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs uppercase">
            {status}
          </Badge>
        </div>
      </div>

      {/* Proof Upload — only for pending */}
      {status === "pending" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              {t("publicPlayer.paymentTab.proofUpload", "Upload Payment Proof")}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("publicPlayer.paymentTab.proofUploadDesc", "Upload a screenshot or photo of your bank transfer receipt.")}
          </p>

          {/* Proof Image Upload Area */}
          <div 
            className="relative group cursor-pointer rounded-lg border-2 border-dashed border-border overflow-hidden bg-secondary/30 hover:border-primary/50 transition-colors"
            onClick={() => !uploadProofMutation.isPending && fileInputRef.current?.click()}
          >
            {proofPreview && uploadProofMutation.isPending ? (
              <img
                src={proofPreview}
                alt="Uploading..."
                className="w-full max-h-[300px] object-contain opacity-50"
              />
            ) : latestPayment.proofImageUrl ? (
              <img
                src={getImageUrl(latestPayment.proofImageUrl)}
                alt="Payment proof"
                className="w-full max-h-[300px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                <span className="text-sm">{t("publicPlayer.paymentTab.clickToUpload", "Click to upload proof")}</span>
              </div>
            )}

            {/* Hover/Loading Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${uploadProofMutation.isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {uploadProofMutation.isPending ? (
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              ) : (
                <div className="flex flex-col items-center text-white">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm font-semibold">
                    {latestPayment.proofImageUrl 
                      ? t("publicPlayer.paymentTab.changeImage", "Change Image")
                      : t("publicPlayer.paymentTab.uploadImage", "Upload Image")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Completed — success message */}
      {status === "completed" && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center space-y-2">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
          <p className="font-semibold text-green-500">
            {t("publicPlayer.paymentTab.paymentSuccess", "Your payment has been confirmed!")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("publicPlayer.paymentTab.paymentSuccessDesc", "Your entry is now eligible for the tournament.")}
          </p>
        </div>
      )}

      {/* Refunded — message and proof */}
      {status === "refunded" && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
          <div className="text-center space-y-2">
            <RotateCcw className="h-10 w-10 text-blue-500 mx-auto" />
            <p className="font-semibold text-blue-500">
              {t("publicPlayer.paymentTab.paymentRefunded", "Your payment has been refunded.")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("publicPlayer.paymentTab.paymentRefundedDesc", "Please check your bank account or contact the organizer if you have not received it.")}
            </p>
          </div>
          {latestPayment.refundProofImageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">{t("publicPlayer.paymentTab.refundProof", "Refund Proof")}</p>
              <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
                <img
                  src={getImageUrl(latestPayment.refundProofImageUrl)}
                  alt="Refund proof"
                  className="w-full max-h-[300px] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
