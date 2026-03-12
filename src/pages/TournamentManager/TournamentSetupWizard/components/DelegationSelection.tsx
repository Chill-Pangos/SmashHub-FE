import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Delegation {
  id: string;
  name: string;
  athletes: number;
  coaches: number;
}

const mockDelegations: Delegation[] = [
  { id: "1", name: "Đoàn Hà Nội", athletes: 24, coaches: 8 },
  { id: "2", name: "Đoàn TP.HCM", athletes: 22, coaches: 7 },
  { id: "3", name: "Đoàn Đà Nẵng", athletes: 18, coaches: 6 },
  { id: "4", name: "Đoàn Hải Phòng", athletes: 16, coaches: 5 },
  { id: "5", name: "Đoàn Cần Thơ", athletes: 14, coaches: 5 },
  { id: "6", name: "Đoàn Nghệ An", athletes: 12, coaches: 4 },
  { id: "7", name: "Đoàn Thanh Hóa", athletes: 10, coaches: 4 },
  { id: "8", name: "Đoàn Quảng Ninh", athletes: 10, coaches: 3 },
];

interface DelegationSelectionProps {
  selectedDelegations: string[];
  onChange: (delegations: string[]) => void;
}

export default function DelegationSelection({
  selectedDelegations,
  onChange,
}: DelegationSelectionProps) {
  const { t } = useTranslation();

  const toggleDelegation = (delegationId: string) => {
    if (selectedDelegations.includes(delegationId)) {
      onChange(selectedDelegations.filter((id) => id !== delegationId));
    } else {
      onChange([...selectedDelegations, delegationId]);
    }
  };

  const selectedDelegationData = mockDelegations.filter((d) =>
    selectedDelegations.includes(d.id),
  );

  const totalAthletes = selectedDelegationData.reduce(
    (sum, d) => sum + d.athletes,
    0,
  );
  const totalCoaches = selectedDelegationData.reduce(
    (sum, d) => sum + d.coaches,
    0,
  );

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {t("tournamentManager.setupWizardPage.delegationsTitle")}
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockDelegations.map((delegation) => {
            const isSelected = selectedDelegations.includes(delegation.id);

            return (
              <label
                key={delegation.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDelegation(delegation.id)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{delegation.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {delegation.athletes}{" "}
                          {t("tournamentManager.setupWizardPage.vdv")}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        {delegation.coaches}{" "}
                        {t("tournamentManager.setupWizardPage.hlv")}
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">
            {t("tournamentManager.setupWizardPage.selectedDelegationsStats")}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{selectedDelegations.length}</p>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.setupWizardPage.delegationsCount")}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAthletes}</p>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.setupWizardPage.athletesCount")}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCoaches}</p>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.setupWizardPage.coachesCount")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            {t("tournamentManager.setupWizardPage.selectedDelegations")}
          </Label>
          {selectedDelegations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDelegations.map((id) => {
                const delegation = mockDelegations.find((d) => d.id === id);
                if (!delegation) return null;
                return (
                  <Badge key={id} variant="outline">
                    {delegation.name}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("tournamentManager.setupWizardPage.noDelegationSelected")}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
