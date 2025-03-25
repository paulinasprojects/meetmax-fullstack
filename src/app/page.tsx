import { getPosts } from "@/actions/post-action";
import { getDbUserId } from "@/actions/user-action";
import { currentUser } from "@clerk/nextjs/server";
import { CreatePost } from "@/components/create-post";
import { PostsCard } from "@/components/posts-card";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const databaseUser = await getDbUserId();

  return (
 <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
    <div className="lg:col-span-6">
      {user ? <CreatePost/> : null}
      <div className="space-y-6">
       {posts.map((post) => (
        <PostsCard key={post.id} post={post} dbuser={databaseUser}/>
       ))}
      </div>
    </div>
 </div>
  );
}
