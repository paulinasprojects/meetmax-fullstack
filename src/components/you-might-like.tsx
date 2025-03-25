import { getUsersYouMightLike } from "@/actions/user-action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { FollowButton } from "./follow-button";
import { UserSocials } from "./user-socials";


export const YouMightLike = async () => {
  const users = await getUsersYouMightLike();

  if (users.length === 0) return null;

  return (
    <Card className="w-[288px]">
      <CardHeader>
        <CardTitle className="text-[16px] font-bold leading-[24px]">You Might Like</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id}>
            <div className="flex gap-2 items-center justify-between">
              <div className="flex  gap-2">
                <Link href={`/profile/${user.username}`}>
                  <Image
                    alt="image"
                    src={user.image ?? "/avatar.png"}
                    className="rounded-full"
                    width={50}
                    height={50}
                  />
                </Link>
                <div className="flex flex-col">
                  <Link href={`/profile/${user.username}`} className="text-[16px] leading-[24px] font-medium cursor-pointer">
                    {user.name}
                  </Link>
                  {/* <p>{user.bio}</p> */}
                  <p className="text-[12px] font-medium leading-[18px]">Founder & CEO at Trophy</p>
                </div>
              </div>
            </div>
              <UserSocials/>
              <FollowButton userId={user.id}/>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
