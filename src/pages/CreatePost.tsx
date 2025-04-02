import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Button from "@/components/ui-components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const CreatePost: React.FC = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/quicktime",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image or video file",
          variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Create the post first to get its ID
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            user_id: user.id,
            description: content.trim(),
          },
        ])
        .select()
        .single();

      if (postError) throw postError;
      if (!post) throw new Error("Failed to create post");

      // If there's an image, upload it using the post's ID as the filename
      if (image) {
        const fileExtension = image.name.split(".").pop();
        const filePath = `${user.id}/${post.id}.${fileExtension}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("posts").getPublicUrl(filePath);

        // Update the post with the image URL
        const { error: updateError } = await supabase
          .from("posts")
          .update({ image_url: publicUrl })
          .eq("id", post.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Your post has been created",
      });

      // Clear form and navigate
      setContent("");
      setImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create post",
        variant: "destructive",
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
          onClick={() => navigate("/dashboard")}
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

          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                Add Media
              </Button>
            </div>

            <Button
              type="submit"
              disabled={uploading || !content.trim()}
              className="ml-auto"
            >
              {uploading ? "Posting..." : "Post"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreatePost;
