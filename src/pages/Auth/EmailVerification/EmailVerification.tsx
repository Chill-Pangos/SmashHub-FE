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
      style={{ backgroundColor: "#0d1515", fontFamily: "'Sora', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="fixed top-1/4 left-1/4 pointer-events-none rounded-full"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0,219,231,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 pointer-events-none rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(87,27,193,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <main className="w-full max-w-[420px] relative z-10">
        <div
          className="rounded-xl p-8 flex flex-col items-center text-center"
          style={{
            backdropFilter: "blur(24px)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase text-white"
            style={{
              background: "linear-gradient(to right, #571bc1, #00dbe7)",
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            {t("authFlow.emailVerification.statusBadge")}
          </div>

          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "rgba(0,219,231,0.08)",
              border: "1px solid rgba(0,219,231,0.2)",
              boxShadow: "0 0 30px rgba(0,219,231,0.1)",
            }}
          >
            <MailCheck className="w-9 h-9" style={{ color: "#00dbe7" }} />
          </div>

          {/* Title & description */}
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#dce4e4" }}>
            {emailSent
              ? t("authFlow.emailVerification.emailSentTitle")
              : t("authFlow.emailVerification.cardTitle")}
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#b9cacb", maxWidth: "300px" }}
          >
            {emailSent
              ? t("authFlow.emailVerification.emailSentDescription")
              : t("authFlow.emailVerification.unverifiedDescription")}
          </p>

          {/* Email display chip */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 w-full"
            style={{
              background: "#232b2c",
              border: "1px solid #3a494b",
            }}
          >
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#00dbe7" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "#00dbe7" }}
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
                  background: loading ? "#1a3030" : "#00f2ff",
                  color: loading ? "#849495" : "#080f10",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 20px rgba(0,242,255,0.4)";
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
                    background: "#00f2ff",
                    color: "#080f10",
                    opacity: hasEmail ? 1 : 0.5,
                    pointerEvents: hasEmail ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 0 20px rgba(0,242,255,0.4)";
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
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: resending ? "#849495" : "#dce4e4",
                    cursor: resending ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!resending)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.03)";
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
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
              style={{ color: "#849495" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00f2ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#849495")}
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
