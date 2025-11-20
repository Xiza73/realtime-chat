import { Message } from "@/services/supabase/actions/messages";
import { createClient } from "@/services/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface UseRealtimeChatProps {
  roomId: string;
  userId: string;
}

export default function useRealtimeChat({
  roomId,
  userId,
}: UseRealtimeChatProps) {
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let newChannel: RealtimeChannel;
    let cancel = false;

    supabase.realtime.setAuth().then(() => {
      if (cancel) return;

      newChannel = supabase.channel(`room:${roomId}:messages`, {
        config: {
          private: true,
          presence: {
            key: userId,
          },
        },
      });

      newChannel
        .on("presence", { event: "sync" }, () => {
          setConnectedUsers(Object.keys(newChannel.presenceState()).length);
        })
        .on("broadcast", { event: "INSERT" }, (payload) => {
          const record = payload.payload;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: record.id,
              text: record.text,
              created_at: record.created_at,
              author_id: record.author_id,
              author: {
                name: record.author_name,
                image_url: record.author_image_url,
              },
            },
          ]);
        })
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") return;

          newChannel.track({ userId });
        });
    });

    return () => {
      cancel = true;
      if (!newChannel) return;
      newChannel.untrack();
      newChannel.unsubscribe();
    };
  }, [roomId, userId]);

  return { connectedUsers, messages };
}
