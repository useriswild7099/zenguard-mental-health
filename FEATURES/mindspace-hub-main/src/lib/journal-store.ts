export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export type EntryMode = 'quick' | 'micro' | 'guided' | 'freewrite';

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  mode: EntryMode;
  note: string;
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = 'mindspace_entries';

export const moodConfig: Record<MoodLevel, { emoji: string; label: string; color: string }> = {
  great: { emoji: '✨', label: 'Wonderful', color: 'mood-great' },
  good: { emoji: '😊', label: 'Good', color: 'mood-good' },
  okay: { emoji: '😐', label: 'Okay', color: 'mood-okay' },
  low: { emoji: '😔', label: 'Low', color: 'mood-low' },
  bad: { emoji: '🌧️', label: 'Rough', color: 'mood-bad' },
};

export const moodToValue: Record<MoodLevel, number> = {
  great: 5, good: 4, okay: 3, low: 2, bad: 1,
};

export function getEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): JournalEntry {
  const entries = getEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return newEntry;
}

export function getStreak(): number {
  const entries = getEntries();
  if (entries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasEntry = entries.some(e => e.date === dateStr);
    if (hasEntry) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function getTodayEntry(): JournalEntry | undefined {
  const today = new Date().toISOString().split('T')[0];
  return getEntries().find(e => e.date === today);
}

export function getRecentEntries(count: number = 7): JournalEntry[] {
  return getEntries().slice(0, count);
}

export function getMoodData(days: number = 30): { date: string; value: number; mood: MoodLevel }[] {
  const entries = getEntries();
  const result: { date: string; value: number; mood: MoodLevel }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === dateStr);
    if (entry) {
      result.push({ date: dateStr, value: moodToValue[entry.mood], mood: entry.mood });
    }
  }
  return result;
}
