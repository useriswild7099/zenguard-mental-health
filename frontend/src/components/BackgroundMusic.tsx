'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Set a gentle volume
    }

    // Try to play on first user interaction because of browser autolay policies
    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted) {
        audioRef.current.play().catch(err => console.log("Autoplay prevented:", err));
        setIsMuted(false);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        const newMuted = !isMuted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/zen-music.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={toggleMute}
        className="fixed bottom-24 right-6 z-[100] p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all group"
        title={isMuted ? "Unmute Music" : "Mute Music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5 animate-pulse" />
        )}
        <span className="absolute right-full mr-3 px-2 py-1 bg-black/60 rounded text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isMuted ? "Sound Off" : "Sound On"}
        </span>
      </button>
    </>
  );
}
