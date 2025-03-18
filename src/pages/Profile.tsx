
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { Loader2 } from 'lucide-react';
import DoctorStatusToggle from '@/components/profile/DoctorStatusToggle';
import ProfileContactForm from '@/components/profile/ProfileContactForm';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Set username when profile is loaded
    if (profile?.username) {
      setUsername(profile.username);
    }

    // If user is a doctor, fetch their online status
    const fetchDoctorStatus = async () => {
      if (user && profile?.userType === 'doctor') {
        try {
          const { data, error } = await supabase
            .from('doctor_status')
            .select('is_online')
            .eq('doctor_id', user.id)
            .single();

          if (!error && data) {
            setIsOnline(data.is_online);
          }
        } catch (error) {
          console.error('Error fetching doctor status:', error);
        }
      }
    };

    fetchDoctorStatus();
  }, [user, profile]);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Call updateProfile from the AuthContext
      await updateProfile({ username });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (status: boolean) => {
    setIsOnline(status);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      
      <AnimatedSection animation="fade-in">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={username} />
                <AvatarFallback className="text-2xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h2 className="text-xl font-semibold">{username || 'New User'}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {profile?.userType && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account profile information
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={isUpdating}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <ProfileContactForm 
              userId={user?.id || ''} 
              initialPhone={profile?.phone} 
              userType={profile?.userType || ''}
            />
            
            {profile?.userType === 'doctor' && (
              <>
                <Separator className="my-6" />
                <DoctorStatusToggle 
                  userId={user?.id || ''} 
                  initialStatus={isOnline}
                  onStatusChange={handleStatusChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default Profile;
