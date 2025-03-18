
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle, MapPin, Award, Mail, Calendar, Phone, Circle } from 'lucide-react';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import Button from '@/components/ui-components/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdditionalProfileData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('doctor_status')
            .select('is_online, phone_number')
            .eq('doctor_id', user.id)
            .single();
            
          if (data) {
            setIsOnline(data.is_online || false);
            setPhoneNumber(data.phone_number);
          } else if (profile?.userType === 'doctor') {
            // Create initial status record for doctors
            const { error: insertError } = await supabase
              .from('doctor_status')
              .insert({
                doctor_id: user.id,
                is_online: false,
                phone_number: null
              });
              
            if (insertError) console.error('Error creating doctor status:', insertError);
          }
        } catch (error) {
          console.error('Error fetching doctor status:', error);
        }
      }
    };
    
    fetchAdditionalProfileData();
  }, [user, profile]);

  const toggleOnlineStatus = async () => {
    if (!user || profile?.userType !== 'doctor') return;
    
    try {
      const newStatus = !isOnline;
      const { error } = await supabase
        .from('doctor_status')
        .upsert({
          doctor_id: user.id,
          is_online: newStatus,
          phone_number: phoneNumber
        });
        
      if (error) throw error;
      
      setIsOnline(newStatus);
      toast({
        title: newStatus ? "You are now online" : "You are now offline",
        description: newStatus 
          ? "Volunteers can now see your availability" 
          : "Your availability is hidden from volunteers",
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      toast({
        title: "Failed to update status",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const updatePhoneNumber = async (number: string) => {
    if (!user || profile?.userType !== 'doctor') return;
    
    try {
      const { error } = await supabase
        .from('doctor_status')
        .upsert({
          doctor_id: user.id,
          is_online: isOnline,
          phone_number: number
        });
        
      if (error) throw error;
      
      setPhoneNumber(number);
      toast({
        title: "Contact details updated",
        description: "Your phone number has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({
        title: "Failed to update contact details",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <AnimatedSection animation="scale-in" className="space-y-6">
        <div className="flex flex-col items-center p-6 bg-card border border-border rounded-lg text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserCircle className="w-16 h-16 text-primary" />
          </div>
          
          <h2 className="text-xl font-bold">{profile?.username || user.email?.split('@')[0] || 'User'}</h2>
          
          <div className="flex items-center text-sm text-muted-foreground my-1">
            <Award className="w-4 h-4 mr-1" />
            <span className="capitalize">{profile?.userType || 'Normal User'}</span>
          </div>
          
          {profile?.locality && (
            <div className="flex items-center text-sm text-muted-foreground my-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{profile.locality}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground my-1">
            <Mail className="w-4 h-4 mr-1" />
            <span>{user.email}</span>
          </div>
          
          {phoneNumber && (
            <div className="flex items-center text-sm text-muted-foreground my-1">
              <Phone className="w-4 h-4 mr-1" />
              <span>{phoneNumber}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground my-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
          
          {profile?.userType === 'doctor' && (
            <div className="flex items-center mt-4 space-x-2">
              <div className="flex items-center">
                <Switch
                  id="online-mode"
                  checked={isOnline}
                  onCheckedChange={toggleOnlineStatus}
                />
                <Label htmlFor="online-mode" className="ml-2">
                  {isOnline ? (
                    <span className="flex items-center">
                      <Circle className="h-3 w-3 fill-green-500 text-green-500 mr-1" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Circle className="h-3 w-3 fill-gray-400 text-gray-400 mr-1" />
                      Offline
                    </span>
                  )}
                </Label>
              </div>
            </div>
          )}
          
          <Button className="mt-6" variant="outline">
            Edit Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Helped Animals</div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Profile;
