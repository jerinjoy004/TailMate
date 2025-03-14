
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
      setError('Geolocation is not supported by your browser');
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
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      toast({
        title: "Location Error",
        description: err.message || "Failed to access your location.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { location, error, loading, requestPermission };
};
