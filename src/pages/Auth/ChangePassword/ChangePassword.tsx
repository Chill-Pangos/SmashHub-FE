import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/useAuth";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useTranslation } from "@/hooks/useTranslation";
import { showToast } from "@/utils/toast.utils";
import {
  validatePassword,
  validatePasswordConfirmation,
  checkPasswordStrength,
  PasswordStrength,
  type ValidationErrors,
} from "@/utils/validation.utils";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { changePassword, loading } = useAuthOperations();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast.error(t("toast.errors.UNAUTHORIZED"));
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, navigate, t]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const getPasswordStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "text-red-500";
      case PasswordStrength.MEDIUM:
        return "text-yellow-500";
      case PasswordStrength.STRONG:
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPasswordStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return t("validation.passwordStrength.weak");
      case PasswordStrength.MEDIUM:
        return t("validation.passwordStrength.medium");
      case PasswordStrength.STRONG:
        return t("validation.passwordStrength.strong");
      default:
        return "";
    }
  };

  const passwordStrength = formData.newPassword
    ? checkPasswordStrength(formData.newPassword)
    : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate old password
    if (!formData.oldPassword) {
      setErrors({ oldPassword: t("validation.auth.oldPasswordRequired") });
      return;
    }

    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword);
    const confirmError = validatePasswordConfirmation(
      formData.newPassword,
      formData.confirmPassword,
    );

    if (newPasswordError || confirmError) {
      setErrors({
        newPassword: newPasswordError || "",
        confirmPassword: confirmError || "",
      });
      return;
    }

    // Check if new password is different from old
    if (formData.oldPassword === formData.newPassword) {
      setErrors({
        newPassword: t("validation.auth.newPasswordMustDiffer"),
      });
      return;
    }

    // Call change password
    const result = await changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      showToast.success(
        t("auth.passwordChangeSuccess"),
        t("authFlow.changePassword.successDescription"),
      );
      // Navigate to signin after success
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } else {
      setErrors({
        oldPassword: result.error || t("authFlow.changePassword.failed"),
      });
      showToast.error(t("authFlow.changePassword.failed"), result.error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("auth.changePassword")}
          </h1>
          <p className="text-muted-foreground">
            {t("authFlow.changePassword.subtitle")}
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              {t("auth.changePassword")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("authFlow.changePassword.cardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">{t("auth.currentPassword")}</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    placeholder={t(
                      "authFlow.changePassword.oldPasswordPlaceholder",
                    )}
                    className={
                      errors.oldPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-sm text-red-500">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder={t("auth.enterNewPassword")}
                    className={
                      errors.newPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.newPassword && passwordStrength && (
                  <p
                    className={`text-sm ${getPasswordStrengthColor(
                      passwordStrength,
                    )}`}
                  >
                    {t("authFlow.passwordStrengthLabel")}:{" "}
                    {getPasswordStrengthText(passwordStrength)}
                  </p>
                )}
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t("authFlow.changePassword.passwordRequirements")}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("authFlow.changePassword.confirmNewPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t(
                      "authFlow.changePassword.confirmPasswordPlaceholder",
                    )}
                    className={
                      errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("authFlow.changePassword.submitting")}
                  </>
                ) : (
                  t("auth.changePassword")
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <button
                  onClick={() => navigate(-1)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("common.back")}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
