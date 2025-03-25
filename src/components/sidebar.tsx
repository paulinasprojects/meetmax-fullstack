"use client";
import { BellIcon, LayoutGrid, SettingsIcon, UserIcon } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

 
 export const Sidebar = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) return <div>loading...</div>


  const routes = [
    {
      icon: LayoutGrid,
      label: "Feed",
      href: "/",
    },
    {
      icon: BellIcon,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: UserIcon,
      label: "Profile",
      href: `/profile/${user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]}`,
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      href: "/settings",
    },
  ] 
   
  return (
    <div>
      {user ? (
      <div className="flex flex-col gap-[10px] pl-5">
        {routes.map((route) => (
          <div className="" key={route.label}>
            <div className={cn("flex items-center gap-5 w-[200px] h-[46px] ", pathname === route.href ? "bg-[#4e5d78] rounded-[10px] pl-4 text-white dark:text-white w-[200px] h-[46px] font-bold" : "bg-transparent")}>
            <route.icon className="size-5"/>
            <Link href={route.href}>
              {route.label}
            </Link>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-4">
                Login to access your profile and connect with others
              </p>
              <SignInButton mode="modal">
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full mt-2" variant="default">
                  Sign up
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
