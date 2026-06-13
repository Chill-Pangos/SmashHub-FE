import { Outlet } from "react-router-dom";
import NavigationBar from "@/components/custom/NavigationBar";

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <NavigationBar />
      <div className="pt-20">
        {children || <Outlet />}
      </div>
    </>
  );
}
