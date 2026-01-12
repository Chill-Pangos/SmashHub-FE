import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
import { Mail, Trophy, Loader2, ArrowLeft } from "lucide-react";
import { useAuthOperations } from "@/hooks";
import { validateForgotPasswordForm, showToast } from "@/utils";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuthOperations();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email
    const validationError = validateForgotPasswordForm(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Send OTP request
    const result = await forgotPassword({ email });

    if (result.success) {
      setSubmitted(true);
      showToast.success(
        "Mã OTP đã được gửi",
        "Vui lòng kiểm tra email của bạn"
      );

      // Navigate to verify OTP page with email param
      setTimeout(() => {
        navigate(
          `/verify-otp?email=${encodeURIComponent(email)}&type=password-reset`
        );
      }, 1500);
    } else {
      setError(result.error || "Không thể gửi mã OTP. Vui lòng thử lại.");
      showToast.error("Gửi mã OTP thất bại", result.error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quên mật khẩu
          </h1>
          <p className="text-muted-foreground">
            Nhập email của bạn để nhận mã xác thực
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Khôi phục mật khẩu
            </CardTitle>
            <CardDescription className="text-center">
              Chúng tôi sẽ gửi mã OTP đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!submitted ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi mã xác thực"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/signin")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-700 dark:text-green-300">
                    Mã OTP đã được gửi đến email của bạn!
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Đang chuyển hướng đến trang xác thực...
                </p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Nhớ mật khẩu?{" "}
                <NavLink
                  to="/signin"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Đăng nhập ngay
                </NavLink>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
