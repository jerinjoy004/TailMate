
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProfileContactFormProps {
  userId: string;
  initialPhone: string | null;
  userType: string;
}

const ProfileContactForm: React.FC<ProfileContactFormProps> = ({ 
  userId, 
  initialPhone, 
  userType 
}) => {
  const [phone, setPhone] = useState(initialPhone || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdatePhone = async () => {
    if (!phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ phone })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // If doctor, also update doctor_status
      if (userType === 'doctor') {
        const { error: statusError } = await supabase
          .from('doctor_status')
          .upsert({ 
            doctor_id: userId, 
            phone_number: phone 
          });
        
        if (statusError) throw statusError;
      }
      
      toast({
        title: "Contact details updated",
        description: "Your phone number has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating phone:', error);
      toast({
        title: "Error updating phone",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your contact details{userType === 'doctor' ? ' for volunteers to reach you' : ''}
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isUpdating}
          />
        </div>
        <Button 
          onClick={handleUpdatePhone} 
          disabled={isUpdating}
          className="w-full sm:w-auto"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Contact Info'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileContactForm;
