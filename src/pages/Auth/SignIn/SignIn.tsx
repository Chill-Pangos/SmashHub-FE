import { useState, type FormEvent, type ChangeEvent, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Mail, Lock, ArrowRight, Briefcase, Fingerprint, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthOperations, useTranslation } from "@/hooks";
import {
  validateLoginForm,
  hasValidationErrors,
  showToast,
  type LoginFormData,
  type ValidationErrors,
} from "@/utils";

const SignIn = () => {
  const { t } = useTranslation();
  const { login, loading, error: authError } = useAuthOperations();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSignInMode, setIsSignInMode] = useState(true);

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

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateLoginForm(formData);
      if (hasValidationErrors(validationErrors)) {
        setErrors(validationErrors);
        return;
      }

      const result = await login(formData);

      if (result.success && result.data) {
        showToast.success(
          t("auth.loginSuccess"),
          t("authFlow.welcomeBackWithName", {
            name: `${result.data.user.firstName} ${result.data.user.lastName}`.trim(),
          })
        );
      } else {
        showToast.error(
          t("message.operationFailed"),
          result.error || authError || undefined
        );
      }
    },
    [formData, errors, login, authError, t]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Side: Cinematic Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-lowest">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUTk_gOo_tmlFR9lbZ-jhvNy30pDCZ2iaBEZ41y9FrtTMUhM5lPWdAc8D2wKSC0CJMCrbsa7gubKTQqxnLtqIC__74OHwq2eVUH9AhDhws6q_NTctDHaxFKaD9jloaeyaT1poKBnoV-62vmPTEUWKnDXJhzRY7urJkbLkXwPxZu84Hq_TyTDDu0jcdpjGq5C-O5il6B8LbDSO8LsO7UQ2t9-8GNevHbC4swjs1ce00fQ9RiQIDR948sHhhyH4b8dq7zqh4qdeCdSdV')",
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />

        {/* Brand Section (refined) */}
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

      {/* Right Side: Auth Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-margin-md relative bg-gradient-to-br from-background via-background to-surface-container-lowest">
        {/* Ambient Glow - Enhanced */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-primary-fixed/8 rounded-full blur-3xl pointer-events-none opacity-60" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

        {/* Glassmorphic Card - Enhanced (closer to reference) */}
        <Card className="relative w-full max-w-[420px] lg:max-w-[440px] bg-surface-container-low/75 backdrop-blur-[40px] border border-outline-variant/20 rounded-[28px] p-10 lg:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.75)] z-10 lg:translate-x-6">
          {/* Decorative Top Accent */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 md:w-48 flex items-center justify-center">
            <div className="bg-surface-container-highest/50 backdrop-blur-md rounded-full p-1.5 border border-outline-variant/10 shadow-sm w-full">
              <div className="flex bg-surface-container-lowest/50 rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setIsSignInMode(true)}
                  className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    isSignInMode
                      ? "bg-gradient-to-r from-primary-fixed to-primary-container text-on-primary-container shadow-[0_8px_30px_rgba(0,211,235,0.12)]"
                      : "text-on-surface-variant"
                  }`}
                >
                  {t("auth.signIn")}
                </button>
                <NavLink
                  to="/signup"
                  className={`flex-1 py-2 rounded-full font-semibold text-sm text-center transition-all duration-300 ${
                    !isSignInMode
                      ? "bg-gradient-to-r from-primary-fixed to-primary-container text-on-primary-container shadow-[0_8px_30px_rgba(0,211,235,0.12)]"
                      : "text-on-surface-variant"
                  }`}
                >
                  {t("auth.signUp")}
                </NavLink>
              </div>
            </div>
          </div>

          <div className="mt-8" />

          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
              {t("auth.welcomeBack")}
            </h3>
            <p className="text-sm text-on-surface-variant leading-snug max-w-xs mx-auto">
              {t("auth.enterCredentials") ||
                "Enter your credentials to access the pro dashboard."}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Field */}
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
                      placeholder={t("placeholder.enterEmail") || "admin@procircuit.com"}
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

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide"
                >
                  {t("auth.password")}
                </Label>
                <NavLink
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary-fixed hover:text-primary-container transition-colors duration-300"
                >
                  {t("auth.forgotPassword")}?
                </NavLink>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors duration-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.enterPassword") || "••••••••"}
                  className="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:bg-surface-container-low/80 focus:shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_0_18px_rgba(0,211,235,0.06)] transition-all duration-300 hover:border-outline-variant/50"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit Button - Enhanced */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-primary-fixed to-primary-container text-on-primary-container font-semibold py-3.5 rounded-lg hover:shadow-[0_10px_40px_rgba(0,211,235,0.24)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  {t("auth.signIn")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
