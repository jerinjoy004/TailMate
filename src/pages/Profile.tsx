
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle, MapPin, Award, Mail, Calendar } from 'lucide-react';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import Button from '@/components/ui-components/Button';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();

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
          
          <div className="flex items-center text-sm text-muted-foreground my-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
          
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
