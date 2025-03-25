"use client";

import { useState } from "react";
import { followUser } from "@/actions/user-action";
import { Button } from "./ui/button"
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string
}

export const FollowButton = ({userId}: FollowButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      await followUser(userId);
      toast.success("User followed!")
    } catch (error) {
      toast.error("Error following user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-5 items-center justify-center mt-5">
    <Button
      size="sm"
      variant="secondary"
      className="w-[116px] h-[36px] rounded-[6px] border border-[#4e5d78] bg-transparent text-[#4e5d78] text-sm font-bold"
    >
      Ignore
    </Button>
    <Button
      size="sm"
      variant="secondary"
      className="w-[116px] h-[36px] bg-[#377DFF] text-white rounded-[6px] text-sm font-bold hover:bg-[#3667c2]"
      disabled={isLoading}
      onClick={handleFollow}
    >
      {isLoading ? <Loader2 className="animate-spin size-4"/> : "Follow"}
    </Button>
   </div>
  )
}
