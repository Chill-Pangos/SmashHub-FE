import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/api.utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Payment } from "@/types/payment.types";

interface PaymentDetailDialogProps {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentId: number) => void;
  onReject: (paymentId: number) => void;
  onRefund: (paymentId: number, file: File) => void;
  isConfirming: boolean;
  isRejecting: boolean;
  isRefunding: boolean;
}

export default function PaymentDetailDialog({
  payment,
  open,
  onClose,
  onConfirm,
  onReject,
  onRefund,
  isConfirming,
  isRejecting,
  isRefunding,
}: PaymentDetailDialogProps) {
  const { t } = useTranslation();
  const [refundFile, setRefundFile] = useState<File | null>(null);
  const [showRefundUpload, setShowRefundUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "—";
    return new Date(date as string).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: {
      label: t("tournamentManager.paymentManagement.status.pending", "Pending"),
      variant: "outline",
    },
    completed: {
      label: t("tournamentManager.paymentManagement.status.completed", "Completed"),
      variant: "default",
    },
    failed: {
      label: t("tournamentManager.paymentManagement.status.failed", "Failed"),
      variant: "destructive",
    },
    refunded: {
      label: t("tournamentManager.paymentManagement.status.refunded", "Refunded"),
      variant: "secondary",
    },
  };

  const handleRefundSubmit = () => {
    if (payment && refundFile) {
      onRefund(payment.id, refundFile);
      setRefundFile(null);
      setShowRefundUpload(false);
    }
  };

  const handleClose = () => {
    setRefundFile(null);
    setShowRefundUpload(false);
    onClose();
  };

  if (!payment) return null;

  const status = payment.status || "pending";
  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>
              {t("tournamentManager.paymentManagement.detail.title", "Payment Detail")} #{payment.id}
            </span>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.entryId", "Entry ID")}
              </p>
              <p className="font-semibold">ENT-{payment.entryId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.amount", "Amount")}
              </p>
              <p className="font-semibold text-primary">{formatCurrency(payment.amount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.createdAt", "Created")}
              </p>
              <p className="text-sm">{formatDate(payment.createdAt)}</p>
            </div>
            {payment.confirmedAt && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("tournamentManager.paymentManagement.detail.confirmedAt", "Confirmed At")}
                </p>
                <p className="text-sm">{formatDate(payment.confirmedAt)}</p>
              </div>
            )}
            {payment.refundedAt && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("tournamentManager.paymentManagement.detail.refundedAt", "Refunded At")}
                </p>
                <p className="text-sm">{formatDate(payment.refundedAt)}</p>
              </div>
            )}
          </div>

          {/* Proof Image */}
          {payment.proofImageUrl && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                {t("tournamentManager.paymentManagement.detail.proofImage", "Proof Image")}
              </p>
              <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
                <img
                  src={getImageUrl(payment.proofImageUrl)}
                  alt="Payment proof"
                  className="w-full max-h-[300px] object-contain"
                />
              </div>
            </div>
          )}

          {/* Refund Proof Image */}
          {payment.refundProofImageUrl && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                {t("tournamentManager.paymentManagement.detail.refundProofImage", "Refund Proof")}
              </p>
              <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
                <img
                  src={getImageUrl(payment.refundProofImageUrl)}
                  alt="Refund proof"
                  className="w-full max-h-[300px] object-contain"
                />
              </div>
            </div>
          )}

          {/* Refund Upload Section */}
          {showRefundUpload && (
            <div className="space-y-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm font-semibold text-blue-500">
                {t("tournamentManager.paymentManagement.detail.refundProof", "Upload Refund Proof")}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setRefundFile(e.target.files?.[0] || null)}
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {refundFile
                    ? refundFile.name
                    : t("tournamentManager.paymentManagement.detail.selectFile", "Select file")}
                </Button>
                <Button
                  size="sm"
                  disabled={!refundFile || isRefunding}
                  onClick={handleRefundSubmit}
                  className="gap-1.5"
                >
                  {isRefunding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {t("tournamentManager.paymentManagement.detail.submitRefund", "Submit Refund")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {status === "pending" && (
            <>
              <Button
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onConfirm(payment.id)}
                disabled={isConfirming}
              >
                {isConfirming && <Loader2 className="h-4 w-4 animate-spin" />}
                <CheckCircle2 className="h-4 w-4" />
                {t("tournamentManager.paymentManagement.confirm", "Confirm")}
              </Button>
              <Button
                variant="destructive"
                className="gap-1.5"
                onClick={() => onReject(payment.id)}
                disabled={isRejecting}
              >
                {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}
                <XCircle className="h-4 w-4" />
                {t("tournamentManager.paymentManagement.reject", "Reject")}
              </Button>
            </>
          )}
          {status === "completed" && (
            <Button
              variant="outline"
              className="gap-1.5 border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
              onClick={() => setShowRefundUpload(!showRefundUpload)}
            >
              <RotateCcw className="h-4 w-4" />
              {t("tournamentManager.paymentManagement.refund", "Refund")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
