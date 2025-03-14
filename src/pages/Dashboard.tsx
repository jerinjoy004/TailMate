
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Share, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui-components/Button';

interface Post {
  id: string;
  user_id: string;
  description: string;
  image_url?: string;
  created_at: string;
  location?: string;
  comments?: { count: number }[];
  user?: {
    name?: string;
    userType?: string;
  };
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            comments:comments(count)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // After getting posts, fetch user profiles separately
          const postsWithUsers = [...data];
          
          // Get unique user IDs
          const userIds = [...new Set(postsWithUsers.map(post => post.user_id))];
          
          if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('id, username, usertype')
              .in('id', userIds);
              
            if (profilesError) {
              console.error('Error fetching profiles:', profilesError);
            } else if (profiles) {
              // Map profiles to posts
              postsWithUsers.forEach(post => {
                const userProfile = profiles.find(profile => profile.id === post.user_id);
                if (userProfile) {
                  post.user = {
                    name: userProfile.username,
                    userType: userProfile.usertype
                  };
                }
              });
            }
          }
          
          setPosts(postsWithUsers);
        }
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Set up realtime subscription for new posts
    const postsSubscription = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        (payload) => {
          fetchPosts(); // Reload all posts for simplicity
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsSubscription);
    };
  }, [toast]);

  const getDisplayName = (post: Post) => {
    return post.user?.name || 'Unknown User';
  };

  const getInitial = (post: Post) => {
    const name = post.user?.name;
    return name ? name[0].toUpperCase() : 'U';
  };

  const handleComment = (postId: string) => {
    navigate(`/dashboard/comments/${postId}`);
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${getDisplayName(post)}`,
          text: post.description,
          url: window.location.origin + `/dashboard/posts/${post.id}`
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.origin + `/dashboard/posts/${post.id}`);
        toast({
          title: "Link copied!",
          description: "Post link copied to clipboard",
        });
      }
    } catch (error: any) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to share post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Feed</h1>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => navigate('/dashboard/donations')}
          className="flex items-center gap-1"
        >
          <Coins className="h-4 w-4" />
          <span>Donation Requests</span>
        </Button>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <AnimatedSection
              key={post.id}
              animation="scale-in"
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Post header */}
              <div className="p-4 flex items-center">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  {getInitial(post)}
                </div>
                <div>
                  <h3 className="font-medium">{getDisplayName(post)}</h3>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {new Date(post.created_at).toLocaleString()}
                    {post.location && (
                      <>
                        <span className="mx-1">•</span>
                        {post.location}
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Post image if available */}
              {post.image_url && (
                <div className="relative aspect-video bg-muted">
                  <img 
                    src={post.image_url} 
                    alt="Post"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Post content */}
              <div className="p-4">
                <p className="text-sm">{post.description}</p>
              </div>
              
              {/* Post actions */}
              <div className="flex border-t border-border">
                <button 
                  onClick={() => handleComment(post.id)}
                  className="flex-1 py-3 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Comment{post.comments && post.comments.length > 0 ? ` (${post.comments[0].count})` : ''}</span>
                </button>
                <button 
                  onClick={() => handleShare(post)}
                  className="flex-1 py-3 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted transition-colors border-l border-border"
                >
                  <Share className="w-4 h-4 mr-2" />
                  <span>Share</span>
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
