import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { tournamentService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type { Tournament, TournamentSearchFilters, Gender } from "@/types";
import TournamentUpdateForm from "../TournamentUpdate/TournamentUpdateForm";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<
    number | null
  >(null);

  const [filters, setFilters] = useState<TournamentSearchFilters>({
    skip: 0,
    limit: 10,
  });

  const fetchTournaments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await tournamentService.searchTournaments(filters);
      setTournaments(response.tournaments);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      showToast.error("Không thể tải danh sách giải đấu");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleSearch = () => {
    setFilters({ ...filters, skip: 0 }); // Reset to first page
    fetchTournaments();
  };

  const handleResetFilters = () => {
    setFilters({ skip: 0, limit: 10 });
    fetchTournaments();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giải đấu này?")) {
      return;
    }

    try {
      await tournamentService.deleteTournament(id);
      showToast.success("Đã xóa giải đấu");
      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      showToast.error(
        "Không thể xóa giải đấu",
        error instanceof Error ? error.message : "Vui lòng thử lại"
      );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: Tournament["status"]) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500">Đang diễn ra</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Sắp diễn ra</Badge>;
      case "completed":
        return <Badge variant="secondary">Đã kết thúc</Badge>;
    }
  };

  const currentPage =
    Math.floor((filters.skip || 0) / (filters.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 10));

  // Show edit form if editing
  if (editingTournamentId !== null) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setEditingTournamentId(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
        <TournamentUpdateForm
          tournamentId={editingTournamentId}
          onSuccess={(tournament) => {
            showToast.success(`Đã cập nhật giải "${tournament.name}"`);
            setEditingTournamentId(null);
            fetchTournaments();
          }}
          onCancel={() => setEditingTournamentId(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Danh sách giải đấu</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả các giải đấu ({total} giải)
          </p>
        </div>
        <Button onClick={handleResetFilters}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc tìm kiếm
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc nâng cao"}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Filters - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                type="number"
                placeholder="Lọc theo user ID"
                value={filters.userId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    userId: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Người tạo (Created By ID)</Label>
              <Input
                type="number"
                placeholder="Lọc theo người tạo"
                value={filters.createdBy || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    createdBy: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Giới tính</Label>
              <Select
                value={filters.gender || "mixed"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    gender: value === "mixed" ? undefined : (value as Gender),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="mixed">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Tuổi tối thiểu</Label>
                <Input
                  type="number"
                  placeholder="VD: 18"
                  value={filters.minAge || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minAge: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Tuổi tối đa</Label>
                <Input
                  type="number"
                  placeholder="VD: 35"
                  value={filters.maxAge || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxAge: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>ELO tối thiểu</Label>
                <Input
                  type="number"
                  placeholder="VD: 1200"
                  value={filters.minElo || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minElo: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>ELO tối đa</Label>
                <Input
                  type="number"
                  placeholder="VD: 2000"
                  value={filters.maxElo || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxElo: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Vòng bảng</Label>
                <Select
                  value={
                    filters.isGroupStage === undefined
                      ? "all"
                      : filters.isGroupStage.toString()
                  }
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      isGroupStage: value === "all" ? undefined : value === "true",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Tournament List */}
      {isLoading ? (
        <Card className="p-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Card>
      ) : tournaments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            Không tìm thấy giải đấu nào
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{tournament.name}</h3>
                    {getStatusBadge(tournament.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(tournament.startDate)}
                        {tournament.endDate &&
                          ` - ${formatDate(tournament.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{tournament.location}</span>
                    </div>
                    {tournament.contents && tournament.contents.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {tournament.contents.length} nội dung thi đấu
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    ID: {tournament.id} | Người tạo: {tournament.createdBy}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      console.log("View tournament:", tournament.id)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTournamentId(tournament.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tournament.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} (Tổng: {total} giải)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setFilters({
                    ...filters,
                    skip: (currentPage - 2) * (filters.limit || 10),
                  })
                }
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setFilters({
                    ...filters,
                    skip: currentPage * (filters.limit || 10),
                  })
                }
              >
                Trang sau
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
