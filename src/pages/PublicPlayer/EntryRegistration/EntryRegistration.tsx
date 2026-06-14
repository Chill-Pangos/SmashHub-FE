import { useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTournamentCategoriesByTournament } from "@/hooks/queries/useTournamentCategoryQueries";
import { useRegisterEntry } from "@/hooks/queries/useEntryQueries";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function EntryRegistration() {
  const { t } = useTranslation();
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  const { data: categoriesResp, isLoading: categoriesLoading } =
    useTournamentCategoriesByTournament(Number(tournamentId), 1, 50);
  const categories = categoriesResp || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [action, setAction] = useState<"create_team" | "join_team">(
    "create_team"
  );
  const [teamName, setTeamName] = useState("");
  const [targetEntryId, setTargetEntryId] = useState("");

  const selectedCategory = categories.find(
    (c: any) => c.id === selectedCategoryId
  );
  const isTeam =
    selectedCategory?.type === "double" || selectedCategory?.type === "team";

  const { mutate: registerEntry, isPending } = useRegisterEntry();

  const handleRegister = () => {
    if (!selectedCategoryId) return;
    registerEntry(
      {
        categoryId: selectedCategoryId,
        action: action,
        name: isTeam && action === "create_team" ? teamName : undefined,
        targetEntryId:
          isTeam && action === "join_team" ? Number(targetEntryId) : undefined,
      },
      {
        onSuccess: () => {
          navigate(`/tournaments/${tournamentId}`, {
            state: { activeTab: t("publicPlayer.tournamentDetail.registrationTab.title", "Registration") }
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-4 py-8">
      <div className="flex items-center gap-2 mb-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" />
        <Link to={`/tournaments/${tournamentId}`}>{t("publicPlayer.entryRegistration.backToTournament", "Back to Tournament")}</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("publicPlayer.entryRegistration.title", "Entry Registration")}
            </h1>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-sm mb-4">{t("publicPlayer.entryRegistration.selectCategory", "1. Select Category")}</h3>
            {categoriesLoading ? (
              <p>{t("publicPlayer.tournaments.loading", "Loading...")}</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categories.map((c: any) => (
                  <div
                    key={c.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedCategoryId === c.id
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedCategoryId(c.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {c.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedCategoryId && isTeam && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-sm mb-4">
                {t("publicPlayer.entryRegistration.teamInfo", "2. Team Information")}
              </h3>
              <div className="flex gap-4 mb-4">
                <Button
                  variant={action === "create_team" ? "default" : "outline"}
                  onClick={() => setAction("create_team")}
                >
                  {t("publicPlayer.entryRegistration.createNew", "Create New Team")}
                </Button>
                <Button
                  variant={action === "join_team" ? "default" : "outline"}
                  onClick={() => setAction("join_team")}
                >
                  {t("publicPlayer.entryRegistration.joinExisting", "Join Existing Team")}
                </Button>
              </div>

              {action === "create_team" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("publicPlayer.entryRegistration.teamName", "Team Name")}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md bg-secondary/50"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("publicPlayer.entryRegistration.entryId", "Entry ID")}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-md bg-secondary/50"
                    placeholder="Enter Entry ID to join"
                    value={targetEntryId}
                    onChange={(e) => setTargetEntryId(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6">
              {t("publicPlayer.entryRegistration.summary", "Registration Summary")}
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="w-12 h-12 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Trophy className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-cyan-400">
                    {t("publicPlayer.entryRegistration.category", "Category")}
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedCategory?.name || "Not selected"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full"
                  disabled={!selectedCategoryId || isPending}
                  onClick={handleRegister}
                >
                  {isPending ? t("publicPlayer.tournaments.loading", "Loading...") : t("publicPlayer.tournamentDetail.registrationTab.registerNow", "Confirm Registration")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
