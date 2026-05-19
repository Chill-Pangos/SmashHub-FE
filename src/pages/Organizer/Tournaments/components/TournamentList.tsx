import TournamentCard from "./TournamentCard";
import type { Tournament } from "./TournamentCard";

export default function TournamentList({
  items,
  className = "",
}: {
  items: Tournament[];
  className?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">No tournaments found.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {items.map((t) => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </div>
  );
}
