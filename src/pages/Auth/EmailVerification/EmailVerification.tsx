import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, MailCheck, RefreshCw } from "lucide-react";
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
          showToast.success(t("auth.otpSent"), t("authFlow.checkEmail"));
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
        showToast.success(t("auth.otpSent"), t("authFlow.checkEmail"));
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
        navigate("/");
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
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* Ambient glows */}
      <div
        className="fixed top-1/4 left-1/4 pointer-events-none rounded-full"
        style={{
          width: "500px",
          height: "500px",
          background: "var(--auth-ambient-primary)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 pointer-events-none rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background: "var(--auth-ambient-accent)",
          filter: "blur(80px)",
        }}
      />

      <main className="w-full max-w-[420px] relative z-10">
        <div
          className="rounded-xl p-8 flex flex-col items-center text-center"
          style={{
            backdropFilter: "blur(24px)",
            background: "var(--auth-card-gradient)",
            border: "1px solid var(--auth-surface-border)",
            boxShadow: "var(--auth-surface-shadow)",
          }}
        >
          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{
              background: "var(--auth-status-badge-bg)",
              color: "var(--auth-status-badge-fg)",
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            {t("authFlow.emailVerification.statusBadge")}
          </div>

          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "var(--auth-icon-bg)",
              border: "1px solid var(--auth-icon-border)",
              boxShadow: "var(--auth-icon-shadow)",
            }}
          >
            <MailCheck className="w-9 h-9" style={{ color: "var(--accent)" }} />
          </div>

          {/* Title & description */}
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            {emailSent
              ? t("authFlow.emailVerification.emailSentTitle")
              : t("authFlow.emailVerification.cardTitle")}
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--foreground-muted)", maxWidth: "300px" }}
          >
            {emailSent
              ? t("authFlow.emailVerification.emailSentDescription")
              : t("authFlow.emailVerification.unverifiedDescription")}
          </p>

          {emailSent && (
            <form
              className="flex flex-col gap-3 w-full mb-6"
              onSubmit={handleVerifyOtp}
            >
              <div className="flex flex-col gap-1.5 text-left">
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
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                  style={{
                    background: "var(--input)",
                    border: `1px solid ${otpError ? "var(--destructive)" : "var(--border)"}`,
                    color: "var(--foreground)",
                  }}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("authFlow.emailVerification.otpDescription")}
                </p>
                {otpError && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--destructive)" }}
                  >
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyEmailOtpMutation.isPending}
                className="w-full py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300"
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
              >
                {verifyEmailOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
            className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 w-full"
            style={{
              background: "var(--input)",
              border: "1px solid var(--border)",
            }}
          >
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "var(--accent)" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--accent)" }}
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
                className="w-full py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300"
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
                      "var(--auth-primary-glow)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
                  className="w-full py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    opacity: hasEmail ? 1 : 0.5,
                    pointerEvents: hasEmail ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "var(--auth-primary-glow)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "none";
                  }}
                >
                  <Mail className="w-4 h-4" />
                  {t("authFlow.emailVerification.openMailClient")}
                </a>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: "var(--auth-ghost-bg)",
                    border: "1px solid var(--auth-ghost-border)",
                    color: resending
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                    cursor: resending ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!resending)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--auth-ghost-bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--auth-ghost-bg)";
                  }}
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
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

          {/* Separator + back */}
          <div
            className="w-full mt-6 pt-5"
            style={{ borderTop: "1px solid var(--auth-divider-border)" }}
          >
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

export default EmailVerification;
