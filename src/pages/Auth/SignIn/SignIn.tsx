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
import { Lock, Mail, Trophy, Loader2 } from "lucide-react";
import { authService } from "@/services";
import {
  validateLoginForm,
  hasValidationErrors,
  type LoginFormData,
  type ValidationErrors,
} from "@/utils";
import { unwrapApiResponse, showApiError, showToast } from "@/utils";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await authService.login(formData);

      // Unwrap response
      const authData = unwrapApiResponse(response);

      // Save auth data to localStorage
      authService.saveAuthData(authData);

      // Show success message
      showToast.success(
        "Đăng nhập thành công",
        `Chào mừng trở lại, ${authData.user.username}!`
      );

      // Redirect to home page
      navigate("/");
    } catch (error) {
      // Show error toast
      showApiError(error, "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
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
            Chào mừng trở lại
          </h1>
          <p className="text-muted-foreground">
            Đăng nhập vào tài khoản SmashHub của bạn
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-border"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Quên mật khẩu?
                </NavLink>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <NavLink
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Đăng ký ngay
                </NavLink>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
