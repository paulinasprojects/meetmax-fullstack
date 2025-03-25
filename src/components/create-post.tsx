"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Loader2} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { createPost } from "@/actions/post-action";
import { ImageUpload } from "./image-upload";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export const CreatePost = () => {
  const { user } = useUser();
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Post created successfully")
      }
    } catch (error) {
      console.error("Failed to create a post", error)
      toast.error("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }
  
  return (
    <Card className="mb-6 ml-5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Image
              src={user?.imageUrl || "/avatar.png"}
              alt="users image"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            <Textarea
              placeholder="What is happening"
              className=" w-[402px] h-[42px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>
          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false)
                }}
              />
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-1.5"/>
                <p className="text-sm font-medium text-black dark:text-white">Photo</p>
              </Button>
            </div>
            <Button 
              className="flex items-center cursor-pointer bg-[#377DFF] text-white hover:bg-[#3f7ae6] rounded-[8px] w-[88px] h-[40px]"
              onClick={handleSubmit}
              disabled={isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2 className="animate-spin size-4 mr-2"/>
                  Posting..
                </>
              ) : (
                <>
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
