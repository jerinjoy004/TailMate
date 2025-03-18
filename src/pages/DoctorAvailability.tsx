
import React, { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@/hooks/use-location';
import DoctorsList from '@/components/doctors/DoctorsList';

const DoctorAvailability: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError, 
    requestPermission 
  } = useLocation();

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }, []);

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Create a stable location key for the query
  const locationKey = useMemo(() => {
    return userLocation ? `${userLocation.latitude},${userLocation.longitude}` : 'no-location';
  }, [userLocation]);

  // Fetch online doctors using React Query
  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ['online-doctors', locationKey],
    queryFn: async () => {
      console.log('Fetching online doctors with user location:', userLocation);
      
      // Get all doctors with online status
      const { data, error } = await supabase
        .from('doctor_status')
        .select(`
          doctor_id,
          is_online,
          phone_number,
          created_at,
          profiles:doctor_id(id, username, phone, usertype)
        `)
        .eq('is_online', true);

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }

      // Format the data and calculate distances
      const formattedDoctors = data.map(item => {
        const profile = item.profiles as any;
        
        let distance = null;
        if (userLocation && profile.locality) {
          try {
            // Parse location if available
            const [lat, lng] = profile.locality.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              distance = calculateDistance(
                userLocation.latitude, 
                userLocation.longitude,
                lat, 
                lng
              );
            }
          } catch (e) {
            console.error('Error parsing location for doctor:', profile.id, e);
          }
        }
        
        return {
          id: profile.id,
          username: profile.username,
          phone: profile.phone,
          phone_number: item.phone_number,
          is_online: item.is_online,
          created_at: item.created_at,
          distance
        };
      });
      
      // Sort by distance
      return formattedDoctors.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    },
    enabled: !!userLocation,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Check if user is a volunteer
  if (profile?.userType !== 'volunteer') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Volunteer Access Only</h1>
        <p className="mb-4 text-center">This page is only accessible to volunteers.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade-in" className="space-y-4">
        <h1 className="text-2xl font-bold">Available Doctors</h1>
        <p className="text-muted-foreground">
          Here are doctors who are currently online and available to assist with animal care.
        </p>
        
        <DoctorsList
          doctors={doctors}
          isLoading={isLoading || locationLoading}
          error={error as Error | null}
          onRetry={refetch}
          locationEnabled={!locationError}
          onEnableLocation={requestPermission}
        />
      </AnimatedSection>
    </div>
  );
};

export default DoctorAvailability;
