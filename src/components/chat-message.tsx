import { cn } from "@/lib/utils";
import { Message } from "@/services/supabase/actions/messages";
import { Ref } from "react";
import UserAvatar from "./user-avatar";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "short",
  timeStyle: "short",
});

export function ChatMessage({
  text,
  author,
  created_at,
  status,
  ref,
}: Message & {
  status?: "pending" | "error" | "success";
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-4 px-4 py-2 hover:bg-accent/50",
        status === "pending" && "opacity-70",
        status === "error" && "bg-destructive/10 text-destructive"
      )}
    >
      <div className="shrink-0">
        <UserAvatar imageUrl={author.image_url} name={author.name} />
      </div>
      <div className="grow space-y-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{author.name}</span>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </div>
        <p className="text-sm wrap-break-words whitespace-pre">{text}</p>
      </div>
    </div>
  );
}
