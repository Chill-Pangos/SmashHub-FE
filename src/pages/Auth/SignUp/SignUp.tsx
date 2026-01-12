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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Mail, Trophy, User, Loader2, UserCog } from "lucide-react";
import { useAuthOperations } from "@/hooks";
import {
  validateRegisterForm,
  hasValidationErrors,
  checkPasswordStrength,
  showToast,
  PasswordStrength,
  type RegisterFormData,
  type ValidationErrors,
} from "@/utils";

const SignUp = () => {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuthOperations();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "spectator",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const passwordStrength = formData.password
    ? checkPasswordStrength(formData.password)
    : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check terms agreement
    if (!agreedToTerms) {
      showToast.error(
        "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật"
      );
      return;
    }

    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Call register from useAuthOperations
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (result.success && result.data) {
      // Show success message
      showToast.success(
        "Đăng ký thành công",
        `Chào mừng bạn đến với SmashHub, ${result.data.user.username}!`
      );

      // Redirect to home page
      navigate("/");
    } else {
      // Error is already set in authError state
      showToast.error(
        "Đăng ký thất bại",
        result.error || authError || undefined
      );
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
            Tham gia SmashHub
          </h1>
          <p className="text-muted-foreground">
            Tạo tài khoản và bắt đầu hành trình của bạn
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Đăng ký
            </CardTitle>
            <CardDescription className="text-center">
              Điền thông tin để tạo tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-card-foreground">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

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
                    disabled={loading}
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
                    placeholder="Tạo mật khẩu"
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {passwordStrength && (
                  <p
                    className={`text-sm ${getPasswordStrengthColor(
                      passwordStrength
                    )}`}
                  >
                    Độ mạnh mật khẩu:{" "}
                    {getPasswordStrengthText(passwordStrength)}
                  </p>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-card-foreground"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="pl-10 bg-input border-border text-foreground"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-card-foreground">
                  Loại tài khoản
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value as "spectator" | "player" | "organizer",
                    }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-full bg-input border-border text-foreground">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Chọn loại tài khoản" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spectator">
                      <div className="flex flex-col">
                        <span className="font-medium">Khán giả</span>
                        <span className="text-xs text-muted-foreground">
                          Xem và theo dõi các trận đấu
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="player">
                      <div className="flex flex-col">
                        <span className="font-medium">Vận động viên</span>
                        <span className="text-xs text-muted-foreground">
                          Tham gia thi đấu
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="organizer">
                      <div className="flex flex-col">
                        <span className="font-medium">Ban tổ chức</span>
                        <span className="text-xs text-muted-foreground">
                          Tổ chức và quản lý giải đấu
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Bạn có thể thay đổi loại tài khoản sau khi đăng ký
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-border"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={loading}
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  Tôi đồng ý với{" "}
                  <NavLink
                    to="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Điều khoản dịch vụ
                  </NavLink>{" "}
                  và{" "}
                  <NavLink
                    to="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Chính sách bảo mật
                  </NavLink>
                </Label>
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <NavLink
                  to="/signin"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Đăng nhập
                </NavLink>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
