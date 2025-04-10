import Image from "next/image";
import Link from "next/link";
import { getUsersYouMightLike } from "@/actions/user-action"
import { FollowButton } from "./follow-button";
import { UserSocials } from "./user-socials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export const YouMightLike = async () => {
  const users = await getUsersYouMightLike();

  if (users.length === 0) return null;

  return (
    <Card className="w-[288px]">
      <CardHeader>
        <CardTitle className="text-[16px] font-bold leading-[24px] mb-[9px]">You Might Like</CardTitle>
        <Separator/>
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
                  <p className="text-[12px] font-medium leading-[18px]">{user.bio}</p>
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
