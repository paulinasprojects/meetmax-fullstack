"use client";

import { Ellipsis } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";


interface RecentEventProps {
  title: string;
  description: string;
  image: string;
  seen: number;
  coming: number

}

export const RecentEvents = ({  title, description, image, seen, coming}: RecentEventProps) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Card className="w-[288px]">
      <CardHeader className="!p-3.5">
        <div className="flex items-center justify-between">
        <CardTitle className="text-[16px] font-bold leading-[24px] mb-[9px]">Recent Events</CardTitle>
        <Ellipsis className="cursor-pointer"/>
        </div>
        <Separator/>
      </CardHeader>
      <CardContent className="!p-2.5">
        <div className="dark:bg-[#212833] rounded-[10px] py-3 px-4">
          <div className="flex items-center gap-2.5">
            <img src={image} alt="logo" className="w-10 h-10 object-cover" />
            <div className="flex flex-col gap-[2px]">
              <p className="text-[16px] font-bold whitespace-nowrap">{title}</p>
              <p className="text-[12px] font-medium">{description}</p>
            </div>
          </div>
          <Separator className="my-[9px] border-[1px] border-[#191C21]"/>
          <div className="flex justify-between">
            <p className="text-[12px] font-medium">{seen} seen</p>
            <p className="text-[12px] font-medium">{coming} coming</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
