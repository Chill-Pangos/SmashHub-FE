import { useMemo, useState } from "react";
import { TournamentList, TournamentFilters } from "./components";
import {
  useTournaments,
  useUpcomingTournamentStatusChanges,
  useScheduleConfigsByTournaments,
} from "@/hooks/queries";
import ServerPagination from "@/components/custom/ServerPagination";
import { useTranslation } from "react-i18next";

export default function OrganizerTournaments() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch tournaments from API
  const { data, isLoading } = useTournaments(page, limit);
  const apiTournaments = data?.tournaments || [];
  const pagination = data?.pagination;

  // Get upcoming status changes
  const { data: upcomingChanges } = useUpcomingTournamentStatusChanges(24);

  // Fetch schedule configs for these tournaments
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
          s.location.toLowerCase().includes(q) ||
          s.categories?.some((cat) => cat.name.toLowerCase().includes(q)) ||
          false,
      );
    }

    if (sort === "start_asc")
      items.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
    if (sort === "start_desc")
      items.sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
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
  }, [apiTournaments, scheduleConfigsDep, query, sort]);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const thisWeek = filtered.filter((t) => {
    if (!t.startDate) return false;
    const d = new Date(t.startDate);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const thisMonth = filtered.filter((t) => {
    if (!t.startDate) return false;
    const d = new Date(t.startDate);
    return d >= startOfMonth && d <= endOfMonth && !thisWeek.includes(t);
  });

  const upcoming = filtered.filter((t) => {
    if (!t.startDate) return false;
    const d = new Date(t.startDate);
    return d > endOfMonth;
  });

  const others = filtered.filter(
    (t) => !thisWeek.includes(t) && !thisMonth.includes(t) && !upcoming.includes(t),
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">{t('tournamentManager.tournamentsList.title', 'Tournaments')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('tournamentManager.tournamentsList.subtitle', 'Manage your tournaments here.')}
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
            {t('tournamentManager.tournamentsList.loading', 'Loading tournaments...')}
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="grid gap-4">
          {upcomingChanges && upcomingChanges.success && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-lg font-medium">
                {t('tournamentManager.tournamentsList.upcomingChanges', 'Upcoming Status Changes')}
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {upcomingChanges.data.openingSoon.length > 0 && (
                  <div className="rounded-lg bg-green-50 p-3">
                    <h3 className="text-sm font-medium text-green-900">
                      {t('tournamentManager.tournamentsList.openingSoon', 'Opening Soon')}
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
                      {t('tournamentManager.tournamentsList.closingSoon', 'Closing Soon')}
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
                      {t('tournamentManager.tournamentsList.bracketsGeneratingSoon', 'Brackets Generating Soon')}
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

          {thisWeek.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-medium">{t('tournamentManager.tournamentsList.thisWeek', 'This Week')}</h2>
              <div className="grid grid-cols-1 gap-3">
                <TournamentList items={thisWeek} />
              </div>
            </section>
          )}

          {thisMonth.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-medium">{t('tournamentManager.tournamentsList.thisMonth', 'This Month')}</h2>
              <div className="grid grid-cols-1 gap-3">
                <TournamentList items={thisMonth} />
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-medium">{t('tournamentManager.tournamentsList.upcoming', 'Upcoming')}</h2>
              <div className="grid grid-cols-1 gap-3">
                <TournamentList items={upcoming} />
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-medium">{t('tournamentManager.tournamentsList.allTournaments', 'Other Tournaments')}</h2>
              <div className="grid grid-cols-1 gap-3">
                <TournamentList items={others} />
              </div>
            </section>
          )}

          {pagination && (
            <div className="mt-6">
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
        </div>
      )}
    </div>
  );
}
