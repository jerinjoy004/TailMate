import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui-components/Button';
import { ArrowLeft, Heart, Coins } from 'lucide-react';
import AnimatedSection from '@/components/ui-components/AnimatedSection';

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
  };
}

const DonateForm: React.FC = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const [donation, setDonation] = useState<DonationRequest | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonationRequest = async () => {
      if (!donationId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await (supabase as any)
          .from('donation_requests')
          .select('*')
          .eq('id', donationId)
          .single();
        
        if (error) throw error;
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user_id)
          .single();
        
        if (profileError) throw profileError;
        
        setDonation({
          id: data.id,
          title: data.title,
          description: data.description,
          amount: data.amount,
          created_at: data.created_at,
          user_id: data.user_id,
          fulfilled: data.fulfilled,
          user: {
            name: profile.username
          }
        });
        
        setAmount(data.amount.toString());
      } catch (error: any) {
        console.error('Error fetching donation request:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load donation request",
          variant: "destructive",
        });
        navigate('/dashboard/donations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationRequest();
  }, [donationId, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !donation) return;
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await (supabase as any)
        .from('donation_requests')
        .update({ fulfilled: true })
        .eq('id', donation.id);
      
      if (error) throw error;
      
      await supabase
        .from('notifications')
        .insert({
          user_id: donation.user_id,
          message: `${user.email || 'Someone'} donated $${amountValue.toFixed(2)} to your request: "${donation.title}"`,
          is_read: false
        });
      
      toast({
        title: "Thank You!",
        description: "Your donation has been processed successfully",
      });
      
      navigate('/dashboard/donations');
    } catch (error: any) {
      console.error('Error processing donation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!donation) {
    return (
      <div className="text-center py-10">
        <p>Donation request not found</p>
        <Button onClick={() => navigate('/dashboard/donations')} className="mt-4">
          Go back to donations
        </Button>
      </div>
    );
  }
  
  if (donation.fulfilled) {
    return (
      <div className="space-y-6 pb-20 sm:pb-0">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/donations')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Donation</h1>
        </div>
        
        <AnimatedSection animation="scale-in" className="text-center py-10 space-y-4">
          <Heart className="h-16 w-16 mx-auto text-green-500 fill-green-500" />
          <h2 className="text-xl font-bold">This donation request has been fulfilled</h2>
          <p className="text-muted-foreground">Thank you for your generosity!</p>
          <Button
            onClick={() => navigate('/dashboard/donations')}
            className="mt-4"
          >
            View other donation requests
          </Button>
        </AnimatedSection>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/donations')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Make a Donation</h1>
      </div>
      
      <AnimatedSection
        animation="scale-in"
        className="bg-card border border-border rounded-lg overflow-hidden p-4"
      >
        <div className="space-y-4">
          <div className="flex items-center">
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
          
          <h2 className="text-lg font-bold flex items-center">
            <Coins className="h-5 w-5 mr-2 text-amber-500" />
            {donation.title}
          </h2>
          
          <p className="text-sm">{donation.description}</p>
          
          <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm inline-block">
            Requested: ${donation.amount.toFixed(2)}
          </div>
        </div>
      </AnimatedSection>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Donation Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-2 pl-8 border border-border rounded-md bg-background"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message (Optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="Add a message to the recipient..."
            maxLength={200}
          />
        </div>
        
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <p>Note: This is a demo application. No actual payment will be processed.</p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={submitting || !amount}
            className="flex items-center gap-1"
          >
            <Heart className="h-4 w-4" />
            Complete Donation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonateForm;
