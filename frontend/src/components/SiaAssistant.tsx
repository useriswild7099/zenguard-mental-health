'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, X, ArrowRight, MessageCircle, 
  Sparkles, Search, BookOpen, PenLine, 
  LifeBuoy, ChevronRight, LayoutGrid, Palette, Wind, Lightbulb
} from 'lucide-react';
import { Button } from './ui/button';
import { KNOWLEDGE_ARTICLES } from '@/lib/knowledge';

interface SiaAssistantProps {
  activeView: string;
  onNavigate: (view: any) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenArticle?: (article: any) => void;
  language?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// SiaRobot removed in favor of static image

export default function SiaAssistant({ activeView, onNavigate, onNavigateTab, onOpenArticle, language = 'English' }: SiaAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isPeekingActive, setIsPeekingActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Proactive Triggers State
  const [viewSwitchCount, setViewSwitchCount] = useState(0);
  const lastViewRef = useRef(activeView);

  // Track view switches for proactive popup
  useEffect(() => {
    if (activeView !== lastViewRef.current) {
      setViewSwitchCount(prev => prev + 1);
      lastViewRef.current = activeView;
      
      // Proactive trigger: User is navigating a lot, maybe they are lost
      if (viewSwitchCount >= 4 && !isOpen) {
        setIsOpen(true);
        const triggerMsg = language === 'English' 
          ? "I'm here to help you find whatever you need today—whether it's a quiet moment for your thoughts or a deep dive into your progress. How are you feeling right now?"
          : `I see you are exploring ZenGuard! (I'll respond in ${language})`;
        addSiaMessage(triggerMsg);
        setViewSwitchCount(0); // Reset after trigger
      }
    }
  }, [activeView, viewSwitchCount, isOpen]);

  // Handle "Wave" on initial mount or proactive message
  useEffect(() => {
    if (hasNewMessage || isOpen) {
      setIsWaving(true);
      const timer = setTimeout(() => setIsWaving(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasNewMessage, isOpen]);

  // Initial welcome after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        setHasNewMessage(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addSiaMessage = (text: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/sia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: `${activeView} | preferred_language: ${language}`,
          history: messages.slice(-5)
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        addSiaMessage(data.response);
        
        // Handle Suggested Actions
        if (data.suggested_action) {
          handleAction(data.suggested_action, data.action_payload);
        }
      }
    } catch (error) {
      addSiaMessage("I'm having a little trouble connecting right now, but I'm still here to help with navigation!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: string, payload?: string) => {
    if (action === 'navigate:help') onNavigate('help');
    else if (action === 'navigate:knowledge') {
      if (payload) {
        const article = KNOWLEDGE_ARTICLES.find(a => a.id === payload);
        if (article && onOpenArticle) onOpenArticle(article);
      } else {
        onNavigate('knowledge');
      }
    } 
    else if (action === 'open:journal') onNavigate('journal');
    else if (action === 'open:chat') onNavigate('chat');
    else if (action === 'open:doodle') onNavigate('doodle');
    else if (action === 'open:breathing') onNavigate('breathing');
    else if (action === 'open:grounding') onNavigate('grounding');
    else if (action.startsWith('journal:')) {
      const tab = action.split(':')[1];
      if (onNavigateTab) onNavigateTab(tab);
    }
  };

  const getTranslatedLabels = () => {
    if (language === 'Hindi') return { help: 'सहायता', library: 'पुस्तकालय', journal: 'जर्नल', chat: 'बात करें', doodle: 'डूडल', breathing: 'सांस लें', stats: 'आंकड़े' };
    return { help: 'Help Hub', library: 'Library', journal: 'Journal', chat: 'AI Friend', doodle: 'Mood Doodle', breathing: 'Breathing', stats: 'Insights' };
  };

  useEffect(() => {
    if (isOpen) {
      setIsPeekingActive(false);
      return;
    }

    const runPeekCycle = () => {
      setIsPeekingActive(true);
      setTimeout(() => {
        setIsPeekingActive(false);
      }, 5000);
    };

    // Initial peek
    const timeout = setTimeout(runPeekCycle, 1000);
    const interval = setInterval(runPeekCycle, 15000); // 5s in, 10s out

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isOpen]);

  const labels = getTranslatedLabels();

  const quickActions = [
    { label: labels.journal, icon: PenLine, action: () => onNavigate('journal') },
    { label: labels.chat, icon: MessageCircle, action: () => onNavigate('chat') },
    { label: labels.library, icon: BookOpen, action: () => onNavigate('knowledge') },
    { label: labels.doodle, icon: Palette, action: () => onNavigate('doodle') },
    { label: labels.breathing, icon: Wind, action: () => onNavigate('breathing') },
    { label: labels.stats, icon: Lightbulb, action: () => onNavigateTab?.('insights') },
    { label: labels.help, icon: LifeBuoy, action: () => onNavigate('help') },
  ];

  return (
    <div className="fixed bottom-1 md:bottom-0 right-4 md:right-2 z-[200] flex flex-col items-end">
      {/* Sia Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] md:w-[300px] h-[500px] md:h-[450px] bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[32px] shadow-elite flex flex-col mb-2 md:mb-1 animate-sia-slide-in overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-[12px] border border-white/10 shadow-inner overflow-hidden backdrop-blur-md">
                <img src="/sia-peeking.png" alt="Sia" className="w-[140%] h-[140%] object-contain -mr-3 mt-1" />
              </div>
              <div>
                <h3 className="font-bold text-white text-[14px] md:text-[13px] leading-tight premium-text-gradient">Sia</h3>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Elite Guide</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all duration-300"
            >
              <X className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 md:p-4 space-y-4 no-scrollbar bg-transparent"
          >
            {messages.length === 0 && (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-white/5 rounded-[20px] border border-white/10 backdrop-blur-md">
                  <p className="text-white/80 text-[13px] md:text-[11px] leading-relaxed text-center font-medium">
                    {language === 'English' 
                      ? "I'm here to help you find whatever you need today."
                      : `I am your ZenGuard guide!`}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black text-center">Shortcuts</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickActions.slice(0, 4).map((qa, i) => (
                      <button
                        key={i}
                        onClick={qa.action}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[16px] text-[13px] md:text-[11px] text-white flex items-center gap-3 transition-all duration-500 active:scale-95 group"
                      >
                        <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-all border border-white/5">
                          <qa.icon className="w-4 h-4 md:w-3.5 md:h-3.5 text-purple-300 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold tracking-tight text-white/50 group-hover:text-white">{qa.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div 
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-[24px] text-[14px] leading-relaxed shadow-xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-600/40 text-white rounded-tr-none border border-white/20 backdrop-blur-md' 
                    : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10 backdrop-blur-xl'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-[24px] rounded-tl-none border border-white/10 flex gap-1.5 items-center backdrop-blur-md">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-2xl"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[16px] py-2.5 md:py-2 pl-4 pr-10 text-[14px] md:text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all duration-500"
              />
              <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 md:p-1.5 bg-purple-600/80 text-white rounded-[10px] disabled:opacity-30 transition-all hover:scale-105 active:scale-90"
              >
                <ArrowRight className="w-4 h-4 md:w-3.5 md:h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        className={`relative group p-0 w-24 md:w-20 h-24 md:h-20 transition-all duration-700 hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto ${
          isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'
        } ${isPeekingActive ? 'animate-sia-peek-right' : 'animate-sia-peek-out'}`}
      >
        <div className="relative w-full h-full flex items-center justify-end">
          <img 
            src="/sia-peeking.png" 
            alt="Sia" 
            className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]" 
          />
          {/* Notification Dots removed for cleaner UI */}
        </div>
      </button>

      {/* Premium Pop-up Hint - Sync with Sia's Peek */}
      {!isOpen && (
        <div className={`absolute bottom-20 right-0 mb-6 p-5 bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[28px] shadow-elite w-72 pointer-events-none border-l-[6px] border-l-purple-500 transition-all duration-700 ${
          isPeekingActive 
            ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
            : 'opacity-0 translate-x-20 translate-y-4 scale-90'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Personal Guide</span>
          </div>
          <p className="text-[13px] text-white/80 leading-relaxed font-semibold">
            I've noticed your journey is expanding. I have new tools ready for you. Shall we explore?
          </p>
        </div>
      )}
    </div>
  );
}
