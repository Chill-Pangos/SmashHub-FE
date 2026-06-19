import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  CheckCircle2,
  Circle,
  ArrowLeft,
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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors"
      style={{
        background: met ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "var(--secondary)",
        border: met
          ? "1px solid color-mix(in srgb, var(--primary) 30%, transparent)"
          : "1px solid var(--border)",
      }}
    >
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
      ) : (
        <Circle className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
      )}
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: met ? "var(--foreground)" : "var(--muted-foreground)" }}
      >
        {label}
      </span>
    </div>
  );

  const strengthColor =
    passwordStrength === PasswordStrength.WEAK
      ? "var(--destructive)"
      : passwordStrength === PasswordStrength.MEDIUM
        ? "var(--chart-4)"
        : "var(--chart-3)";

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
          t("authFlow.changePassword.successTitle"),
          t("authFlow.changePassword.successDescription"),
        );
        setTimeout(() => navigate(-1), 1500); // Go back after success
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

  return (
    <div
      className="flex min-h-[600px] h-full w-full justify-center items-center py-12"
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* ── Auth Form ── */}
      <div className="w-full flex items-center justify-center p-4 lg:p-8 relative">
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
            maxWidth: "480px",
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

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </button>

          {/* Header */}
          <div className="mb-6">
            <h3
              className="text-2xl font-semibold mb-2 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <Lock className="w-6 h-6" style={{ color: "var(--primary)" }} />
              {t("authFlow.changePassword.title")}
            </h3>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {t("authFlow.changePassword.subtitle")}
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="oldPassword"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("authFlow.changePassword.currentPassword")}
              </label>
              <div className="relative group">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder={t("authFlow.changePassword.oldPasswordPlaceholder")}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full py-3 pl-10 pr-10 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: errors.oldPassword
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
                    e.currentTarget.style.border = errors.oldPassword
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--card)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--muted-foreground)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
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
                  className="text-xs mt-1"
                  style={{ color: "var(--destructive)" }}
                >
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label
                htmlFor="newPassword"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("authFlow.changePassword.newPassword")}
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder={t("authFlow.changePassword.newPasswordPlaceholder")}
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full py-3 pl-10 pr-10 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: errors.newPassword
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
                    e.currentTarget.style.border = errors.newPassword
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--card)";
                    const icon = e.currentTarget
                      .previousElementSibling as SVGElement;
                    if (icon) icon.style.color = "var(--muted-foreground)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
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
                  className="text-xs font-medium mt-1"
                  style={{ color: strengthColor }}
                >
                  {t("authFlow.passwordStrengthLabel")}: {strengthText}
                </p>
              )}
              {errors.newPassword && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--destructive)" }}
                >
                  {errors.newPassword}
                </p>
              )}

              <p
                className="text-xs mt-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("authFlow.changePassword.passwordRequirements")}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
              style={{
                background: loading ? "var(--muted)" : "var(--primary)",
                color: loading
                  ? "var(--muted-foreground)"
                  : "var(--primary-foreground)",
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
              {loading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "var(--muted-foreground)",
                      borderTopColor: "transparent",
                    }}
                  />
                  {t("authFlow.changePassword.submitting")}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t("authFlow.changePassword.updateButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
