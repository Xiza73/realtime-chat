import { Brain } from "lucide-react";
import { Button } from "./button";

type ResumeButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  blob?: Blob;
};

export function ResumeButton({ onClick, isLoading }: ResumeButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="destructive"
      className="w-min p-3 mx-auto mt-3"
      disabled={isLoading}
    >
      <Brain className="h-4 w-4" />
      {isLoading ? "Cargando..." : "Resumir"}
    </Button>
  );
}
