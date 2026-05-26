import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  KeyRound,
  CheckCircle2,
  Circle,
  LayoutDashboard,
  Trophy,
  BarChart2,
  Swords,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  UserCircle2,
  ArrowLeft,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useChangePassword } from "@/hooks/queries/useAuthQueries";
import { useTranslation } from "@/hooks/useTranslation";
import { showToast } from "@/utils/toast.utils";
import {
  validatePassword,
  checkPasswordStrength,
  PasswordStrength,
  type ValidationErrors,
} from "@/utils/validation.utils";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Trophy, label: "Tournaments", to: "/tournaments" },
  { icon: BarChart2, label: "Rankings", to: "/rankings" },
  { icon: Swords, label: "Referees", to: "/referees" },
  { icon: Wallet, label: "Financials", to: "/financials" },
  { icon: Settings, label: "System Settings", to: "/settings", active: true },
];

const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const changePasswordMutation = useChangePassword();
  const loading = changePasswordMutation.isPending;

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     showToast.error(t("toast.errors.UNAUTHORIZED"));
  //     navigate("/signin", { replace: true });
  //   }
  // }, [isAuthenticated, navigate, t]);

  if (!isAuthenticated) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
  };

  const passwordStrength = formData.newPassword
    ? checkPasswordStrength(formData.newPassword)
    : null;

  const pw = formData.newPassword;
  const hasMinLength = pw.length >= 12;
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const hasNumber = /\d/.test(pw);

  const Chip = ({ met, label }: { met: boolean; label: string }) => (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded"
      style={{
        background: met
          ? "linear-gradient(to right, rgba(87,27,193,0.2), rgba(0,242,255,0.2))"
          : "#2e3637",
        border: met
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#00f2ff" }} />
      ) : (
        <Circle className="w-3.5 h-3.5" style={{ color: "#849495" }} />
      )}
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: met ? "#dce4e4" : "#849495" }}
      >
        {label}
      </span>
    </div>
  );

  const strengthColor =
    passwordStrength === PasswordStrength.WEAK
      ? "#ffb4ab"
      : passwordStrength === PasswordStrength.MEDIUM
        ? "#e8c423"
        : "#4ade80";

  const strengthText =
    passwordStrength === PasswordStrength.WEAK
      ? t("validation.passwordStrength.weak")
      : passwordStrength === PasswordStrength.MEDIUM
        ? t("validation.passwordStrength.medium")
        : t("validation.passwordStrength.strong");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.oldPassword) {
      setErrors({ oldPassword: t("validation.auth.oldPasswordRequired") });
      return;
    }
    const newErr = validatePassword(formData.newPassword);
    if (newErr) {
      setErrors({ newPassword: newErr });
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      setErrors({ newPassword: t("validation.auth.newPasswordMustDiffer") });
      return;
    }

    try {
      const resp = await changePasswordMutation.mutateAsync({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      if (resp.success) {
        showToast.success(
          t("auth.passwordChangeSuccess"),
          t("authFlow.changePassword.successDescription"),
        );
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        const errMsg =
          typeof resp.error === "string"
            ? resp.error
            : resp.error?.message ||
              resp.message ||
              t("authFlow.changePassword.failed");
        setErrors({ oldPassword: errMsg });
        showToast.error(t("authFlow.changePassword.failed"), errMsg);
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, t("authFlow.changePassword.failed"));
      setErrors({ oldPassword: errMsg });
      showToast.error(t("authFlow.changePassword.failed"), errMsg);
    }
  };

  // Shared input style
  const inputStyle = (hasErr?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "#232b2c",
    border: `1px solid ${hasErr ? "#ffb4ab" : "rgba(58,73,75,0.3)"}`,
    borderRadius: "8px",
    color: "#dce4e4",
    fontFamily: "'Sora', sans-serif",
    fontSize: "16px",
    padding: "12px 44px 12px 44px",
    outline: "none",
    transition: "all 0.2s",
  });

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid #00f2ff";
    e.currentTarget.style.boxShadow = "0 0 15px rgba(0,242,255,0.15)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>, hasErr?: boolean) => {
    e.currentTarget.style.border = `1px solid ${hasErr ? "#ffb4ab" : "rgba(58,73,75,0.3)"}`;
    e.currentTarget.style.boxShadow = "none";
  };

  const glassPanel: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#0d1515",
        fontFamily: "'Sora', sans-serif",
        color: "#dce4e4",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[280px] z-50 py-8 gap-4"
        style={{
          background: "rgba(25,33,34,0.6)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Profile */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={glassPanel}
            >
              <ShieldCheck
                className="w-6 h-6"
                style={{ color: "var(--primary)" }}
              />
            </div>
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Pro Circuit Admin
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Elite Tier
              </p>
            </div>
          </div>
          <button
            className="w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: "0 0 15px rgba(0,242,255,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 25px rgba(0,242,255,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 15px rgba(0,242,255,0.3)";
            }}
          >
            Create Tournament
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map(({ icon: Icon, label, to, active }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 group"
              style={{
                background: active ? "rgba(0,242,255,0.08)" : "transparent",
                borderLeft: active
                  ? "3px solid var(--accent)"
                  : "3px solid transparent",
                color: active ? "var(--accent)" : "var(--foreground-muted)",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div
          className="px-3 flex flex-col gap-1"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "16px",
          }}
        >
          {[
            { icon: HelpCircle, label: "Help", to: "/help" },
            { icon: LogOut, label: "Logout", to: "/signout" },
          ].map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors group"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--foreground)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--muted-foreground)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* ── Top Nav ── */}
      <header
        className="fixed top-0 right-0 z-40 h-16 flex items-center justify-end px-8 gap-3"
        style={{
          left: "280px",
          background: "rgba(13,21,21,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[{ icon: Bell }, { icon: UserCircle2, active: true }].map(
          ({ icon: Icon, active }, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                ...glassPanel,
                color: active ? "var(--accent)" : "var(--foreground-muted)",
                borderBottom: active ? "2px solid var(--accent)" : undefined,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 15px rgba(0,242,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <Icon className="w-5 h-5" />
            </button>
          ),
        )}
      </header>

      {/* ── Main ── */}
      <main className="flex-1 md:ml-[280px] pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--muted-foreground)";
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>

          {/* Page title */}
          <h1
            className="text-5xl font-bold tracking-tight mb-2"
            style={{ color: "var(--foreground)" }}
          >
            Security
          </h1>
          <p
            className="text-base mb-8"
            style={{ color: "var(--foreground-muted)" }}
          >
            Manage your account credentials and security preferences.
          </p>

          {/* Form Card */}
          <div
            className="rounded-xl p-8 relative overflow-hidden mb-6"
            style={glassPanel}
          >
            {/* Accent glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "rgba(0,242,255,0.08)",
                filter: "blur(50px)",
              }}
            />

            <h2
              className="text-2xl font-semibold mb-1 flex items-center gap-3 relative z-10"
              style={{ color: "var(--primary)" }}
            >
              <Lock className="w-6 h-6" />
              Change Password
            </h2>
            <div
              className="mb-6 mt-4"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />

            <form
              className="flex flex-col gap-5 relative z-10"
              onSubmit={handleSubmit}
            >
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {t("auth.currentPassword") || "Current Password"}
                </label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    id="oldPassword"
                    type={showOld ? "text" : "password"}
                    placeholder={
                      t("authFlow.changePassword.oldPasswordPlaceholder") ||
                      "Enter current password"
                    }
                    value={formData.oldPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    style={inputStyle(!!errors.oldPassword)}
                    onFocus={onFocus}
                    onBlur={(e) => onBlur(e, !!errors.oldPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#849495" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#00f2ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#849495")
                    }
                  >
                    {showOld ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--destructive)" }}
                  >
                    {errors.oldPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {t("auth.newPassword") || "New Password"}
                </label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder={
                      t("auth.enterNewPassword") || "Enter new password"
                    }
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    style={inputStyle(!!errors.newPassword)}
                    onFocus={onFocus}
                    onBlur={(e) => onBlur(e, !!errors.newPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#849495" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#00f2ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#849495")
                    }
                  >
                    {showNew ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <p
                    className="text-xs font-medium"
                    style={{ color: strengthColor }}
                  >
                    {t("authFlow.passwordStrengthLabel")}: {strengthText}
                  </p>
                )}
                {errors.newPassword && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--destructive)" }}
                  >
                    {errors.newPassword}
                  </p>
                )}
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("authFlow.changePassword.passwordRequirements") ||
                    "Must be at least 12 characters, include a number and a special character."}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip
                    met={hasMinLength}
                    label={t("authFlow.changePassword.requirements.length")}
                  />
                  <Chip
                    met={hasSymbol}
                    label={t("authFlow.changePassword.requirements.symbol")}
                  />
                  <Chip
                    met={hasNumber}
                    label={t("authFlow.changePassword.requirements.number")}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                  style={{ ...glassPanel, color: "var(--foreground)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "none";
                  }}
                >
                  {t("common.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-300"
                  style={{
                    background: loading ? "var(--muted)" : "var(--primary)",
                    color: loading
                      ? "var(--muted-foreground)"
                      : "var(--primary-foreground)",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 0 15px rgba(0,242,255,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 25px rgba(0,242,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.3)";
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("authFlow.changePassword.submitting") || "Updating..."}
                    </>
                  ) : (
                    t("auth.changePassword") || "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Session Management Info */}
          <div
            className="rounded-lg p-5 flex gap-4 items-start"
            style={{
              background: "var(--card)",
              border:
                "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
            }}
          >
            <Info
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--chart-4)" }}
            />
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                Session Management
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Changing your password will immediately sign you out of all
                other active sessions across devices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
