import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin } from "lucide-react";

interface Referee {
  id: string;
  name: string;
  level: "international" | "national" | "regional";
  experience: number;
  assignedMatches: number;
  availability: "available" | "busy" | "unavailable";
  rating: number;
  specialties: string[];
}

const mockReferees: Referee[] = [
  {
    id: "1",
    name: "Trần Văn Tuấn",
    level: "international",
    experience: 12,
    assignedMatches: 8,
    availability: "available",
    rating: 4.8,
    specialties: ["Nam đơn", "Nam đôi"],
  },
  {
    id: "2",
    name: "Nguyễn Thị Lan",
    level: "international",
    experience: 10,
    assignedMatches: 7,
    availability: "busy",
    rating: 4.7,
    specialties: ["Nữ đơn", "Nữ đôi"],
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    level: "national",
    experience: 8,
    assignedMatches: 6,
    availability: "available",
    rating: 4.5,
    specialties: ["Nam đơn", "Đôi nam nữ"],
  },
  {
    id: "4",
    name: "Phạm Thị Hương",
    level: "national",
    experience: 7,
    assignedMatches: 5,
    availability: "available",
    rating: 4.4,
    specialties: ["Nữ đơn", "Nữ đôi"],
  },
  {
    id: "5",
    name: "Hoàng Văn Minh",
    level: "regional",
    experience: 5,
    assignedMatches: 4,
    availability: "unavailable",
    rating: 4.2,
    specialties: ["Nam đôi", "Đôi nam nữ"],
  },
  {
    id: "6",
    name: "Võ Thị Mai",
    level: "regional",
    experience: 4,
    assignedMatches: 3,
    availability: "available",
    rating: 4.0,
    specialties: ["Nữ đơn"],
  },
  {
    id: "7",
    name: "Đặng Quốc Huy",
    level: "national",
    experience: 9,
    assignedMatches: 6,
    availability: "busy",
    rating: 4.6,
    specialties: ["Nam đơn", "Nam đôi", "Đôi nam nữ"],
  },
  {
    id: "8",
    name: "Bùi Thị Thu",
    level: "regional",
    experience: 3,
    assignedMatches: 2,
    availability: "available",
    rating: 3.9,
    specialties: ["Nữ đôi"],
  },
];

const getLevelLabel = (level: Referee["level"]) => {
  const labels = {
    international: "Quốc tế",
    national: "Quốc gia",
    regional: "Khu vực",
  };
  return labels[level];
};

const getLevelColor = (level: Referee["level"]) => {
  const colors = {
    international: "bg-purple-100 text-purple-700",
    national: "bg-blue-100 text-blue-700",
    regional: "bg-green-100 text-green-700",
  };
  return colors[level];
};

const getAvailabilityColor = (availability: Referee["availability"]) => {
  const colors = {
    available: "bg-green-100 text-green-700",
    busy: "bg-orange-100 text-orange-700",
    unavailable: "bg-red-100 text-red-700",
  };
  return colors[availability];
};

const getAvailabilityLabel = (availability: Referee["availability"]) => {
  const labels = {
    available: "Sẵn sàng",
    busy: "Đang bận",
    unavailable: "Không khả dụng",
  };
  return labels[availability];
};

export default function RefereeList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockReferees.map((referee) => (
        <Card
          key={referee.id}
          className="p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${referee.name}`}
              />
              <AvatarFallback>{referee.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{referee.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getLevelColor(referee.level)}>
                      {getLevelLabel(referee.level)}
                    </Badge>
                    <Badge
                      className={getAvailabilityColor(referee.availability)}
                    >
                      {getAvailabilityLabel(referee.availability)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{referee.rating}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{referee.experience} năm kinh nghiệm</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{referee.assignedMatches} trận đã phân công</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {referee.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={referee.availability === "unavailable"}
                >
                  Phân công
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Xem lịch
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
