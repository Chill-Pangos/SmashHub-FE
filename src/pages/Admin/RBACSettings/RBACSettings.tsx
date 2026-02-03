import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import RoleCards from "./components/RoleCards";
import PermissionMatrix from "./components/PermissionMatrix";
import RoleDialog from "./components/RoleDialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function RBACSettings() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();

  const handleEditRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.rbacSettingsTitle")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.rbacSettingsDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("admin.exportConfig")}
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t("admin.importConfig")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.addRole")}
          </Button>
        </div>
      </div>

      <RoleCards onEdit={handleEditRole} />

      <PermissionMatrix />

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roleId={selectedRoleId}
      />
    </div>
  );
}
