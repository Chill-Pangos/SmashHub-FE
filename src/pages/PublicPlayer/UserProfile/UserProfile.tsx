import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useUpdateUserProfile, useUploadAvatar } from "@/hooks/queries/useUserQueries";
import { getImageUrl } from "@/utils/api.utils";
import { showToast, showApiError } from "@/utils/toast.utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, Save, Key, MailCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState("");

  const updateProfileMutation = useUpdateUserProfile();
  const uploadAvatarMutation = useUploadAvatar();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || "");
      setDob(user.dob ? parseISO(user.dob) : undefined);
      setGender(user.gender || "");
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    uploadAvatarMutation.mutate({ id: user.id, file }, {
      onSuccess: (data) => {
        // Optimistic local update / Auth sync
        updateUser({ ...user, avatarUrl: data.avatarUrl });
        showToast.success(t("profile.uploadAvatarSuccess", "Avatar uploaded successfully"));
      },
      onError: (err: any) => showApiError(err, t("profile.uploadAvatarError", "Failed to upload avatar")),
    });
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    updateProfileMutation.mutate({
      id: user.id,
      data: {
        phoneNumber,
        dob: dob ? format(dob, "yyyy-MM-dd") : null,
        gender: gender || null,
      }
    }, {
      onSuccess: (updatedUser) => {
        updateUser(updatedUser);
        showToast.success(t("profile.updateSuccess", "Profile updated successfully"));
      },
      onError: (err: any) => showApiError(err, t("profile.updateError", "Failed to update profile")),
    });
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t("profile.title") || "User Profile"}</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar Section */}
        <Card className="md:col-span-1 border-border/50">
          <CardHeader>
            <CardTitle>{t("profile.avatarTitle") || "Avatar"}</CardTitle>
            <CardDescription>{t("profile.avatarDesc") || "Click to upload a new avatar."}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div 
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-sm transition-opacity group-hover:opacity-80">
                {user.avatarUrl && <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.firstName} />}
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {user.firstName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {uploadAvatarMutation.isPending ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
            />
          </CardContent>
        </Card>

        {/* Profile Details Section */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>{t("profile.detailsTitle") || "Profile Details"}</CardTitle>
            <CardDescription>{t("profile.detailsDesc") || "Manage your personal information."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("profile.firstName") || "First Name"}</Label>
                <Input id="firstName" value={user.firstName} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("profile.lastName") || "Last Name"}</Label>
                <Input id="lastName" value={user.lastName} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.email") || "Email"}</Label>
              <Input id="email" value={user.email} readOnly className="bg-muted" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t("profile.phoneNumber") || "Phone Number"}</Label>
                <Input 
                  id="phoneNumber" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="+84..."
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="mb-2">{t("profile.dob") || "Date of Birth"}</Label>
                <DatePicker 
                  date={dob} 
                  setDate={setDob} 
                  placeholder={t("profile.selectDate") || "Select Date"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{t("profile.gender") || "Gender"}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={t("profile.selectGender") || "Select gender"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("profile.male") || "Male"}</SelectItem>
                  <SelectItem value="female">{t("profile.female") || "Female"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={updateProfileMutation.isPending}
              className="mt-4"
            >
              {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {t("common.save") || "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings Section */}
        <Card className="md:col-span-2 md:col-start-2 border-border/50">
          <CardHeader>
            <CardTitle>{t("profile.securityTitle") || "Security Settings"}</CardTitle>
            <CardDescription>{t("profile.securityDesc") || "Manage account security and verification."}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => navigate("/change-password")}>
              <Key className="mr-2 h-4 w-4" />
              {t("auth.changePassword") || "Change Password"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/verify-email")}>
              <MailCheck className="mr-2 h-4 w-4" />
              {t("auth.verifyEmail") || "Verify Email"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
