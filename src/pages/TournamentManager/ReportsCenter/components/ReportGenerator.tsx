import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FileSpreadsheet, FileIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ReportGenerator() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState("");
  const [format, setFormat] = useState("");
  const [tournament, setTournament] = useState("");
  const [dateRange, setDateRange] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {t("tournamentManager.reportsCenter.createReport")}
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>{t("tournamentManager.reportsCenter.reportType")}</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "tournamentManager.reportsCenter.selectReportType",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tournament-summary">
                {t("tournamentManager.reportsCenter.tournamentSummary")}
              </SelectItem>
              <SelectItem value="match-report">
                {t("tournamentManager.reportsCenter.matchReport")}
              </SelectItem>
              <SelectItem value="delegation-report">
                {t("tournamentManager.reportsCenter.delegationReport")}
              </SelectItem>
              <SelectItem value="statistics-report">
                {t("tournamentManager.reportsCenter.statisticsReport")}
              </SelectItem>
              <SelectItem value="referee-report">
                {t("tournamentManager.reportsCenter.refereeReport")}
              </SelectItem>
              <SelectItem value="schedule-report">
                {t("tournamentManager.reportsCenter.scheduleReport")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tournament.tournament")}</Label>
          <Select value={tournament} onValueChange={setTournament}>
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "tournamentManager.reportsCenter.selectTournament",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t1">Giải vô địch Quốc gia 2024</SelectItem>
              <SelectItem value="t2">Giải U19 toàn quốc 2024</SelectItem>
              <SelectItem value="t3">Giải vô địch các CLB 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tournamentManager.reportsCenter.dateRange")}</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "tournamentManager.reportsCenter.selectDateRange",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("tournamentManager.reportsCenter.allTournament")}
              </SelectItem>
              <SelectItem value="today">
                {t("tournamentManager.reportsCenter.today")}
              </SelectItem>
              <SelectItem value="yesterday">
                {t("tournamentManager.reportsCenter.yesterday")}
              </SelectItem>
              <SelectItem value="week">
                {t("tournamentManager.reportsCenter.last7Days")}
              </SelectItem>
              <SelectItem value="month">
                {t("tournamentManager.reportsCenter.last30Days")}
              </SelectItem>
              <SelectItem value="custom">
                {t("tournamentManager.reportsCenter.custom")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tournamentManager.reportsCenter.exportFormat")}</Label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setFormat("pdf")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "pdf" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileIcon className="h-8 w-8 text-red-500" />
              <span className="text-sm font-medium">PDF</span>
            </button>

            <button
              onClick={() => setFormat("excel")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "excel" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Excel</span>
            </button>

            <button
              onClick={() => setFormat("word")}
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:border-primary transition-colors ${
                format === "word" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium">Word</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1"
            disabled={!reportType || !format || !tournament || !dateRange}
          >
            {t("tournamentManager.reportsCenter.generateReport")}
          </Button>
          <Button variant="outline" className="flex-1">
            {t("tournamentManager.reportsCenter.preview")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
