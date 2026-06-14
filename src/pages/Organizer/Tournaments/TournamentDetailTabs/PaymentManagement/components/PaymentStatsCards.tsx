import { useTranslation } from "react-i18next";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Wallet,
  TrendingUp,
} from "lucide-react";
import type { PaymentStatistics } from "@/types/payment.types";

interface PaymentStatsCardsProps {
  stats: PaymentStatistics | undefined;
  isLoading: boolean;
}

export default function PaymentStatsCards({
  stats,
  isLoading,
}: PaymentStatsCardsProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      label: t("tournamentManager.paymentManagement.stats.total", "Total Payments"),
      value: stats?.total ?? 0,
      icon: DollarSign,
      color: "text-foreground",
      bgColor: "bg-secondary/50",
      borderColor: "border-border",
    },
    {
      label: t("tournamentManager.paymentManagement.stats.completed", "Completed"),
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: t("tournamentManager.paymentManagement.stats.pending", "Pending"),
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      label: t("tournamentManager.paymentManagement.stats.failed", "Failed"),
      value: stats?.failed ?? 0,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
    },
    {
      label: t("tournamentManager.paymentManagement.stats.refunded", "Refunded"),
      value: stats?.refunded ?? 0,
      icon: RotateCcw,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: t("tournamentManager.paymentManagement.stats.totalAmount", "Total Amount"),
      value: formatCurrency(stats?.totalAmount ?? 0),
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      isCurrency: true,
    },
    {
      label: t("tournamentManager.paymentManagement.stats.collected", "Collected"),
      value: formatCurrency(stats?.collectedAmount ?? 0),
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      isCurrency: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 animate-pulse"
          >
            <div className="h-3 w-16 bg-muted rounded mb-3" />
            <div className="h-6 w-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-4 transition-colors hover:border-primary/30`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                {card.label}
              </span>
            </div>
            <p
              className={`text-xl font-bold ${card.isCurrency ? "text-sm" : ""} ${card.color}`}
            >
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
