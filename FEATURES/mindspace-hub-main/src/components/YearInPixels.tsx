import { getEntries, moodConfig, MoodLevel } from '@/lib/journal-store';
import { motion } from 'framer-motion';

export function YearInPixels() {
  const entries = getEntries();

  // Generate last 90 days
  const days: { date: string; mood?: MoodLevel }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === dateStr);
    days.push({ date: dateStr, mood: entry?.mood });
  }

  const moodColorMap: Record<MoodLevel, string> = {
    great: 'bg-mood-great',
    good: 'bg-mood-good',
    okay: 'bg-mood-okay',
    low: 'bg-mood-low',
    bad: 'bg-mood-bad',
  };

  return (
    <div>
      <div className="grid grid-cols-10 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.008, duration: 0.3 }}
            className={`aspect-square rounded-sm ${
              day.mood ? moodColorMap[day.mood] : 'bg-muted/40'
            } hover:ring-1 hover:ring-primary/30 transition-all cursor-default`}
            title={`${day.date}${day.mood ? ': ' + moodConfig[day.mood].label : ''}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 justify-center">
        {(Object.entries(moodConfig) as [MoodLevel, typeof moodConfig.great][]).map(([mood, config]) => (
          <div key={mood} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${moodColorMap[mood]}`} />
            <span className="text-[10px] text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
