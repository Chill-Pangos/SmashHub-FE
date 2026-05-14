import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Lock, Loader2, Mail, User } from "lucide-react";
import tableTennisBg from "@/assets/table_tennis_bg.png";
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
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    [errors]
  );

  const getPasswordStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:   return "#ffb4ab";
      case PasswordStrength.MEDIUM: return "#e8c423";
      case PasswordStrength.STRONG: return "#4ade80";
      default: return "#b9cacb";
    }
  };

  const getPasswordStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:   return t("validation.passwordStrength.weak");
      case PasswordStrength.MEDIUM: return t("validation.passwordStrength.medium");
      case PasswordStrength.STRONG: return t("validation.passwordStrength.strong");
      default: return "";
    }
  };

  const passwordStrength = formData.password ? checkPasswordStrength(formData.password) : null;

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
        showToast.error(t("auth.registerFailed"), result.error || authError || undefined);
      }
    },
    [agreedToTerms, authError, formData, register, t]
  );

  // Reusable input style helpers (same as SignIn)
  const inputBase: React.CSSProperties = {
    background: "#151d1e",
    border: "1px solid rgba(58,73,75,0.5)",
    borderRadius: "6px",
    color: "#dce4e4",
    fontFamily: "'Sora', sans-serif",
    width: "100%",
    padding: "12px 12px 12px 40px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid #00f2ff";
    e.currentTarget.style.boxShadow = "0 0 15px rgba(0,242,255,0.15)";
    e.currentTarget.style.background = "#2e3637";
    const icon = e.currentTarget.previousElementSibling as HTMLElement;
    if (icon) icon.style.color = "#00f2ff";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
    e.currentTarget.style.border = hasError
      ? "1px solid #ffb4ab"
      : "1px solid rgba(58,73,75,0.5)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "#151d1e";
    const icon = e.currentTarget.previousElementSibling as HTMLElement;
    if (icon) icon.style.color = "#849495";
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "#0d1515", fontFamily: "'Sora', sans-serif" }}
    >
      {/* ── Left: Cinematic Visual ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tableTennisBg})`,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tableTennisBg})`,
            filter: "blur(18px)",
            transform: "scale(1.06)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(13,21,21,0.92) 0%, rgba(13,21,21,0.55) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(13,21,21,0.95) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0"
          style={{
            width: "160px",
            background:
              "linear-gradient(to right, rgba(13,21,21,0) 0%, rgba(13,21,21,0.7) 55%, rgba(13,21,21,1) 100%)",
          }}
        />
        <div className="relative z-10 p-12 flex flex-col justify-end h-full w-full">
          <div className="flex items-center gap-3 mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="16" cy="16" r="12" stroke="#00dbe7" strokeWidth="2.5" fill="none" />
              <line x1="16" y1="4" x2="16" y2="28" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="4" y1="16" x2="28" y2="16" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="8" y1="8" x2="24" y2="24" stroke="#00dbe7" strokeWidth="1" opacity="0.6" />
              <line x1="24" y1="8" x2="8" y2="24" stroke="#00dbe7" strokeWidth="1" opacity="0.6" />
              <line x1="24" y1="24" x2="34" y2="36" stroke="#00dbe7" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#dce4e4" }}>
              Smash<span style={{ color: "#00dbe7" }}>Hub</span>
            </h1>
          </div>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "#b9cacb" }}>
            {t("auth.brandDescription") ??
              "The elite ecosystem for professional table tennis management, analytics, and high-stakes tournament execution."}
          </p>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative overflow-y-auto">
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(0,219,231,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Glassmorphic Card */}
        <div
          className="relative w-full z-10 my-8"
          style={{
            maxWidth: "440px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <circle cx="16" cy="16" r="12" stroke="#00dbe7" strokeWidth="2.5" fill="none" />
              <line x1="16" y1="4" x2="16" y2="28" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="4" y1="16" x2="28" y2="16" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="24" y1="24" x2="34" y2="36" stroke="#00dbe7" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h2 className="text-2xl font-bold" style={{ color: "#dce4e4" }}>
              Smash<span style={{ color: "#00dbe7" }}>Hub</span>
            </h2>
          </div>

          {/* Auth Toggle */}
          <div
            className="flex p-1 mb-8 rounded-full"
            style={{
              background: "rgba(46,54,55,0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <NavLink
              to="/signin"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-center transition-colors duration-200"
              style={{ color: "#b9cacb" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#dce4e4")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#b9cacb")}
            >
              {t("auth.signIn") || "Sign In"}
            </NavLink>
            {/* Sign Up — active */}
            <button
              type="button"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "#00f2ff",
                color: "#080f10",
                boxShadow: "0 0 15px rgba(0,242,255,0.2)",
              }}
            >
              {t("auth.signUp") || "Sign Up"}
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-3xl font-semibold mb-2" style={{ color: "#dce4e4" }}>
              {t("authFlow.signUp.welcomeDescription") || "Create Account"}
            </h3>
            <p className="text-sm" style={{ color: "#b9cacb" }}>
              {t("authFlow.signUp.cardDescription") || "Initialize your Pro Circuit profile."}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "firstName", label: t("validation.fields.firstName") || "First Name", placeholder: t("authFlow.signUp.firstNamePlaceholder") || "John", error: errors.firstName },
                { id: "lastName",  label: t("validation.fields.lastName")  || "Last Name",  placeholder: t("authFlow.signUp.lastNamePlaceholder")  || "Doe",  error: errors.lastName  },
              ].map(({ id, label, placeholder, error }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b9cacb" }}>
                    {label}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#849495" }} />
                    <input
                      id={id}
                      type="text"
                      placeholder={placeholder}
                      value={formData[id as keyof RegisterFormData]}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      style={{ ...inputBase, border: error ? "1px solid #ffb4ab" : "1px solid rgba(58,73,75,0.5)" }}
                      onFocus={handleFocus}
                      onBlur={(e) => handleBlur(e, !!error)}
                    />
                  </div>
                  {error && <p className="text-xs" style={{ color: "#ffb4ab" }}>{error}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b9cacb" }}>
                {t("auth.email") || "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#849495" }} />
                <input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.enterEmail") || "agent@procircuit.com"}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  style={{ ...inputBase, border: errors.email ? "1px solid #ffb4ab" : "1px solid rgba(58,73,75,0.5)" }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.email)}
                />
              </div>
              {errors.email && <p className="text-xs" style={{ color: "#ffb4ab" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b9cacb" }}>
                {t("auth.password") || "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#849495" }} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  style={{ ...inputBase, border: errors.password ? "1px solid #ffb4ab" : "1px solid rgba(58,73,75,0.5)" }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.password)}
                />
              </div>
              {passwordStrength && (
                <p className="text-xs font-medium" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                  {t("authFlow.passwordStrengthLabel")}: {getPasswordStrengthText(passwordStrength)}
                </p>
              )}
              {errors.password && <p className="text-xs" style={{ color: "#ffb4ab" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold tracking-widest uppercase" style={{ color: "#b9cacb" }}>
                {t("auth.confirmPassword") || "Confirm Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#849495" }} />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.confirmPassword") || "••••••••"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  style={{ ...inputBase, border: errors.confirmPassword ? "1px solid #ffb4ab" : "1px solid rgba(58,73,75,0.5)" }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs" style={{ color: "#ffb4ab" }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "rgba(21,29,30,0.6)",
                border: "1px solid rgba(58,73,75,0.3)",
              }}
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
                required
                className="mt-0.5 w-4 h-4 rounded"
                style={{ accentColor: "#00f2ff", flexShrink: 0 }}
              />
              <label htmlFor="terms" className="text-xs leading-relaxed" style={{ color: "#b9cacb" }}>
                {t("authFlow.signUp.termsPrefix")}{" "}
                <NavLink to="/terms" className="font-semibold underline underline-offset-2 transition-colors" style={{ color: "#00dbe7" }}>
                  {t("authFlow.signUp.termsOfService")}
                </NavLink>{" "}
                {t("authFlow.signUp.and")}{" "}
                <NavLink to="/privacy" className="font-semibold underline underline-offset-2 transition-colors" style={{ color: "#00dbe7" }}>
                  {t("authFlow.signUp.privacyPolicy")}
                </NavLink>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                background: loading ? "#1a3030" : "#00f2ff",
                color: loading ? "#849495" : "#080f10",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(0,242,255,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
              onMouseUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("common.loading") || "Loading..."}
                </>
              ) : (
                <>
                  {t("auth.signUp") || "Create Account"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            className="text-center pt-5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-sm" style={{ color: "#b9cacb" }}>
              {t("auth.alreadyHaveAccount")}{" "}
              <NavLink
                to="/signin"
                className="font-semibold underline underline-offset-2 transition-colors"
                style={{ color: "#00dbe7" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00f2ff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00dbe7")}
              >
                {t("auth.signIn")}
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;