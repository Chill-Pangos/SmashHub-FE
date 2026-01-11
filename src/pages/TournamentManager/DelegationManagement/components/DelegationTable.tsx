import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Users, Eye, Trophy } from "lucide-react";

interface Delegation {
  id: number;
  name: string;
  code: string;
  leader: string;
  leaderPhone: string;
  athleteCount: number;
  registeredEvents: number;
  status: "active" | "pending" | "inactive";
}

const mockDelegations: Delegation[] = [
  {
    id: 1,
    name: "Đoàn Hà Nội",
    code: "HN",
    leader: "Nguyễn Văn A",
    leaderPhone: "0912345678",
    athleteCount: 45,
    registeredEvents: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Đoàn Thành phố Hồ Chí Minh",
    code: "TPHCM",
    leader: "Trần Thị B",
    leaderPhone: "0923456789",
    athleteCount: 52,
    registeredEvents: 15,
    status: "active",
  },
  {
    id: 3,
    name: "Đoàn Đà Nẵng",
    code: "DN",
    leader: "Lê Văn C",
    leaderPhone: "0934567890",
    athleteCount: 28,
    registeredEvents: 8,
    status: "active",
  },
  {
    id: 4,
    name: "Đoàn Hải Phòng",
    code: "HP",
    leader: "Phạm Thị D",
    leaderPhone: "0945678901",
    athleteCount: 35,
    registeredEvents: 10,
    status: "pending",
  },
  {
    id: 5,
    name: "Đoàn Cần Thơ",
    code: "CT",
    leader: "Hoàng Văn E",
    leaderPhone: "0956789012",
    athleteCount: 22,
    registeredEvents: 6,
    status: "active",
  },
];

const getStatusBadge = (status: Delegation["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Đã duyệt</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không hoạt động</Badge>;
  }
};

interface DelegationTableProps {
  searchQuery: string;
  onEdit: (delegation: Delegation) => void;
  onViewAthletes: (delegationId: number) => void;
}

export default function DelegationTable({
  searchQuery,
  onEdit,
  onViewAthletes,
}: DelegationTableProps) {
  const filteredDelegations = mockDelegations.filter(
    (delegation) =>
      delegation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Đoàn</TableHead>
            <TableHead>Trưởng đoàn</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead className="text-center">Vận động viên</TableHead>
            <TableHead className="text-center">Môn thi đấu</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDelegations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Không tìm thấy đoàn nào
              </TableCell>
            </TableRow>
          ) : (
            filteredDelegations.map((delegation) => (
              <TableRow key={delegation.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white font-bold">
                        {delegation.code}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{delegation.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Mã: {delegation.code}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{delegation.leader}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {delegation.leaderPhone}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {delegation.athleteCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {delegation.registeredEvents}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(delegation.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewAthletes(delegation.id)}
                      title="Xem vận động viên"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(delegation)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { Delegation };
