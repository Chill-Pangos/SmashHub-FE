import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trophy, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useAuthOperations, useTranslation } from "@/hooks";
import { useAuth } from "@/store/useAuth";
import { validateOTP, showToast } from "@/utils";

const COUNTDOWN_SECONDS = 180; // 3 minutes

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    verifyOtp,
    verifyEmailOtp,
    resendEmailVerification,
    forgotPassword,
    loading,
  } = useAuthOperations();

  const email = searchParams.get("email");
  const type = searchParams.get("type");

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // useEffect(() => {
  //   if (!email) {
  //     showToast.error(t("authFlow.verifyOtp.invalidEmail"));
  //     navigate("/signin");
  //   }
  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (error) setError(null);
    if (digit && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setDigits(newDigits);
    focusInput(Math.min(pasted.length, 5));
  };

  const otp = digits.join("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError(t("authFlow.verifyOtp.invalidEmail"));
      return;
    }
    const validationError = validateOTP(otp);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (type === "email-verification") {
      if (!user) {
        setError(t("authFlow.verifyOtp.userNotFound"));
        return;
      }
      const result = await verifyEmailOtp({ email, otp }, user);
      if (result.success) {
        showToast.success(
          t("authFlow.verifyOtp.emailVerificationSuccessTitle"),
          t("authFlow.verifyOtp.emailVerificationSuccessDescription"),
        );
        navigate("/");
      } else {
        setError(result.error || t("authFlow.verifyOtp.otpInvalid"));
        showToast.error(t("authFlow.verifyOtp.verificationFailed"), result.error);
      }
    } else {
      const result = await verifyOtp({ email, otp });
      if (result.success) {
        showToast.success(
          t("authFlow.verifyOtp.verificationSuccessTitle"),
          t("authFlow.verifyOtp.verificationSuccessDescription"),
        );
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
      } else {
        setError(result.error || t("authFlow.verifyOtp.otpInvalid"));
        showToast.error(t("authFlow.verifyOtp.verificationFailed"), result.error);
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const resendFn =
      type === "email-verification" ? resendEmailVerification : forgotPassword;
    const result = await resendFn({ email });
    if (result.success) {
      setCountdown(COUNTDOWN_SECONDS);
      showToast.success(
        t("authFlow.verifyOtp.resendSuccessTitle"),
        t("authFlow.checkEmail"),
      );
    } else {
      showToast.error(t("authFlow.verifyOtp.resendFailedTitle"), result.error);
    }
    setResending(false);
  };

  const isComplete = otp.length === 6;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ backgroundColor: "#0d1515" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,219,231,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(208,188,255,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <main className="w-full max-w-lg relative z-10 flex flex-col items-center">
        {/* Brand */}
        <div className="mb-12 text-center flex flex-col items-center gap-2">
          <Trophy
            className="w-12 h-12"
            style={{ color: "#00dbe7" }}
            strokeWidth={1.5}
          />
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{ color: "#00dbe7", fontFamily: "'Sora', sans-serif" }}
          >
            SmashHub
          </h1>
          <span
            className="text-xs font-bold tracking-widest uppercase mt-1"
            style={{ color: "#849495", fontFamily: "'Sora', sans-serif" }}
          >
            Pro Circuit Access
          </span>
        </div>

        {/* Glass card */}
        <div
          className="w-full rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          style={{
            background: "rgba(25, 33, 34, 0.60)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {/* Inner gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Header */}
            <div className="text-center flex flex-col gap-2">
              <h2
                className="text-3xl font-semibold"
                style={{ color: "#dce4e4", fontFamily: "'Sora', sans-serif" }}
              >
                Verification Code
              </h2>
              <p
                className="text-base"
                style={{ color: "#b9cacb", fontFamily: "'Sora', sans-serif" }}
              >
                {type === "email-verification"
                  ? t("authFlow.verifyOtp.descriptionEmail", { email })
                  : t("authFlow.verifyOtp.descriptionPasswordReset", { email })}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
              {/* 6 digit inputs */}
              <div className="flex justify-between w-full gap-2 md:gap-3">
                {digits.map((digit, i) => {
                  const isFocused =
                    document.activeElement === inputRefs.current[i];
                  const isActive = !digit && digits.slice(0, i).every(Boolean);
                  return (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoFocus={i === 0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleDigitChange(i, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="flex-1 h-16 rounded-lg text-center outline-none transition-all duration-200"
                      style={{
                        background: "#2e3637",
                        border: isActive || isFocused
                          ? "1px solid #00f2ff"
                          : "1px solid #3a494b",
                        color: "#dce4e4",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "28px",
                        fontWeight: 600,
                        boxShadow:
                          isActive || isFocused
                            ? "0 0 15px rgba(0,242,255,0.15)"
                            : "none",
                        maxWidth: "56px",
                      }}
                    />
                  );
                })}
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-sm text-center"
                  style={{ color: "#ffb4ab", fontFamily: "'Sora', sans-serif" }}
                >
                  {error}
                </p>
              )}

              {/* Countdown chip */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(87,27,193,0.20)",
                  border: "1px solid rgba(87,27,193,0.30)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "#00f2ff",
                    animation: countdown > 0 ? "pulse 2s infinite" : "none",
                  }}
                />
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#b9cacb", fontFamily: "'Sora', sans-serif" }}
                >
                  {countdown > 0
                    ? `${formatTime(countdown)} remaining`
                    : "Code expired"}
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !isComplete}
                className="w-full py-4 rounded-lg font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 group"
                style={{
                  background: isComplete && !loading ? "#00f2ff" : "#1a3030",
                  color: isComplete && !loading ? "#080f10" : "#849495",
                  cursor: isComplete && !loading ? "pointer" : "not-allowed",
                  boxShadow:
                    isComplete && !loading
                      ? "0 0 0px rgba(0,242,255,0)"
                      : "none",
                  fontFamily: "'Sora', sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (isComplete && !loading) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 20px rgba(0,242,255,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("authFlow.verifyOtp.verifying")}
                  </>
                ) : (
                  <>
                    {t("authFlow.verifyOtp.verifyButton") || "Verify Identity"}
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer actions */}
            <div
              className="text-center pt-4 flex flex-col gap-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p
                className="text-sm"
                style={{ color: "#b9cacb", fontFamily: "'Sora', sans-serif" }}
              >
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || countdown > 0}
                  className="ml-1 underline underline-offset-4 transition-all duration-200 disabled:opacity-40"
                  style={{
                    color: "#00dbe7",
                    textDecorationColor: "rgba(0,219,231,0.3)",
                    fontFamily: "'Sora', sans-serif",
                    cursor: resending || countdown > 0 ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!resending && countdown <= 0) {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#00f2ff";
                      (e.currentTarget as HTMLButtonElement).style.textShadow =
                        "0 0 10px rgba(0,242,255,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#00dbe7";
                    (e.currentTarget as HTMLButtonElement).style.textShadow =
                      "none";
                  }}
                >
                  {resending ? "Resending..." : "Resend Code"}
                </button>
              </p>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-1 transition-colors mx-auto"
                style={{
                  color: "#849495",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#dce4e4";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#849495";
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;