import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodChart } from '@/components/MoodChart';
import { YearInPixels } from '@/components/YearInPixels';
import { getEntries, moodConfig, moodToValue, MoodLevel } from '@/lib/journal-store';

export default function Insights() {
  const [avgMood, setAvgMood] = useState<string>('');
  const [totalEntries, setTotalEntries] = useState(0);
  const [topTags, setTopTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    const entries = getEntries();
    setTotalEntries(entries.length);

    if (entries.length > 0) {
      const avg = entries.reduce((sum, e) => sum + moodToValue[e.mood], 0) / entries.length;
      const closestMood = (Object.entries(moodToValue) as [MoodLevel, number][])
        .reduce((prev, [mood, val]) => Math.abs(val - avg) < Math.abs(prev[1] - avg) ? [mood, val] : prev);
      setAvgMood(moodConfig[closestMood[0] as MoodLevel].label);

      // Top tags
      const tagCounts: Record<string, number> = {};
      entries.forEach(e => e.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
      const sorted = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));
      setTopTags(sorted);
    }
  }, []);

  return (
    <div className="min-h-screen gradient-calm pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-semibold text-foreground mb-1">Insights</h1>
          <p className="text-muted-foreground text-sm mb-8">Patterns in your inner world</p>
        </motion.div>

        {totalEntries === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-4xl mb-4">🔮</p>
            <p className="text-muted-foreground text-sm">
              Start journaling to discover your patterns
            </p>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="p-4 rounded-2xl bg-card shadow-soft text-center">
                <div className="text-2xl font-display font-semibold text-foreground">{totalEntries}</div>
                <div className="text-xs text-muted-foreground mt-1">Total entries</div>
              </div>
              <div className="p-4 rounded-2xl bg-card shadow-soft text-center">
                <div className="text-2xl font-display font-semibold text-foreground">{avgMood}</div>
                <div className="text-xs text-muted-foreground mt-1">Average mood</div>
              </div>
            </motion.div>

            {/* Mood trend */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-card shadow-soft mb-6"
            >
              <h3 className="text-sm font-medium text-foreground mb-4">Mood trend</h3>
              <MoodChart />
            </motion.div>

            {/* Year in pixels */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-card shadow-soft mb-6"
            >
              <h3 className="text-sm font-medium text-foreground mb-4">Last 90 days</h3>
              <YearInPixels />
            </motion.div>

            {/* Top tags */}
            {topTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl bg-card shadow-soft"
              >
                <h3 className="text-sm font-medium text-foreground mb-3">Common themes</h3>
                <div className="flex flex-wrap gap-2">
                  {topTags.map(({ tag, count }) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {tag} <span className="text-primary/60">({count})</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
