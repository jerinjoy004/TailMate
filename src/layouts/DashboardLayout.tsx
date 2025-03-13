
import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Home, Bell, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { user, signOut, userLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (userLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If no user is logged in, redirect to sign in
  if (!user && !userLoading) {
    return <Navigate to="/signin" replace />;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            Tailmate
          </Link>
          <button 
            onClick={() => signOut()} 
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6">
        <Outlet />
      </main>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 sm:hidden">
        <div className="container grid grid-cols-3 gap-1">
          {navItems.map((item) => {
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

      {/* Floating action button for creating posts */}
      <Link
        to="/dashboard/create-post"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default DashboardLayout;
