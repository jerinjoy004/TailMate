
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui-components/Button';
import PostCard from './PostCard';

interface PostProfile {
  username: string | null;
  usertype: string;
}

interface Post {
  id: string;
  user_id: string;
  created_at: string;
  description: string;
  image_url: string | null;
  location: string | null;
  comments: { count: number }[];
  profile?: PostProfile;
  distance?: number | null;
}

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  locationError: Error | null;
  onShare: (post: Post) => void;
  formatDate: (dateString: string) => string;
  requestPermission: () => void;
  refetch: () => void;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  isLoading,
  error,
  locationError,
  onShare,
  formatDate,
  requestPermission,
  refetch
}) => {
  if (locationError) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertTriangle size={32} className="mb-4 text-amber-500" />
          <p className="mb-4">Please enable location access to see posts near you.</p>
          <Button onClick={requestPermission}>
            Enable Location Access
          </Button>
        </div>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
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
          <p className="mb-4 font-medium">Error loading posts</p>
          <p className="mb-6 text-sm text-muted-foreground">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }
  
  if (posts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="mb-4">
          No posts found within 15km of your location.
        </p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onShare={onShare} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
};

export default PostsList;
