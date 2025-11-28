import { cn } from "@/lib/utils";
import { Message } from "@/services/supabase/actions/messages";
import { Ref } from "react";
import UserAvatar from "./user-avatar";
import { ChatMessageActions } from "./ui/chat-message-actions";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "short",
  timeStyle: "short",
});

type ChatMessageProps = Message & {
  status?: "pending" | "error" | "success";
  ref?: Ref<HTMLDivElement>;
  showSelectStartTs: boolean;
  onChangeStartTs: (messageId?: string) => void;
  showSelectEndTs: boolean;
  onChangeEndTs: (messageId?: string) => void;
  existStartTs: boolean;
  existEndTs: boolean;
  isPreviousOfStartTs: boolean;
};

export function ChatMessage({
  id,
  text,
  author,
  created_at,
  status,
  ref,
  showSelectStartTs,
  onChangeStartTs,
  showSelectEndTs,
  onChangeEndTs,
  existStartTs,
  existEndTs,
  isPreviousOfStartTs,
}: ChatMessageProps) {
  const addStartTs = () => {
    onChangeStartTs(id);
  };

  const removeStartTs = () => {
    onChangeStartTs(undefined);
  };

  const addEndTs = () => {
    onChangeEndTs(id);
  };

  const removeEndTs = () => {
    onChangeEndTs(undefined);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-4 px-4 py-2 hover:bg-accent/50",
        status === "pending" && "opacity-70",
        status === "error" && "bg-destructive/10 text-destructive",
        showSelectStartTs && "bg-green-900 hover:bg-green-800",
        showSelectEndTs && "bg-red-900 hover:bg-red-800"
      )}
    >
      <div className="shrink-0">
        <UserAvatar imageUrl={author.image_url} name={author.name} />
      </div>
      <div className="grow space-y-0.5">
        <div className="flex gap-2 align-items-center m-0 mb-1">
          <span className="text-sm font-semibold">{author.name}</span>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
          {(!existStartTs || (!existEndTs && !isPreviousOfStartTs)) && (
            <ChatMessageActions
              {...{
                onSelectStartTs: !existStartTs ? addStartTs : undefined,
                onSelectEndTs:
                  existStartTs && !existEndTs ? addEndTs : undefined,
              }}
            />
          )}
        </div>
        <p className="text-sm wrap-break-words whitespace-pre">{text}</p>
      </div>
      {showSelectStartTs && (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={showSelectStartTs}
            onChange={removeStartTs}
          />
          <span className="text-sm">Resumir desde aquí</span>
        </div>
      )}
      {showSelectEndTs && (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={showSelectEndTs}
            onChange={removeEndTs}
          />
          <span className="text-sm">Resumir hasta aquí</span>
        </div>
      )}
    </div>
  );
}
