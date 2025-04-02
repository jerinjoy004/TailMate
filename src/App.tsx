import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/loader";

// Lazy load components to improve initial load time
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const Comments = lazy(() => import("./pages/Comments"));
const Donations = lazy(() => import("./pages/Donations"));
const CreateDonation = lazy(() => import("./pages/CreateDonation"));
const DonateForm = lazy(() => import("./pages/DonateForm"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const DoctorAvailability = lazy(() => import("./pages/DoctorAvailability"));

// Protected route component
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType === "volunteer")
    return <Navigate to="/dashboard/volunteer" />;
  if (profile?.userType === "doctor") return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const ProtectedVolunteerRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType !== "volunteer") return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const ProtectedDoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/signin" />;
  if (profile?.userType !== "doctor") return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

// Redirect to appropriate dashboard based on user type
const DashboardRouter = () => {
  const { profile } = useAuth();

  if (profile?.userType === "volunteer") {
    return <Navigate to="/dashboard/volunteer" replace />;
  }
  return <Dashboard />;
};

const AppContent = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRouter />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="create-post"
            element={
              <ProtectedUserRoute>
                <CreatePost />
              </ProtectedUserRoute>
            }
          />
          <Route path="comments/:postId" element={<Comments />} />
          <Route path="donations" element={<Donations />} />
          <Route
            path="create-donation"
            element={
              <ProtectedVolunteerRoute>
                <CreateDonation />
              </ProtectedVolunteerRoute>
            }
          />
          <Route path="donate/:donationId" element={<DonateForm />} />

          {/* Volunteer routes */}
          <Route
            path="volunteer"
            element={
              <ProtectedVolunteerRoute>
                <VolunteerDashboard />
              </ProtectedVolunteerRoute>
            }
          />
          <Route
            path="doctors"
            element={
              <ProtectedVolunteerRoute>
                <DoctorAvailability />
              </ProtectedVolunteerRoute>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Create a performant query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      retry: 1,
      cacheTime: 600000, // 10 minutes
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
