import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  courts: number;
  address: string;
  capacity: number;
  facilities: string[];
  availability: "available" | "limited" | "full";
  assignedMatches: number;
}

const mockVenues: Venue[] = [
  {
    id: "1",
    name: "Cung thể thao Quần Vợt",
    courts: 8,
    address: "Số 291 Láng Hạ, Đống Đa, Hà Nội",
    capacity: 2000,
    facilities: ["Điều hòa", "Ánh sáng LED", "Ghế VIP", "Bãi đỗ xe"],
    availability: "limited",
    assignedMatches: 18,
  },
  {
    id: "2",
    name: "Nhà thi đấu Trịnh Hoài Đức",
    courts: 6,
    address: "85 Trịnh Hoài Đức, Đống Đa, Hà Nội",
    capacity: 1500,
    facilities: ["Điều hòa", "Phòng thay đồ", "Bãi đỗ xe"],
    availability: "available",
    assignedMatches: 8,
  },
  {
    id: "3",
    name: "Trung tâm thể thao Mỹ Đình",
    courts: 12,
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    capacity: 3000,
    facilities: [
      "Điều hòa",
      "Ánh sáng LED",
      "Ghế VIP",
      "Phòng thay đồ",
      "Y tế",
      "Bãi đỗ xe",
    ],
    availability: "available",
    assignedMatches: 12,
  },
  {
    id: "4",
    name: "Nhà thi đấu Cầu Giấy",
    courts: 4,
    address: "Nguyễn Phong Sắc, Cầu Giấy, Hà Nội",
    capacity: 800,
    facilities: ["Điều hòa", "Phòng thay đồ"],
    availability: "full",
    assignedMatches: 24,
  },
];

const getAvailabilityColor = (availability: Venue["availability"]) => {
  const colors = {
    available: "bg-green-100 text-green-700",
    limited: "bg-orange-100 text-orange-700",
    full: "bg-red-100 text-red-700",
  };
  return colors[availability];
};

const getAvailabilityLabel = (availability: Venue["availability"]) => {
  const labels = {
    available: "Còn trống",
    limited: "Sắp đầy",
    full: "Đã đầy",
  };
  return labels[availability];
};

export default function VenueSelector() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Chọn địa điểm thi đấu</h2>

      <div className="space-y-4">
        {mockVenues.map((venue) => (
          <label
            key={venue.id}
            className="block p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-all"
          >
            <input type="radio" name="venue" className="sr-only" />
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{venue.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.address}</span>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(venue.availability)}>
                  {getAvailabilityLabel(venue.availability)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Số sân</p>
                  <p className="font-semibold">{venue.courts} sân</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sức chứa</p>
                  <p className="font-semibold">
                    {venue.capacity.toLocaleString()} người
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Đã xếp</p>
                  <p className="font-semibold">{venue.assignedMatches} trận</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Tiện ích:</p>
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.map((facility) => (
                    <Badge key={facility} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <Users className="h-4 w-4" />
          <span>Thống kê sử dụng địa điểm</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tổng số sân</p>
            <p className="text-xl font-bold">30 sân</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tổng trận đã xếp</p>
            <p className="text-xl font-bold">62 trận</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
