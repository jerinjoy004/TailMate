import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Home, Bell, User, LogOut, Plus, Users, Calendar, Coins, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { user, profile, signOut, userLoading } = useAuth();
  const location = useLocation();

<<<<<<< HEAD
  // If still loading auth state, show nothing
=======
>>>>>>> b592667 (ui fix)
  if (userLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

<<<<<<< HEAD
  // If no user is logged in, redirect to sign in
=======
>>>>>>> b592667 (ui fix)
  if (!user && !userLoading) {
    return <Navigate to="/signin" replace />;
  }

<<<<<<< HEAD
  // Define navigation items based on user role
=======
>>>>>>> b592667 (ui fix)
  const getNavItems = () => {
    const commonItems = [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' },
<<<<<<< HEAD
    ];

    // Add volunteer-specific items
    if (profile?.userType === 'volunteer') {
      return [
        // Change home path for volunteers to volunteer dashboard
=======
      { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
    ];

    if (profile?.userType === 'volunteer') {
      return [
>>>>>>> b592667 (ui fix)
        { icon: Home, label: 'Home', path: '/dashboard/volunteer' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
        { icon: Calendar, label: 'Doctors', path: '/dashboard/doctors' },
        { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
      ];
    }

<<<<<<< HEAD
    // Add doctor-specific items
=======
>>>>>>> b592667 (ui fix)
    if (profile?.userType === 'doctor') {
      return [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
      ];
    }

<<<<<<< HEAD
    // Normal user items
    return [
      ...commonItems,
      { icon: Coins, label: 'Donations', path: '/dashboard/donations' },
    ];
  };

  const navItems = getNavItems();
  
  // Check if we're on the main dashboard page (not subpages)
  const isMainDashboard = location.pathname === '/dashboard';
  
  // Only normal users can create posts
=======
    return commonItems;
  };

  const navItems = getNavItems();
  const isMainDashboard = location.pathname === '/dashboard';
>>>>>>> b592667 (ui fix)
  const canCreatePost = profile?.userType !== 'volunteer' && profile?.userType !== 'doctor';

  return (
    <div className="flex flex-col min-h-screen bg-background">
<<<<<<< HEAD
      {/* Top navigation */}
=======
>>>>>>> b592667 (ui fix)
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container flex h-16 items-center justify-between">
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

<<<<<<< HEAD
      {/* Main content */}
=======
>>>>>>> b592667 (ui fix)
      <main className="flex-1 container py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

<<<<<<< HEAD
      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 sm:hidden">
        <div className="container grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
=======
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 sm:hidden">
        <div className="container flex justify-around">
          {navItems.map((item) => {
>>>>>>> b592667 (ui fix)
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-2 text-xs font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

<<<<<<< HEAD
      {/* Floating action button for creating posts - only show for normal users */}
=======
>>>>>>> b592667 (ui fix)
      {isMainDashboard && canCreatePost && (
        <Link
          to="/dashboard/create-post"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
      
<<<<<<< HEAD
      {/* Side navigation for desktop */}
      <div className="hidden sm:block fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border p-4">
        <nav className="space-y-2">
=======
      <div className="hidden sm:block fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border p-4">
        <nav className="space-y-4">
>>>>>>> b592667 (ui fix)
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
<<<<<<< HEAD
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium",
=======
                  "flex items-center py-3 px-4 rounded-md text-sm font-medium",
>>>>>>> b592667 (ui fix)
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

<<<<<<< HEAD
export default DashboardLayout;
=======
export default DashboardLayout;
>>>>>>> b592667 (ui fix)
