'use client';

import { useState, useEffect, useRef } from 'react';
import { chatClient, ChatMode, ChatMessage } from '@/lib/api';
import { prepareText } from '@/lib/privacy';

interface ChatInterfaceProps {
  onBack: () => void;
}

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  // State
  const [modes, setModes] = useState<ChatMode[]>([]);
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModes, setIsLoadingModes] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load available modes on mount
  useEffect(() => {
    const loadModes = async () => {
      setIsLoadingModes(true);
      const fetchedModes = await chatClient.getModes();
      setModes(fetchedModes);
      setIsLoadingModes(false);
    };
    loadModes();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when mode is selected
  useEffect(() => {
    if (selectedMode) {
      inputRef.current?.focus();
    }
  }, [selectedMode]);

  // Handle mode selection
  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
    setMessages([]);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !selectedMode) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Privacy: Scrub PII before sending
    const { scrubbed } = prepareText(userMessage);
    
    // Add user message to chat
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);
    
    try {
      const response = await chatClient.sendMessage(
        scrubbed,
        selectedMode.id,
        messages
      );
      
      // Add AI response to chat
      const aiMessage: ChatMessage = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please make sure Ollama is running with the gemma3:4b model." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat and go back to mode selection
  const handleNewChat = () => {
    setSelectedMode(null);
    setMessages([]);
  };

  // Mode selection screen
  if (!selectedMode) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="glass-card p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h2 className="text-xl font-semibold text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              Choose a Companion
            </h2>
            <div className="w-16"></div>
          </div>

          {/* Mode Cards */}
          {isLoadingModes ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode)}
                  className="glass-card text-left p-5 hover:bg-white/20 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{mode.emoji}</span>
                    <h3 className="font-semibold text-white">{mode.name}</h3>
                  </div>
                  <p className="text-sm text-zinc-300">{mode.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Privacy notice */}
          <p className="text-xs text-gray-400 text-center mt-6">
            🔒 Your conversations are never stored. Privacy first, always.
          </p>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={handleNewChat}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Change Mode
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedMode.emoji}</span>
            <span className="font-medium text-white">{selectedMode.name}</span>
          </div>
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            Exit Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-400 py-8">
              <span className="text-4xl mb-2 block">{selectedMode.emoji}</span>
              <p>Start a conversation with your {selectedMode.name}</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-500 text-white rounded-br-md'
                    : 'bg-white/10 backdrop-blur-sm text-zinc-100 rounded-bl-md border border-white/10'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="btn-zen btn-zen-primary disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center rounded-full"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-zinc-400 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
