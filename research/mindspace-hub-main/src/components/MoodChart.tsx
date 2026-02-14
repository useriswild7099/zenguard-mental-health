import { getMoodData, moodConfig, MoodLevel } from '@/lib/journal-store';
import { motion } from 'framer-motion';

export function MoodChart() {
  const data = getMoodData(14);

  if (data.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Start logging to see your mood trends
      </div>
    );
  }

  const maxVal = 5;

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d, i) => {
          const height = (d.value / maxVal) * 100;
          const config = moodConfig[d.mood];
          return (
            <motion.div
              key={d.date}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={`flex-1 rounded-t-md bg-${config.color} opacity-80 hover:opacity-100 transition-opacity cursor-default min-w-[8px]`}
              title={`${d.date}: ${config.label}`}
            />
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map(d => (
          <div key={d.date} className="flex-1 text-center">
            <span className="text-[8px] text-muted-foreground/60">
              {new Date(d.date).getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
