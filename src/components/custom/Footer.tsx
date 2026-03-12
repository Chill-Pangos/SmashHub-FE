import { Trophy } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">SmashHub</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t("components.footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
