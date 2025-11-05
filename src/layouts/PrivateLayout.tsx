import { Outlet, Navigate } from "react-router-dom";

export default function PrivateLayout() {
  //   const isAuthenticated = localStorage.getItem("token"); // hoặc kiểm tra context, redux...

  //   if (!isAuthenticated) {
  //     return <Navigate to="/signin" replace />;
  //   }

  return (
    <div>
      <Outlet />
    </div>
  );
}
