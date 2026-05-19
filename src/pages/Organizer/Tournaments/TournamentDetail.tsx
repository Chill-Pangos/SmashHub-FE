import { useParams } from "react-router-dom";
import { useTournament } from "@/hooks/queries";

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  const { data: tournament, isLoading, error } = useTournament(id);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">Loading tournament details...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-destructive">
          {error?.message || "Failed to load tournament"}
        </p>
      </div>
    );
  }

  // Format data for display
  const sample = {
    id: tournament.id,
    title: tournament.name,
    status: tournament.status,
    description:
      tournament.categories?.map((c) => c.name).join(", ") ||
      "No categories defined",
    prizes: "-",
    formats:
      tournament.categories
        ?.map((c) => c.type)
        .join(", ")
        .toUpperCase() || "-",
    participants: tournament.categories?.reduce(
      (sum, cat) => sum + (cat.maxEntries || 0),
      0,
    ),
    location: tournament.location,
    tier: tournament.tier || "-",
    timeline: [
      {
        label: "Registration",
        date: tournament.registrationStartDate
          ? `${new Date(tournament.registrationStartDate).toLocaleDateString()} to ${
              tournament.registrationEndDate
                ? new Date(tournament.registrationEndDate).toLocaleDateString()
                : "TBD"
            }`
          : "TBD",
      },
      {
        label: "Tournament",
        date: `${new Date(tournament.startDate).toLocaleDateString()} to ${new Date(tournament.endDate).toLocaleDateString()}`,
      },
      ...(tournament.bracketGenerationDate
        ? [
            {
              label: "Bracket Generation",
              date: new Date(
                tournament.bracketGenerationDate,
              ).toLocaleDateString(),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{sample.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>Status: {sample.status}</span>
              {sample.tier && sample.tier !== "-" && (
                <span>Tier: {sample.tier}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-lg font-medium">Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {sample.description}
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Prizes</div>
                <div className="mt-1 font-medium">{sample.prizes}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Formats</div>
                <div className="mt-1 font-medium">{sample.formats}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">
                  Participants
                </div>
                <div className="mt-1 font-medium">{sample.participants}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-lg font-medium">Timeline</h3>
            <ul className="mt-3 space-y-2">
              {sample.timeline.map((t) => (
                <li key={t.label} className="flex items-center justify-between">
                  <div className="text-sm">{t.label}</div>
                  <div className="text-sm text-muted-foreground">{t.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-medium">Location</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {sample.location}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-medium">Categories</h4>
            <div className="mt-2 space-y-2">
              {tournament.categories && tournament.categories.length > 0 ? (
                tournament.categories.map((cat) => (
                  <div key={cat.id} className="text-xs">
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-muted-foreground">
                      {cat.maxEntries} max entries • {cat.maxSets} sets
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No categories defined
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h4 className="text-sm font-medium">Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <button className="rounded-md border px-3 py-2 text-sm">
                Edit Tournament
              </button>
              <button className="rounded-md bg-destructive px-3 py-2 text-sm text-white">
                Cancel Tournament
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
