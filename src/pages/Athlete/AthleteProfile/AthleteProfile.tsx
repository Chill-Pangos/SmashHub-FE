import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Edit, Save } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useState } from "react";

export default function AthleteProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("athlete.personalProfile")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("athlete.viewAndManageProfile")}
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t("athlete.saveChanges")}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              {t("common.edit")}
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{user?.username}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2">{t("athlete.athlete")}</Badge>
              <div className="mt-4 p-4 bg-muted rounded-lg w-full">
                <p className="text-sm text-muted-foreground">
                  {t("athlete.currentElo")}
                </p>
                <p className="text-3xl font-bold text-primary">1500</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("athlete.detailedInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("athlete.username")}</Label>
              <Input
                id="username"
                value={user?.username || ""}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailVerified">{t("athlete.emailStatus")}</Label>
              <Input
                id="emailVerified"
                value={
                  user?.isEmailVerified
                    ? t("athlete.verified")
                    : t("athlete.notVerified")
                }
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("athlete.statsOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("athlete.totalMatches")}
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("athlete.winsCount")}
              </p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("athlete.lossesCount")}
              </p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("athlete.winRate")}
              </p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
