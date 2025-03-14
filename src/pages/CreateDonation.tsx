
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui-components/Button';
import { ArrowLeft, Coins } from 'lucide-react';

const CreateDonation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is a volunteer
  useEffect(() => {
    if (profile && profile.userType !== 'volunteer') {
      toast({
        title: "Permission Denied",
        description: "Only volunteers can create donation requests",
        variant: "destructive",
      });
      navigate('/dashboard/donations');
    }
  }, [profile, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a donation request",
        variant: "destructive",
      });
      return;
    }
    
    // Double check that user is a volunteer
    if (profile?.userType !== 'volunteer') {
      toast({
        title: "Permission Denied",
        description: "Only volunteers can create donation requests",
        variant: "destructive",
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await (supabase as any)
        .from('donation_requests')
        .insert({
          title: title.trim(),
          description: description.trim(),
          amount: amountValue,
          user_id: user.id,
          fulfilled: false
        });
      
      if (error) throw error;
      
      toast({
        title: "Donation Request Created",
        description: "Your donation request has been posted successfully",
      });
      
      navigate('/dashboard/donations');
    } catch (error: any) {
      console.error('Error creating donation request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create donation request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
        <h1 className="text-xl font-bold">Create Donation Request</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="Donation for..."
            maxLength={100}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-border rounded-md bg-background min-h-[150px]"
            placeholder="Explain why you're requesting this donation and how it will be used..."
            maxLength={500}
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount Needed ($)
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
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading || !title.trim() || !description.trim() || !amount}
            className="flex items-center gap-1"
          >
            <Coins className="h-4 w-4" />
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonation;
