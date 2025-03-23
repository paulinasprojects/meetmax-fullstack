import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
 <div>
     <SignedOut>
      <SignInButton mode="modal">
        <Button>Sign in</Button>
      </SignInButton>
        <SignUpButton />
      </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
 </div>
  );
}
