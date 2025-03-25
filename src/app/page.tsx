import { getPosts } from "@/actions/post-action";
import { getDbUserId } from "@/actions/user-action";
import { currentUser } from "@clerk/nextjs/server";
import { CreatePost } from "@/components/create-post";
import { PostsCard } from "@/components/posts-card";
import { YouMightLike } from "@/components/you-might-like";
import { RecentEvents } from "@/components/recent-events";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const databaseUser = await getDbUserId();

  return (
 <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
    <div className="lg:col-span-6">
      {user ? <CreatePost/> : null}
      <div className="space-y-6">
       {posts.map((post) => (
        <PostsCard key={post.id} post={post} dbuser={databaseUser}/>
       ))}
      </div>
    </div>
    <div className="hidden xl:flex flex-col gap-4 lg:col-span-4  ml-56">
      <YouMightLike/>
      <RecentEvents
        title="Graduation Ceremony"
        description="The graduation ceremony is also sometimes called.."
        seen={8}
        coming={8}
        image="/event-logo.png"
      />
      <RecentEvents
        title="Photography Ideas"
        description="Reflections. Reflections work because they can create..."
        seen={11}
        coming={9}
        image="/photo-logo.png"
      />
    </div>
 </div>
  );
}
