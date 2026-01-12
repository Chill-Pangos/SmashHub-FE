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
import { Lock, Trophy, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthOperations } from "@/hooks";
import {
  validatePassword,
  validatePasswordConfirmation,
  checkPasswordStrength,
  showToast,
  PasswordStrength,
  type ValidationErrors,
} from "@/utils";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useAuthOperations();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      showToast.error("Thông tin không hợp lệ");
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const getPasswordStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "text-red-500";
      case PasswordStrength.MEDIUM:
        return "text-yellow-500";
      case PasswordStrength.STRONG:
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPasswordStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case PasswordStrength.WEAK:
        return "Yếu";
      case PasswordStrength.MEDIUM:
        return "Trung bình";
      case PasswordStrength.STRONG:
        return "Mạnh";
      default:
        return "";
    }
  };

  const passwordStrength = formData.newPassword
    ? checkPasswordStrength(formData.newPassword)
    : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !otp) {
      showToast.error("Thông tin không hợp lệ");
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.newPassword);
    const confirmError = validatePasswordConfirmation(
      formData.newPassword,
      formData.confirmPassword
    );

    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError || "",
        confirmPassword: confirmError || "",
      });
      return;
    }

    // Call reset password
    const result = await resetPassword({
      email,
      otp,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      showToast.success(
        "Đặt lại mật khẩu thành công",
        "Bạn có thể đăng nhập với mật khẩu mới"
      );
      navigate("/signin");
    } else {
      showToast.error("Đặt lại mật khẩu thất bại", result.error);
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
            Đặt lại mật khẩu
          </h1>
          <p className="text-muted-foreground">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Mật khẩu mới
            </CardTitle>
            <CardDescription className="text-center">
              Đảm bảo mật khẩu đủ mạnh và an toàn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    className="pl-10 pr-10"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <p
                    className={`text-sm ${getPasswordStrengthColor(
                      passwordStrength
                    )}`}
                  >
                    Độ mạnh: {getPasswordStrengthText(passwordStrength)}
                  </p>
                )}
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Đang đặt lại...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
