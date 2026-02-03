import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Users, Lock, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountTable, AccountDialog, PermissionManager } from "./components";

export default function DelegationAccountManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDelegation, setFilterDelegation] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t("tournamentManager.delegationAccounts.title")}
        </h1>
        <Button
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("tournamentManager.delegationAccounts.createAccount")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.delegationAccounts.totalAccounts")}
              </p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.delegationAccounts.active")}
              </p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.delegationAccounts.locked")}
              </p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.delegationAccounts.delegationCount")}
              </p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t(
                    "tournamentManager.delegationAccounts.searchPlaceholder",
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterDelegation}
                onValueChange={setFilterDelegation}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("tournamentManager.delegationAccounts.allDelegations")}
                  </SelectItem>
                  <SelectItem value="hanoi">
                    {t("tournamentManager.delegationAccounts.hanoiDelegation")}
                  </SelectItem>
                  <SelectItem value="hcm">
                    {t("tournamentManager.delegationAccounts.hcmDelegation")}
                  </SelectItem>
                  <SelectItem value="danang">
                    {t("tournamentManager.delegationAccounts.danangDelegation")}
                  </SelectItem>
                  <SelectItem value="haiphong">
                    {t(
                      "tournamentManager.delegationAccounts.haiphongDelegation",
                    )}
                  </SelectItem>
                  <SelectItem value="cantho">
                    {t("tournamentManager.delegationAccounts.canthoDelegation")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("tournamentManager.delegationAccounts.allRoles")}
                  </SelectItem>
                  <SelectItem value="manager">
                    {t("tournamentManager.delegationAccounts.roleManager")}
                  </SelectItem>
                  <SelectItem value="coach">
                    {t("tournamentManager.delegationAccounts.roleCoach")}
                  </SelectItem>
                  <SelectItem value="medical">
                    {t("tournamentManager.delegationAccounts.roleMedical")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("tournamentManager.delegationAccounts.allStatuses")}
                  </SelectItem>
                  <SelectItem value="active">
                    {t("tournamentManager.delegationAccounts.statusActive")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("tournamentManager.delegationAccounts.statusInactive")}
                  </SelectItem>
                  <SelectItem value="locked">
                    {t("tournamentManager.delegationAccounts.statusLocked")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <AccountTable />
        </div>

        <div>
          <PermissionManager />
        </div>
      </div>

      <AccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
      />
    </div>
  );
}
