import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Trophy, Loader2, ArrowLeft } from "lucide-react";
import { useAuthOperations, useTranslation } from "@/hooks";
import { useAuth } from "@/store/useAuth";
import { validateOTP, showToast } from "@/utils";

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
  const type = searchParams.get("type"); // 'password-reset' or 'email-verification'

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      showToast.error(t("authFlow.verifyOtp.invalidEmail"));
      navigate("/signin");
    }
  }, [email, navigate, t]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError(t("authFlow.verifyOtp.invalidEmail"));
      return;
    }

    // Validate OTP
    const validationError = validateOTP(otp);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Verify based on type
    if (type === "email-verification") {
      // Email verification flow
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
        showToast.error(
          t("authFlow.verifyOtp.verificationFailed"),
          result.error,
        );
      }
    } else {
      // Password reset flow
      const result = await verifyOtp({ email, otp });

      if (result.success) {
        showToast.success(
          t("authFlow.verifyOtp.verificationSuccessTitle"),
          t("authFlow.verifyOtp.verificationSuccessDescription"),
        );
        navigate(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`,
        );
      } else {
        setError(result.error || t("authFlow.verifyOtp.otpInvalid"));
        showToast.error(
          t("authFlow.verifyOtp.verificationFailed"),
          result.error,
        );
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResending(true);

    if (type === "email-verification") {
      const result = await resendEmailVerification({ email });
      if (result.success) {
        showToast.success(
          t("authFlow.verifyOtp.resendSuccessTitle"),
          t("authFlow.checkEmail"),
        );
      } else {
        showToast.error(
          t("authFlow.verifyOtp.resendFailedTitle"),
          result.error,
        );
      }
    } else {
      const result = await forgotPassword({ email });
      if (result.success) {
        showToast.success(
          t("authFlow.verifyOtp.resendSuccessTitle"),
          t("authFlow.checkEmail"),
        );
      } else {
        showToast.error(
          t("authFlow.verifyOtp.resendFailedTitle"),
          result.error,
        );
      }
    }

    setResending(false);
  };

  const getTitle = () => {
    return type === "email-verification"
      ? t("authFlow.verifyOtp.titleEmail")
      : t("authFlow.verifyOtp.titleOtp");
  };

  const getDescription = () => {
    return type === "email-verification"
      ? t("authFlow.verifyOtp.descriptionEmail", { email })
      : t("authFlow.verifyOtp.descriptionPasswordReset", { email });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getTitle()}
          </h1>
          <p className="text-muted-foreground">{getDescription()}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              {t("authFlow.verifyOtp.enterOtpTitle")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("authFlow.verifyOtp.otpDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  {t("auth.otpCode")}
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder={t("authFlow.verifyOtp.otpPlaceholder")}
                  className="text-center text-2xl tracking-widest"
                  value={otp}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("authFlow.verifyOtp.verifying")}
                  </>
                ) : (
                  t("authFlow.verifyOtp.verifyButton")
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                >
                  {resending
                    ? t("authFlow.verifyOtp.resending")
                    : t("authFlow.verifyOtp.resendButton")}
                </button>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("common.back")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
