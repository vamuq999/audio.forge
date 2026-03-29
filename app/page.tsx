"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <main className="container">
      <h1 className="title">🎧 Audio Forge</h1>

      <label className="upload">
        Upload Audio
        <input type="file" accept="audio/*" onChange={handleUpload} hidden />
      </label>

      {audioUrl && (
        <div className="player">
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