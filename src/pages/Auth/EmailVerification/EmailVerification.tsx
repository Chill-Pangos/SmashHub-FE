import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/store";
import { useAuthOperations, useTranslation } from "@/hooks";
import { showToast } from "@/utils";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { sendEmailVerification, loading } = useAuthOperations();
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);
  const email = user?.email || searchParams.get("email") || "";
  const hasEmail = Boolean(email);

  // useEffect(() => {
  //   // Redirect if not authenticated
  //   if (!isAuthenticated || !user) {
  //     showToast.error(t("toast.errors.UNAUTHORIZED"));
  //     navigate("/signin");
  //     return;
  //   }

  //   // Redirect if email is already verified
  //   if (user.isEmailVerified) {
  //     showToast.info(t("authFlow.emailVerification.alreadyVerified"));
  //     navigate("/");
  //   }
  // }, [isAuthenticated, user, navigate, t]);

  const handleSendVerification = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!email) {
      showToast.error(t("authFlow.emailVerification.emailNotFound"));
      return;
    }
    const result = await sendEmailVerification({ email });
    if (result.success) {
      setEmailSent(true);
      showToast.success(t("auth.otpSent"), t("authFlow.checkEmail"));
      setTimeout(() => {
        navigate(
          `/verify-otp?email=${encodeURIComponent(email)}&type=email-verification`,
        );
      }, 1500);
    } else {
      showToast.error(t("authFlow.emailVerification.sendFailed"), result.error);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const result = await sendEmailVerification({ email });
    if (result.success) {
      showToast.success(t("auth.otpSent"), t("authFlow.checkEmail"));
    } else {
      showToast.error(t("authFlow.emailVerification.sendFailed"), result.error);
    }
    setResending(false);
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
