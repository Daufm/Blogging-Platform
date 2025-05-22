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
    <div className="flex flex-col min-h-screen">
      {/* Content wrapper with padding */}
      <div className="flex-grow">
        {!shouldHideNavbar && <Navbar />}
  
        <div className={!shouldHideNavbar ? "pt-20 px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64 " : ""}>
          <Outlet />
        </div>
      </div>
  
      
    </div>
  );
  
};

export default MainLayout;
