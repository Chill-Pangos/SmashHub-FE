import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Loader2, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/store";
import { useAuthOperations } from "@/hooks";
import { showToast } from "@/utils";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { sendEmailVerification, loading } = useAuthOperations();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      showToast.error("Vui lòng đăng nhập để tiếp tục");
      navigate("/signin");
      return;
    }

    // Redirect if email is already verified
    if (user.isEmailVerified) {
      showToast.info("Email của bạn đã được xác thực");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSendVerification = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!user?.email) {
      showToast.error("Không tìm thấy thông tin email");
      return;
    }

    const result = await sendEmailVerification({ email: user.email });

    if (result.success) {
      setEmailSent(true);
      showToast.success(
        "Mã OTP đã được gửi",
        "Vui lòng kiểm tra email của bạn"
      );

      // Navigate to verify OTP page
      setTimeout(() => {
        navigate(
          `/verify-otp?email=${encodeURIComponent(
            user.email
          )}&type=email-verification`
        );
      }, 1500);
    } else {
      showToast.error("Gửi email thất bại", result.error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Xác thực Email
          </h1>
          <p className="text-muted-foreground">
            Xác thực email để sử dụng đầy đủ tính năng
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Xác thực email của bạn
            </CardTitle>
            <CardDescription className="text-center">
              Email: <span className="font-medium">{user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!emailSent ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start gap-3">
                  <Mail className="h-5 w-5 text-yellow-700 dark:text-yellow-300 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Email chưa được xác thực
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Vui lòng xác thực email để sử dụng tất cả các tính năng
                      của SmashHub.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendVerification}>
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
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Gửi mã xác thực
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/")}
                  >
                    Bỏ qua, xác thực sau
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                      Email đã được gửi!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Mã OTP đã được gửi đến email của bạn.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Đang chuyển hướng đến trang xác thực...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
