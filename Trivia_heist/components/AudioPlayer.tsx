import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default subtle volume
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to play on mount
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
          // Autoplay was prevented.
          // Add listeners for the first user interaction to start playback
          const startAudio = () => {
             audio.play().then(() => setIsPlaying(true)).catch(() => {});
             document.removeEventListener('click', startAudio);
             document.removeEventListener('keydown', startAudio);
          };
          document.addEventListener('click', startAudio);
          document.addEventListener('keydown', startAudio);
        });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
        setIsMuted(false);
        if (audioRef.current) audioRef.current.muted = false;
    }
    if (val === 0) {
        setIsMuted(true);
        if (audioRef.current) audioRef.current.muted = true;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 group flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 pl-3 rounded-full border border-zinc-700/50 hover:border-red-900/50 hover:bg-black/90 transition-all duration-300 shadow-xl">
       <button 
         onClick={toggleMute} 
         className={`transition-colors ${isMuted ? 'text-zinc-500' : 'text-red-500 hover:text-red-400'}`}
         title={isMuted ? "Unmute Theme" : "Mute Theme"}
       >
         {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
       </button>
       
       <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 ml-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-red-500"
          />
       </div>

       <audio ref={audioRef} src={src} loop />
    </div>
  );
};
