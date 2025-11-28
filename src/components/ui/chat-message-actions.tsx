import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { CircleEllipsis } from "lucide-react";

type ChatMessageActionsProps = {
  onSelectStartTs?: () => void;
  onSelectEndTs?: () => void;
};

export function ChatMessageActions({
  onSelectStartTs,
  onSelectEndTs,
}: ChatMessageActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CircleEllipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          {onSelectStartTs && (
            <DropdownMenuItem onClick={() => onSelectStartTs()} inset>
              Resumir desde aquí
            </DropdownMenuItem>
          )}
          {onSelectEndTs && (
            <DropdownMenuItem onClick={() => onSelectEndTs()} inset>
              Resumir hasta aquí
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
