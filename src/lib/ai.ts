export async function getSummaryFromLLM(transcript: string): Promise<string> {
  const systemPrompt = `
Resume la siguiente conversación lo más breve que creas convenientemente,
en tono claro y conversado, mencionando el nombre de cada uno. No inventes cosas.
  `.trim();

  const userPrompt = `
TRANSCRIPCIÓN:
${transcript}
  `.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  const data = await res.json();
  const summary =
    data.choices?.[0]?.message?.content ?? "No se pudo generar un resumen.";

  return summary;
}

export async function getTtsStream(text: string) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // puedes usar alloy, verse, shimmer
      input: text,
      format: "mp3",
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TTS error:", errorText);
    throw new Error("Error generating TTS audio");
  }

  return res.body!;
}
