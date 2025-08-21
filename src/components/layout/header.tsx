import logo from "../../assets/logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineLogout, MdMenu, MdClose } from "react-icons/md";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../services/api";
import LogoutModal from "./LogoutModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authAPI.getProfile,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");

      // Clear query cache
      queryClient.clear();

      // Redirect to auth page
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const navigationItems = [
    { path: "/dashboard", label: "Дашборд", requiredRole: "dashboard" },
    { path: "/calls", label: "Дзвінки", requiredRole: "calls" },
    { path: "/managers", label: "Менеджери", requiredRole: "managers" },
    { path: "/processes", label: "Процеси", requiredRole: "processes" },
    { path: "/settings", label: "Налаштування", requiredRole: "settings" },
    { path: "/users", label: "Користувачі", requiredRole: "admins" },
  ];

  // Filter navigation items based on user roles
  const userRoles = user?.role || [];
  const accessibleNavigationItems = navigationItems.filter((item) =>
    userRoles.includes(item.requiredRole)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Use user data from query, fallback to hardcoded values
  const userName = user?.full_name || "Користувач";
  const userEmail = user?.email || "user@example.com";
  const userPhoto = user?.photo;
  const initials = getInitials(userName);

  // User avatar component
  const UserAvatar = ({
    size = "default",
    className = "",
  }: {
    size?: "small" | "default" | "large";
    className?: string;
  }) => {
    const sizeClasses = {
      small: "size-8",
      default: "size-10",
      large: "size-12",
    };

    if (userPhoto) {
      return (
        <img
          src={userPhoto}
          alt={userName}
          className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-[#EAEAEA] flex items-center justify-center text-[#00101F] font-semibold text-sm ${className}`}
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      <header className="bg-white border-b border-[#EAEAEA] header-shadow px-3 sm:px-4 md:px-6 xl:px-10 flex justify-between items-center min-h-[64px] sm:min-h-[72px] lg:min-h-[80px] relative">
        <img
          src={logo}
          className="max-w-[100px] xs:max-w-[120px] sm:max-w-[120px] xl:max-w-[162px] w-full h-auto"
          alt=""
        />

        {/* Mobile menu button */}
        <motion.button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {isMobileMenuOpen ? (
              <MdClose size={24} color="#00101F" />
            ) : (
              <MdMenu size={24} color="#00101F" />
            )}
          </motion.div>
        </motion.button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-2 lg:gap-4 xl:gap-6 2xl:gap-10">
          {accessibleNavigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-[18px] md:py-[20px] lg:py-[25px] xl:py-[30.5px] px-1 md:px-2 ${
                isActive(item.path)
                  ? "border-b-[3px] border-[#739C9C]"
                  : "border-b-[3px] border-transparent"
              } hover:bg-gray-50 transition-colors`}
            >
              <span
                className={`text-xs md:text-sm lg:text-[13px] xl:text-[14px] leading-[100%] font-semibold whitespace-nowrap ${
                  isActive(item.path) ? "text-[#739C9C]" : "text-[#00101F]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop user profile */}
        <div className="hidden lg:flex max-w-[180px] lg:max-w-[240px] xl:max-w-[280px] 2xl:max-w-[365px] w-full self-center rounded-full border border-[#EAEAEA] bg-[#F7F7F7] items-center justify-between gap-2 lg:gap-4 xl:gap-6 2xl:gap-10 p-1 hover:bg-[#F0F0F0] transition-colors group">
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 min-w-0 flex-1">
            <div className="relative">
              <UserAvatar
                size="large"
                className="shrink-0 hover:bg-[#D0D0D0] transition-colors cursor-pointer group-hover:scale-105 transform duration-200"
              />
              {userPhoto && (
                <div className="size-8 lg:size-10 xl:size-12 rounded-full bg-[#EAEAEA] flex items-center justify-center text-[#00101F] font-semibold text-xs lg:text-sm xl:text-base hidden absolute inset-0">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1 gap-0.5">
              <span className="text-[#00101F] text-sm lg:text-base xl:text-[16px] leading-[100%] font-medium truncate">
                {isLoading ? "Завантаження..." : userName}
              </span>
              <span className="text-[#9A9A9A] text-xs lg:text-sm xl:text-[14px] leading-[100%] truncate">
                {isLoading ? "..." : userEmail}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="size-8 lg:size-10 xl:size-12 shrink-0 flex items-center justify-center hover:bg-[#FFE5E5] rounded-full transition-all duration-200 hover:scale-110 transform group-hover:bg-[#FFE5E5]"
            title="Вийти"
          >
            <MdOutlineLogout
              size={16}
              color="#B24545"
              className="lg:w-5 lg:h-5 xl:w-6 xl:h-6"
            />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={toggleMobileMenu}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                duration: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile menu header */}
              <motion.div
                className="flex items-center justify-between p-4 border-b border-[#EAEAEA]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                    }}
                  >
                    <UserAvatar size="default" />
                    {userPhoto && (
                      <div className="size-10 rounded-full bg-[#EAEAEA] flex items-center justify-center text-[#00101F] font-semibold text-sm hidden absolute inset-0">
                        {initials}
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                  >
                    <span className="text-[#00101F] text-sm font-medium truncate">
                      {isLoading ? "Завантаження..." : userName}
                    </span>
                    <span className="text-[#9A9A9A] text-xs truncate">
                      {isLoading ? "..." : userEmail}
                    </span>
                  </motion.div>
                </div>
                <motion.button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdClose size={24} color="#00101F" />
                </motion.button>
              </motion.div>

              {/* Mobile navigation links */}
              <motion.nav
                className="flex flex-col py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
              >
                {accessibleNavigationItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    onClick={() => handleMobileNavClick(item.path)}
                    className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                      isActive(item.path)
                        ? "bg-[#739C9C0A] border-r-4 border-[#739C9C]"
                        : ""
                    }`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.08,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`text-base font-semibold ${
                        isActive(item.path)
                          ? "text-[#739C9C]"
                          : "text-[#00101F]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </motion.nav>

              {/* Mobile logout button */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#EAEAEA]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
              >
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FFE5E5] hover:bg-[#FFD0D0] rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MdOutlineLogout size={20} color="#B24545" />
                  <span className="text-[#B24545] font-semibold">Вийти</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Header;
