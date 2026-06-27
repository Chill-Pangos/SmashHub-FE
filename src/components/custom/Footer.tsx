import { useTranslation } from "@/hooks/useTranslation";
import logoSvg from "@/assets/smashhub_logo.svg";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 dark:bg-gradient-to-br dark:from-white/20 dark:to-white/5 dark:backdrop-blur-xl ring-1 ring-primary/20 dark:ring-white/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden">
              <img src={logoSvg} alt="SmashHub Logo" className="h-12 w-12 object-contain" />
            </div>
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
