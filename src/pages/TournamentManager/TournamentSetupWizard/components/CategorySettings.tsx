import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  gender: "male" | "female" | "mixed";
  ageGroup: string;
  maxParticipants: number;
}

const predefinedCategories: Category[] = [
  {
    id: "1",
    name: "Nam đơn",
    gender: "male",
    ageGroup: "Tất cả",
    maxParticipants: 32,
  },
  {
    id: "2",
    name: "Nữ đơn",
    gender: "female",
    ageGroup: "Tất cả",
    maxParticipants: 32,
  },
  {
    id: "3",
    name: "Nam đôi",
    gender: "male",
    ageGroup: "Tất cả",
    maxParticipants: 16,
  },
  {
    id: "4",
    name: "Nữ đôi",
    gender: "female",
    ageGroup: "Tất cả",
    maxParticipants: 16,
  },
  {
    id: "5",
    name: "Đôi nam nữ",
    gender: "mixed",
    ageGroup: "Tất cả",
    maxParticipants: 16,
  },
  {
    id: "6",
    name: "Nam đơn U19",
    gender: "male",
    ageGroup: "U19",
    maxParticipants: 16,
  },
  {
    id: "7",
    name: "Nữ đơn U19",
    gender: "female",
    ageGroup: "U19",
    maxParticipants: 16,
  },
  {
    id: "8",
    name: "Nam đơn U15",
    gender: "male",
    ageGroup: "U15",
    maxParticipants: 16,
  },
  {
    id: "9",
    name: "Nữ đơn U15",
    gender: "female",
    ageGroup: "U15",
    maxParticipants: 16,
  },
];

interface CategorySettingsProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategorySettings({
  selectedCategories,
  onChange,
}: CategorySettingsProps) {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const getGenderBadge = (gender: Category["gender"]) => {
    const colors = {
      male: "bg-blue-100 text-blue-700",
      female: "bg-pink-100 text-pink-700",
      mixed: "bg-purple-100 text-purple-700",
    };
    const labels = {
      male: "Nam",
      female: "Nữ",
      mixed: "Hỗn hợp",
    };
    return { color: colors[gender], label: labels[gender] };
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Nội dung thi đấu</h2>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm nội dung tùy chỉnh
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predefinedCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const genderBadge = getGenderBadge(category.gender);

            return (
              <label
                key={category.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category.id)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge className={genderBadge.color}>
                        {genderBadge.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Độ tuổi: {category.ageGroup}</p>
                      <p>Số VĐV tối đa: {category.maxParticipants}</p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Nội dung đã chọn</h3>
            <Badge variant="secondary">
              {selectedCategories.length} nội dung
            </Badge>
          </div>
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategories.map((id) => {
                const category = predefinedCategories.find((c) => c.id === id);
                if (!category) return null;
                return (
                  <Badge key={id} variant="outline" className="gap-1">
                    {category.name}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCategory(id);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Chưa chọn nội dung thi đấu nào
            </p>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p>
            <strong>Khuyến nghị:</strong> Giải vô địch quốc gia thường bao gồm 5
            nội dung chính: Nam đơn, Nữ đơn, Nam đôi, Nữ đôi, và Đôi nam nữ.
          </p>
        </div>
      </div>
    </Card>
  );
}
