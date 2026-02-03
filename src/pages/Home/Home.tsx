import Footer from "@/components/custom/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  BarChart3,
  Calendar,
  Target,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { useTranslation } from "@/hooks/useTranslation";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { getDefaultRouteForRoles, getRoleNames, hasAnyRole, getRoleByName } =
    useRole();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cardItems = [
    {
      title: t("tournamentManager.tournamentManager"),
      content: t("home.tournamentManagementDesc"),
      icon: Trophy,
    },
    {
      title: t("nav.rankings"),
      content: t("home.playerRankingsDesc"),
      icon: BarChart3,
    },
    {
      title: t("athlete.athleteProfile"),
      content: t("home.playerProfilesDesc"),
      icon: Users,
    },
    {
      title: t("nav.schedule"),
      content: t("home.matchSchedulingDesc"),
      icon: Calendar,
    },
    {
      title: t("athlete.performanceStats"),
      content: t("home.performanceAnalyticsDesc"),
      icon: Target,
    },
    {
      title: t("athlete.achievements"),
      content: t("home.achievementSystemDesc"),
      icon: Award,
    },
  ];

  const handleDashboard = () => {
    if (user && user.roles && user.roles.length > 0) {
      const dashboardRoute = getDefaultRouteForRoles(user.roles);
      console.log(
        "Navigating to dashboard:",
        dashboardRoute,
        "with roles:",
        user.roles,
      );
      navigate(dashboardRoute);
    } else {
      console.warn("Cannot navigate: user or roles not available", { user });
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section*/}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6">
              <span className="text-foreground">{t("home.heroTitle1")}</span>
              <br />
              <span className="text-primary">{t("home.heroTitle2")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
              {t("home.heroDescription")}
            </p>

            {/* User welcome section when authenticated */}
            {isAuthenticated && user && (
              <div className="mb-8 p-6 rounded-lg bg-primary/10 border border-primary/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t("home.welcomeBack", { name: user.username })}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {getRoleNames(user.roles).map((roleName) => (
                    <span
                      key={roleName}
                      className="text-sm px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium"
                    >
                      {roleName}
                    </span>
                  ))}
                </div>
                <Button
                  size="lg"
                  onClick={handleDashboard}
                  className="text-lg px-8 gap-2"
                  type="button"
                >
                  {t("home.goToDashboard")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* CTA buttons for non-authenticated users */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <NavLink to="/signup">{t("home.getStarted")}</NavLink>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                  asChild
                >
                  <NavLink to="/rankings">{t("home.viewRankings")}</NavLink>
                </Button>
              </div>
            )}

            {/* Quick links for authenticated users with management roles */}
            {isAuthenticated &&
              user &&
              (() => {
                const adminRole = getRoleByName("admin");
                const organizerRole = getRoleByName("organizer");
                const chiefRefereeRole = getRoleByName("chief_referee");
                const allowedRoles = [
                  adminRole?.id,
                  organizerRole?.id,
                  chiefRefereeRole?.id,
                ].filter((id): id is number => id !== undefined);

                return hasAnyRole(user.roles, allowedRoles);
              })() && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {(() => {
                    const adminRole = getRoleByName("admin");
                    return adminRole && hasAnyRole(user.roles, [adminRole.id]);
                  })() && (
                    <Card
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate("/admin")}
                    >
                      <CardHeader className="text-center py-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {t("admin.systemDashboard")}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  )}
                  {(() => {
                    const organizerRole = getRoleByName("organizer");
                    return (
                      organizerRole &&
                      hasAnyRole(user.roles, [organizerRole.id])
                    );
                  })() && (
                    <Card
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate("/tournament-manager")}
                    >
                      <CardHeader className="text-center py-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {t("tournamentManager.tournamentManager")}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  )}
                  {(() => {
                    const chiefRefereeRole = getRoleByName("chief_referee");
                    return (
                      chiefRefereeRole &&
                      hasAnyRole(user.roles, [chiefRefereeRole.id])
                    );
                  })() && (
                    <Card
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate("/chief-referee")}
                    >
                      <CardHeader className="text-center py-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {t("chiefReferee.chiefReferee")}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("home.featuresTitle")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.featuresDescription")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="bg-card border-border">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.content}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("home.ctaDescription")}
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <NavLink to="/signup">{t("home.startJourney")}</NavLink>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
