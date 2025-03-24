import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, UserButton } from "@clerk/nextjs"
import ThemeToggle from "./theme-toggle"
import { Button } from "./ui/button"


export const DesktopNavbar= async () => {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-y-1">
      <div className="mr-4 mt-1.5">
        <ThemeToggle/>
      </div>
      {user ? (
        <>
        <div className="flex items-center gap-4">
          <p className="font-bold">{`${user.firstName || ""} ${user.lastName || ""}`}</p>
          <UserButton/>
        </div>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  )
}
