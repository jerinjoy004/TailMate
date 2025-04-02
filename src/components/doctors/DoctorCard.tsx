import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
  doctor: {
    id: string;
    username: string | null;
    phone: string | null;
    phone_number: string | null;
    distance?: number | null;
    is_online: boolean;
    created_at: string;
  };
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleCall = () => {
    const phoneNumber = doctor.phone_number || doctor.phone;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const formattedDistance = doctor.distance ? doctor.distance.toFixed(1) : 'N/A';

  return (
    <Card className="p-4 overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {doctor.username?.[0]?.toUpperCase() || 'D'}
          </div>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{doctor.username || 'Anonymous Doctor'}</h3>
              <p className="text-xs text-muted-foreground">
                Available since {formatDate(doctor.created_at)}
              </p>
            </div>
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500">
            Distance: {formattedDistance} km
          </div>
          
          {(doctor.phone || doctor.phone_number) && (
            <div className="mt-4">
              <Button 
                size="sm"
                variant="outline"
                className="flex items-center text-sm" 
                onClick={handleCall}
              >
                <Phone className="h-3.5 w-3.5 mr-2" />
                Call Doctor
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DoctorCard;
