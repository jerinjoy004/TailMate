
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import Button from '@/components/ui-components/Button';
import { ArrowLeft, PlusCircle, Coins, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DonationRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  created_at: string;
  user_id: string;
  fulfilled: boolean;
  user?: {
    name?: string;
    userType?: string;
  };
}

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('donation_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Get unique user IDs
          const userIds = [...new Set(data.map(donation => donation.user_id))];
          
          // Fetch user profiles
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, usertype')
            .in('id', userIds);
          
          if (profilesError) throw profilesError;
          
          // Map profiles to donations
          const donationsWithUsers = data.map(donation => {
            const userProfile = profiles.find((profile: any) => profile.id === donation.user_id);
            return {
              ...donation,
              user: userProfile ? {
                name: userProfile.username,
                userType: userProfile.usertype
              } : undefined
            };
          });
          
          setDonations(donationsWithUsers);
        }
      } catch (error: any) {
        console.error('Error fetching donation requests:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load donation requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
    
    // Set up realtime subscription for donation requests
    const donationsSubscription = supabase
      .channel('public:donation_requests')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'donation_requests' }, 
        (payload) => {
          fetchDonations();
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'donation_requests' }, 
        (payload) => {
          fetchDonations();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(donationsSubscription);
    };
  }, [toast]);
  
  const handleDonate = (donationId: string) => {
    navigate(`/dashboard/donate/${donationId}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Donation Requests</h1>
        </div>
        <Button 
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard/create-donation')}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Request Donation</span>
        </Button>
      </div>
      
      {donations.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No donation requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <AnimatedSection
              key={donation.id}
              animation="scale-in"
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    {donation.user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium">{donation.user?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donation.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <h2 className="text-lg font-bold mb-2 flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-amber-500" />
                  {donation.title}
                </h2>
                
                <p className="text-sm mb-4">{donation.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                    ${donation.amount.toFixed(2)}
                  </div>
                  
                  {donation.fulfilled ? (
                    <span className="text-green-500 flex items-center text-sm">
                      <Heart className="h-4 w-4 mr-1 fill-green-500" />
                      Fulfilled
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleDonate(donation.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      Donate
                    </Button>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default Donations;
