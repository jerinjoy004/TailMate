import React, { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@/hooks/use-location';
import PostsList from '@/components/dashboard/PostsList';

interface PostProfile {
  username: string | null;
  usertype: string;
}

interface Post {
  created_at: string;
  description: string;
  id: string;
  image_url: string | null;
  location: string | null;
  user_id: string;
  comments: { count: number }[];
  profile?: PostProfile;
  distance?: number | null;
}

const VolunteerDashboard: React.FC = () => {
  const { profile } = useAuth();
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

  // Fetch posts using React Query
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
        <h1 className="text-2xl font-bold">Nearby Posts (15km Radius)</h1>
        
        <PostsList
          posts={posts}
          isLoading={isLoading || locationLoading}
          error={error as Error | null}
          locationError={locationError ? new Error(locationError) : null}
          onShare={handleShare}
          formatDate={formatDate}
          requestPermission={requestPermission}
          refetch={refetch}
        />
      </AnimatedSection>
    </div>
  );
};

export default VolunteerDashboard;
