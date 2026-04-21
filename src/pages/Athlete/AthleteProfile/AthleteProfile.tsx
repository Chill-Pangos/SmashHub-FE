import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Edit, Save } from "lucide-react";
import { useUpdateUserProfile } from "@/hooks/queries";
import { useAuth } from "@/store/useAuth";
import { showApiError, showToast } from "@/utils/toast.utils";
import { useEffect, useMemo, useState } from "react";

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
};

const toNullable = (value?: string) => {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
};

export default function AthleteProfile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const updateUserProfileMutation = useUpdateUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    avatarUrl: "",
    dob: "",
    phoneNumber: "",
    gender: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      avatarUrl: user.avatarUrl ?? "",
      dob: toDateInputValue(user.dob),
      phoneNumber: user.phoneNumber ?? "",
      gender:
        user.gender === "male" || user.gender === "female" ? user.gender : "",
    });
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }

    return (
      `${user.firstName} ${user.lastName}`.trim() || user.username || user.email
    );
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateUserProfileMutation.mutateAsync({
        id: user.id,
        data: {
          avatarUrl: toNullable(formData.avatarUrl),
          dob: toNullable(formData.dob),
          phoneNumber: toNullable(formData.phoneNumber),
          gender: toNullable(formData.gender),
        },
      });

      updateUser(updatedUser);
      showToast.success(t("athlete.profileUpdatedSuccess"));
      setIsEditing(false);
    } catch (error) {
      showApiError(error, t("athlete.profileUpdateFailed"));
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      void handleSaveProfile();
      return;
    }

    setIsEditing(true);
  };

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
          onClick={handleEditClick}
          disabled={updateUserProfileMutation.isPending}
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
                <AvatarImage src={formData.avatarUrl || user.avatarUrl || ""} />
                <AvatarFallback className="text-2xl">
                  {displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="text-muted-foreground">{user.email}</p>
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
              <Input id="username" value={displayName} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">{t("athlete.avatarUrl")}</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    avatarUrl: e.target.value,
                  }))
                }
                disabled={!isEditing}
                placeholder="https://example.com/avatar.png"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dob">{t("athlete.dateOfBirth")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t("athlete.gender")}</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t("common.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("athlete.male")}</SelectItem>
                    <SelectItem value="female">
                      {t("athlete.female")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("auth.phoneNumber")}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailVerified">{t("athlete.emailStatus")}</Label>
              <Input
                id="emailVerified"
                value={
                  user.isEmailVerified
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
