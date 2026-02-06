'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Flame, Download, Clock, Zap, Moon, Volume2, VolumeX } from 'lucide-react';
import EmotionPicker, { Emotion, EMOTION_PROMPTS, getTimeBasedPrompt } from './EmotionPicker';
import { BurnAnimation, ExportOptions, EphemeralBadge, EndOfSessionRitual, TimerDisplay } from './JournalFeatures';
import VoiceInput from './VoiceInput';

// Journal mode types
type JournalMode = 'free' | 'timed' | 'void';

interface EnhancedJournalProps {
  onSubmit: (text: string) => void;
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function EnhancedJournal({ onSubmit, onAnalyze, isAnalyzing }: EnhancedJournalProps) {
  // Core state
  const [text, setText] = useState('');
  const [mode, setMode] = useState<JournalMode>('free');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(getTimeBasedPrompt());

  // Feature states
  const [showBurn, setShowBurn] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showEndRitual, setShowEndRitual] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [releaseEffect, setReleaseEffect] = useState<'burn' | 'ocean' | 'space'>('burn');

  // Timed mode
  const [timedDuration, setTimedDuration] = useState(300); // 5 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Void mode
  const [isVoidMode, setIsVoidMode] = useState(false);

  // Ambient sound
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typing speed tracking
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const lastKeyTime = useRef(Date.now());
  const keyCount = useRef(0);

  // Release affirmation
  const [affirmation, setAffirmation] = useState<string>("");

  // Update prompt based on emotion
  useEffect(() => {
    if (selectedEmotion) {
      const prompts = EMOTION_PROMPTS[selectedEmotion.promptTone];
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }
  }, [selectedEmotion]);

  // Timer logic
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Track typing speed
  const handleTextChange = (newText: string) => {
    setText(newText);

    const now = Date.now();
    const timeDiff = now - lastKeyTime.current;
    keyCount.current++;

    if (keyCount.current % 10 === 0) {
      if (timeDiff < 100) setTypingSpeed('fast');
      else if (timeDiff > 500) setTypingSpeed('slow');
      else setTypingSpeed('normal');
    }

    lastKeyTime.current = now;
  };

  // Burn effect
  const handleBurn = useCallback(() => {
    setIsBurning(true);
    setTimeout(() => {
      setText('');
      setIsBurning(false);
      setShowEndRitual(true);
    }, 2500);
  }, []);

  // Start timed session
  const startTimedSession = (seconds: number) => {
    setTimedDuration(seconds);
    setTimeRemaining(seconds);
    setIsTimerActive(true);
    setMode('timed');
  };

  // Toggle void mode
  const toggleVoidMode = () => {
    setIsVoidMode(!isVoidMode);
    setMode(isVoidMode ? 'free' : 'void');
  };

  // Ambient sound logic
  const toggleAmbientSound = (sound: string) => {
    if (ambientSound === sound) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setAmbientSound(null);
    } else {
      const sounds: Record<string, string> = {
        rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder for real rain sound
        forest: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        waves: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      };

      if (audioRef.current) {
        audioRef.current.src = sounds[sound];
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setAmbientSound(sound);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      {/* Release Animations */}
      {isBurning && releaseEffect === 'burn' && <BurnAnimation onComplete={() => setIsBurning(false)} />}
      {isBurning && releaseEffect === 'ocean' && (
        <div
          className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm animate-ripple pointer-events-none"
          onAnimationEnd={() => setIsBurning(false)}
        />
      )}

      {/* Export Modal */}
      {showExport && <ExportOptions text={text} onClose={() => setShowExport(false)} />}

      {/* End of Session Ritual */}
      {showEndRitual && <EndOfSessionRitual onClose={() => setShowEndRitual(false)} affirmation={affirmation} />}

      <div className={`space-y-4 ${isVoidMode ? 'void-mode' : ''}`}>
        {/* Ephemeral Badge */}
        {!isVoidMode && (
          <div className="text-center">
            <EphemeralBadge />
          </div>
        )}

        {/* Mode Selector - hidden in void mode */}
        {!isVoidMode && (
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setMode('free')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${mode === 'free'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
            >
              Free Write
            </button>
            <button
              onClick={() => startTimedSession(300)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${mode === 'timed'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
            >
              <Clock className="w-4 h-4" />
              5 Min Session
            </button>
            <button
              onClick={toggleVoidMode}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${mode === 'void'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
            >
              <Moon className="w-4 h-4" />
              Void Mode
            </button>
          </div>
        )}

        {/* Emotion Picker - hidden in void mode */}
        {!isVoidMode && mode === 'free' && (
          <EmotionPicker
            onSelect={setSelectedEmotion}
            selectedEmotion={selectedEmotion}
          />
        )}

        {/* Timer Display for timed mode */}
        {mode === 'timed' && isTimerActive && (
          <TimerDisplay seconds={timeRemaining} totalSeconds={timedDuration} />
        )}

        {/* Dynamic prompt */}
        {!isVoidMode && (
          <p className="text-center text-zinc-400 text-sm italic mb-2">
            {typingSpeed === 'fast' ? 'Let it all out...' : currentPrompt}
          </p>
        )}

        {/* Main Textarea */}
        <div className={`relative ${isBurning ? 'animate-burn-text' : ''}`}>
          {/* Space Starfield Visual (Void Mode) */}
          {isVoidMode && (
            <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
              <div className="stars-sm" />
              <div className="stars-md" />
              <div className="stars-lg" />
            </div>
          )}

          {/* Black Hole Visual (Void Mode) */}
          {isVoidMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
              <img
                src="/black-hole.gif"
                alt="Black Hole"
                className="w-[500px] h-[500px] object-contain opacity-40 mix-blend-screen"
              />
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={isVoidMode ? '' : currentPrompt}
            disabled={isAnalyzing}
            className={`journal-input ${isVoidMode
              ? 'bg-transparent border-none focus:ring-0 text-white/80'
              : ''
              } ${selectedEmotion ? `bg-gradient-to-br ${selectedEmotion.gradient}` : ''}`}
            style={{
              minHeight: isVoidMode ? '60vh' : '200px',
              fontWeight: typingSpeed === 'fast' ? '400' : '300',
              position: 'relative',
              zIndex: 10
            }}
          />
        </div>

        {/* Footer Actions - hidden in void mode */}
        {!isVoidMode && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {wordCount} words
            </span>

            <div className="flex items-center gap-2">
              {/* Voice Input */}
              <VoiceInput
                onTranscript={(newText) => setText(prev => prev + (prev ? ' ' : '') + newText)}
                onInterimTranscript={(liveText) => setText(liveText)}
                disabled={isAnalyzing}
              />

              {/* Ambient Sound Toggle */}
              <button
                onClick={() => toggleAmbientSound('rain')}
                className={`p-2 rounded-lg transition-colors ${ambientSound ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                title="Ambient sounds"
              >
                {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Export */}
              <button
                onClick={() => setShowExport(true)}
                disabled={!text.trim()}
                className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Go Button (Random Release) */}
              <button
                onClick={async () => {
                  const currentText = text; // Capture text
                  const effects = ['space', 'ocean', 'burn'];
                  const randomEffect = effects[Math.floor(Math.random() * effects.length)];

                  // Trigger background affirmation check
                  import('@/lib/api').then(({ sentimentClient }) => {
                    sentimentClient.getReleaseAffirmation(currentText).then(setAffirmation);
                  });

                  if (randomEffect === 'space') {
                    setReleaseEffect('space');
                    setIsVoidMode(true);
                    setTimeout(() => {
                      setIsBurning(true); // Triggers cleanup via effect logic if needed
                      handleBurn(); // This triggers the text clear
                      setIsVoidMode(false);
                      setAffirmation(""); // Reset
                    }, 2500);
                  } else if (randomEffect === 'ocean') {
                    setReleaseEffect('ocean');
                    handleBurn();
                  } else {
                    setReleaseEffect('burn');
                    handleBurn();
                  }
                }}
                disabled={!text.trim()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
              >
                <span className="text-xl">🚀</span>
                Go
              </button>

              {/* Analyze */}
              <button
                onClick={() => onAnalyze(text)}
                disabled={!text.trim() || isAnalyzing || (mode === 'timed' && isTimerActive)}
                className="px-4 py-2 rounded-lg bg-purple-500/30 text-purple-200 hover:bg-purple-500/40 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Get Insights'}
              </button>
            </div>
          </div>
        )}

        {/* Void Mode Exit */}
        {isVoidMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <button
              onClick={() => {
                if (text.trim()) {
                  handleBurn();
                }
                toggleVoidMode();
              }}
              className="px-6 py-3 bg-white/5 text-zinc-400 hover:text-white rounded-full transition-colors"
            >
              {text.trim() ? 'Let it go' : 'Exit void'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
