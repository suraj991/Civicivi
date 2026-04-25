"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

interface Props {
  billId: string;
  type: "impact_brief" | "sixty_second" | "debate";
  label: string;
  text: string;
  accentColor?: string;
}

export default function AudioPlayer({ billId, type, label, text, accentColor = "indigo" }: Props) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colorMap: Record<string, { btn: string; wave: string; bg: string }> = {
    indigo: {
      btn: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25",
      wave: "bg-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/25",
    },
    violet: {
      btn: "bg-violet-600 hover:bg-violet-500 shadow-violet-500/25",
      wave: "bg-violet-400",
      bg: "bg-violet-500/10 border-violet-500/25",
    },
    amber: {
      btn: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/25",
      wave: "bg-amber-400",
      bg: "bg-amber-500/10 border-amber-500/25",
    },
  };

  const colors = colorMap[accentColor] || colorMap.indigo;

  const handlePlay = async () => {
    if (audioRef.current && audioUrl) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billId, type, text }),
      });

      if (!res.ok) {
        let message = "Audio generation failed";
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Fall back to the generic message if the response isn't JSON.
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${colors.bg}`}>
      {/* Play button */}
      <button
        onClick={handlePlay}
        disabled={loading}
        className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.btn} text-white flex items-center justify-center transition-all shadow-lg disabled:opacity-60`}
        aria-label={playing ? "Pause" : "Play"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Label + wave viz */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-200 truncate">{label}</span>
        </div>

        {playing ? (
          <div className="flex items-end gap-0.5 mt-1.5 h-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${colors.wave} wave-bar`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {error || (audioUrl ? "Ready to play" : "Click to generate audio")}
          </p>
        )}
      </div>
    </div>
  );
}
