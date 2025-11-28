"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { InviteUserModal } from "@/components/invite-user-modal";
import { Button } from "@/components/ui/button";
import { ResumeButton } from "@/components/ui/resume-button";
import useInfiniteScrollChat from "@/hooks/useInfiniteScrollChat";
import useRealtimeChat from "@/hooks/useRealtimeChat";
import { downloadAudio, playAudio } from "@/lib/audio";
import { resumeChatProxy } from "@/services/rooms/proxy/resume-chat";
import { Message } from "@/services/supabase/actions/messages";
import { CirclePlay, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RoomClientProps {
  room: {
    id: string;
    name: string | null;
    is_pvp: boolean | null;
  };
  user: {
    id: string;
    name: string;
    image_url: string | null;
  };
  messages: Message[];
}

export function RoomClient({ room, user, messages }: RoomClientProps) {
  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat({
    roomId: room.id,
    userId: user.id,
  });
  const {
    loadMoreMessages,
    messages: oldMessages,
    status,
    triggerQueryRef,
  } = useInfiniteScrollChat({
    roomId: room.id,
    startingMessages: messages.toReversed(),
  });

  const [sentMessages, setSentMessages] = useState<
    (Message & { status: "pending" | "error" | "success" })[]
  >([]);
  const [startTsSelected, setStartTsSelected] = useState<string | undefined>();
  const [endTsSelected, setEndTsSelected] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [finishResumeChat, setFinishResumeChat] = useState(false);
  const [resumeResult, setResumeResult] = useState<Blob | undefined>();

  const visibleMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id))
  );

  const isPreviousOfStartTs = (message: Message) => {
    if (!startTsSelected) return false;

    const selectedMessage = messages.find((m) => m.id === startTsSelected);

    if (!selectedMessage) return false;

    const startDate = new Date(message.created_at);
    const selectedDate = new Date(selectedMessage.created_at);

    return startDate.getTime() <= selectedDate.getTime();
  };

  const resumeChat = async () => {
    try {
      if (!startTsSelected || !endTsSelected) return;

      const startMessage = messages.find((m) => m.id === startTsSelected);
      const endMessage = messages.find((m) => m.id === endTsSelected);

      if (!startMessage || !endMessage) return;

      setIsLoading(true);

      const res = await resumeChatProxy(
        room.id,
        startMessage.created_at,
        endMessage.created_at
      );

      if (!res.ok) {
        toast.error(await res.text());
      }

      const blob = await res.blob();

      setResumeResult(blob);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setFinishResumeChat(true);
    }
  };

  useEffect(() => {
    if (finishResumeChat) {
      setIsLoading(false);
      setFinishResumeChat(false);
    }
  }, [finishResumeChat]);

  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 p-4">
        {room.is_pvp && (
          <div className="border-b">
            <h1 className="text-2xl font-bold">Chat</h1>
          </div>
        )}
        {!room.is_pvp && (
          <>
            <div className="border-b">
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <p className="text-muted-foreground text-sm">
                {connectedUsers} {connectedUsers === 1 ? "usuario" : "usuarios"}{" "}
                en línea
              </p>
            </div>
            <InviteUserModal roomId={room.id} />
          </>
        )}
      </div>
      <div
        className="grow overflow-y-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <div>
          {status === "loading" && (
            <p className="text-center text-sm text-muted-foreground py-2">
              Cargando más mensajes...
            </p>
          )}
          {status === "error" && (
            <div className="text-center">
              <p className="text-sm text-destructive py-2">
                Error al cargar mensajes.
              </p>
              <Button onClick={loadMoreMessages} variant="outline">
                Reintentar
              </Button>
            </div>
          )}
          {visibleMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              {...message}
              showSelectStartTs={startTsSelected === message.id}
              onChangeStartTs={(id) => {
                setStartTsSelected(id);
                setEndTsSelected(undefined);
                if (!id) {
                  setResumeResult(undefined);
                }
              }}
              showSelectEndTs={endTsSelected === message.id}
              onChangeEndTs={(id) => {
                if (!startTsSelected) return;

                setEndTsSelected(id);

                if (!id) {
                  setResumeResult(undefined);
                }
              }}
              existStartTs={Boolean(startTsSelected)}
              existEndTs={Boolean(endTsSelected)}
              isPreviousOfStartTs={isPreviousOfStartTs(message)}
              ref={index === 0 && status === "idle" ? triggerQueryRef : null}
            />
          ))}
        </div>
      </div>
      {startTsSelected && endTsSelected && !resumeResult && (
        <ResumeButton onClick={resumeChat} isLoading={isLoading} />
      )}
      {resumeResult && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Button
            onClick={() => {
              playAudio(resumeResult);
            }}
          >
            <CirclePlay className="h-4 w-4" />
            Reproducir
          </Button>
          <Button
            onClick={() => {
              downloadAudio(resumeResult);
            }}
          >
            <Download className="h-4 w-4" />
            Descargar
          </Button>
        </div>
      )}
      <ChatInput
        roomId={room.id}
        onSend={(message) => {
          setSentMessages((prev) => [
            ...prev,
            {
              id: message.id,
              text: message.text,
              created_at: new Date().toISOString(),
              author_id: user.id,
              author: {
                name: user.name,
                image_url: user.image_url,
              },
              status: "pending",
            },
          ]);
        }}
        onSuccessfulSend={(message) => {
          setSentMessages((prev) =>
            prev.map((m) =>
              m.id === message.id ? { ...message, status: "success" } : m
            )
          );
        }}
        onErrorSend={(id) => {
          setSentMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "error" } : m))
          );
        }}
      />
    </div>
  );
}
