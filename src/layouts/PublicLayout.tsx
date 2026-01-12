import { Outlet } from "react-router-dom";
import NavigationBar from "@/components/custom/NavigationBar";

export default function PublicLayout() {
  return (
    <>
      <NavigationBar />
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
}
