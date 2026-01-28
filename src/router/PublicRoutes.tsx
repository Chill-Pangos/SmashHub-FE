import { Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import Home from "@/pages/Home/Home";
import SignIn from "@/pages/Auth/SignIn/SignIn";
import SignUp from "@/pages/Auth/SignUp/SignUp";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import VerifyOtp from "@/pages/Auth/VerifyOtp/VerifyOtp";
import ResetPassword from "@/pages/Auth/ResetPassword/ResetPassword";
import EmailVerification from "@/pages/Auth/EmailVerification/EmailVerification";
// import Rankings from "@/pages/Rankings/Rankings"; // COMMENTED OUT: Uses mock data
import MasterScoreboard from "@/pages/Public/MasterScoreboard/MasterScoreboard";

/**
 * Public Routes
 * Routes accessible without authentication
 */
export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        {/* COMMENTED OUT: Uses mock data, no ranking/leaderboard API available */}
        {/* <Route path="/rankings" element={<Rankings />} /> */}
        <Route path="/scoreboard" element={<MasterScoreboard />} />
      </Route>
    </>
  );
}
