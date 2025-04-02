import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  username?: string;
  userType: "normal" | "volunteer" | "doctor";
  locality?: string;
  licenseNumber?: string;
  isVerified?: boolean;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          username: data.username,
          userType: data.usertype as "normal" | "volunteer" | "doctor",
          locality: data.locality,
          licenseNumber: data.licensenumber,
          isVerified: data.isverified,
          phone: data.phone,
        };
      }

      return null;
    } catch (error) {
      console.error("Error in profile fetch:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setUserLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      }
    );

    const postsSubscription = supabase
      .channel("posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (insert, update, delete)
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          // Handle changes
        }
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      postsSubscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          const profileData = await fetchUserProfile(data.user.id);
          setUser(data.user);
          if (profileData) {
            setProfile(profileData);
            if (profileData.userType === "volunteer") {
              navigate("/dashboard/volunteer");
            } else {
              navigate("/dashboard");
            }
          }

          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Sign in failed",
          description:
            error?.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate, toast, fetchUserProfile]
  );

  const signUp = useCallback(
    async (email: string, password: string, userData: Partial<UserProfile>) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              userType: userData.userType,
              name: userData.username,
              phone: userData.phone,
              locality: userData.locality,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              username: userData.username,
              usertype: userData.userType,
              locality: userData.locality,
              licensenumber: userData.licenseNumber,
              phone: userData.phone,
            });

          if (profileError) {
            console.error("Error updating profile:", profileError);
          }

          if (userData.userType === "doctor") {
            const { error: statusError } = await supabase
              .from("doctor_status")
              .insert({
                doctor_id: data.user.id,
                is_online: false,
                phone_number: userData.phone,
              });

            if (statusError) {
              console.error("Error creating doctor status:", statusError);
            }
          }

          toast({
            title: "Account created!",
            description:
              "You've successfully signed up. Please verify your email.",
          });
          navigate("/signin");
        }
      } catch (error: any) {
        toast({
          title: "Sign up failed",
          description:
            error?.message || "There was a problem with your registration.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate, toast]
  );

  const signOut = useCallback(async () => {
    try {
      console.log("Starting sign out process...");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      console.log("Supabase signOut response:", error ? "Error" : "Success");

      if (error) throw error;

      // Clear user state
      console.log("Clearing user state...");
      setUser(null);
      setProfile(null);

      // Navigate to home page
      console.log("Navigating to home page...");
      navigate("/");

      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      console.log("Sign out process completed");
    } catch (error: any) {
      console.error("Sign out error details:", error);
      toast({
        title: "Sign out failed",
        description: error?.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      signIn,
      signUp,
      signOut,
      loading,
      userLoading,
    }),
    [user, profile, signIn, signUp, signOut, loading, userLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
