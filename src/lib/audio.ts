export async function playAudio(blob: Blob) {
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  audio.play();
}

export async function downloadAudio(blob: Blob) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resumen.mp3";
  a.click();
}
