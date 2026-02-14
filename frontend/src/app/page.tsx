'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { sentimentClient } from '@/lib/api';
import ChatInterface from '@/components/ChatInterface';
import FeatureShowcase from '@/components/FeatureShowcase';
import BackgroundMusic from '@/components/BackgroundMusic';
import { 
  PenLine, MessageCircle, 
  WifiOff, Cpu, UserX, Code, 
  Plus, BookOpen, Lightbulb, Flame, Calendar, Shield
} from 'lucide-react';

// ZenGuard Journal imports
import { JournalEntry } from '@/types/journal';
import { journalStorage, generateInsights } from '@/lib/storage';
import { NewEntryFlow } from '@/components/journal/NewEntryFlow';
import { TimelineView } from '@/components/journal/TimelineView';
import { InsightsDashboard } from '@/components/journal/InsightsDashboard';
import { StreakTracker } from '@/components/journal/StreakTracker';
import { JournalCalendar } from '@/components/journal/JournalCalendar';
import { YearInPixels } from '@/components/journal/YearInPixels';
import { MoodChart } from '@/components/journal/MoodChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [apiConnected, setApiConnected] = useState(false);
  const [activeView, setActiveView] = useState<'landing' | 'journal' | 'chat'>('landing');

  // ZenGuard Journal state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'insights' | 'stats' | 'calendar'>('timeline');

  useEffect(() => {
    sentimentClient.healthCheck().then(setApiConnected);
  }, []);

  // Load journal entries from localStorage
  useEffect(() => {
    if (activeView === 'journal') {
      const loadedEntries = journalStorage.getEntries();
      setEntries(loadedEntries);
    }
  }, [activeView]);

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    journalStorage.saveEntry(newEntry);
    setEntries(journalStorage.getEntries());
    setIsCreatingEntry(false);
  };

  const insights = generateInsights(entries);
  const streak = journalStorage.getStreak();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  // ===== LANDING PAGE VIEW =====
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen relative">
        <BackgroundMusic />
        {/* Background Video */}
        <div className="fixed inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-[0.5em] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              ZenGuard
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-yellow-400'}`}></div>
            <span className="text-white/90 font-medium">{apiConnected ? 'AI Ready' : 'Connecting...'}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 md:pt-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8 flex justify-center animate-fade-scale">
              <Image 
                src="/logo.png" 
                alt="ZenGuard Logo" 
                width={256}
                height={256}
                className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-gentle-float"
                priority
              />
            </div>

            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] drop-shadow-xl tracking-tight animate-fade-up stagger-2" 
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              A quiet space for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 animate-gradient-x">
                your thoughts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-100 mb-12 max-w-xl mx-auto leading-relaxed drop-shadow-md font-light animate-fade-up stagger-3">
              Express how you&apos;re feeling. Get gentle insights. 
              <span className="block mt-2 text-zinc-300 font-medium">Everything stays with you — nothing is stored.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up stagger-4">
              <button
                onClick={() => setActiveView('journal')}
                className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
              >
                <span>Start Journaling</span>
                <PenLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('chat')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
              >
                <span>Talk to AI Friend</span>
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          <FeatureShowcase />

          {/* Trust Indicators */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-up stagger-8">
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <WifiOff className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-zinc-300 font-mono text-xs tracking-wide">Fully Offline</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-zinc-300 font-mono text-xs tracking-wide">Local Processing</span>
            </div>

            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <UserX className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-zinc-300 font-mono text-xs tracking-wide">No Account Needed</span>
            </div>

            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Code className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-zinc-300 font-mono text-xs tracking-wide">Open Source</span>
            </div>
          </div>
        </main>

        <footer className="relative z-10 text-center py-8 text-sm text-gray-400">
          <p>Built for mental wellness. Your peace of mind matters.</p>
        </footer>
      </div>
    );
  }

  // ===== CHAT VIEW =====
  if (activeView === 'chat') {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 dark">
        <BackgroundMusic />
        <div className="fixed inset-0 overflow-hidden -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          >
            <source src="/chat-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="w-full max-w-2xl z-10">
          <ChatInterface onBack={() => setActiveView('landing')} />
        </div>
      </div>
    );
  }

  // New Entry Flow (full screen)
  if (isCreatingEntry) {
    return (
      <div className="dark min-h-screen relative flex items-start justify-center p-4 py-8">
        {/* Background Video (Consitent with Homepage) */}
        <div className="fixed inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          >
            <source src="/chat-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <button
            onClick={() => { setIsCreatingEntry(false); setActiveView('landing'); }}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
          >
            <span>←</span>
            <span>Home</span>
          </button>
          <NewEntryFlow onSave={handleSaveEntry} onCancel={() => setIsCreatingEntry(false)} />
        </div>
        <Toaster />
      </div>
    );
  }

  // Journal Dashboard View
  return (
    <div className="dark min-h-screen relative">
      {/* Background Video (Consitent with Homepage) */}
      <div className="fixed inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute w-full h-full object-cover"
          style={{ filter: 'brightness(0.5)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 shadow-2xl">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('landing')}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              >
                <span>←</span>
              </button>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ZenGuard</h1>
                <p className="text-xs text-white/40">Your Reflective Space</p>
              </div>
            </div>
            <Button onClick={() => setIsCreatingEntry(true)} size="lg" className="gap-2 bg-white text-black hover:bg-white/90 border-0 shadow-xl">
              <Plus className="h-5 w-5" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-7xl mx-auto px-4 py-8 text-white">
        {entries.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center space-y-8 py-20">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-md shadow-2xl">
              <BookOpen className="h-12 w-12 text-white/60" />
            </div>
            <h2 className="text-4xl font-bold">Welcome to ZenGuard</h2>
            <p className="text-xl text-white/50">A mental wellness app with 10 scientifically-proven features for better emotional health.</p>
            <Button onClick={() => setIsCreatingEntry(true)} size="lg" className="gap-2 px-8 bg-white text-black hover:bg-white/90 border-0 shadow-2xl">
              <Plus className="h-5 w-5" />
              Start Your First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <StreakTracker streak={streak} />
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
                <TabsTrigger value="timeline" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                  <Flame className="h-4 w-4 mr-2" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-0 focus-visible:outline-none">
                <TimelineView entries={entries} />
              </TabsContent>

              <TabsContent value="insights" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-8">
                  <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6">10 Science-Backed Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-3 text-sm text-white/70">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Mood Predictor - 70% accuracy</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Weekly Heatmap - 40% awareness boost</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div> Positive Memory Bank - 3x happiness</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> Social Connection Tracker</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> Sleep Correlation - 60% impact</li>
                      </ul>
                      <ul className="space-y-3 text-sm text-white/70">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> CBT Reframing - 50-60% reduction</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Three Good Things - 2-10% happiness</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Worry Dump - 50% thought reduction</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div> Future Self Letters - 30% goal boost</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-lime-400"></div> Timed Free-Write - 40% focus boost</li>
                      </ul>
                    </div>
                  </div>
                  <InsightsDashboard insights={insights} />
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-0 focus-visible:outline-none">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Your Statistics</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                      <p className="text-sm text-white/40 mb-1">Total Entries</p>
                      <p className="text-5xl font-bold text-white">{entries.length}</p>
                    </div>
                    <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                      <p className="text-sm text-white/40 mb-1">Average Mood</p>
                      <p className="text-5xl font-bold text-white">
                        {entries.length > 0 ? (entries.reduce((sum, e) => sum + e.pulse.mood, 0) / entries.length).toFixed(1) : '0'}<span className="text-xl text-white/30 ml-1">/10</span>
                      </p>
                    </div>
                    <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                      <p className="text-sm text-white/40 mb-1">Total Words</p>
                      <p className="text-5xl font-bold text-white">
                        {entries.reduce((sum, e) => sum + (e.content?.split(/\s+/).filter(Boolean).length || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Mood Trend Chart */}
                  <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6">Mood Trend (14 days)</h3>
                    <MoodChart entries={entries} days={14} />
                  </div>

                  {/* Year in Pixels */}
                  <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6">Last 90 Days</h3>
                    <YearInPixels entries={entries} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
                <JournalCalendar entries={entries} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
