
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
  if (profile?.userType === 'volunteer') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const ProtectedVolunteerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType !== 'volunteer') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
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
              <Route path="volunteer" element={<VolunteerDashboard />} />
              <Route path="doctors" element={<DoctorAvailability />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
