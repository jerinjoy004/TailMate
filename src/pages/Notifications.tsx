
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setNotifications(data as Notification[]);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load notifications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up realtime subscription for new notifications
    if (user) {
      const notificationsSubscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            // Add the new notification to the list
            setNotifications(prev => [payload.new as Notification, ...prev]);
            
            // Show a toast for the new notification
            toast({
              title: "New Notification",
              description: (payload.new as Notification).message,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsSubscription);
      };
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? {...notification, is_read: true} : notification
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification",
        variant: "destructive",
      });
    }
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
      <h1 className="text-2xl font-bold">Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Bell className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <AnimatedSection
              key={notification.id}
              animation="slide-up"
              className={`p-4 rounded-lg border ${
                notification.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex">
                <div className={`min-w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  notification.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.is_read ? 'text-foreground' : 'text-foreground font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
