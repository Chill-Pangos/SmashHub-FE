import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import Rankings from "./pages/Rankings/Rankings";
import NotFound from "./pages/NotFound/NotFound";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import AdminPage from "./pages/Admin/Admin";
import TournamentManagementPage from "./pages/TournamentManagement/TournamentManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/rankings" element={<Rankings />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="tournament-management"
            element={<TournamentManagementPage />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
