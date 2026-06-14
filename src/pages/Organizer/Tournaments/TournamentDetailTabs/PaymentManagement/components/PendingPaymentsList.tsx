import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Eye, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Payment } from "@/types/payment.types";

interface PendingPaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  onConfirm: (paymentId: number) => void;
  onReject: (paymentId: number) => void;
  onViewDetail: (paymentId: number) => void;
  isConfirming: boolean;
  isRejecting: boolean;
}

export default function PendingPaymentsList({
  payments,
  isLoading,
  onConfirm,
  onReject,
  onViewDetail,
  isConfirming,
  isRejecting,
}: PendingPaymentsListProps) {
  const { t } = useTranslation();
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground animate-pulse">
          {t("tournamentManager.paymentManagement.loadingPayments", "Loading payments...")}
        </p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          {t("tournamentManager.paymentManagement.noPending", "No pending payments to review.")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.id", "Payment ID")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.entryId", "Entry ID")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.amount", "Amount")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.proof", "Proof")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("tournamentManager.paymentManagement.table.createdAt", "Created")}
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">
                {t("tournamentManager.paymentManagement.table.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="border-border hover:bg-secondary/30">
                <TableCell className="font-mono text-sm font-semibold">
                  #{payment.id}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    ENT-{payment.entryId}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  {payment.proofImageUrl ? (
                    <button
                      onClick={() => setProofPreview(payment.proofImageUrl!)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      {t("tournamentManager.paymentManagement.viewProof", "View")}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      {t("tournamentManager.paymentManagement.noProof", "No proof")}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(payment.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => onViewDetail(payment.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onConfirm(payment.id)}
                      disabled={isConfirming}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("tournamentManager.paymentManagement.confirm", "Confirm")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 gap-1"
                      onClick={() => onReject(payment.id)}
                      disabled={isRejecting}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {t("tournamentManager.paymentManagement.reject", "Reject")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Proof Image Preview Dialog */}
      <Dialog open={!!proofPreview} onOpenChange={() => setProofPreview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("tournamentManager.paymentManagement.proofPreview", "Payment Proof")}
            </DialogTitle>
          </DialogHeader>
          {proofPreview && (
            <div className="flex items-center justify-center p-2">
              <img
                src={proofPreview}
                alt="Payment proof"
                className="max-h-[60vh] w-auto rounded-lg border border-border object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
