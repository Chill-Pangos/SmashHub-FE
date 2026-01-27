import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import type { TournamentContent } from "@/types";

interface ContentListProps {
  contents: TournamentContent[];
  onRegister: (content: TournamentContent) => void;
  disabled?: boolean;
}

export function ContentList({
  contents,
  onRegister,
  disabled = false,
}: ContentListProps) {
  const getContentTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      single: "default",
      double: "secondary",
      team: "outline",
    };
    const labels: Record<string, string> = {
      single: "Đơn",
      double: "Đôi",
      team: "Đội",
    };

    return (
      <Badge variant={variants[type] || "outline"}>
        {labels[type] || type}
      </Badge>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <Card key={content.id} className="border">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{content.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Tối đa {content.maxEntries} entries
                </p>
              </div>
              {getContentTypeBadge(content.type)}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              {content.gender && (
                <p>
                  Giới tính:{" "}
                  {content.gender === "male"
                    ? "Nam"
                    : content.gender === "female"
                      ? "Nữ"
                      : "Hỗn hợp"}
                </p>
              )}
              {content.minAge && content.maxAge && (
                <p>
                  Độ tuổi: {content.minAge} - {content.maxAge}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => onRegister(content)}
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              Đăng ký
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
