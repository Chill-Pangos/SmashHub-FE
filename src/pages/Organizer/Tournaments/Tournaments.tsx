import { useMemo, useState } from "react";
import { TournamentList, TournamentFilters } from "./components";
import {
  useTournaments,
  useUpcomingTournamentStatusChanges,
} from "@/hooks/queries";

export default function OrganizerTournaments() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  // Fetch tournaments from API
  const { data: apiTournaments = [], isLoading } = useTournaments(page, limit);

  // Get upcoming status changes
  const { data: upcomingChanges } = useUpcomingTournamentStatusChanges(24);

  // Apply local search and sort on top of API data
  const sample = apiTournaments;

  const filtered = useMemo(() => {
    let items = sample.slice();
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.categories?.some((cat) => cat.name.toLowerCase().includes(q)) ||
          false,
      );
    }

    if (sort === "start_asc")
      items.sort((a, b) => a.startDate.localeCompare(b.startDate));
    if (sort === "start_desc")
      items.sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (sort === "participants_desc") {
      items.sort((a, b) => {
        const aParticipants =
          a.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) ??
          0;
        const bParticipants =
          b.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) ??
          0;
        return bParticipants - aParticipants;
      });
    }

    return items;
  }, [sample, query, sort]);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const thisWeek = filtered.filter((t) => {
    const d = new Date(t.startDate);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const thisMonth = filtered.filter((t) => {
    const d = new Date(t.startDate);
    return d >= startOfMonth && d <= endOfMonth && !thisWeek.includes(t);
  });

  const others = filtered.filter(
    (t) => !thisWeek.includes(t) && !thisMonth.includes(t),
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Tournaments</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your tournaments here.
        </p>
        {/* Filters */}
        <div className="mt-4">
          <TournamentFilters
            onSearch={(q) => {
              setQuery(q);
              setPage(1); // Reset pagination on search
            }}
            onSort={(s) => setSort(s)}
          />
        </div>
        {isLoading && (
          <div className="mt-4 text-center text-muted-foreground">
            Loading tournaments...
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="grid gap-4">
          {upcomingChanges && upcomingChanges.success && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-lg font-medium">
                Upcoming Status Changes
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {upcomingChanges.data.openingSoon.length > 0 && (
                  <div className="rounded-lg bg-green-50 p-3">
                    <h3 className="text-sm font-medium text-green-900">
                      Opening Soon
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {upcomingChanges.data.openingSoon.map((t) => (
                        <li key={t.id} className="text-xs text-green-800">
                          <strong>{t.name}</strong>
                          <br />
                          {new Date(
                            t.registrationStartDate,
                          ).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {upcomingChanges.data.closingSoon.length > 0 && (
                  <div className="rounded-lg bg-orange-50 p-3">
                    <h3 className="text-sm font-medium text-orange-900">
                      Closing Soon
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {upcomingChanges.data.closingSoon.map((t) => (
                        <li key={t.id} className="text-xs text-orange-800">
                          <strong>{t.name}</strong>
                          <br />
                          {new Date(t.registrationEndDate).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {upcomingChanges.data.bracketsSoon.length > 0 && (
                  <div className="rounded-lg bg-blue-50 p-3">
                    <h3 className="text-sm font-medium text-blue-900">
                      Brackets Generating Soon
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {upcomingChanges.data.bracketsSoon.map((t) => (
                        <li key={t.id} className="text-xs text-blue-800">
                          <strong>{t.name}</strong>
                          <br />
                          {new Date(
                            t.bracketGenerationDate,
                          ).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-medium">This Week</h2>
            <div className="grid grid-cols-1 gap-3">
              <TournamentList items={thisWeek} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium">This Month</h2>
            <div className="grid grid-cols-1 gap-3">
              <TournamentList items={thisMonth} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium">All Tournaments</h2>
            <div className="grid grid-cols-1 gap-3">
              <TournamentList items={others} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
