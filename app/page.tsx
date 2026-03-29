"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const setSpeed = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;

    audioRef.current.currentTime =
      percent * audioRef.current.duration;
  };

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audioCtx = new AudioContext();

    fetch(audioUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => audioCtx.decodeAudioData(buffer))
      .then(data => {
        const channel = data.getChannelData(0);
        const step = Math.ceil(channel.length / canvas.width);
        const amp = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";

        for (let i = 0; i < canvas.width; i++) {
          let min = 1.0;
          let max = -1.0;

          for (let j = 0; j < step; j++) {
            const datum = channel[i * step + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }

          ctx.fillRect(
            i,
            (1 + min) * amp,
            1,
            Math.max(1, (max - min) * amp)
          );
        }
      });
  }, [audioUrl]);

  return (
    <main className="container">
      <h1 className="title">🎧 Audio Forge</h1>

      <label className="upload">
        Upload Audio
        <input type="file" accept="audio/*" onChange={handleUpload} hidden />
      </label>

      {audioUrl && (
        <div className="player">
          <canvas
            ref={canvasRef}
            width={300}
            height={80}
            onClick={handleSeek}
            style={{
              width: "100%",
              maxWidth: "400px",
              cursor: "pointer",
            }}
          />

          <audio ref={audioRef} controls src={audioUrl} />

          <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
            <button onClick={() => setSpeed(1)}>1x</button>
            <button onClick={() => setSpeed(1.5)}>1.5x</button>
            <button onClick={() => setSpeed(2)}>2x</button>
          </div>
        </div>
      )}
    </main>
  );
}