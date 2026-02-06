"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, CheckCircle2 } from 'lucide-react';

interface BreathingGuideProps {
    exercise: {
        name: string;
        description: string;
        pattern?: string;
        duration_seconds: number;
        category: string;
        situation_category: string;
    };
    onComplete: () => void;
}

export function BreathingGuide({ exercise, onComplete }: BreathingGuideProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');
    const [timeLeft, setTimeLeft] = useState(exercise.duration_seconds);
    const [isActive, setIsActive] = useState(false);
    const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Parse pattern (e.g. "4-7-8" or "4-4")
    const timings = exercise.pattern ? exercise.pattern.split('-').map(Number) : [4, 4];
    const inhaleTime = timings[0] || 4;
    const holdTime1 = timings.length > 2 ? timings[1] : 0;
    const exhaleTime = timings.length > 2 ? timings[2] : (timings[1] || 4);
    const holdTime2 = timings.length > 3 ? timings[3] : 0;

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft <= 0) {
            onComplete();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, onComplete]);

    useEffect(() => {
        if (!isActive) return;

        let timeout: NodeJS.Timeout;

        const runCycle = async () => {
            // Inhale
            setPhase('inhale');
            setPhaseTimeLeft(inhaleTime);
            await new Promise(r => setTimeout(r, inhaleTime * 1000));

            // Hold 1
            if (holdTime1 > 0) {
                setPhase('hold');
                setPhaseTimeLeft(holdTime1);
                await new Promise(r => setTimeout(r, holdTime1 * 1000));
            }

            // Exhale
            setPhase('exhale');
            setPhaseTimeLeft(exhaleTime);
            await new Promise(r => setTimeout(r, exhaleTime * 1000));

            // Hold 2
            if (holdTime2 > 0) {
                setPhase('hold');
                setPhaseTimeLeft(holdTime2);
                await new Promise(r => setTimeout(r, holdTime2 * 1000));
            }

            if (isActive) runCycle();
        };

        runCycle();

        return () => {
            // Cleanup happens via isActive change
        };
    }, [isActive, inhaleTime, holdTime1, exhaleTime, holdTime2]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-zinc-900/50 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
            >
                <button
                    onClick={onComplete}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20 mb-4">
                        <Wind className="w-3 h-3" />
                        {exercise.situation_category}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{exercise.name}</h2>
                    <p className="text-zinc-400 text-sm">{exercise.description}</p>
                </div>

                {/* Breathing Visualizer */}
                <div className="relative h-64 flex items-center justify-center mb-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            initial={{ scale: phase === 'inhale' ? 0.8 : 1 }}
                            animate={{
                                scale: phase === 'inhale' ? 1.5 : (phase === 'exhale' ? 0.8 : 1.2),
                                backgroundColor: phase === 'inhale' ? 'rgba(59, 130, 246, 0.3)' : (phase === 'exhale' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)')
                            }}
                            transition={{ duration: phase === 'inhale' ? inhaleTime : (phase === 'exhale' ? exhaleTime : (phase === 'hold' ? (timings[1] || 4) : 1)), ease: "easeInOut" }}
                            className="w-32 h-32 rounded-full border-2 border-blue-500/50 flex items-center justify-center relative"
                        >
                            <span className="text-xl font-bold text-white uppercase tracking-tighter">
                                {phase === 'ready' ? 'Start' : phase}
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Outer Ripple */}
                    <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-32 h-32 rounded-full border border-blue-500/30"
                    />
                </div>

                {!isActive ? (
                    <button
                        onClick={() => setIsActive(true)}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors text-lg"
                    >
                        Start Exercise
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="text-zinc-500 font-mono text-sm">
                            Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <button
                            onClick={onComplete}
                            className="text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            I feel better now, stop exercise
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
