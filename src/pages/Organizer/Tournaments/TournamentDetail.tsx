import { useParams } from "react-router-dom";

export default function TournamentDetail() {
  const { tournamentId } = useParams();

  // Placeholder content — replace with real data fetch
  const sample = {
    id: tournamentId || "-",
    title: "Sample Tournament",
    status: "Ongoing",
    description:
      "This is a sample tournament overview. Replace with API-driven content.",
    prizes: "$5,000 total",
    formats: ["Singles", "Doubles"],
    participants: 128,
    location: "Convention Center, Main Hall",
    timeline: [
      { label: "Registration", date: "2026-04-01 to 2026-05-01" },
      { label: "Group Stage", date: "2026-05-12 to 2026-05-18" },
      { label: "Knockout", date: "2026-05-19 to 2026-05-24" },
    ],
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{sample.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Status: {sample.status}
            </p>
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
                <div className="mt-1 font-medium">
                  {sample.formats.join(", ")}
                </div>
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
