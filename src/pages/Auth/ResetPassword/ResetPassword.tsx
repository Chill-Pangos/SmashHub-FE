import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  Loader2,
  EyeOff,
  CheckCircle2,
  Circle,
} from "lucide-react";
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

  // useEffect(() => {
  //   if (!email || !otp) {
  //     showToast.error(t("authFlow.resetPassword.invalidInfo"));
  //     navigate("/forgot-password");
  //   }
  // }, [email, otp, navigate, t]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    }
  };

  const pw = formData.newPassword;
  const hasMinLength = pw.length >= 12;
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const passwordStrength = pw ? checkPasswordStrength(pw) : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !otp) {
      showToast.error(t("authFlow.resetPassword.invalidInfo"));
      return;
    }

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

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "var(--input)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--foreground)",
    fontFamily: "'Sora', sans-serif",
    fontSize: "16px",
    padding: "12px 44px 12px 16px",
    outline: "none",
    transition: "all 0.2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid var(--primary)";
    e.currentTarget.style.boxShadow = "inset 0 0 10px rgba(0,242,255,0.1)";
  };
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    hasErr?: boolean,
  ) => {
    e.currentTarget.style.border = hasErr
      ? "1px solid var(--destructive)"
      : "1px solid var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  const Chip = ({ met, label }: { met: boolean; label: string }) => (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded"
      style={{
        background: met
          ? "linear-gradient(to right, rgba(87,27,193,0.2), rgba(0,242,255,0.2))"
          : "var(--secondary)",
        border: met
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {met ? (
        <CheckCircle2
          className="w-3.5 h-3.5"
          style={{ color: "var(--primary)" }}
        />
      ) : (
        <Circle
          className="w-3.5 h-3.5"
          style={{ color: "var(--muted-foreground)" }}
        />
      )}
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: met ? "var(--foreground)" : "var(--muted-foreground)" }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(0,242,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <main className="w-full max-w-[480px] relative z-10">
        {/* Glassmorphism Card */}
        <div
          className="rounded-xl p-8"
          style={{
            backdropFilter: "blur(24px)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="text-3xl font-bold tracking-tight mb-1"
              style={{ color: "var(--accent)" }}
            >
              SmashHub
            </div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("authFlow.resetPassword.headerTitle")}
            </h1>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {t("authFlow.resetPassword.subtitle")}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="newPassword"
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--foreground-muted)" }}
              >
                {t("auth.newPassword")}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  style={{
                    ...inputBase,
                    border: errors.newPassword
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                  }}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, !!errors.newPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordStrength && (
                <p
                  className="text-xs font-medium"
                  style={{
                    color:
                      passwordStrength === PasswordStrength.WEAK
                        ? "var(--destructive)"
                        : passwordStrength === PasswordStrength.MEDIUM
                          ? "var(--chart-4)"
                          : "var(--chart-3)",
                  }}
                >
                  {t("authFlow.passwordStrengthLabel")}:{" "}
                  {passwordStrength === PasswordStrength.WEAK
                    ? t("validation.passwordStrength.weak")
                    : passwordStrength === PasswordStrength.MEDIUM
                      ? t("validation.passwordStrength.medium")
                      : t("validation.passwordStrength.strong")}
                </p>
              )}
              {errors.newPassword && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.newPassword}
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
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
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
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <LockKeyhole className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password requirement chips */}
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              <Chip
                met={hasMinLength}
                label={t("authFlow.resetPassword.requirements.length")}
              />
              <Chip
                met={hasSymbol}
                label={t("authFlow.resetPassword.requirements.symbol")}
              />
              <Chip
                met={hasNumber}
                label={t("authFlow.resetPassword.requirements.number")}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded flex items-center justify-center gap-2 text-base font-semibold transition-all duration-300 group"
              style={{
                background: loading ? "var(--muted)" : "var(--primary)",
                color: loading
                  ? "var(--muted-foreground)"
                  : "var(--primary-foreground)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 15px var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("authFlow.resetPassword.submitting")}
                </>
              ) : (
                <>
                  {t("authFlow.resetPassword.submitButton")}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div
            className="my-6"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
            }}
          />

          {/* Back to login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--muted-foreground)")
              }
            >
              <ArrowLeft className="w-4 h-4" />
              {t("authFlow.backToSignIn")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
