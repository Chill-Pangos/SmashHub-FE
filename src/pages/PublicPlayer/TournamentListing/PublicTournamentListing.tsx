import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { useTournaments } from "@/hooks/queries";
import type { Tournament } from "@/types";
import ServerPagination from "@/components/custom/ServerPagination";

function formatDateRange(start?: string, end?: string) {
  if (!start) return "TBD";
  const s = new Date(start).toLocaleDateString();
  if (!end) return s;
  const e = new Date(end).toLocaleDateString();
  return `${s} — ${e}`;
}

export default function PublicTournamentListing() {
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
    <div className="container mx-auto px-6 py-12 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Tournaments</h1>
          <p className="text-muted-foreground mt-1">
            Discover and join our exciting competitive events.
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
        <div className="text-center py-20 text-muted-foreground animate-pulse">Loading tournaments...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-muted-foreground text-lg">No tournaments found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((t: Tournament) => {
              const participants =
                t.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) ?? 0;
              return (
                <Link
                  key={t.id}
                  to={`/tournaments/${t.id}`}
                  className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
                >
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {t.status}
                      </span>
                      {t.tier && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tier {t.tier}
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{formatDateRange(t.startDate, t.endDate)}</span>
                      </div>
                      {t.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary/70" />
                          <span>{t.location}</span>
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
