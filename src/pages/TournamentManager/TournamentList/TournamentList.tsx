import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
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
import { useSearchTournaments, useDeleteTournament } from "@/hooks";
import { showToast } from "@/utils/toast.utils";
import type { Tournament, TournamentSearchFilters, Gender } from "@/types";
import TournamentUpdateForm from "../TournamentUpdate/TournamentUpdateForm";
import TournamentDetail from "../TournamentDetail/TournamentDetail";

export default function TournamentList() {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<number | null>(
    null,
  );
  const [viewingTournamentId, setViewingTournamentId] = useState<number | null>(
    null,
  );

  const [filters, setFilters] = useState<TournamentSearchFilters>({
    skip: 0,
    limit: 10,
  });

  // React Query hooks
  const {
    data: searchResult,
    isLoading,
    refetch,
  } = useSearchTournaments(filters);

  const deleteMutation = useDeleteTournament();

  // Extract data from query result
  const tournaments = searchResult?.tournaments ?? [];
  const total = searchResult?.total ?? 0;

  const handleSearch = () => {
    setFilters({ ...filters, skip: 0 }); // Reset to first page
  };

  const handleResetFilters = () => {
    setFilters({ skip: 0, limit: 10 });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("message.confirmDelete"))) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast.success(t("message.deleteSuccess"));
      },
      onError: (error) => {
        console.error("Error deleting tournament:", error);
        showToast.error(
          t("message.operationFailed"),
          error instanceof Error ? error.message : t("message.pleaseTryAgain"),
        );
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: Tournament["status"]) => {
    switch (status) {
      case "ongoing":
        return (
          <Badge className="bg-green-500">{t("tournament.ongoing")}</Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-500">{t("tournament.upcoming")}</Badge>
        );
      case "completed":
        return <Badge variant="secondary">{t("tournament.completed")}</Badge>;
    }
  };

  const currentPage =
    Math.floor((filters.skip || 0) / (filters.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 10));

  // Show detail view if viewing
  if (viewingTournamentId !== null) {
    return (
      <TournamentDetail
        tournamentId={viewingTournamentId}
        onBack={() => setViewingTournamentId(null)}
        onEdit={(id) => {
          setViewingTournamentId(null);
          setEditingTournamentId(id);
        }}
        onDelete={() => {
          setViewingTournamentId(null);
          // React Query sẽ tự động refetch sau khi invalidate
        }}
      />
    );
  }

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
          {t("common.back")}
        </Button>
        <TournamentUpdateForm
          tournamentId={editingTournamentId}
          onSuccess={(tournament) => {
            showToast.success(`Đã cập nhật giải "${tournament.name}"`);
            setEditingTournamentId(null);
            // React Query sẽ tự động refetch sau khi invalidate
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
          <h1 className="text-3xl font-bold">
            {t("tournament.tournamentList")}
          </h1>
          <p className="text-muted-foreground">
            {t("tournament.tournaments")} ({total})
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {t("common.refresh")}
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t("common.filter")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? t("common.close") : t("common.details")}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Filters - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("admin.users")} ID</Label>
              <Input
                type="number"
                placeholder={t("common.filter")}
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
              <Label>{t("tournament.organizer")} ID</Label>
              <Input
                type="number"
                placeholder={t("common.filter")}
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
              <Label>{t("athlete.gender")}</Label>
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
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("athlete.male")}</SelectItem>
                  <SelectItem value="female">{t("athlete.female")}</SelectItem>
                  <SelectItem value="mixed">{t("common.all")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>
                  {t("validation.minValue", { min: t("athlete.dateOfBirth") })}
                </Label>
                <Input
                  type="number"
                  placeholder="18"
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
                <Label>
                  {t("validation.maxValue", { max: t("athlete.dateOfBirth") })}
                </Label>
                <Input
                  type="number"
                  placeholder="35"
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
                <Label>ELO {t("validation.minValue", { min: "" })}</Label>
                <Input
                  type="number"
                  placeholder="1200"
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
                <Label>ELO {t("validation.maxValue", { max: "" })}</Label>
                <Input
                  type="number"
                  placeholder="2000"
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
                <Label>{t("schedule.groupStage")}</Label>
                <Select
                  value={
                    filters.isGroupStage === undefined
                      ? "all"
                      : filters.isGroupStage.toString()
                  }
                  onValueChange={(value) => {
                    const newFilters = { ...filters };
                    if (value === "all") {
                      delete newFilters.isGroupStage;
                    } else {
                      newFilters.isGroupStage = value === "true";
                    }
                    setFilters(newFilters);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("common.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="true">{t("common.yes")}</SelectItem>
                    <SelectItem value="false">{t("common.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="mr-2 h-4 w-4" />
              {t("common.search")}
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              {t("common.clear")}
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
            {t("tournament.noTournamentFound")}
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
                          {tournament.contents.length}{" "}
                          {t("tournament.contents")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    ID: {tournament.id} | {t("tournament.organizer")}:{" "}
                    {tournament.createdBy}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingTournamentId(tournament.id)}
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
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
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
              {currentPage} / {totalPages} ({t("spectator.total")}: {total})
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
                {t("common.previous")}
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
                {t("common.next")}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
