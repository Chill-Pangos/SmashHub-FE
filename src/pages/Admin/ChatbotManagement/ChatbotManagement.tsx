import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RefreshCw, Database, FileText, Upload, Download, Activity, AlertTriangle } from "lucide-react";
import { useDateFormat } from "@/hooks/useDateFormat";
import {
  useChatbotHealth,
  useChatbotFiles,
  useUploadDocument,
  useIngestDocuments,
  useResetCollection,
} from "@/hooks/queries/useChatbotQueries";
import { getChatbotFileUrl } from "@/utils/file.utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function ChatbotManagement() {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const { data: healthData, isLoading: isLoadingHealth, refetch: refetchHealth } = useChatbotHealth();
  const { data: filesData, isLoading: isLoadingFiles, refetch: refetchFiles } = useChatbotFiles();
  
  const uploadMutation = useUploadDocument();
  const ingestMutation = useIngestDocuments();
  const resetMutation = useResetCollection();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [resetInput, setResetInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadMutation.mutateAsync(selectedFile);
      setSelectedFile(null);
      refetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIngest = async () => {
    try {
      await ingestMutation.mutateAsync({ overwrite });
      refetchHealth();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async () => {
    if (resetInput !== "RESET") return;
    try {
      await resetMutation.mutateAsync();
      setResetInput("");
      refetchHealth();
      refetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("chatbotManagement.title")}</h1>
        <Button onClick={() => { refetchHealth(); refetchFiles(); }} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("chatbotManagement.refresh")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t("chatbotManagement.systemStatus")}
            </CardTitle>
            <CardDescription>{t("chatbotManagement.systemStatusDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHealth ? (
              <p className="text-sm text-muted-foreground">{t("chatbotManagement.loading")}</p>
            ) : healthData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{t("chatbotManagement.serviceStatus")}</span>
                  <Badge variant={healthData.status === "ok" ? "default" : "destructive"}>
                    {healthData.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase">{t("chatbotManagement.llmModel")}</span>
                    <p className="text-sm font-medium">{healthData.llm_model}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase">{t("chatbotManagement.embedModel")}</span>
                    <p className="text-sm font-medium">{healthData.embed_model}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase">{t("chatbotManagement.collection")}</span>
                    <p className="text-sm font-medium">{healthData.chroma_collection}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase">{t("chatbotManagement.docsIndexed")}</span>
                    <p className="text-sm font-medium">{healthData.documents_indexed}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-destructive">{t("chatbotManagement.failedLoadStatus")}</p>
            )}
          </CardContent>
        </Card>

        {/* Upload & Ingest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t("chatbotManagement.dataPipeline")}
            </CardTitle>
            <CardDescription>{t("chatbotManagement.dataPipelineDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t("chatbotManagement.uploadLabel")}</Label>
              <div className="flex gap-2">
                <Input type="file" accept=".txt,.md" onChange={handleFileChange} />
                <Button onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending}>
                  {uploadMutation.isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {t("chatbotManagement.uploadButton")}
                </Button>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>{t("chatbotManagement.ingestLabel")}</Label>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox 
                  id="overwrite" 
                  checked={overwrite} 
                  onCheckedChange={(checked) => setOverwrite(checked as boolean)} 
                />
                <Label htmlFor="overwrite" className="text-sm font-normal">
                  {t("chatbotManagement.overwriteLabel")}
                </Label>
              </div>
              <Button onClick={handleIngest} disabled={ingestMutation.isPending} variant="secondary" className="w-full">
                {ingestMutation.isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                {t("chatbotManagement.ingestButton")}
              </Button>
              {ingestMutation.isSuccess && (
                <p className="text-sm text-green-600 mt-2">
                  {t("chatbotManagement.ingestSuccess", { 
                    loaded: ingestMutation.data?.documents_loaded, 
                    chunks: ingestMutation.data?.chunks_created 
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("chatbotManagement.documentStore")}
            </CardTitle>
            <CardDescription>{t("chatbotManagement.documentStoreDesc", { root: filesData?.root || "data" })}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFiles ? (
               <p className="text-sm text-muted-foreground">{t("chatbotManagement.loading")}</p>
            ) : filesData?.files && filesData.files.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("chatbotManagement.fileName")}</TableHead>
                      <TableHead>{t("chatbotManagement.size")}</TableHead>
                      <TableHead>{t("chatbotManagement.modified")}</TableHead>
                      <TableHead className="text-right">{t("chatbotManagement.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filesData.files.map((file) => (
                      <TableRow key={file.path}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.size_label}</TableCell>
                        <TableCell>{formatDateTime(file.modified_at_iso)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={getChatbotFileUrl(file.download_url)} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" /> {t("chatbotManagement.download")}
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("chatbotManagement.noDocs")}</p>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="md:col-span-2 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {t("chatbotManagement.dangerZone")}
            </CardTitle>
            <CardDescription>{t("chatbotManagement.dangerZoneDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t("chatbotManagement.resetCollection")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("chatbotManagement.resetConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("chatbotManagement.resetConfirmDesc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="confirmReset" className="mb-2 block text-sm" dangerouslySetInnerHTML={{ __html: t("chatbotManagement.resetConfirmLabel") }} />
                  <Input 
                    id="confirmReset" 
                    value={resetInput} 
                    onChange={(e) => setResetInput(e.target.value)} 
                    placeholder={t("chatbotManagement.resetPlaceholder")}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setResetInput("")}>{t("chatbotManagement.cancel")}</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleReset} 
                    disabled={resetInput !== "RESET" || resetMutation.isPending}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {resetMutation.isPending ? t("chatbotManagement.resetting") : t("chatbotManagement.resetAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
