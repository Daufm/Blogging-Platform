import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  // Paths where the navbar should be hidden
  const hideNavbarOn = [
    "/admin_dashboard",
    "/login",
    "/register",
    "/verify-otp",
  ];

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      {!shouldHideNavbar && <Navbar />}

      {/* Apply spacing only if navbar is visible */}
      <div className={!shouldHideNavbar ? "pt-20" : ""}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
