
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui-components/Button';
import { Calendar, Clock, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  username: string | null;
  locality: string | null;
  licenseNumber: string | null;
  isVerified: boolean | null;
  email?: string;
  available?: boolean;
  timeSlot?: string;
}

const DoctorAvailability: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Get all doctor profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('usertype', 'doctor')
          .eq('isverified', true);

        if (error) throw error;

        if (data) {
          // For this demo, we'll simulate availability
          // In a real app, you would have a separate table for doctor availability
          const availableDoctors = data.map(doctor => {
            const isAvailable = Math.random() > 0.3; // 70% chance of being available
            
            // Get email from auth.users (note: this would require a function in production)
            // For demo purposes, we're just creating a placeholder email
            const email = `${doctor.username?.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            
            return {
              id: doctor.id,
              username: doctor.username,
              locality: doctor.locality,
              licenseNumber: doctor.licensenumber,
              isVerified: doctor.isverified,
              email: email,
              available: isAvailable,
              timeSlot: selectedTimeSlot
            };
          });
          
          setDoctors(availableDoctors);
        }
      } catch (error: any) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedDate, selectedTimeSlot]);

  const handleContactDoctor = (doctor: Doctor) => {
    // In a real app, this would create a notification or message
    toast({
      title: "Contact Request Sent",
      description: `Your request to contact Dr. ${doctor.username} has been sent.`,
    });

    // For demo purposes, simulate opening email client
    const subject = encodeURIComponent(`Medical Consultation Request - ${selectedDate} (${selectedTimeSlot})`);
    const body = encodeURIComponent(`
      Hello Dr. ${doctor.username},

      I would like to schedule a consultation on ${selectedDate} during the ${selectedTimeSlot} time slot.

      Thank you,
      ${profile?.username || 'A user from Tailmate'}
    `);
    
    window.open(`mailto:${doctor.email}?subject=${subject}&body=${body}`);
  };

  // Check if user is a volunteer
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
      
      <AnimatedSection animation="fade-in" className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : doctors.filter(doctor => doctor.available).length > 0 ? (
          <div className="space-y-4">
            {doctors
              .filter(doctor => doctor.available)
              .map((doctor) => (
                <Card key={doctor.id} className="p-6 overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-medium">Dr. {doctor.username || 'Anonymous'}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {doctor.locality || 'Location not specified'}
                      </div>
                      <div className="text-sm mt-2">
                        <span className="inline-flex items-center text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Available ({selectedTimeSlot})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleContactDoctor({ ...doctor, timeSlot: 'email' })}
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
            <p className="mb-4">No doctors available for the selected time slot.</p>
            <p className="text-sm text-muted-foreground">Try selecting a different date or time.</p>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default DoctorAvailability;
