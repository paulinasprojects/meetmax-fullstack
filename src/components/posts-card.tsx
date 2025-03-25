"use client";

import {formatDistanceToNow} from 'date-fns';
import { getPosts } from "@/actions/post-action";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from './ui/button';
import { Forward, HeartIcon, Loader2, LogIn, MessageCircle, SendHorizonal, SendIcon, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

interface PostsCardProps {
  post: Post;
  dbuser: string | null;
}

export const PostsCard = ({ post, dbuser }: PostsCardProps) => {
  const { user } = useUser();
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbuser));
  const [postLikes, setPostLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false);

  return (
    <Card className="ml-5 overflow-hidden ">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Image
                src={post.author.image ?? "/avatar.png"}
                alt="auth-image"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link href={`/profile/${post.author.username}`} className="font-semibold truncate">
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>@{post.author.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                  </div>
                </div>
                {dbuser === post.author.id && (
                  <Trash2 className='text-red-500 size-4'/>
                )}
              </div>
              <p className='mt-2 text-sm text-foreground break-words'>{post.content}</p>
            </div>
          </div>
          {post.image && (
            <div className='rounded-lg overflow-hidden'>
              <img src={post.image} alt="post content" className='w-full h-auto object-cover rounded-[16px]' />
            </div>
          )}
          <div className="flex items-center justify-between pt-2 space-x-4">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground gap-2 ${
                  hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                }`}
                onClick={() => {}}
              >
                {hasLiked ? (
                  <HeartIcon className='size-5 fill-current'/>
                ): (
                  <HeartIcon className='size-5'/>
                )}
                <span>{postLikes} Likes</span>
              </Button>
            ) : (
              <SignInButton mode='modal'>
                <Button variant="ghost" size="sm" className='text-muted-foreground gap-2'>
                  <HeartIcon className='size-5'/>
                  <span>{postLikes} Likes</span>
                </Button>
              </SignInButton>
            )}
            <Button
              variant="ghost"
              size="sm"
              className='text-muted-foreground gap-2 hover:text-blue-500'
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircle className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}/>
              <span>{post.comments.length} Comments</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className='text-muted-foreground gap-2 hover:text-blue-400'
              onClick={() => {}}
            >
              <Forward/>
              <span>Share</span>
            </Button>
          </div>
          {showComments && (
            <div className='space-y-4  border-t pt-4'>
              <div className='space-y-4'>
                {post.comments.map((comment) => (
                  <div className="flex space-x-3" key={comment.id}>
                    <Image
                      alt='author-image'
                      width={32}
                      height={32}
                      src={comment.author.image ?? "/avatar.png"}
                      className='rounded-full'
                    />
                    <div className="flex-1 min-w-0">
                      <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                        <span className='font-medium text-sm'>{comment.author.name}</span>
                        <span className='text-sm text-muted-foreground'>
                          @{comment.author.username}
                        </span>
                        <span className='text-sm text-muted-foreground'>·</span>
                        <span className='text-sm text-muted-foreground'>
                          {formatDistanceToNow(new Date(comment.createdAt))}
                        </span>
                      </div>
                      <p className='text-sm break-words'>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              {user ? (
                <div className="flex  gap-2">
                  <Image
                    src={user.imageUrl || "/avatar.png"}
                    alt='avatar'
                    width={32}
                    height={32}
                    className='rounded-full w-8 h-8'
                  />
                  <div className='flex items-center justify-between gap-4'>
                    <textarea
                      placeholder='Write a comment'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className='h-[38px] w-[376px] resize-none pl-2 pt-2 border border-black  rounded-[10px] placeholder:text-sm'
                    />
                    <div className="ml-10">
                    <Button
                    className='w-[38px] h-[38px] rounded-[5px] bg-[#212833]'
                    >
                      {isCommenting ? (
                        <Loader2 className='animate-spin dark:text-white'/>
                      ): (
                        <>
                          <SendHorizonal className='dark:text-white'/>
                        </>
                      )}
                    </Button>
                    </div>
                  </div>
                </div>
              ) : (
               <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                <SignInButton mode='modal'>
                <Button variant="outline" className='gap-2'>
                  <LogIn className='size-4'/>
                  Sign in to comment
                </Button>
                </SignInButton>
               </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
