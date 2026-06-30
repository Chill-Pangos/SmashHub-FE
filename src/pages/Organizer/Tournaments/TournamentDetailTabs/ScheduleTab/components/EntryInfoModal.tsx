import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEntryMembers } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/utils/api.utils";
import { useDateFormat } from "@/hooks/useDateFormat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EntryInfoModalProps {
  entryId: number | null;
  onClose: () => void;
}

export function EntryInfoModal({ entryId, onClose }: EntryInfoModalProps) {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  
  const { data, isLoading, error } = useEntryMembers(entryId || 0, 1, 10, {
    enabled: !!entryId,
  });

  const members = data?.members || [];

  return (
    <Dialog open={!!entryId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('tournamentManager.scheduleTab.entryInfo', 'Player Information')}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4">
            {t('tournamentManager.scheduleTab.errorLoadingEntry', 'Failed to load player information.')}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            {t('tournamentManager.scheduleTab.noMembers', 'No members found for this entry.')}
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member: any) => {
              const user = member.user;
              if (!user) return null;
              
              const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
              const initial = fullName.charAt(0) || '?';

              return (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card/50">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={getImageUrl(user.avatarUrl)} alt={fullName} />
                    <AvatarFallback className="text-lg">{initial}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">{fullName}</h4>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      {user.gender && (
                        <div>
                          <span className="font-medium mr-1">{t('tournamentManager.scheduleTab.gender', 'Gender')}:</span>
                          <span className="capitalize">{user.gender}</span>
                        </div>
                      )}
                      {user.dob && (
                        <div>
                          <span className="font-medium mr-1">{t('tournamentManager.scheduleTab.dob', 'DOB')}:</span>
                          <span>{formatDateTime(user.dob)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
