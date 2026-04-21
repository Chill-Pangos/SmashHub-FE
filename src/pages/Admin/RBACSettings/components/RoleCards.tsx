import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Edit, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { AdminUser, Role } from "@/types";

interface RoleCardsProps {
  roles: Role[];
  users: AdminUser[];
  isLoading?: boolean;
  onEdit: (role: Role) => void;
}

const roleColors = [
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
  "text-orange-500",
  "text-pink-500",
  "text-cyan-500",
];

export default function RoleCards({
  roles,
  users,
  isLoading,
  onEdit,
}: RoleCardsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="p-6 text-muted-foreground">{t("common.loading")}</Card>
    );
  }

  if (roles.length === 0) {
    return (
      <Card className="p-6 text-muted-foreground">
        {t("admin.noRolesFound")}
      </Card>
    );
  }

  const getUserCountByRole = (roleId: number) => {
    return users.filter((user) => (user.roles ?? []).includes(roleId)).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map((role, index) => {
        const color = roleColors[index % roleColors.length];

        return (
          <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
                  <Shield className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {role.description || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Users className="h-4 w-4" />
              <span>
                {getUserCountByRole(role.id)} {t("admin.users")}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onEdit(role)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
