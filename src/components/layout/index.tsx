import { Outlet } from "react-router-dom";
import Header from "./header";

interface LayoutProps {
  className?: string;
}

const Layout = ({ className = "" }: LayoutProps): JSX.Element => {
  return (
    <div className={`min-h-screen flex flex-col bg-[#EBF0F0] ${className}`}>
      <Header />
      <main className="flex-1 p-3 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
