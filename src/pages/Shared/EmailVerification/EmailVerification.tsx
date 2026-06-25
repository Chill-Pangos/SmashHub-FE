import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/store";
import { useTranslation } from "@/hooks";
import {
  useSendEmailVerification,
  useResendEmailVerification,
  useVerifyEmailOtp,
} from "@/hooks/queries/useAuthQueries";
import { validateOTP } from "@/utils/validation.utils";
import { showToast } from "@/utils";
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return fallback;
};

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, updateUser } = useAuth();
  const sendEmailVerificationMutation = useSendEmailVerification();
  const resendEmailVerificationMutation = useResendEmailVerification();
  const verifyEmailOtpMutation = useVerifyEmailOtp();
  const loading = sendEmailVerificationMutation.isPending;
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const autoSentRef = useRef(false);
  const email = user?.email || searchParams.get("email") || "";
  const hasEmail = Boolean(email);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      showToast.error(t("toast.errors.UNAUTHORIZED"));
      navigate("/signin");
      return;
    }

    if (user.isEmailVerified) {
      showToast.info(t("authFlow.emailVerification.alreadyVerified"));
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, t]);

  const handleSendVerification = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!email) {
        showToast.error(t("authFlow.emailVerification.emailNotFound"));
        return;
      }
      try {
        const resp = await sendEmailVerificationMutation.mutateAsync({ email });
        if (resp.success) {
          setEmailSent(true);
          setOtpError(null);
          showToast.success(t("authFlow.emailVerification.otpSent"), t("authFlow.emailVerification.checkEmail"));
        } else {
          const errMsg =
            typeof resp.error === "string"
              ? resp.error
              : resp.error?.message || resp.message;
          showToast.error(t("authFlow.emailVerification.sendFailed"), errMsg);
        }
      } catch (err: unknown) {
        const errMsg = getErrorMessage(
          err,
          t("authFlow.emailVerification.sendFailed"),
        );
        showToast.error(t("authFlow.emailVerification.sendFailed"), errMsg);
      }
    },
    [email, sendEmailVerificationMutation, t],
  );

  useEffect(() => {
    if (!hasEmail || emailSent || autoSentRef.current) {
      return;
    }

    autoSentRef.current = true;
    void handleSendVerification();
  }, [hasEmail, emailSent, handleSendVerification]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const resp = await resendEmailVerificationMutation.mutateAsync({ email });
      if (resp.success) {
        setOtpError(null);
        showToast.success(t("authFlow.emailVerification.otpSent"), t("authFlow.emailVerification.checkEmail"));
      } else {
        const errMsg =
          typeof resp.error === "string"
            ? resp.error
            : resp.error?.message || resp.message;
        showToast.error(t("authFlow.emailVerification.sendFailed"), errMsg);
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(
        err,
        t("authFlow.emailVerification.sendFailed"),
      );
      showToast.error(t("authFlow.emailVerification.sendFailed"), errMsg);
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setOtpError(t("authFlow.emailVerification.emailNotFound"));
      return;
    }

    const validationError = validateOTP(otp);
    if (validationError) {
      setOtpError(validationError);
      return;
    }

    try {
      const resp = await verifyEmailOtpMutation.mutateAsync({ email, otp });
      if (resp.success) {
        if (user) {
          updateUser({ ...user, isEmailVerified: true });
        }
        showToast.success(
          t("authFlow.emailVerification.verificationSuccessTitle"),
          t("authFlow.emailVerification.verificationSuccessDescription"),
        );
        const fromSignUp = location.state?.fromSignUp;
        if (fromSignUp) {
          navigate("/profile", { state: { forceUpdate: true } });
        } else {
          navigate("/");
        }
      } else {
        const errMsg =
          typeof resp.error === "string"
            ? resp.error
            : resp.error?.message || resp.message;
        setOtpError(errMsg || t("authFlow.emailVerification.otpInvalid"));
        showToast.error(
          t("authFlow.emailVerification.verificationFailed"),
          errMsg,
        );
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(
        err,
        t("authFlow.emailVerification.verificationFailed"),
      );
      setOtpError(errMsg);
      showToast.error(
        t("authFlow.emailVerification.verificationFailed"),
        errMsg,
      );
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
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 w-fit text-xs font-bold tracking-widest uppercase"
              style={{
                background: "color-mix(in srgb, var(--primary) 15%, transparent)",
                color: "var(--primary)",
                border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚡</span>
              {t("authFlow.emailVerification.statusBadge")}
            </div>

            <h3
              className="text-2xl font-semibold mb-2 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <MailCheck className="w-6 h-6" style={{ color: "var(--primary)" }} />
              {emailSent
                ? t("authFlow.emailVerification.emailSentTitle")
                : t("authFlow.emailVerification.cardTitle")}
            </h3>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {emailSent
                ? t("authFlow.emailVerification.emailSentDescription")
                : t("authFlow.emailVerification.unverifiedDescription")}
            </p>
          </div>

          {emailSent && (
            <form className="flex flex-col gap-4 mb-6" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="otp"
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {t("authFlow.emailVerification.enterOtpTitle")}
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (otpError) setOtpError(null);
                  }}
                  placeholder={t("authFlow.emailVerification.otpPlaceholder")}
                  className="w-full px-4 py-3 text-sm rounded-md outline-none transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: otpError
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "'Sora', sans-serif",
                    letterSpacing: "0.5em",
                    textAlign: "center",
                    fontSize: "1.25rem",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid var(--primary)";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(0,242,255,0.15)";
                    e.currentTarget.style.background = "var(--secondary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = otpError
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--card)";
                  }}
                />
                {otpError && (
                  <p
                    className="text-xs mt-1 text-center"
                    style={{ color: "var(--destructive)" }}
                  >
                    {otpError}
                  </p>
                )}
                <p
                  className="text-xs mt-1 text-center"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("authFlow.emailVerification.otpDescription")}
                </p>
              </div>

              <button
                type="submit"
                disabled={verifyEmailOtpMutation.isPending}
                className="w-full mt-2 py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
                style={{
                  background: verifyEmailOtpMutation.isPending
                    ? "var(--muted)"
                    : "var(--primary)",
                  color: verifyEmailOtpMutation.isPending
                    ? "var(--muted-foreground)"
                    : "var(--primary-foreground)",
                  cursor: verifyEmailOtpMutation.isPending
                    ? "not-allowed"
                    : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!verifyEmailOtpMutation.isPending) {
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
                {verifyEmailOtpMutation.isPending ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{
                        borderColor: "var(--muted-foreground)",
                        borderTopColor: "transparent",
                      }}
                    />
                    {t("authFlow.emailVerification.verifying")}
                  </>
                ) : (
                  <>
                    <MailCheck className="w-4 h-4" />
                    {t("authFlow.emailVerification.verifyButton")}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Email display chip */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6 w-full"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "var(--muted-foreground)" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--foreground)" }}
            >
              {hasEmail ? email : t("authFlow.emailVerification.emailNotFound")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            {!emailSent ? (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={loading}
                className="w-full py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
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
                    {t("authFlow.emailVerification.sending")}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {t("authFlow.emailVerification.sendButton")}
                  </>
                )}
              </button>
            ) : (
              <>
                <a
                  href={hasEmail ? `mailto:${email}` : "#"}
                  className="w-full py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    opacity: hasEmail ? 1 : 0.5,
                    pointerEvents: hasEmail ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (hasEmail) {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        "0 0 20px rgba(0,242,255,0.4)";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLAnchorElement).style.transform =
                      "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (hasEmail)
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    if (hasEmail)
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "scale(1.02)";
                  }}
                >
                  <Mail className="w-4 h-4" />
                  {t("authFlow.emailVerification.openMailClient")}
                </a>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full py-4 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: resending
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                    cursor: resending ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!resending) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  {resending ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{
                          borderColor: "var(--muted-foreground)",
                          borderTopColor: "transparent",
                        }}
                      />
                      {t("authFlow.emailVerification.resending")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      {t("authFlow.emailVerification.resendButton")}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
