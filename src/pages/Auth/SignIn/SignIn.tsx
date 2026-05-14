import { useState, type FormEvent, type ChangeEvent, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Mail, Lock, ArrowRight, Briefcase, Fingerprint } from "lucide-react";
import tableTennisBg from "@/assets/table_tennis_bg.png";
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
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});

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
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "#0d1515", fontFamily: "'Sora', sans-serif" }}
    >
      {/* ── Left: Cinematic Visual ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background image */}
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
        {/* Gradient overlays */}
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
            background:
              "linear-gradient(to top, rgba(13,21,21,0.95) 0%, transparent 60%)",
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

        {/* Brand anchor — bottom left */}
        <div className="relative z-10 p-12 flex flex-col justify-end h-full w-full">
          <div className="flex items-center gap-3 mb-4">
            {/* Tennis racket SVG icon */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="12" stroke="#00dbe7" strokeWidth="2.5" fill="none" />
              <line x1="16" y1="4" x2="16" y2="28" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="4" y1="16" x2="28" y2="16" stroke="#00dbe7" strokeWidth="1.5" />
              <line x1="8" y1="8" x2="24" y2="24" stroke="#00dbe7" strokeWidth="1" opacity="0.6" />
              <line x1="24" y1="8" x2="8" y2="24" stroke="#00dbe7" strokeWidth="1" opacity="0.6" />
              <line x1="24" y1="24" x2="34" y2="36" stroke="#00dbe7" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "#dce4e4" }}
            >
              Smash<span style={{ color: "#00dbe7" }}>Hub</span>
            </h1>
          </div>
          <p
            className="text-base leading-relaxed max-w-sm"
            style={{ color: "#b9cacb" }}
          >
            {t("auth.brandDescription") ??
              "The elite ecosystem for professional table tennis management, analytics, and high-stakes tournament execution."}
          </p>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative">
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
          className="relative w-full z-10"
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
            {/* Sign In — active */}
            <button
              type="button"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "#00f2ff",
                color: "#080f10",
                boxShadow: "0 0 15px rgba(0,242,255,0.2)",
              }}
            >
              {t("auth.signIn") || "Sign In"}
            </button>
            {/* Sign Up — inactive */}
            <NavLink
              to="/signup"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-center transition-colors duration-200"
              style={{ color: "#b9cacb" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#dce4e4")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#b9cacb")
              }
            >
              {t("auth.signUp") || "Sign Up"}
            </NavLink>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3
              className="text-3xl font-semibold mb-2"
              style={{ color: "#dce4e4" }}
            >
              {t("auth.welcomeBack") || "Welcome Back"}
            </h3>
            <p className="text-sm" style={{ color: "#b9cacb" }}>
              {t("auth.enterCredentials") ||
                "Enter your credentials to access the pro dashboard."}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "#b9cacb" }}
              >
                {t("auth.email") || "Email Address"}
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "#849495" }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.enterEmail") || "admin@procircuit.com"}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#151d1e",
                    border: errors.email
                      ? "1px solid #ffb4ab"
                      : "1px solid rgba(58,73,75,0.5)",
                    borderRadius: "6px",
                    color: "#dce4e4",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid #00f2ff";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.15)";
                    e.currentTarget.style.background = "#2e3637";
                    // also color icon
                    const icon = e.currentTarget.previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "#00f2ff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.email
                      ? "1px solid #ffb4ab"
                      : "1px solid rgba(58,73,75,0.5)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#151d1e";
                    const icon = e.currentTarget.previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "#849495";
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs" style={{ color: "#ffb4ab" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#b9cacb" }}
                >
                  {t("auth.password") || "Password"}
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-xs font-bold transition-colors duration-200"
                  style={{ color: "#00dbe7" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#00f2ff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#00dbe7")
                  }
                >
                  {t("auth.forgotPassword") || "Forgot"}?
                </NavLink>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "#849495" }}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#151d1e",
                    border: errors.password
                      ? "1px solid #ffb4ab"
                      : "1px solid rgba(58,73,75,0.5)",
                    borderRadius: "6px",
                    color: "#dce4e4",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid #00f2ff";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.15)";
                    e.currentTarget.style.background = "#2e3637";
                    const icon = e.currentTarget.previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "#00f2ff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.password
                      ? "1px solid #ffb4ab"
                      : "1px solid rgba(58,73,75,0.5)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "#151d1e";
                    const icon = e.currentTarget.previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "#849495";
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: "#ffb4ab" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                background: loading ? "#1a3030" : "#00f2ff",
                color: loading ? "#849495" : "#080f10",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 20px rgba(0,242,255,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
            >
              {loading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#849495", borderTopColor: "transparent" }}
                  />
                  {t("common.loading") || "Loading..."}
                </>
              ) : (
                <>
                  {t("auth.signIn") || "Initialize Session"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6" style={{ opacity: 0.5 }}>
            <div
              className="flex-grow h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, #3a494b)",
              }}
            />
            <span
              className="px-4 text-xs font-bold tracking-widest uppercase"
              style={{ color: "#b9cacb" }}
            >
              OR CONTINUE WITH
            </span>
            <div
              className="flex-grow h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, #3a494b)",
              }}
            />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { icon: <Briefcase className="w-5 h-5" />, label: "SSO" },
              { icon: <Fingerprint className="w-5 h-5" />, label: "Biometric" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-200 group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "6px",
                  color: "#b9cacb",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid rgba(255,255,255,0.20)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#dce4e4";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#b9cacb";
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;