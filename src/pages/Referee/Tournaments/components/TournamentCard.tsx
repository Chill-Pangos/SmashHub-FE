import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Tournament } from "@/types";

function formatDateRange(start?: string, end?: string) {
  if (!start) return "TBD";
  const s = new Date(start).toLocaleDateString();
  if (!end) return s;
  const e = new Date(end).toLocaleDateString();
  return `${s} — ${e}`;
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
  const participants = getParticipants(tournament);
  const shortDescription = getShortDescription(tournament);
  return (
    <Link
      to={`/referee/tournaments/${tournament.id}`}
      className={`group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition ${className}`}
      aria-label={tournament.name}
    >
      <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
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
            <span>
              <Link
                to={`/referee/tournaments/${tournament.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                onClick={(e) => e.stopPropagation()}
              >
                View details
              </Link>
            </span>
          </div>
        ) : (
          <Link
            to={`/referee/tournaments/${tournament.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            View details
          </Link>
        )}
      </div>
    </Link>
  );
}
