import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { useTournaments } from "@/hooks/queries";
import type { Tournament } from "@/types";
import ServerPagination from "@/components/custom/ServerPagination";
import { useTranslation } from "react-i18next";

function formatDateRange(start?: string, end?: string) {
  if (!start) return "TBD";
  const s = new Date(start).toLocaleDateString();
  if (!end) return s;
  const e = new Date(end).toLocaleDateString();
  return `${s} — ${e}`;
}

export default function TournamentListing() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useTournaments(page, limit);
  const apiTournaments = data?.tournaments || [];
  const pagination = data?.pagination;

  const filtered = useMemo(() => {
    let items = apiTournaments.slice();
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
      );
    }
    // Default sort by start date descending
    items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    return items;
  }, [apiTournaments, query]);

  return (
    <div className="px-6 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("publicPlayer.tournaments.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("publicPlayer.tournaments.subtitle")}
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
        <div className="text-center py-10 text-muted-foreground">{t("publicPlayer.tournaments.loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">{t("publicPlayer.tournaments.notFound")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((t: Tournament) => {
              const participants =
                t.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) ?? 0;
              return (
                <Link
                  key={t.id}
                  to={`/tournaments/${t.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {t.status}
                      </span>
                      {t.tier && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tier {t.tier}
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateRange(t.startDate, t.endDate)}</span>
                      </div>
                      {t.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{t.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>{participants} capacity</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {pagination && (
            <div className="mt-8">
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
