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

// Supportive prompts that rotate
const JOURNAL_PROMPTS = [
  "How are you feeling right now?",
  "What's on your mind today?",
  "Take a moment to express yourself freely...",
  "This is your safe space. Share what you need to.",
  "No judgment here. What would you like to say?",
];

export default function Home() {
  // Session management
  const [sessionId] = useState(() => generateSessionId());
  
  // Journal state
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  
  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [quickCheck, setQuickCheck] = useState<QuickCheckResponse | null>(null);
  
  // UI state
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);
  const [showDoodle, setShowDoodle] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  
  // Debounce timer for quick check
  const quickCheckTimer = useRef<NodeJS.Timeout>();

  // Rotate prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => {
        const currentIndex = JOURNAL_PROMPTS.indexOf(prev);
        return JOURNAL_PROMPTS[(currentIndex + 1) % JOURNAL_PROMPTS.length];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check API connection
  useEffect(() => {
    sentimentClient.healthCheck().then(setApiConnected);
  }, []);

  // Real-time quick check while typing
  const handleTextChange = useCallback((text: string) => {
    setJournalText(text);
    
    // Clear previous timer
    if (quickCheckTimer.current) {
      clearTimeout(quickCheckTimer.current);
    }
    
    // Debounce quick check
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

  // Submit journal entry for full analysis
  const handleSubmit = async () => {
    if (journalText.trim().length < 10) return;
    
    setIsAnalyzing(true);
    
    try {
      // Privacy: Scrub PII before sending
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

  // Handle intervention selection
  const handleInterventionSelect = (type: string) => {
    setActiveIntervention(type);
  };

  // Close intervention modal
  const closeIntervention = () => {
    setActiveIntervention(null);
  };

  // Start a new entry
  const handleNewEntry = () => {
    setJournalText('');
    setAnalysisResult(null);
    setQuickCheck(null);
    setActiveIntervention(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8 animate-float">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          ZenGuard
        </h1>
        <p className="text-gray-500 text-lg">Your safe space to express</p>
        
        {/* Connection status */}
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
          /* Journal Input Mode */
          <div className="glass rounded-2xl p-6 md:p-8 shadow-lg">
            <JournalInput
              value={journalText}
              onChange={handleTextChange}
              onSubmit={handleSubmit}
              placeholder={currentPrompt}
              isAnalyzing={isAnalyzing}
              quickCheck={quickCheck}
            />
            
            {/* Mood Doodle Option */}
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
          /* Analysis Results Mode */
          <div className="space-y-6">
            {/* Mood Visualization */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-lg text-center">
              <MoodSeed
                stage={analysisResult.mood_seed_stage}
                color={analysisResult.mood_color}
                wellnessScore={analysisResult.wellness_score}
                confidence={analysisResult.confidence}
              />
              
              {/* Supportive Message */}
              <p className="mt-6 text-lg text-gray-600 italic">
                "{analysisResult.supportive_message}"
              </p>
              
              {/* Emotional Insight */}
              {analysisResult.masking.detected && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg text-sm text-purple-700">
                  <p>💜 It's okay to not be okay. You don't have to hide how you truly feel.</p>
                </div>
              )}
            </div>

            {/* Intervention Cards */}
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

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNewEntry}
                className="btn-zen btn-zen-primary"
              >
                Write another entry
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
