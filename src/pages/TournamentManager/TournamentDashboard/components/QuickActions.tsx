import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  UserPlus,
  FileSpreadsheet,
  Calendar,
  Users,
  ClipboardList,
  Workflow,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const quickActions = [
  {
    icon: Workflow,
    titleKey: "tournamentManager.quickActions.fullFlow.title",
    descriptionKey: "tournamentManager.quickActions.fullFlow.description",
    color: "text-violet-500 bg-violet-500/10",
    action: "full-flow",
  },
  {
    icon: Plus,
    titleKey: "tournamentManager.quickActions.createTournament.title",
    descriptionKey:
      "tournamentManager.quickActions.createTournament.description",
    color: "text-blue-500 bg-blue-500/10",
    action: "create-tournament",
  },
  {
    icon: UserPlus,
    titleKey: "tournamentManager.quickActions.addDelegation.title",
    descriptionKey: "tournamentManager.quickActions.addDelegation.description",
    color: "text-green-500 bg-green-500/10",
    action: "add-delegation",
  },
  {
    icon: Calendar,
    titleKey: "tournamentManager.quickActions.scheduleMatches.title",
    descriptionKey:
      "tournamentManager.quickActions.scheduleMatches.description",
    color: "text-purple-500 bg-purple-500/10",
    action: "schedule-matches",
  },
  {
    icon: Users,
    titleKey: "tournamentManager.quickActions.assignReferees.title",
    descriptionKey: "tournamentManager.quickActions.assignReferees.description",
    color: "text-orange-500 bg-orange-500/10",
    action: "assign-referees",
  },
  {
    icon: ClipboardList,
    titleKey: "tournamentManager.quickActions.enterResults.title",
    descriptionKey: "tournamentManager.quickActions.enterResults.description",
    color: "text-pink-500 bg-pink-500/10",
    action: "enter-results",
  },
  {
    icon: FileSpreadsheet,
    titleKey: "tournamentManager.quickActions.exportReport.title",
    descriptionKey: "tournamentManager.quickActions.exportReport.description",
    color: "text-cyan-500 bg-cyan-500/10",
    action: "export-report",
  },
];

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {t("tournamentManager.quickActions.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-start p-4 hover:bg-accent"
              onClick={() => onAction?.(item.action)}
            >
              <div className={`p-2 rounded-lg ${item.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">{t(item.titleKey)}</p>
                <p className="text-xs text-muted-foreground">
                  {t(item.descriptionKey)}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
