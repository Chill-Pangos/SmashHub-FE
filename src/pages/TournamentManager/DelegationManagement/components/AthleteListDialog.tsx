import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar, Trophy } from "lucide-react";

interface Athlete {
  id: number;
  name: string;
  gender: "male" | "female";
  dob: string;
  category: string;
  events: string[];
}

const mockAthletes: Record<number, Athlete[]> = {
  1: [
    {
      id: 1,
      name: "Nguyễn Văn X",
      gender: "male",
      dob: "2005-03-15",
      category: "U20 Nam",
      events: ["Đơn nam", "Đôi nam"],
    },
    {
      id: 2,
      name: "Trần Thị Y",
      gender: "female",
      dob: "2006-07-22",
      category: "U18 Nữ",
      events: ["Đơn nữ", "Đôi nữ", "Đôi nam nữ"],
    },
    {
      id: 3,
      name: "Lê Văn Z",
      gender: "male",
      dob: "2004-11-08",
      category: "U20 Nam",
      events: ["Đơn nam"],
    },
  ],
  2: [
    {
      id: 4,
      name: "Phạm Văn A",
      gender: "male",
      dob: "2005-05-20",
      category: "U20 Nam",
      events: ["Đơn nam", "Đôi nam"],
    },
    {
      id: 5,
      name: "Hoàng Thị B",
      gender: "female",
      dob: "2007-02-14",
      category: "U18 Nữ",
      events: ["Đơn nữ"],
    },
  ],
};

interface AthleteListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delegationId: number | null;
  delegationName?: string;
}

export default function AthleteListDialog({
  open,
  onOpenChange,
  delegationId,
  delegationName,
}: AthleteListDialogProps) {
  const athletes = delegationId ? mockAthletes[delegationId] || [] : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderBadge = (gender: "male" | "female") => {
    return gender === "male" ? (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
        Nam
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-500/10 text-pink-700">
        Nữ
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Danh sách vận động viên - {delegationName}</DialogTitle>
          <DialogDescription>
            Tổng số: {athletes.length} vận động viên
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vận động viên</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Hạng thi đấu</TableHead>
                <TableHead>Môn đăng ký</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    Chưa có vận động viên nào
                  </TableCell>
                </TableRow>
              ) : (
                athletes.map((athlete) => (
                  <TableRow key={athlete.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback
                            className={
                              athlete.gender === "male"
                                ? "bg-blue-500"
                                : "bg-pink-500"
                            }
                          >
                            {getInitials(athlete.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{athlete.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {athlete.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getGenderBadge(athlete.gender)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {athlete.dob}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{athlete.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {athlete.events.map((event, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Trophy className="h-3 w-3 mr-1" />
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
