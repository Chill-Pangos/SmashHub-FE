import { TournamentCard } from "./TournamentCard";
import type { Tournament } from "@/types";
import { useTranslation } from "react-i18next";

export default function TournamentList({
  items,
  className = "",
}: {
  items: Tournament[];
  className?: string;
}) {
  const { t } = useTranslation();
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">{t('tournament.noTournamentFound', 'No tournaments found.')}</p>
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
