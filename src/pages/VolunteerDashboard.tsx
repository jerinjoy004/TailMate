
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Share, MessageCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui-components/Button';

interface Post {
  created_at: string;
  description: string;
  id: string;
  image_url: string | null;
  location: string | null;
  user_id: string;
  comments: { count: number }[];
  profile?: {
    username: string | null;
    usertype: string;
  };
  distance?: number;
}

const VolunteerDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Request user location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setLocationPermission(true);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationPermission(false);
            toast({
              title: "Location Access Denied",
              description: "Please enable location access to see posts near you.",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser doesn't support geolocation.",
          variant: "destructive",
        });
      }
    };

    getUserLocation();
  }, [toast]);

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Fetch posts when location is available
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userLocation) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            comments:comments(count)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Fetch user profiles for each post
          const postsWithProfiles = await Promise.all(
            data.map(async (post) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('username, usertype, locality')
                .eq('id', post.user_id)
                .single();
              
              // Parse location if available
              let postLocation = null;
              if (post.location) {
                try {
                  // Assuming location is stored as "latitude,longitude"
                  const [lat, lng] = post.location.split(',').map(Number);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    const distance = calculateDistance(
                      userLocation.latitude, 
                      userLocation.longitude,
                      lat, 
                      lng
                    );
                    return { 
                      ...post, 
                      profile: profileData, 
                      distance: distance 
                    };
                  }
                } catch (e) {
                  console.error('Error parsing location:', e);
                }
              }
              
              return { ...post, profile: profileData, distance: null };
            })
          );
          
          // Filter posts within 10km radius
          const nearbyPosts = postsWithProfiles.filter(post => {
            return post.distance !== null && post.distance <= 10;
          });
          
          // Sort by distance
          nearbyPosts.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
          
          setPosts(nearbyPosts);
        }
      } catch (error: any) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchPosts();
    }
  }, [userLocation]);

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.profile?.username || 'User'}`,
        text: post.description,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      toast({
        title: "Share link copied!",
        description: "The link to this post has been copied to your clipboard.",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
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
      <AnimatedSection animation="fade-in" className="space-y-4">
        <h1 className="text-2xl font-bold">Nearby Posts (10km Radius)</h1>
        
        {!locationPermission ? (
          <Card className="p-6 text-center">
            <p className="mb-4">Please enable location access to see posts near you.</p>
            <Button onClick={() => window.location.reload()}>
              Retry Location Access
            </Button>
          </Card>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                      {post.profile?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.profile?.username || 'Anonymous'}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>
                
                <p className="mb-4 whitespace-pre-wrap break-words">{post.description}</p>
                
                {post.image_url && (
                  <div className="relative rounded-md overflow-hidden mb-4 h-60">
                    <img 
                      src={post.image_url} 
                      alt="Post" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {post.distance !== null && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{post.distance.toFixed(1)} km away</span>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => navigate(`/dashboard/comments/${post.id}`)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircle size={20} />
                    <span>{post.comments[0]?.count || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Share size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="mb-4">No posts found within 10km of your location.</p>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default VolunteerDashboard;
