import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Lock, Loader2, Mail, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthOperations, useTranslation } from "@/hooks";
import {
  checkPasswordStrength,
  hasValidationErrors,
  PasswordStrength,
  showToast,
  validateRegisterForm,
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

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));

      if (errors[id]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const getPasswordStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "text-red-500";
      case PasswordStrength.MEDIUM:
        return "text-yellow-500";
      case PasswordStrength.STRONG:
        return "text-green-500";
      default:
        return "text-on-surface-variant";
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

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!agreedToTerms) {
        showToast.error(t("authFlow.signUp.termsRequired"));
        return;
      }

      const validationErrors = validateRegisterForm(formData);
      if (hasValidationErrors(validationErrors)) {
        setErrors(validationErrors);
        return;
      }

      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.data) {
        showToast.success(
          t("auth.registerSuccess"),
          t("authFlow.signUp.welcomeDescription", {
            name: `${result.data.user.firstName} ${result.data.user.lastName}`.trim(),
          })
        );
      } else {
        showToast.error(
          t("auth.registerFailed"),
          result.error || authError || undefined
        );
      }
    },
    [agreedToTerms, authError, formData, register, t]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-lowest">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUTk_gOo_tmlFR9lbZ-jhvNy30pDCZ2iaBEZ41y9FrtTMUhM5lPWdAc8D2wKSC0CJMCrbsa7gubKTQqxnLtqIC__74OHwq2eVUH9AhDhws6q_NTctDHaxFKaD9jloaeyaT1poKBnoV-62vmPTEUWKnDXJhzRY7urJkbLkXwPxZu84Hq_TyTDDu0jcdpjGq5C-O5il6B8LbDSO8LsO7UQ2t9-8GNevHbC4swjs1ce00fQ9RiQIDR948sHhhyH4b8dq7zqh4qdeCdSdV')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-70" />

        <div className="relative z-10 p-12 flex flex-col justify-end h-full w-full items-start">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center bg-surface-container-high rounded-full p-3 drop-shadow-md">
              <Search className="h-6 w-6 text-primary-fixed" />
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight leading-none">
              <span className="font-extrabold">Smash</span>
              <span className="text-primary-fixed font-extrabold">Hub</span>
            </h1>
          </div>

          <div className="mt-2">
            <p className="text-sm md:text-base text-on-surface-variant max-w-xs md:max-w-md leading-relaxed opacity-90">
              {t("auth.brandDescription") ??
                "The elite ecosystem for professional table tennis management, analytics, and high-stakes tournament execution."}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-margin-md relative bg-linear-to-br from-background via-background to-surface-container-lowest">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-175 max-h-175 bg-primary-fixed/8 rounded-full blur-3xl pointer-events-none opacity-60" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative w-full max-w-110 bg-surface-container-low/75 backdrop-blur-2xl border border-outline-variant/20 rounded-[28px] p-10 lg:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.75)] z-10 lg:translate-x-6">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 md:w-48 flex items-center justify-center">
            <div className="bg-surface-container-highest/50 backdrop-blur-md rounded-full p-1.5 border border-outline-variant/10 shadow-sm w-full">
              <div className="flex bg-surface-container-lowest/50 rounded-full p-0.5">
                <NavLink
                  to="/signin"
                  className="flex-1 py-2 rounded-full font-semibold text-sm text-center transition-all duration-300 text-on-surface-variant"
                >
                  {t("auth.signIn")}
                </NavLink>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-full font-semibold text-sm transition-all duration-300 bg-linear-to-r from-primary-fixed to-primary-container text-on-primary-container shadow-[0_8px_30px_rgba(0,211,235,0.12)]"
                >
                  {t("auth.signUp")}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
              <Search className="h-6 w-6 text-primary-fixed" />
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight leading-none mb-2">
              Smash<span className="text-primary-fixed">Hub</span>
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xs">
              {t("authFlow.signUp.cardDescription") ??
                t("auth.registerNow") ??
                "Initialize your Pro Circuit profile."}
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
                >
                  {t("validation.fields.firstName")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t("authFlow.signUp.firstNamePlaceholder")}
                    className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 font-medium">{errors.firstName}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
                >
                  {t("validation.fields.lastName")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t("authFlow.signUp.lastNamePlaceholder")}
                    className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 font-medium">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
              >
                {t("auth.email")}
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.enterEmail") || "agent@procircuit.com"}
                  className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
              >
                {t("auth.password")}
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.enterNewPassword") || "••••••••"}
                  className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              {passwordStrength && (
                <p className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
                  {t("authFlow.passwordStrengthLabel")}: {getPasswordStrengthText(passwordStrength)}
                </p>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
              >
                {t("auth.confirmPassword")}
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.confirmPassword")}
                  className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-low/40 px-4 py-3">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-outline-variant/40 bg-transparent text-primary-container focus:ring-primary-container"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
                required
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed text-on-surface-variant">
                {t("authFlow.signUp.termsPrefix")} {" "}
                <NavLink
                  to="/terms"
                  className="font-semibold text-primary-fixed hover:text-primary-container transition-colors"
                >
                  {t("authFlow.signUp.termsOfService")}
                </NavLink>{" "}
                {t("authFlow.signUp.and")} {" "}
                <NavLink
                  to="/privacy"
                  className="font-semibold text-primary-fixed hover:text-primary-container transition-colors"
                >
                  {t("authFlow.signUp.privacyPolicy")}
                </NavLink>
              </Label>
            </div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-1" />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-primary-fixed to-primary-container text-on-primary-container font-semibold py-3.5 rounded-lg hover:shadow-[0_10px_40px_rgba(0,211,235,0.24)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  {t("auth.signUp")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              {t("auth.alreadyHaveAccount")} {" "}
              <NavLink
                to="/signin"
                className="font-semibold text-primary-fixed hover:text-primary-container transition-colors"
              >
                {t("auth.signIn")}
              </NavLink>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
