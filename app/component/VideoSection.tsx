"use client";

import { useRef, useState } from "react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const handlePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/home/video1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Play / Pause button */}
      {!playing && (
        <button
          onClick={handlePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 shadow-lg group-hover:bg-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#1d1a17"
              className="w-8 h-8 translate-x-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Click anywhere to pause when playing */}
      {playing && (
        <button
          onClick={handlePlay}
          aria-label="Pause video"
          className="absolute inset-0"
        />
      )}
    </section>
  );
};

export default VideoSection;
