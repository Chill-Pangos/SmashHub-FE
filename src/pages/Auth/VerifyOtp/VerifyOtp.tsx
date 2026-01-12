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
import { useAuthOperations } from "@/hooks";
import { useAuth } from "@/store/useAuth";
import { validateOTP, showToast } from "@/utils";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { verifyOtp, verifyEmailOtp, resendEmailVerification, loading } =
    useAuthOperations();

  const email = searchParams.get("email");
  const type = searchParams.get("type"); // 'password-reset' or 'email-verification'

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      showToast.error("Email không hợp lệ");
      navigate("/signin");
    }
  }, [email, navigate]);

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
      setError("Email không hợp lệ");
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
        setError("Không tìm thấy thông tin người dùng");
        return;
      }
      const result = await verifyEmailOtp({ email, otp }, user);

      if (result.success) {
        showToast.success(
          "Xác thực email thành công",
          "Email của bạn đã được xác thực"
        );
        navigate("/");
      } else {
        setError(result.error || "Mã OTP không chính xác");
        showToast.error("Xác thực thất bại", result.error);
      }
    } else {
      // Password reset flow
      const result = await verifyOtp({ email, otp });

      if (result.success) {
        showToast.success(
          "Xác thực thành công",
          "Bạn có thể đặt lại mật khẩu mới"
        );
        navigate(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`
        );
      } else {
        setError(result.error || "Mã OTP không chính xác");
        showToast.error("Xác thực thất bại", result.error);
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResending(true);

    if (type === "email-verification") {
      const result = await resendEmailVerification({ email });
      if (result.success) {
        showToast.success("Mã OTP mới đã được gửi", "Vui lòng kiểm tra email");
      } else {
        showToast.error("Gửi lại thất bại", result.error);
      }
    } else {
      // Resend forgot password OTP - need to implement in useAuthOperations if needed
      showToast.info("Vui lòng quay lại trang quên mật khẩu để gửi lại");
    }

    setResending(false);
  };

  const getTitle = () => {
    return type === "email-verification" ? "Xác thực Email" : "Xác thực OTP";
  };

  const getDescription = () => {
    return type === "email-verification"
      ? `Nhập mã OTP đã được gửi đến ${email}`
      : `Nhập mã OTP được gửi đến ${email} để đặt lại mật khẩu`;
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
              Nhập mã OTP
            </CardTitle>
            <CardDescription className="text-center">
              Mã OTP gồm 6 chữ số
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Mã OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
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
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                >
                  {resending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                </button>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
