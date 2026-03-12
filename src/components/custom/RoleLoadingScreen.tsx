import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * RoleLoadingScreen - Displays while role data is being fetched
 */
export default function RoleLoadingScreen() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <Card className="bg-card border-border p-12 text-center">
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {t("roleLoading.title")}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-balance">
              {t("roleLoading.description")}
            </p>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-primary animate-pulse rounded-full w-2/3"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
