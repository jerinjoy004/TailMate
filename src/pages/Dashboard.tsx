
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Heart, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';

interface Post {
  id: string;
  user_id: string;
  description: string;
  image_url?: string;
  created_at: string;
  location?: string;
  comments_count: number;
  user: {
    name: string;
    userType: string;
  };
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            user:user_id (
              name,
              userType
            ),
            comments_count:comments(count)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setPosts(data as any);
        }
      } catch (error: any) {
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <h1 className="text-2xl font-bold">Home Feed</h1>
      
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
                  {post.user?.name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-medium">{post.user?.name || 'Unknown User'}</h3>
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
                <button className="flex-1 py-3 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Comment{post.comments_count > 0 ? ` (${post.comments_count})` : ''}</span>
                </button>
                <button className="flex-1 py-3 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted transition-colors border-l border-r border-border">
                  <Heart className="w-4 h-4 mr-2" />
                  <span>Like</span>
                </button>
                <button className="flex-1 py-3 flex items-center justify-center text-sm text-muted-foreground hover:bg-muted transition-colors">
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
