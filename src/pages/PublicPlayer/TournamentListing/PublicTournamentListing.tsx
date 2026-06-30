import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { useTournaments, useScheduleConfigsByTournaments } from "@/hooks/queries";
import { useDateFormat } from "@/hooks/useDateFormat";
import type { Tournament } from "@/types";
import ServerPagination from "@/components/custom/ServerPagination";
import { useTranslation } from "react-i18next";

export default function PublicTournamentListing() {
  const { formatDateTime } = useDateFormat();
  
  function formatDateRange(start?: string, end?: string) {
    if (!start) return "TBD";
    const s = formatDateTime(start);
    if (!end) return s;
    const e = formatDateTime(end);
    return `${s} — ${e}`;
  }
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useTournaments(page, limit);
  const apiTournaments = data?.tournaments || [];
  const pagination = data?.pagination;

  const scheduleConfigQueries = useScheduleConfigsByTournaments(
    apiTournaments.map((t) => t.id)
  );

  const scheduleConfigsDep = JSON.stringify(
    scheduleConfigQueries.map((q) => q.data)
  );

  const filtered = useMemo(() => {
    const configs = JSON.parse(scheduleConfigsDep);
    let items = apiTournaments.map((t, index) => ({
      ...t,
      startDate: configs[index]?.startDate || t.startDate,
      endDate: configs[index]?.endDate || t.endDate,
    }));
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
      );
    }
    // Default sort by start date descending
    items.sort((a, b) => new Date(b.startDate || "").getTime() - new Date(a.startDate || "").getTime());
    return items;
  }, [apiTournaments, scheduleConfigsDep, query]);

  return (
    <div className="container mx-auto px-6 py-12 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("publicPlayer.tournaments.upcoming")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("publicPlayer.tournaments.discover")}
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">{t("publicPlayer.tournaments.loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-muted-foreground text-lg">{t("publicPlayer.tournaments.notFound")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((tournament: Tournament) => {
              const participants =
                tournament.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) ?? 0;
              return (
                <Link
                  key={tournament.id}
                  to={`/tournaments/${tournament.id}`}
                  className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
                >
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {t(`constants.status.tournament.${tournament.status}`, tournament.status) as string}
                      </span>
                      {tournament.tier && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tier {tournament.tier}
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {tournament.name}
                    </h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
                      </div>
                      {tournament.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary/70" />
                          <span>{tournament.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary/70" />
                        <span>{participants} capacity</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {pagination && (
            <div className="mt-10 flex justify-center">
              <ServerPagination
                skip={(page - 1) * limit}
                limit={limit}
                total={pagination.total}
                hasNext={pagination.hasNextPage}
                hasPrevious={pagination.hasPrevPage}
                isLoading={isLoading}
                onSkipChange={(nextSkip) => setPage(Math.floor(nextSkip / limit) + 1)}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
