
import React, { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Share, MessageCircle, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui-components/Button';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@/hooks/use-location';

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
  distance?: number | null;
}

const VolunteerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    location: userLocation, 
    loading: locationLoading, 
    error: locationError, 
    requestPermission 
  } = useLocation();

  // Calculate distance between two coordinates in kilometers - memoized for performance
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

  // Fetch posts using React Query with better error handling and optimization
  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['nearby-posts', locationKey],
    queryFn: async () => {
      if (!userLocation) {
        console.log('No user location available for fetching posts');
        return [];
      }
      
      console.log('Fetching posts with user location:', userLocation);
      
      // First, get all posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          comments:comments(count)
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        console.log('No posts found');
        return [];
      }

      console.log(`Found ${postsData.length} posts, processing...`);

      // Fetch all profiles in one query for better performance
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, usertype, locality');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // Process all posts with distance calculation and add profile data
      const postsWithDistance = postsData.map(post => {
        let distance = null;
        if (post.location) {
          try {
            // Parse location if available
            const [lat, lng] = post.location.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              distance = calculateDistance(
                userLocation.latitude, 
                userLocation.longitude,
                lat, 
                lng
              );
            }
          } catch (e) {
            console.error('Error parsing location for post:', post.id, e);
          }
        }
        
        // Add profile data from our map
        const profile = profilesMap.get(post.user_id);
        
        return { 
          ...post, 
          profile, 
          distance 
        };
      });
      
      // Filter posts within 15km radius and sort by distance
      const nearbyPosts = postsWithDistance
        .filter(post => post.distance !== null && post.distance <= 15)
        .sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      
      console.log(`Found ${nearbyPosts.length} posts within 15km`);
      return nearbyPosts;
    },
    enabled: !!userLocation,
    staleTime: 300000, // 5 minutes cache for better performance
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleShare = useCallback((post: Post) => {
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
  }, [toast]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }, []);

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
        <h1 className="text-2xl font-bold">Nearby Posts (15km Radius)</h1>
        
        {locationError ? (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle size={32} className="mb-4 text-amber-500" />
              <p className="mb-4">Please enable location access to see posts near you.</p>
              <Button onClick={requestPermission}>
                Enable Location Access
              </Button>
            </div>
          </Card>
        ) : isLoading || locationLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center text-destructive">
              <AlertTriangle size={48} className="mb-4" />
              <p className="mb-4 font-medium">Error loading posts</p>
              <p className="mb-6 text-sm text-muted-foreground">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Card>
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
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
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
            <p className="mb-4">
              {userLocation 
                ? "No posts found within 15km of your location." 
                : "Waiting for your location to find nearby posts..."}
            </p>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default VolunteerDashboard;
