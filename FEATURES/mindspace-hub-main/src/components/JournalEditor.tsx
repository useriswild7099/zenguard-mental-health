import { useState } from 'react';
import { motion } from 'framer-motion';
import { EntryMode, MoodLevel } from '@/lib/journal-store';
import { Textarea } from '@/components/ui/textarea';

interface JournalEditorProps {
  mode: EntryMode;
  mood: MoodLevel;
  onSave: (note: string, tags: string[]) => void;
  onBack: () => void;
}

const guidedQuestions = [
  "What's on your mind right now?",
  "What's one thing that stood out today?",
  "Is there something you're grateful for?",
  "What would make tomorrow better?",
];

const tagSuggestions = ['work', 'relationships', 'health', 'growth', 'rest', 'creativity', 'anxiety', 'joy'];

export function JournalEditor({ mode, mood, onSave, onBack }: JournalEditorProps) {
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    onSave(note, tags);
  };

  const canSave = mode === 'quick' || note.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 w-full max-w-lg mx-auto"
    >
      {mode === 'quick' && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">Your mood has been noted. Want to add anything?</p>
          <Textarea
            placeholder="Optional: a quick thought..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="min-h-[80px] resize-none bg-card border-border/50 focus:border-primary/40 rounded-xl text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      )}

      {mode === 'micro' && (
        <div>
          <p className="text-muted-foreground text-sm mb-3 text-center">Capture one thought</p>
          <Textarea
            autoFocus
            placeholder="What's in your mind..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="min-h-[100px] resize-none bg-card border-border/50 focus:border-primary/40 rounded-xl text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      )}

      {mode === 'guided' && (
        <div>
          <motion.p
            key={questionIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-lg text-foreground mb-3 text-center"
          >
            {guidedQuestions[questionIndex]}
          </motion.p>
          <Textarea
            autoFocus
            placeholder="Take your time..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="min-h-[140px] resize-none bg-card border-border/50 focus:border-primary/40 rounded-xl text-foreground placeholder:text-muted-foreground/50"
          />
          <div className="flex gap-2 mt-3 justify-center">
            {guidedQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuestionIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === questionIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      )}

      {mode === 'freewrite' && (
        <div>
          <p className="text-muted-foreground text-sm mb-3 text-center italic">
            No rules. No structure. Just write.
          </p>
          <Textarea
            autoFocus
            placeholder=""
            value={note}
            onChange={e => setNote(e.target.value)}
            className="min-h-[220px] resize-none bg-card border-border/50 focus:border-primary/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 text-base leading-relaxed"
          />
        </div>
      )}

      {/* Tags */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Tags (optional)</p>
        <div className="flex flex-wrap gap-2">
          {tagSuggestions.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                tags.includes(tag)
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {mode === 'quick' ? 'Save Mood' : 'Save Entry'}
        </button>
      </div>
    </motion.div>
  );
}
