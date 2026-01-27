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

const cardItems = [
  {
    title: "Tournament Management",
    content:
      "Create and manage tournaments with automated bracket generation and real-time updates.",
    icon: Trophy,
  },
  {
    title: "Player Rankings",
    content:
      "Dynamic ranking system that tracks player performance and skill progression over time.",
    icon: BarChart3,
  },
  {
    title: "Player Profiles",
    content:
      "Comprehensive player profiles with match history, statistics, and achievements.",
    icon: Users,
  },
  {
    title: "Match Scheduling",
    content:
      "Smart scheduling system for matches with automated notifications and reminders.",
    icon: Calendar,
  },
  {
    title: "Performance Analytics",
    content:
      "Detailed analytics and insights to help players improve their game and strategy.",
    icon: Target,
  },
  {
    title: "Achievement System",
    content:
      "Unlock achievements and badges as you progress through your table tennis journey.",
    icon: Award,
  },
];

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { getDefaultRouteForRoles, getRoleNames, hasAnyRole, getRoleByName } =
    useRole();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (user && user.roles && user.roles.length > 0) {
      const dashboardRoute = getDefaultRouteForRoles(user.roles);
      console.log(
        "Navigating to dashboard:",
        dashboardRoute,
        "with roles:",
        user.roles
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
              <span className="text-foreground">MASTER YOUR</span>
              <br />
              <span className="text-primary">TABLE TENNIS GAME</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
              The ultimate management system for table tennis tournaments,
              player rankings, and match statistics. Track your progress and
              compete with the best.
            </p>

            {/* User welcome section when authenticated */}
            {isAuthenticated && user && (
              <div className="mb-8 p-6 rounded-lg bg-primary/10 border border-primary/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Chào mừng trở lại, {user.username}!
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
                  Vào Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* CTA buttons for non-authenticated users */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <NavLink to="/signup">Get Started</NavLink>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                  asChild
                >
                  <NavLink to="/rankings">View Rankings</NavLink>
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
                          Quản trị hệ thống
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
                          Quản lý giải đấu
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
                          Tổng trọng tài
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
              CHAMPIONS OF THE SEASON
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track performance, manage tournaments, and climb the rankings
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
              Ready to Elevate Your Game?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of players already using PingPong Pro to manage
              their table tennis experience.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <NavLink to="/signup">Start Your Journey</NavLink>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
