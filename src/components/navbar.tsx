import Link from "next/link"
import { DesktopNavbar } from "./desktop-navbar"
import { MobileNavbar } from "./mobile-navbar"
import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user-action"
import Image from "next/image"

export const Navbar = async () => {
  const user = await currentUser();

  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
             <Image
              src="/meetmax-logo.svg"
              alt="meetmax logo"
              width={112}
              height={28}
             />
            </Link>
          </div>
            <DesktopNavbar/>
            <MobileNavbar/>
        </div>
      </div>
    </nav>
  )
}
