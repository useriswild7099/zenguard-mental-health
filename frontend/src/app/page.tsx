'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { sentimentClient, AnalysisResponse, QuickCheckResponse } from '@/lib/api';
import { prepareText, generateSessionId } from '@/lib/privacy';
import JournalInput from '@/components/JournalInput';
import MoodSeed from '@/components/MoodSeed';
import InterventionCards from '@/components/InterventionCards';
import BreathingExercise from '@/components/BreathingExercise';
import GroundingExercise from '@/components/GroundingExercise';
import MemoryBox from '@/components/MemoryBox';
import MoodDoodle from '@/components/MoodDoodle';
import ChatInterface from '@/components/ChatInterface';
import EnhancedJournal from '@/components/EnhancedJournal';
import FeatureShowcase from '@/components/FeatureShowcase';
import BackgroundMusic from '@/components/BackgroundMusic';
import {
  Shield, PenLine, MessageCircle, Lock, Brain, Sprout,
  WifiOff, Cpu, UserX, Code, Sparkles, Activity, CheckCircle2
} from 'lucide-react';

const JOURNAL_PROMPTS = [
  "How are you feeling right now?",
  "What's on your mind today?",
  "Take a moment to express yourself freely...",
  "This is your safe space. Share what you need to.",
  "No judgment here. What would you like to say?",
];

export default function Home() {
  const [sessionId] = useState(() => generateSessionId());
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [quickCheck, setQuickCheck] = useState<QuickCheckResponse | null>(null);
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);
  const [showDoodle, setShowDoodle] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [activeView, setActiveView] = useState<'landing' | 'journal' | 'chat'>('landing');
  const quickCheckTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => {
        const currentIndex = JOURNAL_PROMPTS.indexOf(prev);
        return JOURNAL_PROMPTS[(currentIndex + 1) % JOURNAL_PROMPTS.length];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sentimentClient.healthCheck().then(setApiConnected);
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setJournalText(text);
    if (quickCheckTimer.current) {
      clearTimeout(quickCheckTimer.current);
    }
    if (text.length > 20) {
      quickCheckTimer.current = setTimeout(async () => {
        try {
          const { scrubbed } = prepareText(text);
          const result = await sentimentClient.quickCheck(scrubbed);
          setQuickCheck(result);
        } catch (error) {
          console.error('Quick check failed:', error);
        }
      }, 1000);
    } else {
      setQuickCheck(null);
    }
  }, []);

  const handleSubmit = async () => {
    if (journalText.trim().length < 10) return;
    setIsAnalyzing(true);
    try {
      const { scrubbed, piiDetected } = prepareText(journalText);
      // PII Detected: scrubbed before transmission

      const result = await sentimentClient.analyzeEntry(scrubbed, sessionId);
      setAnalysisResult(result);
      setQuickCheck(null);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInterventionSelect = (type: string) => {
    setActiveIntervention(type);
  };

  const closeIntervention = () => {
    setActiveIntervention(null);
  };

  const handleNewEntry = () => {
    setJournalText('');
    setAnalysisResult(null);
    setQuickCheck(null);
    setActiveIntervention(null);
  };

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  // Landing Page View
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
            preload="auto"
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
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
            {/* Breathing indicator */}
            <div className="mb-8 flex justify-center animate-fade-scale">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300/20 to-blue-300/20 flex items-center justify-center animate-gentle-float backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/40 to-blue-400/40 flex items-center justify-center animate-soft-glow">
                  <Sparkles className="w-6 h-6 text-white/80" />
                </div>
              </div>
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
              Express how you're feeling. Get gentle insights.
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





          {/* New Feature Showcase */}
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

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 text-sm text-gray-400">
          <p>Built for mental wellness. Your peace of mind matters.</p>
        </footer>
      </div>
    );
  }

  // Chat View
  if (activeView === 'chat') {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8">
        <BackgroundMusic />
        {/* Background Video */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          >
            <source src="/chat-bg.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="w-full max-w-2xl z-10">
          <ChatInterface onBack={() => setActiveView('landing')} />
        </div>
      </div>
    );
  }

  // Journal View
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8">
      <BackgroundMusic />
      {/* Background Video (Reused) */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute w-full h-full object-cover"
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setActiveView('landing')}
        className="fixed top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-20"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      {/* Header */}
      <header className="text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Journal Entry
        </h1>
        <p className="text-zinc-200">Express yourself freely</p>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-yellow-400'}`}></span>
          <span className="text-zinc-300 font-mono text-xs">
            {apiConnected ? 'AI Ready' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl relative z-10">
        {!analysisResult ? (
          <div className="glass-card p-6 md:p-8">
            <EnhancedJournal
              onSubmit={handleSubmit}
              onAnalyze={handleSubmit}
              isAnalyzing={isAnalyzing}
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDoodle(!showDoodle)}
                className="text-sm text-zinc-400 hover:text-zinc-200 underline transition-colors"
              >
                {showDoodle ? 'Hide mood doodle' : 'Or express with a mood doodle ✨'}
              </button>
            </div>

            {showDoodle && (
              <div className="mt-4">
                <MoodDoodle sessionId={sessionId} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card p-6 md:p-8 text-center">
              <MoodSeed
                stage={analysisResult.mood_seed_stage}
                color={analysisResult.mood_color}
                wellnessScore={analysisResult.wellness_score}
                confidence={analysisResult.confidence}
              />

              <p className="mt-6 text-lg text-zinc-200 italic">
                "{analysisResult.supportive_message}"
              </p>

              {analysisResult.therapeutic_insight && (
                <div className="mt-6 p-5 bg-white/5 rounded-xl text-left border border-white/10">
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Therapeutic Insight</h4>
                  <p className="text-zinc-200 leading-relaxed">{analysisResult.therapeutic_insight}</p>
                </div>
              )}

              {analysisResult.key_patterns && analysisResult.key_patterns.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {analysisResult.key_patterns.map((pattern, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800/50 rounded-full text-xs text-zinc-400 border border-zinc-700/50">
                      {pattern}
                    </span>
                  ))}
                </div>
              )}

              {analysisResult.masking.detected && (
                <div className="mt-4 p-4 bg-purple-500/20 rounded-lg text-sm text-purple-200 border border-purple-400/30">
                  <p>💜 It's okay to not be okay. You don't have to hide how you truly feel.</p>
                </div>
              )}
            </div>

            {analysisResult.recommended_interventions.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Suggested self-care
                </h3>
                <InterventionCards
                  interventions={analysisResult.recommended_interventions}
                  onSelect={handleInterventionSelect}
                />
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button onClick={handleNewEntry} className="btn-zen btn-zen-primary">
                Write another entry
              </button>
              <button onClick={() => setActiveView('landing')} className="btn-zen btn-zen-secondary">
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Intervention Modals */}
      {activeIntervention === 'breathing' && (
        <BreathingExercise onClose={closeIntervention} />
      )}
      {activeIntervention === 'grounding' && (
        <GroundingExercise onClose={closeIntervention} />
      )}
      {activeIntervention === 'memory_box' && (
        <MemoryBox onClose={closeIntervention} />
      )}

      {/* Privacy Footer */}
      <div className="mt-8 text-center text-sm text-zinc-400">
        <p>🔒 Your words stay with you. Analysis happens, nothing is stored.</p>
      </div>
    </div>
  );
}
