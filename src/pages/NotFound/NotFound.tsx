import { LayoutDashboard, HeadphonesIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden px-4"
      style={{
        backgroundColor: "#0a0e17",
        backgroundImage:
          "radial-gradient(circle at 15% 50%, rgba(0,242,255,0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(87,27,193,0.05), transparent 25%)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <main className="w-full max-w-4xl">
        <div
          className="rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left relative overflow-hidden"
          style={{
            backdropFilter: "blur(24px)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 20px rgba(0,242,255,0.15)",
          }}
        >
          {/* Corner glows */}
          <div
            className="absolute -top-32 -left-32 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "#00f2ff",
              opacity: 0.1,
              filter: "blur(100px)",
            }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "#571bc1",
              opacity: 0.1,
              filter: "blur(100px)",
            }}
          />

          {/* 404 */}
          <div className="flex-shrink-0 relative flex items-center justify-center w-48 h-36 md:w-56 md:h-40">
            <span
              className="absolute select-none pointer-events-none"
              style={{
                fontSize: "120px",
                color: "#00f2ff",
                opacity: 0.15,
                lineHeight: 1,
              }}
            >
              ◎
            </span>
            <h1
              className="relative z-10 font-bold tracking-tighter"
              style={{
                fontSize: "8rem",
                lineHeight: 1,
                color: "#dce4e4",
              }}
            >
              4<span style={{ color: "#00f2ff" }}>0</span>4
            </h1>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col gap-6 z-10">
            <div>
              <div
                className="inline-block px-3 py-1 rounded-full mb-4"
                style={{
                  background: "linear-gradient(to right, #571bc1, #00f2ff)",
                }}
              >
                <span className="text-xs font-bold tracking-widest uppercase text-white">
                  {t("notFoundPage.badge")}
                </span>
              </div>
              <h2
                className="text-3xl font-semibold mb-2"
                style={{ color: "#dce4e4" }}
              >
                {t("notFoundPage.title")}
              </h2>
              <p
                className="text-base leading-relaxed max-w-lg"
                style={{ color: "#b9cacb" }}
              >
                {t("notFoundPage.description")}
              </p>
            </div>

            {/* Separator */}
            <div
              className="w-full"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <NavLink
                to="/"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto"
                style={{ background: "#00f2ff", color: "#080f10" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 20px rgba(0,242,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "none";
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("notFoundPage.primaryAction")}
              </NavLink>

              <a
                href="mailto:support@smashhub.com"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded text-xs font-bold tracking-widest uppercase transition-colors duration-300 w-full sm:w-auto"
                style={{
                  backdropFilter: "blur(24px)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#dce4e4",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)";
                }}
              >
                <HeadphonesIcon className="w-4 h-4" />
                {t("notFoundPage.secondaryAction")}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
