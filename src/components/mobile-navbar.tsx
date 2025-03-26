"use client";

import { SunIcon, MoonIcon, MenuIcon, LayoutGrid, BellIcon, UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export const MobileNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mr-2"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
          <span className="sr-only">Toggle dark/light theme</span>
        </Button>
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="size-5"/>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-black">
            <SheetHeader>
              <SheetTitle className="text-start ml-5">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-6 mt-6">
              <Button
                variant="ghost"
                className="flex items-center gap-3 justify-start"
                asChild
              >
                <Link href="/">
                  <LayoutGrid className="size-4"/>
                  Feed
                </Link>
              </Button>
              {user ? (
                <>
                <Button asChild variant="ghost" className="flex items-center gap-3 justify-start">
                  <Link href="/notifications">
                    <BellIcon className="size-4"/>
                    Notifications
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="flex items-center gap-3 justify-start">
                  <Link href={`/profle/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`}>
                    <UserIcon className="size-4"/>
                    Profile
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="flex items-center gap-3 justify-start">
                  <Link href="/settings">
                  <SettingsIcon className="size-4"/>
                  Settings
                </Link>
                </Button>
                <SignOutButton>
                  <Button variant="ghost" className="flex items-center gap-3 justify-start w-full">
                    <LogOutIcon className="w-4 h-4"/>
                    Logout
                  </Button>
                </SignOutButton>
                </>
              ): (
                <SignInButton mode="modal">
                  <Button className="w-full" variant="default">
                    Sign in
                  </Button>
                </SignInButton>
              )}
            </nav>
          </SheetContent>
        </Sheet>
    </div>
  )
}
