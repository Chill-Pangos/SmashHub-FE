import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Lock, Trophy, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthOperations, useTranslation } from "@/hooks";
import {
  validatePassword,
  validatePasswordConfirmation,
  checkPasswordStrength,
  showToast,
  PasswordStrength,
  type ValidationErrors,
} from "@/utils";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useAuthOperations();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      showToast.error(t("authFlow.resetPassword.invalidInfo"));
      navigate("/forgot-password");
    }
  }, [email, otp, navigate, t]);

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

    if (!email || !otp) {
      showToast.error(t("authFlow.resetPassword.invalidInfo"));
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.newPassword);
    const confirmError = validatePasswordConfirmation(
      formData.newPassword,
      formData.confirmPassword,
    );

    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError || "",
        confirmPassword: confirmError || "",
      });
      return;
    }

    // Call reset password
    const result = await resetPassword({
      email,
      otp,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      showToast.success(
        t("auth.passwordResetSuccess"),
        t("authFlow.resetPassword.resetSuccessDescription"),
      );
      navigate("/signin");
    } else {
      showToast.error(t("authFlow.resetPassword.resetFailed"), result.error);
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
            {t("auth.resetPassword")}
          </h1>
          <p className="text-muted-foreground">
            {t("authFlow.resetPassword.subtitle")}
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              {t("authFlow.resetPassword.cardTitle")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("authFlow.resetPassword.cardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  {t("auth.newPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.enterNewPassword")}
                    className="pl-10 pr-10"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordStrength && (
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
                  <p className="text-sm text-destructive">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  {t("auth.confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t(
                      "authFlow.resetPassword.confirmPasswordPlaceholder",
                    )}
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
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
                    {t("authFlow.resetPassword.submitting")}
                  </>
                ) : (
                  t("auth.resetPassword")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
