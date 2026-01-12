import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Mail, Share2, Printer } from "lucide-react";

interface ExportOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const exportOptions: ExportOption[] = [
  {
    id: "download",
    icon: <Download className="h-6 w-6" />,
    title: "Tải xuống",
    description: "Lưu báo cáo về máy tính",
    action: "Tải xuống",
  },
  {
    id: "email",
    icon: <Mail className="h-6 w-6" />,
    title: "Gửi email",
    description: "Gửi báo cáo qua email",
    action: "Gửi email",
  },
  {
    id: "print",
    icon: <Printer className="h-6 w-6" />,
    title: "In báo cáo",
    description: "In trực tiếp hoặc xuất PDF để in",
    action: "In",
  },
  {
    id: "share",
    icon: <Share2 className="h-6 w-6" />,
    title: "Chia sẻ",
    description: "Tạo link chia sẻ báo cáo",
    action: "Chia sẻ",
  },
];

export default function ExportOptions() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Tùy chọn xuất báo cáo</h2>

      <div className="space-y-4">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                {option.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{option.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
            <Button variant="outline">{option.action}</Button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <Label className="text-sm font-semibold mb-3 block">
          Cài đặt xuất báo cáo
        </Label>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Bao gồm logo và header</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Hiển thị chữ ký điện tử</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Đánh số trang</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Chế độ in đen trắng</span>
          </label>
        </div>
      </div>
    </Card>
  );
}
