import { getProfilebyUsername, getUsersSavedPost, isFollowing } from "@/actions/user-action"
import { notFound } from "next/navigation";
import { ProfileClient } from "./profile-client";


const UsernamePage = async ({params}: {params: {username: string}}) => {
  const user = await getProfilebyUsername(params.username);

  if (!user) notFound();

  const [getusersSaved, isCurrentUserFollowing] = await Promise.all([
    getUsersSavedPost(user.username),
    isFollowing(user.id)
  ])

  return (
   <ProfileClient
    user={user}
    isFollowing={isCurrentUserFollowing}
    // savedPosts={getusersSaved}
   />
  )
}

export default UsernamePage