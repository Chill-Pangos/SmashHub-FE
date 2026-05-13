import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthOperations, useTranslation } from "@/hooks";
import { validateForgotPasswordForm, showToast } from "@/utils";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { forgotPassword, loading } = useAuthOperations();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForgotPasswordForm(email);
    if (validationError) { setError(validationError); return; }

    const result = await forgotPassword({ email });
    if (result.success) {
      setSubmitted(true);
      showToast.success(t("auth.otpSent"), t("authFlow.checkEmail"));
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=password-reset`);
      }, 1500);
    } else {
      setError(result.error || t("authFlow.forgotPassword.otpSendFailed"));
      showToast.error(t("authFlow.forgotPassword.otpSendFailed"), result.error);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "#0d1515", fontFamily: "'Sora', sans-serif" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(0,242,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <main className="w-full max-w-[480px] relative z-10 flex flex-col items-center">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: "#00dbe7" }}>
            SmashHub
          </h1>
          <p className="text-sm" style={{ color: "#849495" }}>
            Pro Circuit Recovery
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-xl p-8"
          style={{
            backdropFilter: "blur(24px)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: "#dce4e4" }}>
                  {t("authFlow.forgotPassword.cardTitle") || "Reset Password"}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#b9cacb" }}>
                  {t("authFlow.forgotPassword.cardDescription") ||
                    "Enter the email address associated with your Pro Circuit Admin account to receive recovery instructions."}
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Email field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "#b9cacb" }}
                  >
                    {t("auth.email") || "Email Address"}
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#849495" }}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder={t("placeholder.enterEmail") || "admin@procircuit.com"}
                      value={email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full outline-none transition-all duration-200"
                      style={{
                        background: "#232b2c",
                        border: error ? "1px solid #ffb4ab" : "1px solid #3a494b",
                        borderRadius: "6px",
                        color: "#dce4e4",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "16px",
                        padding: "12px 12px 12px 42px",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border = "1px solid #00f2ff";
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(0,242,255,0.15)";
                        e.currentTarget.style.background = "#2e3637";
                        const icon = e.currentTarget.previousElementSibling as HTMLElement;
                        if (icon) icon.style.color = "#00f2ff";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = error ? "1px solid #ffb4ab" : "1px solid #3a494b";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = "#232b2c";
                        const icon = e.currentTarget.previousElementSibling as HTMLElement;
                        if (icon) icon.style.color = "#849495";
                      }}
                    />
                  </div>
                  {error && <p className="text-xs" style={{ color: "#ffb4ab" }}>{error}</p>}
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 group"
                  style={{
                    background: loading ? "#1a3030" : "#00f2ff",
                    color: loading ? "#849495" : "#000000",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(0,242,255,0.4)";
                  }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                  onMouseUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("authFlow.forgotPassword.sending") || "Sending..."}
                    </>
                  ) : (
                    <>
                      {t("authFlow.forgotPassword.sendOtpButton") || "Send Recovery Link"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Return to login button */}
                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="w-full py-4 rounded flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#b9cacb",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("authFlow.backToSignIn") || "Return to Login"}
                </button>
              </form>

              {/* Footer */}
              <div
                className="text-center mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-sm" style={{ color: "#849495" }}>
                  Need urgent access?{" "}
                  <NavLink
                    to="/signin"
                    className="font-semibold transition-colors"
                    style={{ color: "#00dbe7" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00f2ff")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00dbe7")}
                  >
                    Contact Support
                  </NavLink>
                </p>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center flex flex-col items-center gap-5 py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,242,255,0.1)", border: "1px solid rgba(0,242,255,0.2)" }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: "#00f2ff" }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: "#dce4e4" }}>
                  {t("authFlow.forgotPassword.otpSentSuccess") || "Recovery Link Sent"}
                </h2>
                <p className="text-sm" style={{ color: "#b9cacb" }}>
                  {t("authFlow.redirectingToVerification") || "Redirecting to verification..."}
                </p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00f2ff",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;