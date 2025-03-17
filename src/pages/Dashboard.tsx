
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Share, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Define Post interface with user profile data
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
}

const fetchPosts = async () => {
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
          .select('username, usertype')
          .eq('id', post.user_id)
          .single();
        
        return { ...post, profile: profileData };
      })
    );
    
    return postsWithProfiles;
  }
  
  return [];
};

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use React Query for data fetching with caching
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });

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
      // Fallback for browsers that don't support the Web Share API
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

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade-in" className="space-y-4">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        
        {isLoading ? (
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
                      {post.location && ` • ${post.location}`}
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
                      loading="lazy" // Add lazy loading for images
                    />
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
            <p className="mb-4">No posts yet. Be the first to share something!</p>
          </Card>
        )}
      </AnimatedSection>
    </div>
  );
};

export default Dashboard;
