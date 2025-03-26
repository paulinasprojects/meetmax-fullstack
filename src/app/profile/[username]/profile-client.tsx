"use client";

import { getProfilebyUsername, getUsersSavedPost, updateProfile, followUser } from "@/actions/user-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { CalendarIcon, EditIcon, LinkIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfilebyUsername>>;
// type Posts = Awaited<ReturnType<typeof>>
// type SavedPosts = Awaited<ReturnType<typeof getUsersSavedPost>> 


interface Props {
  user: NonNullable<User>;
  isFollowing: boolean
  // savedPosts: SavedPosts;
}

export const ProfileClient = ({user, isFollowing: initialIsFollowing}: Props) => {
  const {user: currentUser} = useUser();
  const [showEdiitingDialog, setShowEditingDialog] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleEditProfile = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value)
    });

    const result = await updateProfile(formData);

    if (result.success) {
      setShowEditingDialog(false);
      toast.success("Profile updated.")
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true)
      await followUser(user.id);
      setIsFollowing(!isFollowing)
    } catch (error) {
      toast.error("Failed to follow this user")
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile = currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

    const formattedDate = format(new Date(user.createdAt), "MMMM yyyy")

  return (
    <div className="ml-40 max-sm:ml-0">
      <Card className="bg-card w-[500px]">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={user.image ?? "/avatar.png"}
              width={96}
              height={96}
              alt={`${user.username} profile image`}
            />
            <h1 className="mt-4 text-2xl font-bold">{user.name ?? user.username}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="mt-2 text-sm">Founder & CEO at Trophy</p>
            <div className="w-full flex justify-between mb-4 mt-6">
              <div>
                <div className="font-semibold">{user._count.following.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <Separator orientation="vertical" />
              <div>
                <div className="font-semibold">{user._count.followers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <Separator orientation="vertical" />
              <div>
                <div className="font-semibold">{user._count.posts.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
            </div>
          </div>
          {!currentUser ? (
            <SignInButton mode="modal">
              <Button className="w-full mt-4">Follow</Button>
            </SignInButton>
          ): isOwnProfile ? (
              <Button className="w-full mt-4" onClick={() => setShowEditingDialog(true)}>
                <EditIcon className="size-4 mr"/>
                Edit profile
              </Button>
          ): (
            <Button className="w-full mt-4" onClick={handleFollow} disabled={isUpdatingFollow}
              variant={isFollowing ? "outline": "default"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
          {/*  */}
          <div className="w-full mt-6 space-y-2 text-sm">
            {user.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="size-4 mr-2"/>
                {user.location}
              </div>
            )}
            {user.website && (
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="size-4 mr-2"/>
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="size-4 mr-2"/>
              Joined {formattedDate}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEdiitingDialog} onOpenChange={setShowEditingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Tell us about yourself"
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                name="location"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value })}
                placeholder="Where are you based?"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                name="website"
                value={editForm.website}
                onChange={(e) => setEditForm({...editForm, website: e.target.value })}
                placeholder="Your website"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditProfile}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
