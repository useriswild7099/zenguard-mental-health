'use client';

import { useState, useRef } from 'react';
import { sentimentClient } from '@/lib/api';

import MoodCanvas from './MoodCanvas';

interface MoodDoodleProps {
  sessionId: string;
}

export default function MoodDoodle({ sessionId }: MoodDoodleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    visual_emotion: string;
    emotional_intensity: number;
    interpretation: string;
  } | null>(null);
  const [isDoodling, setIsDoodling] = useState(true);

  const handleAnalyze = async (blob: Blob) => {
    setIsUploading(true);
    setIsDoodling(false);

    // Create a File from the Blob for the API
    const file = new File([blob], 'doodle.png', { type: 'image/png' });

    try {
      const response = await sentimentClient.analyzeVisual(file);
      setResult({
        visual_emotion: response.visual_emotion,
        emotional_intensity: response.emotional_intensity,
        interpretation: response.interpretation,
      });
    } catch (error) {
      console.error('Visual analysis failed:', error);
      setResult(null);
      setIsDoodling(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsDoodling(true);
  };

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            ✏️ Mood Doodle v2
          </h3>
          <p className="text-sm text-zinc-400">
            Sketch your feelings for AI interpretation
          </p>
        </div>
        {!isDoodling && result && (
          <button
            onClick={handleReset}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
          >
            New Doodle
          </button>
        )}
      </div>

      <div className="relative">
        {isDoodling ? (
          <MoodCanvas onAnalyze={handleAnalyze} isAnalyzing={isUploading} />
        ) : (
          <div className="space-y-6 animate-fade-up">
            {isUploading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-zinc-400">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <p className="animate-pulse">Decoding your artistic expression...</p>
              </div>
            ) : result ? (
              <div className="p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white capitalize">
                      {result.visual_emotion} Detected
                    </h4>
                    <p className="text-sm text-purple-300">
                      {Math.round(result.emotional_intensity * 100)}% emotional intensity
                    </p>
                  </div>
                </div>

                <div className="relative p-4 bg-black/20 rounded-xl italic text-zinc-300 border-l-4 border-purple-500">
                  "{result.interpretation}"
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl text-sm text-zinc-400">
                  <p><b>AI Insight:</b> Your use of strokes and space suggests a {result.visual_emotion} state. This is a safe space to explore that further.</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-zinc-500">
                Something went wrong. Let's try again.
                <button onClick={handleReset} className="block mx-auto mt-4 text-purple-400 underline">Restart</button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] text-zinc-600 text-center mt-6 uppercase tracking-widest font-mono">
        🔒 Private Processing • Nothing Saved
      </p>
    </div>
  );
}
