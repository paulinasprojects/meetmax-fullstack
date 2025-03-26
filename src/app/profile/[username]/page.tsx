import { getProfilebyUsername, getUsersSavedPost } from "@/actions/user-action"
import { notFound } from "next/navigation";
import { ProfileClient } from "./profile-client";


const UsernamePage = async ({params}: {params: {username: string}}) => {
  const user = await getProfilebyUsername(params.username);

  if (!user) notFound();

  const [getusersSaved] = await Promise.all([
    getUsersSavedPost(user.username),
  ])

  return (
   <ProfileClient
    user={user}
    // savedPosts={getusersSaved}
   />
  )
}

export default UsernamePage