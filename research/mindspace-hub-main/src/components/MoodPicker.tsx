import { motion } from 'framer-motion';
import { MoodLevel, moodConfig } from '@/lib/journal-store';

interface MoodPickerProps {
  selected?: MoodLevel;
  onSelect: (mood: MoodLevel) => void;
}

const moods: MoodLevel[] = ['bad', 'low', 'okay', 'good', 'great'];

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-2xl font-medium text-foreground">
        How are you feeling?
      </h2>
      <div className="flex items-center gap-3 sm:gap-5">
        {moods.map((mood, i) => {
          const config = moodConfig[mood];
          const isSelected = selected === mood;
          return (
            <motion.button
              key={mood}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => onSelect(mood)}
              className={`
                flex flex-col items-center gap-2 rounded-2xl px-3 py-4 sm:px-5 sm:py-5 transition-all duration-300 cursor-pointer
                ${isSelected
                  ? 'bg-primary/15 shadow-glow scale-110 ring-2 ring-primary/30'
                  : 'hover:bg-muted/60 hover:scale-105'
                }
              `}
            >
              <span className={`text-3xl sm:text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                {config.emoji}
              </span>
              <span className={`text-xs font-medium tracking-wide ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {config.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
