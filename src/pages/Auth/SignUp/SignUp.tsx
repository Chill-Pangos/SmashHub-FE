import { useState, type FormEvent, type ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
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
import { Lock, Mail, Trophy, User, Loader2 } from "lucide-react";
import { useAuthOperations, useTranslation } from "@/hooks";
import {
  validateRegisterForm,
  hasValidationErrors,
  checkPasswordStrength,
  showToast,
  PasswordStrength,
  type RegisterFormData,
  type ValidationErrors,
} from "@/utils";

const SignUp = () => {
  const { t } = useTranslation();
  const { register, loading, error: authError } = useAuthOperations();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const passwordStrength = formData.password
    ? checkPasswordStrength(formData.password)
    : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check terms agreement
    if (!agreedToTerms) {
      showToast.error(t("authFlow.signUp.termsRequired"));
      return;
    }

    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Call register from useAuthOperations
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success && result.data) {
      // Show success message
      showToast.success(
        t("auth.registerSuccess"),
        t("authFlow.signUp.welcomeDescription", {
          name: `${result.data.user.firstName} ${result.data.user.lastName}`.trim(),
        }),
      );
    } else {
      // Error is already set in authError state
      showToast.error(
        t("auth.registerFailed"),
        result.error || authError || undefined,
      );
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
            {t("auth.signUp")}
          </h1>
          <p className="text-muted-foreground">{t("auth.registerNow")}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              {t("auth.signUp")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("authFlow.signUp.cardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-card-foreground">
                    {t("validation.fields.firstName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t("authFlow.signUp.firstNamePlaceholder")}
                      className="pl-10 bg-input border-border text-foreground"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-card-foreground">
                    {t("validation.fields.lastName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t("authFlow.signUp.lastNamePlaceholder")}
                      className="pl-10 bg-input border-border text-foreground"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  {t("auth.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("placeholder.enterEmail")}
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("auth.enterNewPassword")}
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-card-foreground"
                >
                  {t("auth.confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("auth.confirmPassword")}
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-border"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={loading}
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  {t("authFlow.signUp.termsPrefix")}{" "}
                  <NavLink
                    to="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("authFlow.signUp.termsOfService")}
                  </NavLink>{" "}
                  {t("authFlow.signUp.and")}{" "}
                  <NavLink
                    to="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("authFlow.signUp.privacyPolicy")}
                  </NavLink>
                </Label>
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
                    {t("common.loading")}
                  </>
                ) : (
                  t("auth.signUp")
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("auth.alreadyHaveAccount")}{" "}
                <NavLink
                  to="/signin"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("auth.signIn")}
                </NavLink>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
