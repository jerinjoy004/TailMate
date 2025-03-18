
import React from 'react';
import DoctorCard from './DoctorCard';
import { Card } from '@/components/ui/card';
import { AlertTriangle, UserX } from 'lucide-react';
import Button from '@/components/ui-components/Button';

interface Doctor {
  id: string;
  username: string | null;
  phone: string | null;
  phone_number: string | null;
  distance?: number | null;
  is_online: boolean;
  created_at: string;
}

interface DoctorsListProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  locationEnabled: boolean;
  onEnableLocation: () => void;
}

const DoctorsList: React.FC<DoctorsListProps> = ({
  doctors,
  isLoading,
  error,
  onRetry,
  locationEnabled,
  onEnableLocation
}) => {
  if (!locationEnabled) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertTriangle size={32} className="mb-4 text-amber-500" />
          <p className="mb-4">Please enable location access to see doctors near you.</p>
          <Button onClick={onEnableLocation}>
            Enable Location Access
          </Button>
        </div>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center text-destructive">
          <AlertTriangle size={48} className="mb-4" />
          <p className="mb-4 font-medium">Error loading doctors</p>
          <p className="mb-6 text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }
  
  if (doctors.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <UserX size={48} className="mb-4 text-muted-foreground" />
          <p className="mb-2 font-medium">No doctors available</p>
          <p className="text-sm text-muted-foreground">
            There are no doctors currently online near your location.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;
