import { getProfilebyUsername, getUsersSavedPost, getUsersPosts, isFollowing, getUsersLikedPosts } from "@/actions/user-action"
import { notFound } from "next/navigation";
import { ProfileClient } from "./profile-client";


const UsernamePage = async ({params}: {params: {username: string}}) => {
  const user = await getProfilebyUsername(params.username);

  if (!user) notFound();

  const [getusersSaved, likedposts, getusersPosts, isCurrentUserFollowing] = await Promise.all([
    getUsersSavedPost(user.username),
    getUsersLikedPosts(user.id),
    getUsersPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
   <ProfileClient
    user={user}
    isFollowing={isCurrentUserFollowing}
    likedPosts={likedposts}
    savedPosts={getusersSaved}
    posts={getusersPosts}
   />
  )
}

export default UsernamePage