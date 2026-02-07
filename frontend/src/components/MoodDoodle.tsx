'use client';

import { useState, useRef } from 'react';
import { sentimentClient } from '@/lib/api';

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
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
        ✏️ Mood Doodle
      </h3>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Upload a sketch or doodle that expresses how you feel
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        /* Upload area */
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-all"
        >
          <span className="text-3xl">🎨</span>
          <span className="text-gray-500">Click to upload your doodle</span>
          <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
        </button>
      ) : (
        /* Preview and result */
        <div className="space-y-4">
          {/* Image preview */}
          <div className="relative">
            <img
              src={preview}
              alt="Your mood doodle"
              className="w-full h-40 object-contain rounded-lg bg-gray-100"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Analysis result */}
          {isUploading ? (
            <div className="text-center text-gray-500 animate-pulse">
              <span className="inline-block w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2"></span>
              Analyzing your expression...
            </div>
          ) : result ? (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">✨</span>
                <span className="font-semibold text-purple-700 capitalize">
                  {result.visual_emotion}
                </span>
                <span className="text-sm text-purple-500">
                  ({Math.round(result.emotional_intensity * 100)}% intensity)
                </span>
              </div>
              {result.interpretation && (
                <p className="text-sm text-purple-600 italic">
                  "{result.interpretation}"
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Privacy notice */}
      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Your image is analyzed and immediately discarded
      </p>
    </div>
  );
}
