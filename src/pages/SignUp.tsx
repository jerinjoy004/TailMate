import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui-components/Button";
import AnimatedSection from "@/components/ui-components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [userType, setUserType] = useState<"normal" | "volunteer" | "doctor">(
    "normal"
  );
  const { signUp, loading, user } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) return;

    await signUp(email, password, {
      username: name,
      userType,
      phone: phone,
      locality: locality,
      licenseNumber: userType === "doctor" ? licenseNumber : undefined,
    });
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <AnimatedSection delay={100}>
          <div className="text-center">
            <Link
              to="/"
              className="text-2xl font-bold text-primary inline-flex items-center"
            >
              Tailmate
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join our community and help animals in need
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <form onSubmit={handleSignUp} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="userType" className="block text-sm font-medium">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setUserType("normal")}
                  className={`px-2 sm:px-4 py-2 border rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    userType === "normal"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-secondary/50"
                  }`}
                  disabled={loading}
                >
                  Normal User
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("volunteer")}
                  className={`px-2 sm:px-4 py-2 border rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    userType === "volunteer"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-secondary/50"
                  }`}
                  disabled={loading}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("doctor")}
                  className={`px-2 sm:px-4 py-2 border rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    userType === "doctor"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-secondary/50"
                  }`}
                  disabled={loading}
                >
                  Doctor
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  <User className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                  <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <Lock className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                  <Phone className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="locality" className="block text-sm font-medium">
                  Locality
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="locality"
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your locality"
                    disabled={loading}
                  />
                  <MapPin className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {userType === "doctor" && (
                <div>
                  <label
                    htmlFor="licenseNumber"
                    className="block text-sm font-medium"
                  >
                    License Number
                  </label>
                  <div className="mt-1">
                    <Input
                      id="licenseNumber"
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Enter your medical license number"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default SignUp;
