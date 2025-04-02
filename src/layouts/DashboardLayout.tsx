import React, { useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  Home,
  Bell,
  User,
  LogOut,
  Plus,
  Users,
  Calendar,
  Coins,
  Circle,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const DashboardLayout: React.FC = () => {
  const { user, profile, signOut, userLoading } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If no user is logged in, redirect to sign in
  if (!user && !userLoading) {
    return <Navigate to="/signin" replace />;
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { icon: Home, label: "Home", path: "/dashboard" },
      { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
      { icon: User, label: "Profile", path: "/dashboard/profile" },
    ];

    // Add volunteer-specific items
    if (profile?.userType === "volunteer") {
      return [
        { icon: Home, label: "Home", path: "/dashboard/volunteer" },
        {
          icon: Bell,
          label: "Notifications",
          path: "/dashboard/notifications",
        },
        { icon: Calendar, label: "Doctors", path: "/dashboard/doctors" },
        { icon: Coins, label: "Donations", path: "/dashboard/donations" },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ];
    }

    // Add doctor-specific items
    if (profile?.userType === "doctor") {
      return [
        { icon: Home, label: "Home", path: "/dashboard" },
        { icon: Coins, label: "Donations", path: "/dashboard/donations" },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ];
    }

    // Normal user items
    return [
      ...commonItems,
      { icon: Coins, label: "Donations", path: "/dashboard/donations" },
    ];
  };

  const navItems = getNavItems();
  const isMainDashboard = location.pathname === "/dashboard";
  const canCreatePost =
    profile?.userType !== "volunteer" && profile?.userType !== "doctor";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top navigation - Mobile optimized */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border safe-top">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden -ml-2 p-2 rounded-lg hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-lg font-semibold text-primary">
              Tailmate
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {profile?.userType && (
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                {profile.userType.charAt(0).toUpperCase() +
                  profile.userType.slice(1)}
              </span>
            )}
            <button
              onClick={async () => {
                console.log("Sign out button clicked");
                try {
                  console.log("Attempting to sign out...");
                  await signOut();
                  console.log("Sign out successful");
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-secondary"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background border-r border-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center py-3 px-4 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content - Mobile optimized */}
      <main className="flex-1 container py-4 px-4 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 sm:hidden safe-bottom">
        <div className="container grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-1 px-1 rounded-lg text-xs font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating action button - Mobile optimized */}
      {isMainDashboard && canCreatePost && (
        <Link
          to="/dashboard/create-post"
          className="fixed bottom-20 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity z-30"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}

      {/* Side navigation for desktop */}
      <div className="hidden sm:block fixed top-14 left-0 bottom-0 w-64 bg-background border-r border-border p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
