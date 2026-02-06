'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseWhisperOptions {
  onInterimResult?: (text: string) => void;
  silenceTimeout?: number; // ms of silence before auto-stop
}

interface UseWhisperReturn {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => string;
}

export function useWhisper(options: UseWhisperOptions = {}): UseWhisperReturn {
  const { onInterimResult, silenceTimeout = 2000 } = options;
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onInterimRef = useRef(onInterimResult);
  
  // Keep callback ref updated
  useEffect(() => {
    onInterimRef.current = onInterimResult;
  }, [onInterimResult]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      console.log('🔇 Silence detected, auto-stopping...');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, silenceTimeout);
  }, [silenceTimeout, clearSilenceTimer]);

  const startRecording = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }
    
    setError(null);
    finalTranscriptRef.current = '';
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsRecording(true);
      startSilenceTimer(); // Start silence detection
    };
    
    recognition.onresult = (event: any) => {
      clearSilenceTimer();
      startSilenceTimer(); // Reset silence timer on each result
      
      let interim = '';
      let final = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      
      finalTranscriptRef.current = final;
      
      // Stream to parent in real-time
      if (onInterimRef.current) {
        onInterimRef.current(final + interim);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      clearSilenceTimer();
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error);
      }
    };
    
    recognition.onend = () => {
      clearSilenceTimer();
      setIsRecording(false);
      setIsProcessing(false);
    };
    
    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (err: any) {
      setError(err.message || 'Failed to start');
    }
  }, [startSilenceTimer, clearSilenceTimer]);

  const stopRecording = useCallback((): string => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      setIsProcessing(true);
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    return finalTranscriptRef.current.trim();
  }, [clearSilenceTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [clearSilenceTimer]);

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
  };
}
