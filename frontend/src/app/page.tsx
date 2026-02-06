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
      if (piiDetected) {
        console.log('[Privacy] PII detected and scrubbed before transmission');
      }
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

  // Landing Page View
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen relative">
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
              <span className="text-white text-lg">🧘</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              ZenGuard
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            <span className="text-white/80">{apiConnected ? 'AI Ready' : 'Connecting...'}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 md:pt-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Breathing indicator */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300/40 to-blue-300/40 flex items-center justify-center animate-breathe">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              A quiet space for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                your thoughts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-100 mb-12 max-w-xl mx-auto leading-relaxed drop-shadow-md">
              Express how you're feeling. Get gentle insights. 
              <span className="block mt-2 text-zinc-300">Everything stays with you — nothing is stored.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setActiveView('journal')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium text-lg shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center gap-3">
                  <span>Start Journaling</span>
                  <span className="group-hover:translate-x-1 transition-transform">✍️</span>
                </span>
              </button>

              <button
                onClick={() => setActiveView('chat')}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-medium text-lg border border-gray-200 hover:bg-white hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center gap-3">
                  <span>Talk to AI Friend</span>
                  <span>💬</span>
                </span>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Private by Design</h3>
              <p className="text-sm text-gray-500">Your words are scrubbed of personal info before processing. Nothing is ever stored.</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">AI That Listens</h3>
              <p className="text-sm text-gray-500">Powered by local AI. Understands your emotions without judgment or data collection.</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Gentle Guidance</h3>
              <p className="text-sm text-gray-500">Breathing exercises, grounding techniques, and self-care suggestions when you need them.</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Fully Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% Local Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Open Source</span>
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <ChatInterface onBack={() => setActiveView('landing')} />
        </div>
      </div>
    );
  }

  // Journal View
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => setActiveView('landing')}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Journal Entry
        </h1>
        <p className="text-gray-500">Express yourself freely</p>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
          <span className="text-gray-400">
            {apiConnected ? 'AI Ready' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl">
        {!analysisResult ? (
          <div className="glass rounded-2xl p-6 md:p-8 shadow-lg">
            <JournalInput
              value={journalText}
              onChange={handleTextChange}
              onSubmit={handleSubmit}
              placeholder={currentPrompt}
              isAnalyzing={isAnalyzing}
              quickCheck={quickCheck}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDoodle(!showDoodle)}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
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
            <div className="glass rounded-2xl p-6 md:p-8 shadow-lg text-center">
              <MoodSeed
                stage={analysisResult.mood_seed_stage}
                color={analysisResult.mood_color}
                wellnessScore={analysisResult.wellness_score}
                confidence={analysisResult.confidence}
              />
              
              <p className="mt-6 text-lg text-gray-600 italic">
                "{analysisResult.supportive_message}"
              </p>
              
              {analysisResult.masking.detected && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg text-sm text-purple-700">
                  <p>💜 It's okay to not be okay. You don't have to hide how you truly feel.</p>
                </div>
              )}
            </div>

            {analysisResult.recommended_interventions.length > 0 && (
              <div className="glass rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🔒 Your words stay with you. Analysis happens, nothing is stored.</p>
      </div>
    </div>
  );
}
