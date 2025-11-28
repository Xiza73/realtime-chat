export async function resumeChatProxy(
  chatRoomId: string,
  fromTs: string,
  toTs: string
) {
  const res = await fetch("/api/summary-audio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatRoomId,
      fromTs,
      toTs,
    }),
  });

  const blob = await res.blob();

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
