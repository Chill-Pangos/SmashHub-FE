import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <Card className="bg-card border-border p-12 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                Page Not Found
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-balance">
              The page you're looking for seems to have missed a match. Let's
              get you back to the game!
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button size="lg" asChild className="w-full">
                <NavLink to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </NavLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full bg-transparent"
              >
                <NavLink to="/rankings">
                  <Search className="w-4 h-4 mr-2" />
                  View Rankings
                </NavLink>
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-muted-foreground mt-8 pt-8 border-t border-border">
              If you believe this is a mistake, please contact support.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
