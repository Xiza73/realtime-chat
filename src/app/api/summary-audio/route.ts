/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { getSummaryFromLLM, getTtsStream } from "@/lib/ai";
import { createClient } from "@/services/supabase/server/create-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatRoomId, fromTs, toTs } = body;

    if (!chatRoomId || !fromTs || !toTs) {
      return new Response("Missing params", { status: 400 });
    }

    const supabase = await createClient();

    const { data: messages, error } = await supabase
      .from("message")
      .select("text, created_at, author_id, author:user_profile (name)")
      .eq("chat_room_id", chatRoomId)
      .gte("created_at", fromTs)
      .lte("created_at", toTs)
      .order("created_at", { ascending: true });

    if (error) {
      return new Response(`DB error: ${error.message}`, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return new Response("No messages", { status: 404 });
    }

    try {
      const transcript = messages
        .map((m) => `[${m.created_at}] ${m.author.name}: ${m.text}`)
        .join("\n");

      const summaryText = await getSummaryFromLLM(transcript);

      const audioStream = await getTtsStream(summaryText);

      return new Response(audioStream, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
        },
      });
    } catch (error: any) {
      return new Response(`Error generating summary: ${error.message}`, {
        status: 500,
      });
    }
  } catch (e: any) {
    return new Response(
      `Internal error in line ${e.lineNumber}: ${e.data} ${e.response} ${e.message}`,
      {
        status: 500,
      }
    );
  }
}
