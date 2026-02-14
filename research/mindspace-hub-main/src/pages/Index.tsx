import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRecentEntries, getStreak, getTodayEntry, moodConfig, JournalEntry } from '@/lib/journal-store';
import { MoodChart } from '@/components/MoodChart';
import { useNavigate } from 'react-router-dom';
import { Plus, Flame } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | undefined>();

  useEffect(() => {
    setEntries(getRecentEntries(5));
    setStreak(getStreak());
    setTodayEntry(getTodayEntry());
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen gradient-calm pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-semibold text-foreground mb-1">
            {greeting()}
          </h1>
          <p className="text-muted-foreground text-sm">
            {todayEntry
              ? `You logged feeling ${moodConfig[todayEntry.mood].label.toLowerCase()} today`
              : 'How are you today?'
            }
          </p>
        </motion.div>

        {/* Quick action */}
        {!todayEntry && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/new')}
            className="w-full mb-6 p-5 rounded-2xl gradient-warm border border-primary/10 flex items-center gap-4 hover:shadow-glow transition-all group cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Check in with yourself</div>
              <div className="text-sm text-muted-foreground">It takes just a moment</div>
            </div>
          </motion.button>
        )}

        {/* Streak */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-card shadow-soft"
          >
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{streak} day streak</span>
            <span className="text-xs text-muted-foreground ml-1">Keep going gently</span>
          </motion.div>
        )}

        {/* Mood chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-5 rounded-2xl bg-card shadow-soft"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Recent mood</h3>
          <MoodChart />
        </motion.div>

        {/* Recent entries */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Recent entries</h3>
            <div className="flex flex-col gap-2">
              {entries.map((entry, i) => {
                const config = moodConfig[entry.mood];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="p-4 rounded-xl bg-card shadow-soft flex items-start gap-3"
                  >
                    <span className="text-xl mt-0.5">{config.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-muted-foreground/60">•</span>
                        <span className="text-xs text-muted-foreground capitalize">{entry.mode}</span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-foreground/80 line-clamp-2">{entry.note}</p>
                      )}
                      {entry.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {entry.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {entries.length === 0 && todayEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-sm">Your journey starts here ✨</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
