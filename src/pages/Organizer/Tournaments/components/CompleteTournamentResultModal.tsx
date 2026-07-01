import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompleteTournamentResponse } from "@/types/tournament.types";
import { Trophy, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CompleteTournamentResponse["data"] | null;
}

export function CompleteTournamentResultModal({ open, onOpenChange, result }: Props) {
  const { t } = useTranslation();

  if (!result) return null;

  const { awards, elo } = result;

  const getAwardTitle = (title: string) => {
    switch (title) {
      case "champion": return t("tournamentManager.detail.completeTournamentResult.champion", "Champion");
      case "runner_up": return t("tournamentManager.detail.completeTournamentResult.runner_up", "Runner-up");
      case "third_place": return t("tournamentManager.detail.completeTournamentResult.third_place", "Third Place");
      case "group_winner": return t("tournamentManager.detail.completeTournamentResult.group_winner", "Group Winner");
      default: return title;
    }
  };

  const getSource = (source: string) => {
    return source === "knockout" 
      ? t("tournamentManager.detail.completeTournamentResult.knockout", "Knockout")
      : t("tournamentManager.detail.completeTournamentResult.group", "Group Stage");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            {t("tournamentManager.detail.completeTournamentResult.title", "Tournament Completed")}
          </DialogTitle>
          <DialogDescription>
            {t("tournamentManager.detail.completeTournamentResult.description", "The tournament has been marked as completed. Awards have been distributed and Elo ratings updated.")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="awards" className="flex-1 overflow-hidden flex flex-col mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="awards">{t("tournamentManager.detail.completeTournamentResult.awards", "Awards")}</TabsTrigger>
            <TabsTrigger value="elo">{t("tournamentManager.detail.completeTournamentResult.eloChanges", "Elo Changes")}</TabsTrigger>
          </TabsList>

          <TabsContent value="awards" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-6">
                {awards.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No awards found.</p>
                ) : (
                  awards.map((award, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/40 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg text-primary">{award.categoryName}</span>
                          <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                            {getSource(award.source)}
                            {award.groupName ? ` - Group ${award.groupName}` : ""}
                          </span>
                        </div>
                        <h4 className="font-bold text-xl mb-1">{award.entry.name}</h4>
                        {award.entry.members.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {award.entry.members.map(m => `${m.user.firstName} ${m.user.lastName}`).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                        <span className="text-2xl font-black text-yellow-600 dark:text-yellow-500">
                          {getAwardTitle(award.title)}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                          Placement: #{award.placement}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="elo" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[400px] border rounded-md">
              <div className="p-4">
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Matches</div>
                    <div className="font-semibold text-xl">{elo.totalMatches}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tier Multiplier</div>
                    <div className="font-semibold text-xl">{elo.tierMultiplier}x</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Records Created</div>
                    <div className="font-semibold text-xl">{elo.historyRecordsCreated}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Players Updated</div>
                    <div className="font-semibold text-xl">{elo.changes.length}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3">{t("tournamentManager.detail.completeTournamentResult.player", "Player")} (ID)</th>
                        <th className="px-4 py-3 text-right">{t("tournamentManager.detail.completeTournamentResult.currentElo", "Current Elo")}</th>
                        <th className="px-4 py-3 text-center">{t("tournamentManager.detail.completeTournamentResult.delta", "Change")}</th>
                        <th className="px-4 py-3 text-right">{t("tournamentManager.detail.completeTournamentResult.finalElo", "Final Elo")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elo.changes.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No Elo changes.</td>
                        </tr>
                      ) : (
                        elo.changes.map((change) => (
                          <tr key={change.userId} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">#{change.userId}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{change.currentElo}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {change.totalDelta > 0 ? (
                                  <ArrowUp className="h-4 w-4 text-green-500" />
                                ) : change.totalDelta < 0 ? (
                                  <ArrowDown className="h-4 w-4 text-destructive" />
                                ) : (
                                  <Minus className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className={
                                  change.totalDelta > 0 ? "text-green-500 font-semibold" : 
                                  change.totalDelta < 0 ? "text-destructive font-semibold" : ""
                                }>
                                  {change.totalDelta > 0 ? "+" : ""}{change.totalDelta}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-bold">{change.finalElo}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t("tournamentManager.detail.completeTournamentResult.close", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
