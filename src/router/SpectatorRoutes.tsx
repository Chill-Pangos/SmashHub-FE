import { Route } from "react-router-dom";
import SpectatorPage from "@/pages/Spectator/SpectatorPage";

/**
 * Spectator Routes
 * Routes for spectators (Khán giả)
 * Spectators can:
 * - View tournaments list
 * - View match schedules
 * - Watch live matches (scores)
 * - View rankings
 *
 * Note: Spectator routes don't require specific role guard
 * as they are accessible to any authenticated user
 */
export default function SpectatorRoutes() {
  return (
    <>
      <Route path="/spectator/*" element={<SpectatorPage />} />
    </>
  );
}
