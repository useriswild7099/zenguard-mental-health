'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Shield, Brain, Zap, 
  MessageCircle, Heart, Star, BookOpen, Coffee 
} from 'lucide-react';

const PERSONALITIES = [
  { name: "Socrates", emoji: "🏛️", desc: "Deep philosophical questioning" },
  { name: "Steve Jobs", emoji: "📱", desc: "Design-focused minimalist" },
  { name: "Grandmother", emoji: "👵", desc: "Warm comfort & food" },
  { name: "Rumi", emoji: "📜", desc: "Poetic soul connections" },
  { name: "David Goggins", emoji: "💪", desc: "Therapeutic toughness" },
  { name: "The Universe", emoji: "🌌", desc: "Cosmic perspective" },
  { name: "Best Friend", emoji: "🫂", desc: "Unconditional support" },
  { name: "School Teacher", emoji: "🍎", desc: "Patient guidance" },
  { name: "Marcus Aurelius", emoji: "👑", desc: "Stoic resilience" },
  { name: "Cool Aunt", emoji: "🍷", desc: "Fun & honest advice" },
  { name: "Sherlock", emoji: "🎻", desc: "Analytical breakdown" },
  { name: "Nature Guide", emoji: "🌿", desc: "Grounding in reality" },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<'personalities' | 'analysis' | 'privacy'>('personalities');

  return (
    <section className="py-24 relative z-10 w-full max-w-7xl mx-auto px-6">
      
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Explore the Ecosystem
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          More than just a journal. A complete mental wellness system powered by local AI.
        </p>
      </div>

      {/* Interactive Feature Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {[
          { id: 'personalities', label: '57+ Personalities', icon: Users },
          { id: 'analysis', label: 'Deep Analysis', icon: Brain },
          { id: 'privacy', label: 'Privacy First', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* FEATURE 1: PERSONALITIES MARQUEE */}
      {activeTab === 'personalities' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {PERSONALITIES.map((persona, i) => (
              <div 
                key={persona.name}
                className="glass-card p-4 hover:bg-white/10 transition-colors flex items-start gap-4"
              >
                <span className="text-4xl">{persona.emoji}</span>
                <div>
                  <h3 className="font-bold text-white text-lg">{persona.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{persona.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-zinc-500 italic">
            + 45 more personas found inside chat mode
          </div>
        </div>
      )}

      {/* FEATURE 2: ANALYSIS VISUALIZATION */}
      {activeTab === 'analysis' && (
        <div className="animate-fade-in glass-card p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-purple-400" />
                <h3 className="text-2xl font-bold text-white">From Confusion to Clarity</h3>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Our local AI analyzes your journal entries for emotional tone, cognitive distortions, and hidden patterns.
              </p>
              <ul className="space-y-3">
                {[
                  "Mood Seed Metaphor (Plant Growth)",
                  "Emotional Masking Detection",
                  "Risk Scoring (0-100 Wellness)",
                  "Customized Intervention Tips"
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual Abstract Representation */}
            <div className="relative h-64 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl">🌱</span>
                </div>
                <div className="mt-4 px-4 py-2 bg-white/10 rounded-full text-xs font-mono text-green-300">
                  Status: Flourishing
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "100% Offline Capable",
              desc: "The AI model (Gemma 3:4B) runs directly on your machine. Unplug the internet and it still works.",
              icon: Zap
            },
            {
              title: "Zero Data Collection",
              desc: "We don't have servers. We don't have a database. Your thoughts evaporate after the session.",
              icon: Shield
            },
            {
              title: "Ephemeral by Design",
              desc: "Close the tab, and it's gone. Designed for true psychological safety and uninhibited expression.",
              icon: Heart
            }
          ].map((card, i) => (
            <div key={i} className="glass-card p-8 text-center hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
