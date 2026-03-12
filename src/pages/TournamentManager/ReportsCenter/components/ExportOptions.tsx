import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Mail, Share2, Printer } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ExportOptions() {
  const { t } = useTranslation();

  const exportOptions = [
    {
      id: "download",
      icon: <Download className="h-6 w-6" />,
      title: t("tournamentManager.reportsCenter.downloadOption"),
      description: t("tournamentManager.reportsCenter.downloadDesc"),
      action: t("tournamentManager.reportsCenter.download"),
    },
    {
      id: "email",
      icon: <Mail className="h-6 w-6" />,
      title: t("tournamentManager.reportsCenter.emailOption"),
      description: t("tournamentManager.reportsCenter.emailDesc"),
      action: t("tournamentManager.reportsCenter.emailOption"),
    },
    {
      id: "print",
      icon: <Printer className="h-6 w-6" />,
      title: t("tournamentManager.reportsCenter.printOption"),
      description: t("tournamentManager.reportsCenter.printDesc"),
      action: t("tournamentManager.reportsCenter.printOption"),
    },
    {
      id: "share",
      icon: <Share2 className="h-6 w-6" />,
      title: t("tournamentManager.reportsCenter.shareOption"),
      description: t("tournamentManager.reportsCenter.shareDesc"),
      action: t("tournamentManager.reportsCenter.shareOption"),
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {t("tournamentManager.reportsCenter.exportOptions")}
      </h2>

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
          {t("tournamentManager.reportsCenter.exportSettings")}
        </Label>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">
              {t("tournamentManager.reportsCenter.includeLogoHeader")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">
              {t("tournamentManager.reportsCenter.showDigitalSignature")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">
              {t("tournamentManager.reportsCenter.pageNumbers")}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">
              {t("tournamentManager.reportsCenter.blackWhiteMode")}
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
}
