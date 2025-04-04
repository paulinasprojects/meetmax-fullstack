"use client";

import { format } from "date-fns";
import { Bookmark, CalendarIcon, EditIcon, FileText, HeartIcon, LinkIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { SignInButton, useUser } from "@clerk/nextjs";
import { getProfilebyUsername, getUsersSavedPost, updateProfile, followUser, getUsersPosts } from "@/actions/user-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsCard } from "@/components/posts-card";


type User = Awaited<ReturnType<typeof getProfilebyUsername>>;
type Posts = Awaited<ReturnType<typeof getUsersPosts>>;
type SavedPosts = Awaited<ReturnType<typeof getUsersSavedPost>> 


interface Props {
  user: NonNullable<User>;
  isFollowing: boolean
  savedPosts: SavedPosts;
  posts: Posts;
  likedPosts: Posts;
}

export const ProfileClient = ({user, isFollowing: initialIsFollowing, likedPosts, posts, savedPosts}: Props) => {
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
    <div className="lg:ml-40 md:ml-0 max-sm:ml-0 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card xl:w-[760px] lg:w-[560px] md:w-[700px] max-sm:w-[390px]">
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
            <p className="mt-2 text-sm">{user.bio}</p>
            <div className="w-full flex justify-between mb-4 mt-6">
              <div>
                <p className="font-semibold">{user._count.following.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-semibold">{user._count.followers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-semibold">{user._count.posts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </div>
          </div>
          {!currentUser ? (
            <SignInButton mode="modal">
              <Button className="w-full mt-4">Follow</Button>
            </SignInButton>
          ): isOwnProfile ? (
              <Button 
                className="w-full mt-4" 
                onClick={() => setShowEditingDialog(true)}
              >
                <EditIcon className="size-4 mr"/>
                Edit profile
              </Button>
          ): (
            <Button 
              className="w-full mt-4" 
              onClick={handleFollow} 
              disabled={isUpdatingFollow}
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
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`} 
                  className="hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
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
        </div>

      <div className="mt-5">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="flex items-center justify-between border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="posts" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold">
              <FileText className="size-4"/>
              Posts
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold">
              <HeartIcon className="size-4"/>
              Likes
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold">
              <Bookmark/>
              Saved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostsCard key={post.id} post={post} dbuser={user.id}/>)
              ) : (
                <div>No posts yet</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="likes" className="mt-6">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <PostsCard key={post.id} post={post} dbuser={user.id}/>)
              ) : (
                <div>No liked posts yet</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="saved" className="mt-6">
            <div className="space-y-6">
              {savedPosts.length > 0 ? (
                savedPosts.map((savedPost) => <PostsCard key={savedPost.post.id} post={savedPost.post} dbuser={user.id}/>)
              ) : (
                <div>No saved posts yet</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog 
        open={showEdiitingDialog} 
        onOpenChange={setShowEditingDialog}
      >
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
            <Button 
              onClick={handleEditProfile}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
