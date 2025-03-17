
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, MapPin, X } from 'lucide-react';
import Button from '@/components/ui-components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, getStorageUrl, initializeStorage } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize storage bucket on component mount
    initializeStorage();
    
    // Check if geolocation is available
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.log('Geolocation permission not granted');
        }
      });
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      
      let imageUrl: string | null = null;
      
      // Upload image if present
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload the file
        const { error: uploadError } = await supabase
          .storage
          .from('posts')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        imageUrl = getStorageUrl('posts', filePath);
      }
      
      // Add location data if enabled
      let locationData = null;
      if (locationEnabled && userLocation) {
        locationData = `${userLocation.latitude},${userLocation.longitude}`;
      }
      
      // Create the post
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          description: content.trim(),
          image_url: imageUrl,
          location: locationData
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your post has been created",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
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
        <h1 className="text-xl font-bold">Create Post</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 min-h-[150px] resize-none border-none focus:outline-none bg-transparent"
            maxLength={500}
          />
          
          {imagePreview && (
            <div className="relative mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 p-1 h-8 w-8"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="rounded-md max-h-60 w-full object-contain"
              />
            </div>
          )}

          {userLocation && (
            <div className="border-t pt-4 mt-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationEnabled}
                  onChange={() => setLocationEnabled(!locationEnabled)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Include my current location
              </label>
              {locationEnabled && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </div>
              )}
            </div>
          )}
        </Card>
        
        <div className="flex justify-between items-center">
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ImageIcon className="h-5 w-5" />
              <span>Add Image</span>
            </div>
          </label>
          
          <div className="text-xs text-muted-foreground">
            {content.length}/500
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={uploading || !content.trim()}
          >
            {uploading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
