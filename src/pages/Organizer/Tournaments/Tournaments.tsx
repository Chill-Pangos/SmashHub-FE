import { useMemo, useState } from "react";
import { TournamentList, TournamentFilters } from "./components";
import type { Tournament } from "./components";

const SAMPLE: Tournament[] = [
  {
    id: "1",
    title: "Global Elite Series: Berlin",
    startDate: "2026-05-12",
    endDate: "2026-05-24",
    location: "Mercedes-Benz Arena",
    participants: 128,
    shortDescription: "Top-tier invitational featuring international players.",
    thumbnailUrl: null,
    status: "Ongoing",
  },
  {
    id: "2",
    title: "Pro-Circuit Qualifiers",
    startDate: "2026-06-05",
    endDate: "2026-06-10",
    location: "Virtual Arena A",
    participants: 64,
    shortDescription: "Regional qualifiers for the pro-circuit.",
    thumbnailUrl: null,
    status: "Upcoming",
  },
  {
    id: "3",
    title: "Summer Smash Finals",
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    location: "Downtown Convention Center",
    participants: 32,
    shortDescription: "Season finals with winners from regional events.",
    thumbnailUrl: null,
    status: "Completed",
  },
];

export default function OrganizerTournaments() {
  const sample = SAMPLE;
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    let items = sample.slice();
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.shortDescription || "").toLowerCase().includes(q),
      );
    }

    if (sort === "start_asc")
      items.sort((a, b) => a.startDate.localeCompare(b.startDate));
    if (sort === "start_desc")
      items.sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (sort === "participants_desc")
      items.sort((a, b) => (b.participants ?? 0) - (a.participants ?? 0));

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
            onSearch={(q) => setQuery(q)}
            onSort={(s) => setSort(s)}
          />
        </div>
      </div>

      <div className="grid gap-4">
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
    </div>
  );
}
