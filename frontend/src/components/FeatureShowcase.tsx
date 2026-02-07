'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, Sparkles, Shield, Brain, Zap, 
  MessageCircle, Heart, Star, BookOpen, Coffee,
  Wind, Flame, Cloud
} from 'lucide-react';

const PERSONALITIES = [
  { name: "Socrates", emoji: "🏛️", desc: "Deep philosophical questioning" },
  { name: "Steve Jobs", emoji: "📱", desc: "Design-focused minimalist" },
  { name: "Mother", emoji: "👩", desc: "Warm comfort & nurturing" },
  { name: "Rumi", emoji: "📜", desc: "Poetic soul connections" },
  { name: "David Goggins", emoji: "💪", desc: "Therapeutic toughness" },
  { name: "The Universe", emoji: "🌌", desc: "Cosmic perspective" },
  { name: "Best Friend", emoji: "🫂", desc: "Unconditional support" },
  { name: "Academic Coach", emoji: "📚", desc: "Patient guidance" },
  { name: "Marcus Aurelius", emoji: "👑", desc: "Stoic resilience" },
  { name: "Motivational Coach", emoji: "🚀", desc: "Inspiring action" },
  { name: "Sherlock", emoji: "🎻", desc: "Analytical breakdown" },
  { name: "Mindfulness Guide", emoji: "🌿", desc: "Grounding in reality" },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<'personalities' | 'analysis' | 'release' | 'privacy'>('personalities');

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
          { id: 'release', label: 'Release & Reflect', icon: Wind },
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
                className="glass-card p-4 hover:bg-white/10 transition-colors flex items-center gap-4 group"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={`/personalities/${persona.name.toLowerCase()}.png`}
                    alt={persona.name}
                    fill
                    className="rounded-full object-cover border border-white/10 group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      // Fallback to emoji if image fails (handled by hiding image and showing emoji span)
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden text-3xl absolute inset-0 flex items-center justify-center">{persona.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{persona.name}</h3>
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

      {/* FEATURE: RELEASE LOOPS */}
      {activeTab === 'release' && (
        <div className="animate-fade-in glass-card p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-80 bg-black/40 rounded-2xl border border-white/10 overflow-hidden group flex items-center justify-center">
               {/* Visual representation of release loops */}
               <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
               <div className="grid grid-cols-2 gap-4 p-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex flex-col items-center gap-2 animate-float-slow">
                     <Wind className="text-yellow-400 w-8 h-8" />
                     <span className="text-xs text-zinc-400">Anxious</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 animate-float-delayed">
                     <Flame className="text-red-400 w-8 h-8" />
                     <span className="text-xs text-zinc-400">Angry</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 animate-float-reverse">
                     <Cloud className="text-blue-400 w-8 h-8" />
                     <span className="text-xs text-zinc-400">Sad</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 animate-float-delayed-reverse">
                     <Sparkles className="text-green-400 w-8 h-8" />
                     <span className="text-xs text-zinc-400">Hopeful</span>
                  </div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5">
                    <span className="text-white font-light text-lg tracking-widest uppercase">Release</span>
                  </div>
               </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="text-blue-300" />
                <h3 className="text-2xl font-bold text-white">Let It Go, For Real.</h3>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Enter the Void Mode to release intense emotions safely.
              </p>
              <ul className="space-y-4">
                {[
                  { title: "30+ Mood Loops", desc: "Tailored experiences for Anxiety, Anger, Sadness, and more." },
                  { title: "Visual Release", desc: "Watch your words shatter, burn, fade, or dissolve." },
                  { title: "AI Reflection", desc: "Receive instant, validating insight for your specific state." },
                  { title: "Cool-Downs", desc: "Guided breathing and grounding to reset your nervous system." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                    <div>
                      <strong className="text-zinc-200 block">{item.title}</strong>
                      <span className="text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
