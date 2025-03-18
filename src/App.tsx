
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeStorage } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Comments from "./pages/Comments";
import Donations from "./pages/Donations";
import CreateDonation from "./pages/CreateDonation";
import DonateForm from "./pages/DonateForm";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import DoctorAvailability from "./pages/DoctorAvailability";
import { useAuth } from "@/contexts/AuthContext";

// Protected route component
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType === 'volunteer') return <Navigate to="/dashboard/volunteer" />;
  if (profile?.userType === 'doctor') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const ProtectedVolunteerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType !== 'volunteer') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const ProtectedDoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType !== 'doctor') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

// Redirect to appropriate dashboard based on user type
const DashboardRouter = () => {
  const { profile } = useAuth();
  
  if (profile?.userType === 'volunteer') {
    return <Navigate to="/dashboard/volunteer" replace />;
  }
  return <Dashboard />;
};

const AppContent = () => {
  useEffect(() => {
    // Initialize storage when the app loads
    initializeStorage();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRouter />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-post" element={
          <ProtectedUserRoute>
            <CreatePost />
          </ProtectedUserRoute>
        } />
        <Route path="comments/:postId" element={<Comments />} />
        <Route path="donations" element={<Donations />} />
        <Route path="create-donation" element={
          <ProtectedVolunteerRoute>
            <CreateDonation />
          </ProtectedVolunteerRoute>
        } />
        <Route path="donate/:donationId" element={<DonateForm />} />
        
        {/* Volunteer routes */}
        <Route path="volunteer" element={
          <ProtectedVolunteerRoute>
            <VolunteerDashboard />
          </ProtectedVolunteerRoute>
        } />
        <Route path="doctors" element={
          <ProtectedVolunteerRoute>
            <DoctorAvailability />
          </ProtectedVolunteerRoute>
        } />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Create a performant query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
