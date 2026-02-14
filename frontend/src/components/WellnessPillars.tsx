'use client';

import { 
  PenLine, MessageCircle, BookOpen, Sparkles
} from 'lucide-react';

interface WellnessPillarsProps {
  onNavigate: (view: 'journal' | 'chat' | 'knowledge' | 'doodle' | 'help' | 'breathing' | 'grounding') => void;
}

const PILLARS = [
  {
    id: 'journal' as const,
    title: "The Silent Journal",
    subtitle: "Reflect & Grow",
    desc: "A sacred space where your words stay yours. Our local AI analyzes patterns without ever seeing your data.",
    icon: PenLine,
    color: "from-purple-500/20 to-blue-500/20",
    iconColor: "text-purple-400",
    features: ["Pattern Recognition", "Emotional Mapping", "Mood Seeds"]
  },
  {
    id: 'chat' as const,
    title: "Sia AI Companion",
    subtitle: "Always Listening",
    desc: "Meet your proactive wellness guide. Sia understands nuance, follows your journey, and checks in when it matters.",
    icon: MessageCircle,
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-rose-400",
    features: ["57+ Personalities", "Proactive Empathy", "Zero Latency"]
  },
  {
    id: 'knowledge' as const,
    title: "MindSpace Hub",
    subtitle: "Deep Learning",
    desc: "A vast library of clinical-grade mental health insights filtered through our gentle, supportive AI interface.",
    icon: BookOpen,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    features: ["CBT Foundations", "Crisis Navigation", "Wellness Paths"]
  },
  {
    id: 'doodle' as const,
    title: "Void Mode",
    subtitle: "Release & Reset",
    desc: "Release overwhelming emotions through visual metaphors. Watch your stress burn, shatter, or dissolve into the void.",
    icon: Sparkles,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
    features: ["Visual Catharsis", "Breathing Sync", "Immediate Relief"]
  }
];

export default function WellnessPillars({ onNavigate }: WellnessPillarsProps) {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
            The Four Pillars <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-black">of ZenGuard</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar, i) => (
            <button 
              key={i}
              onClick={() => onNavigate(pillar.id)}
              className="group relative p-1 rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.02] text-left w-full h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-50`}></div>
              <div className="relative h-full glass-card p-8 md:p-10 flex flex-col group-hover:bg-white/5 transition-all duration-500">
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${pillar.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                    <pillar.icon className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black mb-1 block">{pillar.subtitle}</span>
                    <h3 className="text-2xl font-bold text-white">{pillar.title}</h3>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  {pillar.desc}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {pillar.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-medium uppercase tracking-wider"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
