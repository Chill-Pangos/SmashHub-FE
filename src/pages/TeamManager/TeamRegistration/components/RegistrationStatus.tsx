import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface RegistrationStatusProps {
  status: "registered" | "pending" | "not_registered";
  entryCount?: number;
}

export function RegistrationStatus({
  status,
  entryCount = 0,
}: RegistrationStatusProps) {
  const statusConfig = {
    registered: {
      icon: CheckCircle,
      label: "Đã đăng ký",
      variant: "default" as const,
      color: "text-green-600",
    },
    pending: {
      icon: Clock,
      label: "Đang chờ duyệt",
      variant: "secondary" as const,
      color: "text-yellow-600",
    },
    not_registered: {
      icon: AlertCircle,
      label: "Chưa đăng ký",
      variant: "outline" as const,
      color: "text-muted-foreground",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <Badge variant={config.variant}>{config.label}</Badge>
      {entryCount > 0 && (
        <span className="text-sm text-muted-foreground">
          ({entryCount} entries)
        </span>
      )}
    </div>
  );
}
