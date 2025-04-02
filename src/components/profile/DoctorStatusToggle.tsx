import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface DoctorStatusToggleProps {
  userId: string;
  initialStatus: boolean;
  onStatusChange: (isOnline: boolean) => void;
}

const DoctorStatusToggle: React.FC<DoctorStatusToggleProps> = ({ 
  userId, 
  initialStatus, 
  onStatusChange 
}) => {
  const [isOnline, setIsOnline] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggleOnlineStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus = !isOnline;
      
      // Update doctor_status table
      const { error } = await supabase
        .from('doctor_status')
        .upsert(
          {
            doctor_id: userId,
            is_online: newStatus
          },
          {
            onConflict: 'doctor_id'
          }
        );
      
      if (error) throw error;
      
      setIsOnline(newStatus);
      onStatusChange(newStatus);
      
      toast({
        title: newStatus ? "You are now online" : "You are now offline",
        description: newStatus 
          ? "Volunteers can now see you in the available doctors list" 
          : "You've been removed from the available doctors list",
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-lg font-medium">Online Status</h3>
        <p className="text-sm text-muted-foreground">
          Toggle this to appear in the available doctors list for volunteers
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch 
              checked={isOnline} 
              onCheckedChange={handleToggleOnlineStatus}
              disabled={isUpdating}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorStatusToggle;
