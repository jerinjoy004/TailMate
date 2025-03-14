
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui-components/AnimatedSection';
import Button from '@/components/ui-components/Button';
import { ArrowLeft, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: {
    name?: string;
  };
}

interface Post {
  id: string;
  description: string;
  user_id: string;
  created_at: string;
  user?: {
    name?: string;
  };
}

const Comments: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();
        
        if (postError) throw postError;
        
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
        
        if (commentsError) throw commentsError;
        
        // Get unique user IDs
        const userIds = [
          postData.user_id,
          ...commentsData.map((comment: any) => comment.user_id)
        ];
        
        const uniqueUserIds = [...new Set(userIds)];
        
        // Fetch user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', uniqueUserIds);
        
        if (profilesError) throw profilesError;
        
        // Map user data to post
        const postWithUser = {
          ...postData,
          user: {
            name: profiles.find((profile: any) => profile.id === postData.user_id)?.username || 'Unknown User'
          }
        };
        
        // Map user data to comments
        const commentsWithUsers = commentsData.map((comment: any) => ({
          ...comment,
          user: {
            name: profiles.find((profile: any) => profile.id === comment.user_id)?.username || 'Unknown User'
          }
        }));
        
        setPost(postWithUser);
        setComments(commentsWithUsers);
      } catch (error: any) {
        console.error('Error fetching post and comments:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndComments();
    
    // Set up realtime subscription for new comments
    const commentsSubscription = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, 
        (payload) => {
          // Refresh comments
          fetchPostAndComments();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [postId, toast]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user || !postId) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: postId,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted"
      });
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="text-center py-10">
        <p>Post not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Go back to dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Comments</h1>
      </div>
      
      {/* Original post */}
      <AnimatedSection
        animation="fade-in"
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        <div className="p-4 flex items-center border-b border-border">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
            {post.user?.name?.[0] || 'U'}
          </div>
          <div>
            <h3 className="font-medium">{post.user?.name || 'Unknown User'}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm">{post.description}</p>
        </div>
      </AnimatedSection>
      
      {/* Comments list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {comments.length > 0 ? `${comments.length} Comments` : 'No comments yet'}
        </h2>
        
        {comments.map((comment) => (
          <AnimatedSection
            key={comment.id}
            animation="fade-in"
            className="bg-card border border-border rounded-lg overflow-hidden p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center flex-shrink-0">
                {comment.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-medium text-sm">{comment.user?.name || 'Unknown User'}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="sticky bottom-16 sm:bottom-0 bg-background pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={submitting}
          />
          <Button 
            type="submit" 
            disabled={!newComment.trim() || submitting}
            className="rounded-full p-2 h-auto"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Comments;
