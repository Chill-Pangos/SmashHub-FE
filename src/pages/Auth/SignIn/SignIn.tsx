import { useState, type FormEvent, type ChangeEvent, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight/* , Briefcase, Fingerprint */ } from "lucide-react";
import tableTennisBgLight from "@/assets/table_tennis_bg_light.png";
import tableTennisBgDark from "@/assets/table_tennis_bg_dark.png";
import { useCurrentUser, useLogin, useTranslation } from "@/hooks";
import { useAuth, useRole } from "@/store";
import {
  validateLoginForm,
  hasValidationErrors,
  showToast,
  showApiError,
  type LoginFormData,
  type ValidationErrors,
} from "@/utils";

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: setAuthData, updateUser } = useAuth();
  const { getDefaultRouteForRoles, getRoleNames } = useRole();
  const loginMutation = useLogin();
  const { refetch: fetchCurrentUser } = useCurrentUser({ enabled: false });
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
 /*  const quickAccessItems = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: t("authFlow.signIn.sso"),
    },
    {
      icon: <Fingerprint className="w-5 h-5" />,
      label: t("authFlow.signIn.biometric"),
    },
  ]; */

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
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validationErrors = validateLoginForm(formData);
      if (hasValidationErrors(validationErrors)) {
        setErrors(validationErrors);
        return;
      }
      try {
        const response = await loginMutation.mutateAsync(formData);

        if (response.success && response.data) {
          setAuthData(response.data);

          let currentUser = response.data.user;
          try {
            const refreshed = await fetchCurrentUser();
            if (refreshed.data) {
              currentUser = refreshed.data;
              updateUser(currentUser);
            }
          } catch (err) {
            console.warn("Failed to refresh current user after login:", err);
          }

          const roleNames = getRoleNames(currentUser.roles ?? []);
          const redirectPath =
            roleNames.length > 1 ? "/" : getDefaultRouteForRoles(roleNames);

          navigate(redirectPath, { replace: true });
          showToast.success(
            t("auth.loginSuccess"),
            t("authFlow.welcomeBackWithName", {
              name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
            }),
          );
        } else {
          showApiError(response, t("auth.loginFailed"));
        }
      } catch (err) {
        showApiError(err, t("auth.loginFailed"));
      }
    },
    [
      fetchCurrentUser,
      formData,
      getDefaultRouteForRoles,
      getRoleNames,
      loginMutation,
      navigate,
      setAuthData,
      t,
      updateUser,
    ],
  );

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* ── Left: Cinematic Visual ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0"
          style={{
            backgroundImage: `url(${tableTennisBgLight})`,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100"
          style={{
            backgroundImage: `url(${tableTennisBgDark})`,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0"
          style={{
            backgroundImage: `url(${tableTennisBgLight})`,
            filter: "blur(18px)",
            transform: "scale(1.06)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100"
          style={{
            backgroundImage: `url(${tableTennisBgDark})`,
            filter: "blur(18px)",
            transform: "scale(1.06)",
            opacity: 0.35,
          }}
        />

        {/* Gradient overlays — Tối ưu độ trong suốt cho Light Mode */}
        {/* Light mode overlays */}
        {/* Đệm nhẹ từ trái sang cho khu vực đặt Text brand */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0"
          style={{
            background:
              "linear-gradient(to right, rgba(244,247,247,0.65) 0%, rgba(244,247,247,0.2) 35%, transparent 80%)",
          }}
        />
        {/* Đệm từ dưới lên để làm nổi bật chữ SmashHub ở góc trái */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0"
          style={{
            background:
              "linear-gradient(to top, rgba(244,247,247,0.85) 0%, rgba(244,247,247,0.05) 40%, transparent 100%)",
          }}
        />
        {/* Dải vuốt lề phải: Chuyển tiếp mượt mà vào background form */}
        <div
          className="absolute inset-y-0 right-0 transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0"
          style={{
            width: "200px",
            background:
              "linear-gradient(to right, rgba(244,247,247,0) 0%, rgba(244,247,247,0.8) 65%, rgba(244,247,247,1) 100%)",
          }}
        />

        {/* Dark mode overlays */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(to right, rgba(13,21,21,0.92) 0%, rgba(13,21,21,0.55) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(13,21,21,0.95) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100"
          style={{
            width: "200px",
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
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="var(--accent)"
                strokeWidth="2.5"
                fill="none"
              />
              <line
                x1="16"
                y1="4"
                x2="16"
                y2="28"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <line
                x1="4"
                y1="16"
                x2="28"
                y2="16"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <line
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                stroke="var(--accent)"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="24"
                y1="8"
                x2="8"
                y2="24"
                stroke="var(--accent)"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="24"
                y1="24"
                x2="34"
                y2="36"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Smash<span style={{ color: "var(--accent)" }}>Hub</span>
            </h1>
          </div>
          <p
            className="text-base leading-relaxed max-w-sm"
            style={{ color: "var(--foreground-muted)" }}
          >
            {t("auth.brandDescription")}
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
            background:
              "radial-gradient(circle, rgba(0,219,231,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Glassmorphic Card */}
        <div
          className="relative w-full z-10"
          style={{
            maxWidth: "440px",
            background: "var(--auth-surface)",
            backdropFilter: "blur(24px)",
            border: "1px solid var(--auth-surface-border)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "var(--auth-surface-shadow)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="var(--accent)"
                strokeWidth="2.5"
                fill="none"
              />
              <line
                x1="16"
                y1="4"
                x2="16"
                y2="28"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <line
                x1="4"
                y1="16"
                x2="28"
                y2="16"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <line
                x1="24"
                y1="24"
                x2="34"
                y2="36"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Smash<span style={{ color: "var(--accent)" }}>Hub</span>
            </h2>
          </div>

          {/* Auth Toggle */}
          <div
            className="flex p-1 mb-8 rounded-full"
            style={{
              background: "var(--auth-toggle-bg)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--auth-toggle-border)",
            }}
          >
            {/* Sign In — active */}
            <button
              type="button"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--auth-primary-glow)",
              }}
            >
              {t("auth.signIn")}
            </button>
            {/* Sign Up — inactive */}
            <NavLink
              to="/signup"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-center transition-colors duration-200"
              style={{ color: "var(--foreground-muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--foreground)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--foreground-muted)")
              }
            >
              {t("auth.signUp")}
            </NavLink>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("auth.welcomeBack")}
            </h3>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {t("auth.enterCredentials")}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("auth.email")}
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.enterEmail")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loginMutation.isPending}
                  required
                  className="w-full py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: errors.email
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid var(--primary)";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.15)";
                    e.currentTarget.style.background = "var(--secondary)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.email
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--card)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--muted-foreground)";
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="password"
                  type="password"
                  placeholder={t("auth.enterPassword")}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loginMutation.isPending}
                  required
                  className="w-full py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: errors.password
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid var(--primary)";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.15)";
                    e.currentTarget.style.background = "var(--secondary)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = errors.password
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--card)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--muted-foreground)";
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-2 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                background: loginMutation.isPending
                  ? "var(--muted)"
                  : "var(--primary)",
                color: loginMutation.isPending
                  ? "var(--muted-foreground)"
                  : "var(--primary-foreground)",
                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loginMutation.isPending) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 20px rgba(0,242,255,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.02)";
              }}
            >
              {loginMutation.isPending ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "var(--muted-foreground)",
                      borderTopColor: "transparent",
                    }}
                  />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  {t("auth.signIn")}
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
                  "linear-gradient(to right, transparent, var(--border))",
              }}
            />
           {/*  <span
              className="px-4 text-xs font-bold tracking-widest uppercase"
              style={{ color: "var(--foreground-muted)" }}
            >
              {t("authFlow.signIn.continueWith")}
            </span> */}
            <div
              className="flex-grow h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, var(--border))",
              }}
            />
          </div>

          <div className="flex justify-center mb-6">
            <NavLink
              to="/forgot-password"
              className="text-sm font-bold transition-colors duration-200"
              style={{ color: "var(--accent)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--accent)")
              }
            >
              {t("auth.forgotPassword")}
            </NavLink>
          </div>

          {/* Social buttons */}
         {/*  <div className="flex flex-col sm:flex-row gap-4">
            {quickAccessItems.map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-200 group"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "6px",
                  color: "var(--foreground-muted)",
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
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--foreground-muted)";
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
