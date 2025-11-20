import { cn } from "@/lib/utils";
import { User2Icon } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  imageUrl: string | null;
  name: string;
  size?: number;
}

export default function UserAvatar({
  imageUrl,
  name,
  size = 40,
}: UserAvatarProps) {
  return (
    <>
      {imageUrl != null ? (
        <Image
          src={imageUrl}
          alt={name}
          width={size}
          height={size}
          className="rounded-full"
        />
      ) : (
        <div
          className={cn(
            size !== 40 ? `w-[${size}px] h-[${size}px]` : "size-10",
            "rounded-full flex items-center justify-center border bg-muted text-muted-foreground overflow-hidden"
          )}
        >
          <User2Icon className="size-[30px] mt-2.5" />
        </div>
      )}
    </>
  );
}
