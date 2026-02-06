'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, Trash2, Download, Check } from 'lucide-react';

interface MoodCanvasProps {
    onAnalyze: (blob: Blob) => void;
    isAnalyzing: boolean;
    selectedEmotion?: string;
}

export default function MoodCanvas({ onAnalyze, isAnalyzing, selectedEmotion }: MoodCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#a88bfa');
    const [brushSize, setBrushSize] = useState(4);
    const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas resolution
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Initial background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Smooth lines
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }, []);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const coords = getCoordinates(e);
        if (coords) setLastPoint(coords);
    };

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!isDrawing || !lastPoint) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const coords = getCoordinates(e);
        if (!coords) return;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        setLastPoint(coords);
    }, [isDrawing, lastPoint, color, brushSize]);

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPoint(null);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleAnalyze = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) onAnalyze(blob);
        }, 'image/png');
    };

    return (
        <div className="space-y-4">
            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[400px] bg-zinc-900 rounded-2xl cursor-crosshair border border-white/10 shadow-2xl touch-none"
                />

                {/* Canvas Toolbar */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 transition-opacity">
                    <button
                        onClick={clearCanvas}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all border border-white/10"
                        title="Clear canvas"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Brush Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {['#a88bfa', '#ff6b6b', '#4ecdc4', '#f7d794', '#fff'].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>

                        <div className="h-8 w-px bg-white/10 mx-2" />

                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-24 accent-purple-400"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="px-6 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        {isAnalyzing ? (
                            <span className="animate-pulse">Analyzing...</span>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Done
                            </>
                        )}
                    </button>
                </div>
            </div>

            <p className="text-xs text-zinc-500 text-center">
                Doodle how you're feeling right now. Our AI will help interpret your strokes.
            </p>
        </div>
    );
}
