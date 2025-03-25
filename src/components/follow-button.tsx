import { Button } from "./ui/button"

interface FollowButtonProps {
  userId: string
}

export const FollowButton = ({userId}: FollowButtonProps) => {
  return (
    <div className="flex gap-5 items-center justify-center mt-5">
    <Button
      size="sm"
      variant="secondary"
      className="w-[116px] h-[36px] rounded-[6px] border border-[#4e5d78] bg-transparent text-[#4e5d78] text-sm font-bold"
    >
      Ignore
    </Button>
    <Button
      size="sm"
      variant="secondary"
      className="w-[116px] h-[36px] bg-[#377DFF] text-white rounded-[6px] text-sm font-bold hover:bg-[#3667c2]"
    >
      Follow
    </Button>
   </div>
  )
}
