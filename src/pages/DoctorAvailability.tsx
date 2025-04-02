import React, { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DoctorsList from '@/components/doctors/DoctorsList';

const DoctorAvailability: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

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

  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ['online-doctors'],
    queryFn: async () => {
      // First get all online doctors
      const { data: onlineDoctors, error: doctorsError } = await supabase
        .from('doctor_status')
        .select('doctor_id')
        .eq('is_online', true);

      if (doctorsError) {
        throw doctorsError;
      }

      // Then get their profile details
      const doctorIds = onlineDoctors.map(doc => doc.doctor_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, phone')
        .in('id', doctorIds);

      if (profilesError) {
        throw profilesError;
      }

      // Combine the data
      return profiles.map(profile => ({
        id: profile.id,
        is_online: true,
        username: profile.username || null,
        phone: profile.phone || null,
        created_at: new Date().toISOString()
      }));
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade-in">
        <h1 className="text-2xl font-bold">Available Doctors</h1>
        <p className="text-muted-foreground">
          View and contact doctors who are currently online
        </p>
      </AnimatedSection>

      <AnimatedSection animation="fade-in">
        <DoctorsList
          doctors={doctors}
          isLoading={isLoading}
          error={error as Error | null}
          onRetry={refetch}
        />
      </AnimatedSection>
    </div>
  );
};

export default DoctorAvailability;
