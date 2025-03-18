
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui-components/Button';
import { Calendar, Clock, Mail, Phone, Circle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/use-location';
import { useQuery } from '@tanstack/react-query';

interface Doctor {
  id: string;
  username: string | null;
  locality: string | null;
  licenseNumber: string | null;
  isVerified: boolean | null;
  email?: string;
  phone?: string | null;
  available?: boolean;
  distance?: number | null;
}

const DoctorAvailability: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError, 
    requestPermission 
  } = useLocation();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const locationKey = userLocation 
    ? `${userLocation.latitude},${userLocation.longitude}` 
    : 'no-location';

  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ['doctors', locationKey, selectedDate, selectedTimeSlot],
    queryFn: async () => {
      try {
        // Join profiles and doctor_status tables to get all doctor info
        const { data: doctorProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('usertype', 'doctor')
          .eq('isverified', true);

        if (profilesError) throw profilesError;

        if (!doctorProfiles || doctorProfiles.length === 0) {
          return [];
        }

        const { data: statusData, error: statusError } = await supabase
          .from('doctor_status')
          .select('*')
          .in('doctor_id', doctorProfiles.map(d => d.id));

        if (statusError) throw statusError;

        const doctorsWithStatus = doctorProfiles.map(doctor => {
          const status = statusData?.find(s => s.doctor_id === doctor.id);
          
          let distance = null;
          
          if (userLocation && doctor.locality) {
            try {
              if (doctor.locality.includes(',')) {
                const [docLat, docLng] = doctor.locality.split(',').map(Number);
                if (!isNaN(docLat) && !isNaN(docLng)) {
                  distance = calculateDistance(
                    userLocation.latitude, 
                    userLocation.longitude,
                    docLat, 
                    docLng
                  );
                }
              }
            } catch (err) {
              console.error('Error calculating distance:', err);
            }
          }
          
          return {
            id: doctor.id,
            username: doctor.username,
            locality: doctor.locality,
            licenseNumber: doctor.licensenumber,
            isVerified: doctor.isverified,
            email: `${doctor.username?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: status?.phone_number || doctor.phone,
            available: status?.is_online || false,
            distance: distance
          };
        });

        return doctorsWithStatus
          .filter(doctor => doctor.available)
          .sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
      } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }
    },
    enabled: profile?.userType === 'volunteer',
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const handleContactDoctor = (doctor: Doctor) => {
    toast({
      title: "Contact Request Sent",
      description: `Your request to contact Dr. ${doctor.username} has been sent.`,
    });

    const subject = encodeURIComponent(`Medical Consultation Request - ${selectedDate} (${selectedTimeSlot})`);
    const body = encodeURIComponent(`
      Hello Dr. ${doctor.username},

      I would like to schedule a consultation on ${selectedDate} during the ${selectedTimeSlot} time slot.

      Thank you,
      ${profile?.username || 'A user from Tailmate'}
    `);
    
    if (doctor.phone) {
      toast({
        title: "Doctor's Contact Information",
        description: `Phone: ${doctor.phone}`,
      });
    } else {
      window.open(`mailto:${doctor.email}?subject=${subject}&body=${body}`);
    }
  };

  if (profile?.userType !== 'volunteer') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Volunteer Access Only</h1>
        <p className="mb-4 text-center">This page is only accessible to volunteers.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Available Doctors</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center border rounded-md overflow-hidden">
            <div className="px-3 py-2 bg-muted flex items-center">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-2 px-3 border-0 focus:outline-none bg-background"
            />
          </div>
          
          <div className="flex rounded-md overflow-hidden border">
            <div className="px-3 py-2 bg-muted flex items-center">
              <Clock className="h-4 w-4" />
            </div>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="py-2 px-3 border-0 focus:outline-none bg-background"
            >
              <option value="morning">Morning (9AM - 12PM)</option>
              <option value="afternoon">Afternoon (1PM - 5PM)</option>
              <option value="evening">Evening (6PM - 9PM)</option>
            </select>
          </div>
        </div>
      </div>
      
      {locationError && (
        <Card className="p-6 text-center mb-4">
          <p className="mb-4">Please enable location access to see doctors sorted by proximity.</p>
          <Button onClick={requestPermission}>
            Enable Location
          </Button>
        </Card>
      )}
      
      <AnimatedSection animation="fade-in" className="space-y-4">
        {isLoading || locationLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="p-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">Dr. {doctor.username || 'Anonymous'}</h3>
                      <span className="ml-2 flex items-center text-green-600">
                        <Circle className="h-3 w-3 fill-green-500 text-green-500 mr-1" />
                        <span className="text-xs">Online</span>
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {doctor.locality || 'Location not specified'}
                    </div>
                    
                    {doctor.distance !== null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {doctor.distance.toFixed(1)} km away
                      </div>
                    )}
                    
                    {doctor.phone && (
                      <div className="text-sm mt-2 flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-primary" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleContactDoctor({ ...doctor })}
                      className="flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      onClick={() => handleContactDoctor(doctor)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="mb-4">No doctors available at the moment.</p>
            <p className="text-sm text-muted-foreground">Try again later or select a different time slot.</p>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default DoctorAvailability;
