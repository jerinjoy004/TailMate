
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationState {
  location: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
  requestPermission: () => Promise<void>;
}

export const useLocation = (): LocationState => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const requestPermission = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const message = 'Geolocation is not supported by your browser';
      setError(message);
      setLoading(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation services.",
        variant: "destructive"
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (err) => {
          // Handle permission denied specifically
          if (err.code === 1) { // 1 = PERMISSION_DENIED
            reject(new Error('Location permission denied. Please enable location services in your browser settings.'));
          } else {
            reject(err);
          }
        }, {
          enableHighAccuracy: true,
          timeout: 10000, // Extended timeout
          maximumAge: 0
        });
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      
      // Don't show toast on initial load to avoid annoying users
      // Only show it when the user explicitly requests location
      if (!location) {
        console.error('Location error:', errorMessage);
      } else {
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial location request
    requestPermission();
  }, []);

  return { location, error, loading, requestPermission };
};
