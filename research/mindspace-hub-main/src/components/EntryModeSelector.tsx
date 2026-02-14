import { motion } from 'framer-motion';
import { EntryMode } from '@/lib/journal-store';
import { Zap, PenLine, Compass, Feather } from 'lucide-react';

interface EntryModeSelectorProps {
  onSelect: (mode: EntryMode) => void;
}

const modes: { mode: EntryMode; icon: typeof Zap; title: string; desc: string; time: string }[] = [
  { mode: 'quick', icon: Zap, title: 'Quick Log', desc: 'Just a mood & go', time: '5 sec' },
  { mode: 'micro', icon: PenLine, title: 'Micro Journal', desc: 'One thought, one moment', time: '1 min' },
  { mode: 'guided', icon: Compass, title: 'Guided Reflection', desc: 'Gentle questions to explore', time: '3–5 min' },
  { mode: 'freewrite', icon: Feather, title: 'Free Write', desc: 'Open canvas, no rules', time: '∞' },
];

export function EntryModeSelector({ onSelect }: EntryModeSelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <p className="text-sm text-muted-foreground text-center mb-2">
        How deep do you want to go?
      </p>
      {modes.map((m, i) => (
        <motion.button
          key={m.mode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          onClick={() => onSelect(m.mode)}
          className="flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-200 hover:bg-muted/60 hover:shadow-soft group cursor-pointer border border-transparent hover:border-border"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <m.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">{m.title}</div>
            <div className="text-sm text-muted-foreground">{m.desc}</div>
          </div>
          <span className="text-xs text-muted-foreground/70 shrink-0">{m.time}</span>
        </motion.button>
      ))}
    </div>
  );
}
