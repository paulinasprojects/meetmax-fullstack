"use client";

import { getProfilebyUsername, getUsersSavedPost } from "@/actions/user-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { CalendarIcon, EditIcon, LinkIcon, MapPin } from "lucide-react";
import Image from "next/image";

type User = Awaited<ReturnType<typeof getProfilebyUsername>>;
// type Posts = Awaited<ReturnType<typeof>>
// type SavedPosts = Awaited<ReturnType<typeof getUsersSavedPost>>


interface Props {
  user: NonNullable<User>;
  // savedPosts: SavedPosts;
}

export const ProfileClient = ({user}: Props) => {
  const {user: currentUser} = useUser();

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
              <Button className="w-full mt-4">
                <EditIcon className="size-4 mr"/>
                Edit profile
              </Button>
          ): (
            <Button className="w-full mt-4">
              Follow
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
    </div>
  )
}
