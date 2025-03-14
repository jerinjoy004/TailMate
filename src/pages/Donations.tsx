
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui-components/Button';

interface DonationRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  amount: number;
  created_at: string;
  fulfilled: boolean;
  profile?: {
    username: string | null;
  };
}

const Donations: React.FC = () => {
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonationRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('donation_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Fetch user profiles for each donation request
          const requestsWithProfiles = await Promise.all(
            data.map(async (request) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', request.user_id)
                .single();
              
              return { ...request, profile: profileData };
            })
          );
          
          setDonationRequests(requestsWithProfiles);
        }
      } catch (error: any) {
        console.error('Error fetching donation requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationRequests();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Donation Requests</h1>
        {user && profile?.userType === 'volunteer' && (
          <Button onClick={() => navigate('/dashboard/create-donation')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        )}
      </div>
      
      <AnimatedSection animation="fade-in" className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : donationRequests.length > 0 ? (
          <div className="space-y-4">
            {donationRequests.map((request) => (
              <Card key={request.id} className="p-6 overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{request.title}</h3>
                  <div className="text-lg font-semibold text-primary">
                    {formatCurrency(request.amount)}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mb-4">
                  Posted by {request.profile?.username || 'Anonymous'} • {formatDate(request.created_at)}
                </div>
                
                <p className="mb-6 whitespace-pre-wrap break-words">{request.description}</p>
                
                <Separator className="my-4" />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => navigate(`/dashboard/donate/${request.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Coins className="h-4 w-4" />
                    Donate Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="mb-4">No donation requests yet.</p>
            {profile?.userType === 'volunteer' && (
              <Button onClick={() => navigate('/dashboard/create-donation')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Donation Request
              </Button>
            )}
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default Donations;
