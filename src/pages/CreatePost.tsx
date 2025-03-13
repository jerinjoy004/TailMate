
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/ui-components/Button';
import { Image, MapPin, X } from 'lucide-react';
import AnimatedSection from '@/components/ui-components/AnimatedSection';

const CreatePost: React.FC = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get location when component mounts
  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Convert coordinates to readable address using a reverse geocoding API
              // For simplicity, we'll just use the coordinates as text
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              setLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
            } catch (error) {
              console.error('Error getting location:', error);
            } finally {
              setIsGettingLocation(false);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            setIsGettingLocation(false);
            toast({
              title: "Location Error",
              description: "Could not get your location. Please check your device settings.",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support geolocation.",
          variant: "destructive",
        });
      }
    };

    getLocation();
  }, []);

  // Update image preview when image changes
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please add a description for your post",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      let imageUrl = null;
      
      // Upload image if one was selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('post-images')
          .upload(filePath, image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        imageUrl = `${supabase.storageUrl}/object/public/post-images/${filePath}`;
      }
      
      // Create the post
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        description,
        image_url: imageUrl,
        location,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Your post has been created!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatedSection animation="scale-in" className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Create Post</h1>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's happening with the animal?"
            className="w-full p-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
          />
        </div>
        
        {/* Image preview */}
        {preview && (
          <div className="relative rounded-md overflow-hidden">
            <img src={preview} alt="Preview" className="w-full object-cover max-h-80" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {isGettingLocation ? (
            <span>Getting your location...</span>
          ) : location ? (
            <span>Location: {location}</span>
          ) : (
            <span>Location not available</span>
          )}
        </div>
        
        <div className="flex gap-4">
          <div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center p-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80"
            >
              <Image className="h-5 w-5 mr-2" />
              <span>Add Image</span>
            </label>
          </div>
          
          <Button
            type="submit"
            className="ml-auto"
            disabled={isUploading || !description.trim()}
          >
            {isUploading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </AnimatedSection>
  );
};

export default CreatePost;
