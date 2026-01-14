import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import TournamentContentForm from "./TournamentContentForm";
import type { TournamentContentFormData } from "@/utils/validation.utils";

interface CategorySettingsProps {
  tournamentContents: TournamentContentFormData[];
  onAdd: (content: TournamentContentFormData) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, content: TournamentContentFormData) => void;
}

export default function CategorySettings({
  tournamentContents,
  onAdd,
  onRemove,
  onUpdate,
}: CategorySettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = (content: TournamentContentFormData) => {
    if (editingIndex !== null) {
      onUpdate(editingIndex, content);
      setEditingIndex(null);
    } else {
      onAdd(content);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
  };

  const getTypeBadge = (type: TournamentContentFormData["type"]) => {
    const colors = {
      single: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      double: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      team: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };
    const labels = {
      single: "Đơn",
      double: "Đôi",
      team: "Đồng đội",
    };
    return (
      <Badge className={colors[type]}>{labels[type]}</Badge>
    );
  };

  const getGenderBadge = (gender?: string | null) => {
    if (!gender) return null;
    const colors = {
      male: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      female: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      mixed: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };
    const labels = {
      male: "Nam",
      female: "Nữ",
      mixed: "Hỗn hợp",
    };
    return (
      <Badge className={colors[gender as keyof typeof colors]}>
        {labels[gender as keyof typeof labels]}
      </Badge>
    );
  };

  if (isAdding || editingIndex !== null) {
    return (
      <TournamentContentForm
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={editingIndex !== null ? tournamentContents[editingIndex] : undefined}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Nội dung thi đấu</h2>
          <p className="text-sm text-muted-foreground">
            Thêm các nội dung thi đấu cho giải đấu (đơn, đôi, đồng đội)
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nội dung
        </Button>
      </div>

      {tournamentContents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Chưa có nội dung thi đấu nào
          </p>
          <Button variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nội dung đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tournamentContents.map((content, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{content.name}</h3>
                    {getTypeBadge(content.type)}
                    {getGenderBadge(content.gender)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Số lượng tối đa: <strong>{content.maxEntries}</strong></div>
                    <div>Số set tối đa: <strong>{content.maxSets}</strong></div>
                    
                    {content.type === "team" && (
                      <>
                        <div>Số trận đơn: <strong>{content.numberOfSingles ?? 0}</strong></div>
                        <div>Số trận đôi: <strong>{content.numberOfDoubles ?? 0}</strong></div>
                      </>
                    )}
                    
                    {(content.minAge || content.maxAge) && (
                      <div>
                        Độ tuổi:{" "}
                        <strong>
                          {content.minAge ?? "?"} - {content.maxAge ?? "?"}
                        </strong>
                      </div>
                    )}
                    
                    {(content.minElo || content.maxElo) && (
                      <div>
                        ELO:{" "}
                        <strong>
                          {content.minElo ?? "?"} - {content.maxElo ?? "?"}
                        </strong>
                      </div>
                    )}
                    
                    <div>
                      Kiểm tra vợt:{" "}
                      <strong>{content.racketCheck ? "Có" : "Không"}</strong>
                    </div>
                    
                    <div>
                      Vòng bảng:{" "}
                      <strong>{content.isGroupStage ? "Có" : "Không"}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(index)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tournamentContents.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tổng cộng:</strong> {tournamentContents.length} nội dung thi đấu
          </p>
        </div>
      )}
    </Card>
  );
}
