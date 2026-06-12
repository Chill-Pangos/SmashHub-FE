import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Tournament } from "@/types";
import { useDeleteTournament } from "@/hooks/queries/useTournamentQueries";

function formatDateRange(start?: string, end?: string) {
  if (!start) return "TBD";
  const s = new Date(start).toLocaleDateString();
  if (!end) return s;
  const e = new Date(end).toLocaleDateString();
  return `${s} — ${e}`;
}

function getThumbnailUrl(): string | null {
  // Could be extended to use tournament-specific images if available
  return null;
}

function getParticipants(tournament: Tournament): number {
  return (
    tournament.categories?.reduce(
      (sum, cat) => sum + (cat.maxEntries || 0),
      0,
    ) ?? 0
  );
}

function getShortDescription(tournament: Tournament): string {
  const categoryNames = tournament.categories?.map((c) => c.name).join(", ");
  if (categoryNames) return categoryNames;
  const categoryCount = tournament.categories?.length || 0;
  return categoryCount > 0
    ? `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`
    : "No categories";
}

export default function TournamentCard({
  tournament,
  className = "",
}: {
  tournament: Tournament;
  className?: string;
}) {
  const thumbnailUrl = getThumbnailUrl();
  const participants = getParticipants(tournament);
  const shortDescription = getShortDescription(tournament);
  const deleteTournament = useDeleteTournament();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteTournament.mutate(tournament.id);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/organizer/tournaments/${tournament.id}/edit`);
  };

  return (
    <>
      <Link
        to={`/organizer/tournaments/${tournament.id}`}
      className={`group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition ${className}`}
      aria-label={tournament.name}
    >
      <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {thumbnailUrl ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={thumbnailUrl}
            alt={`${tournament.name} thumbnail`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-8 w-8 opacity-80"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 7v10a2 2 0 0 0 2 2h14V7H3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 7a4 4 0 1 1 8 0"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-foreground">
          {tournament.name}
        </h3>
        {shortDescription ? (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {shortDescription}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDateRange(tournament.startDate, tournament.endDate)}
            </span>
          </div>

          {tournament.location ? (
            <div className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{tournament.location}</span>
            </div>
          ) : null}

          <div className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{participants} participants</span>
          </div>
        </div>
      </div>

      <div className="ml-4 flex-shrink-0 text-right">
        {tournament.status ? (
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {tournament.status}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center rounded-md bg-secondary/10 p-1.5 text-secondary hover:bg-secondary/20 transition-colors"
                title="Sửa"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center justify-center rounded-md bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <span
                className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                onClick={(e) => e.stopPropagation()}
              >
                View details
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center rounded-md bg-secondary/10 p-1.5 text-secondary hover:bg-secondary/20 transition-colors"
              title="Sửa"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center justify-center rounded-md bg-destructive/10 p-1.5 text-destructive hover:bg-secondary/20 transition-colors"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <span
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              View details
            </span>
          </div>
        )}
      </div>
    </Link>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giải đấu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giải đấu <strong>{tournament.name}</strong> không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDeleteConfirm(); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
