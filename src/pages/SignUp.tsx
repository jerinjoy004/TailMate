
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Button from '@/components/ui-components/Button';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // This is where you would connect to your authentication service
    // For now, we'll simulate a success
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Your account has been created!",
      });
      navigate('/signin'); // Redirect to sign in after successful signup
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatedSection 
          className="w-full max-w-md p-8 rounded-xl shadow-medium bg-card border border-border"
          animation="scale-in"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-semibold text-primary">Tailmate</h1>
            </Link>
            <p className="mt-2 text-muted-foreground">Create your account</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full py-2 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-2 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="hello@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full py-2 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="userType" className="block text-sm font-medium">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('normal')}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    userType === 'normal'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-secondary/50'
                  }`}
                >
                  Normal User
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('volunteer')}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    userType === 'volunteer'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-secondary/50'
                  }`}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('doctor')}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    userType === 'doctor'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-secondary/50'
                  }`}
                >
                  Doctor
                </button>
              </div>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    className="h-5 w-5 border-2 border-t-transparent border-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account <ArrowRight className="ml-2" size={18} />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default SignUp;
