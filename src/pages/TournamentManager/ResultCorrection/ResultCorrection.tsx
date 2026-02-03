import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CorrectionRequestList,
  ApprovalDialog,
  HistoryLog,
} from "./components";

export default function ResultCorrection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t("tournamentManager.resultCorrection.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.resultCorrection.pendingApproval")}
              </p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.resultCorrection.approved")}
              </p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.resultCorrection.rejected")}
              </p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tournamentManager.resultCorrection.totalRequests")}
              </p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t(
                    "tournamentManager.resultCorrection.searchPlaceholder",
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("tournamentManager.resultCorrection.allStatuses")}
                  </SelectItem>
                  <SelectItem value="pending">
                    {t("tournamentManager.resultCorrection.pendingApproval")}
                  </SelectItem>
                  <SelectItem value="approved">
                    {t("tournamentManager.resultCorrection.approved")}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t("tournamentManager.resultCorrection.rejected")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <CorrectionRequestList />
        </div>

        <div>
          <HistoryLog />
        </div>
      </div>

      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        request={null}
      />
    </div>
  );
}
