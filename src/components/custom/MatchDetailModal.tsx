import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/utils/api.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMatch } from "@/hooks/queries/useMatchQueries";
import { Loader2, Trophy, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useDateFormat } from "@/hooks/useDateFormat";

interface MatchDetailModalProps {
  matchId: number | null;
  onClose: () => void;
}

export function MatchDetailModal({ matchId, onClose }: MatchDetailModalProps) {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  
  const { data: match, isLoading } = useMatch(matchId || 0, { 
    enabled: !!matchId 
  });

  if (!matchId) return null;

  return (
    <Dialog open={!!matchId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("match.details.title", "Match Details")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : match ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs uppercase">
                {t(`constants.status.match.${match.status}`, match.status) as string}
              </Badge>
              {match.schedule?.scheduledAt && (
                <span className="text-sm font-mono text-muted-foreground">
                  {formatDateTime(match.schedule.scheduledAt)}
                </span>
              )}
            </div>

            {/* Players & Overall winner display */}
            <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/20 border border-border/50">
              <div className="flex flex-col items-center flex-1 text-center">
                <div className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${match.winnerEntryId === match.entryAId ? 'bg-yellow-500/20 text-yellow-500 ring-4 ring-yellow-500/30' : 'bg-primary/10 text-primary'}`}>
                  {match.winnerEntryId === match.entryAId ? <Trophy className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <span className={`font-bold text-lg line-clamp-2 ${match.winnerEntryId === match.entryAId ? 'text-yellow-500' : 'text-foreground'}`}>
                  {(match.entryA as any)?.team?.name || (match.entryA as any)?.name || `Entry ${match.entryAId}`}
                </span>
                
                <div className="flex flex-col gap-1 mt-3 items-center">
                  {(match.entryA as any)?.members?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-center gap-2">
                      <Avatar className="w-6 h-6 border">
                        <AvatarImage src={getImageUrl(member.user?.avatarUrl)} />
                        <AvatarFallback>{member.user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-muted-foreground">{member.user?.firstName} {member.user?.lastName}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-4xl font-black">{match.setsWonA || 0}</div>
              </div>
              
              <div className="px-6 text-sm font-black text-muted-foreground/50">{t("match.details.vs", "VS")}</div>
              
              <div className="flex flex-col items-center flex-1 text-center">
                <div className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${match.winnerEntryId === match.entryBId ? 'bg-yellow-500/20 text-yellow-500 ring-4 ring-yellow-500/30' : 'bg-chart-3/10 text-chart-3'}`}>
                  {match.winnerEntryId === match.entryBId ? <Trophy className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <span className={`font-bold text-lg line-clamp-2 ${match.winnerEntryId === match.entryBId ? 'text-yellow-500' : 'text-foreground'}`}>
                  {(match.entryB as any)?.team?.name || (match.entryB as any)?.name || `Entry ${match.entryBId}`}
                </span>
                
                <div className="flex flex-col gap-1 mt-3 items-center">
                  {(match.entryB as any)?.members?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-center gap-2">
                      <Avatar className="w-6 h-6 border">
                        <AvatarImage src={getImageUrl(member.user?.avatarUrl)} />
                        <AvatarFallback>{member.user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-muted-foreground">{member.user?.firstName} {member.user?.lastName}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-4xl font-black">{match.setsWonB || 0}</div>
              </div>
            </div>

            {/* SubMatches and Sets */}
            {match.subMatches && match.subMatches.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t("match.details.setScores", "Set Scores")}</h3>
                {match.subMatches.map((subMatch: any) => (
                  <div key={subMatch.id} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="bg-secondary/30 px-4 py-2 border-b border-border flex justify-between items-center">
                      <span className="text-xs font-semibold">{t("match.details.subMatch", "Sub-Match")} {String(subMatch.subMatchNumber)}</span>
                      {subMatch.winnerTeam && (
                        <span className="text-xs font-bold text-yellow-500">{t("match.details.winnerTeam", "Winner: Team")} {String(subMatch.winnerTeam)}</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      {subMatch.matchSets && subMatch.matchSets.length > 0 ? (
                        subMatch.matchSets.map((set: any) => (
                          <div key={set.id} className="flex justify-between items-center px-4 py-2 bg-background rounded-md border border-border/30">
                            <span className={`font-bold text-sm w-12 text-center ${set.entryAScore > set.entryBScore ? 'text-primary' : 'text-muted-foreground'}`}>
                              {set.entryAScore}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">{t("match.details.set", "Set")} {set.setNumber}</span>
                            <span className={`font-bold text-sm w-12 text-center ${set.entryBScore > set.entryAScore ? 'text-chart-3' : 'text-muted-foreground'}`}>
                              {set.entryBScore}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">{t("match.details.noSets", "No sets recorded yet.")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">{t("match.details.noResults", "No detailed results available.")}</p>
            )}

          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t("match.details.notFound", "Match not found.")}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
