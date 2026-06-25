import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Loader2, Mail, User } from "lucide-react";
import tableTennisBgLight from "@/assets/table_tennis_bg_light.png";
import tableTennisBgDark from "@/assets/table_tennis_bg_dark.png";
import { useCurrentUser, useRegister, useTranslation } from "@/hooks";
import { useAuth, useRole } from "@/store";
import {
  checkPasswordStrength,
  hasValidationErrors,
  PasswordStrength,
  showToast,
  showApiError,
  validateRegisterForm,
  type RegisterFormData,
  type ValidationErrors,
} from "@/utils";

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: setAuthData, updateUser } = useAuth();
  const { getDefaultRouteForRoles, getRoleNames } = useRole();
  const registerMutation = useRegister();
  const { refetch: fetchCurrentUser } = useCurrentUser({ enabled: false });
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
    [errors],
  );

  const getPasswordStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "var(--destructive)";
      case PasswordStrength.MEDIUM:
        return "var(--chart-4)";
      case PasswordStrength.STRONG:
        return "var(--chart-3)";
      default:
        return "var(--foreground-muted)";
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
      try {
        const response = await registerMutation.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

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
            console.warn("Failed to refresh current user after register:", err);
          }

          navigate("/verify-email", { replace: true, state: { fromSignUp: true } });
          showToast.success(
            t("auth.registerSuccess"),
            t("authFlow.signUp.welcomeDescription", {
              name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
            }),
          );
        } else {
          showApiError(response, t("auth.registerFailed"));
        }
      } catch (err) {
        showApiError(err, t("auth.registerFailed"));
      }
    },
    [
      agreedToTerms,
      fetchCurrentUser,
      formData,
      getDefaultRouteForRoles,
      getRoleNames,
      navigate,
      registerMutation,
      setAuthData,
      t,
      updateUser,
    ],
  );

  // Reusable input style helpers
  const inputBase: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--foreground)",
    fontFamily: "'Sora', sans-serif",
    width: "100%",
    padding: "12px 12px 12px 40px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid var(--primary)";
    e.currentTarget.style.boxShadow = "0 0 15px rgba(0,242,255,0.15)";
    e.currentTarget.style.background = "var(--secondary)";
    const icon = e.currentTarget.previousElementSibling as HTMLElement;
    if (icon) icon.style.color = "var(--primary)";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    hasError?: boolean,
  ) => {
    e.currentTarget.style.border = hasError
      ? "1px solid var(--destructive)"
      : "1px solid var(--border)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "var(--card)";
    const icon = e.currentTarget.previousElementSibling as HTMLElement;
    if (icon) icon.style.color = "var(--muted-foreground)";
  };

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
        {/* Background images */}
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
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
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
      <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-8 relative overflow-y-auto">
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
          className="relative w-full z-10 my-auto mx-auto shrink-0"
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
            <NavLink
              to="/signin"
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
              {t("auth.signIn")}
            </NavLink>
            {/* Sign Up — active */}
            <button
              type="button"
              className="flex-1 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--auth-primary-glow)",
              }}
            >
              {t("auth.signUp")}
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("authFlow.signUp.welcomeDescription")}
            </h3>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {t("authFlow.signUp.cardDescription")}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "firstName",
                  label: t("validation.fields.firstName"),
                  placeholder: t("authFlow.signUp.firstNamePlaceholder"),
                  error: errors.firstName,
                },
                {
                  id: "lastName",
                  label: t("validation.fields.lastName"),
                  placeholder: t("authFlow.signUp.lastNamePlaceholder"),
                  error: errors.lastName,
                },
              ].map(({ id, label, placeholder, error }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={id}
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                    <input
                      id={id}
                      type="text"
                      placeholder={placeholder}
                      value={formData[id as keyof RegisterFormData]}
                      onChange={handleChange}
                      disabled={registerMutation.isPending}
                      required
                      style={{
                        ...inputBase,
                        border: error
                          ? "1px solid var(--destructive)"
                          : "1px solid var(--border)",
                      }}
                      onFocus={handleFocus}
                      onBlur={(e) => handleBlur(e, !!error)}
                    />
                  </div>
                  {error && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--destructive)" }}
                    >
                      {error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.enterEmail")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={registerMutation.isPending}
                  required
                  style={{
                    ...inputBase,
                    border: errors.email
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                  }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.email)}
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="password"
                  type="password"
                  placeholder={t("auth.enterPassword")}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={registerMutation.isPending}
                  required
                  style={{
                    ...inputBase,
                    border: errors.password
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                  }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.password)}
                />
              </div>
              {passwordStrength && (
                <p
                  className="text-xs font-medium"
                  style={{ color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {t("authFlow.passwordStrengthLabel")}:{" "}
                  {getPasswordStrengthText(passwordStrength)}
                </p>
              )}
              {errors.password && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.confirmPassword")}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={registerMutation.isPending}
                  required
                  style={{
                    ...inputBase,
                    border: errors.confirmPassword
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                  }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "var(--auth-terms-bg)",
                border: "1px solid var(--auth-terms-border)",
              }}
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={registerMutation.isPending}
                required
                className="mt-0.5 w-4 h-4 rounded"
                style={{ accentColor: "var(--primary)", flexShrink: 0 }}
              />
              <label
                htmlFor="terms"
                className="text-xs leading-relaxed"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("authFlow.signUp.termsPrefix")}{" "}
                <NavLink
                  to="/terms"
                  className="font-semibold underline underline-offset-2 transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {t("authFlow.signUp.termsOfService")}
                </NavLink>{" "}
                {t("authFlow.signUp.and")}{" "}
                <NavLink
                  to="/privacy"
                  className="font-semibold underline underline-offset-2 transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {t("authFlow.signUp.privacyPolicy")}
                </NavLink>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full mt-1 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                background: registerMutation.isPending
                  ? "var(--muted)"
                  : "var(--primary)",
                color: registerMutation.isPending
                  ? "var(--muted-foreground)"
                  : "var(--primary-foreground)",
                cursor: registerMutation.isPending ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!registerMutation.isPending) {
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
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  {t("auth.signUp")}
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
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {t("auth.alreadyHaveAccount")}{" "}
              <NavLink
                to="/signin"
                className="font-semibold underline underline-offset-2 transition-colors"
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
