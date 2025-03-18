
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Share, MessageCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface PostCardProps {
  post: Post;
  onShare: (post: Post) => void;
  formatDate: (dateString: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onShare, formatDate }) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => onShare(post)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Share size={20} />
          <span>Share</span>
        </button>
      </div>
    </Card>
  );
};

export default PostCard;
