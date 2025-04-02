import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Home, Bell, User, LogOut, Plus, Users, Calendar, Coins, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { user, profile, signOut, userLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // If no user is logged in, redirect to sign in
  if (!user && !userLoading) {
    return <Navigate to="/signin" replace />;
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' },
      { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
    ];

    if (profile?.userType === 'volunteer') {
      return [
        { icon: Home, label: 'Home', path: '/dashboard/volunteer' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
        { icon: Calendar, label: 'Doctors', path: '/dashboard/doctors' },
        { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
      ];
    }

    if (profile?.userType === 'doctor') {
      return [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();
  const isMainDashboard = location.pathname === '/dashboard';
  const canCreatePost = profile?.userType !== 'volunteer' && profile?.userType !== 'doctor';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-xl font-semibold text-primary">
            Tailmate
          </Link>
          <div className="flex items-center gap-4">
            {profile?.userType && (
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                {profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6 pb-20 sm:pb-6 px-4 sm:px-6">
        <Outlet />
      </main>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4 sm:hidden">
        <div className="container flex justify-between px-6">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-2 text-xs font-medium transition-colors",
                  isActive
                  ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating action button for creating posts - only show for normal users */}
      {isMainDashboard && canCreatePost && (
        <Link
          to="/dashboard/create-post"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}

      {/* Side navigation for desktop */}
      <div className="hidden sm:block fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium",
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