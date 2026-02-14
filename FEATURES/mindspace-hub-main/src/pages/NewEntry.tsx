import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoodPicker } from '@/components/MoodPicker';
import { EntryModeSelector } from '@/components/EntryModeSelector';
import { JournalEditor } from '@/components/JournalEditor';
import { MoodLevel, EntryMode, saveEntry } from '@/lib/journal-store';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

type Step = 'mood' | 'mode' | 'write' | 'done';

export default function NewEntry() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('mood');
  const [mood, setMood] = useState<MoodLevel | undefined>();
  const [mode, setMode] = useState<EntryMode | undefined>();

  const handleMoodSelect = (m: MoodLevel) => {
    setMood(m);
    setTimeout(() => setStep('mode'), 300);
  };

  const handleModeSelect = (m: EntryMode) => {
    setMode(m);
    if (m === 'quick') {
      // Quick log: save immediately with just mood
      setStep('write');
    } else {
      setStep('write');
    }
  };

  const handleSave = (note: string, tags: string[]) => {
    if (!mood || !mode) return;
    saveEntry({
      date: new Date().toISOString().split('T')[0],
      mood,
      mode,
      note,
      tags,
    });
    setStep('done');
  };

  const handleDone = () => {
    toast('Entry saved', {
      description: 'Your mind feels a little lighter now ✨',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-calm pb-24">
      <div className="max-w-lg mx-auto px-5 pt-8">
        {/* Back button */}
        {step !== 'done' && (
          <button
            onClick={() => {
              if (step === 'mood') navigate('/');
              else if (step === 'mode') setStep('mood');
              else if (step === 'write') setStep('mode');
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-12"
            >
              <MoodPicker selected={mood} onSelect={handleMoodSelect} />
            </motion.div>
          )}

          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EntryModeSelector onSelect={handleModeSelect} />
            </motion.div>
          )}

          {step === 'write' && mood && mode && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JournalEditor
                mode={mode}
                mood={mood}
                onSave={handleSave}
                onBack={() => setStep('mode')}
              />
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center pt-24 gap-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="text-6xl"
              >
                🌿
              </motion.div>
              <div className="text-center">
                <h2 className="font-display text-2xl font-medium text-foreground mb-2">
                  Moment captured
                </h2>
                <p className="text-muted-foreground text-sm">
                  Your mind feels a little lighter now
                </p>
              </div>
              <button
                onClick={handleDone}
                className="mt-4 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
