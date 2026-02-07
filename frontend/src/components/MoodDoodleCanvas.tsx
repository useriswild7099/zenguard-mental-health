'use client';

import { useEffect, useRef, useState } from 'react';
import { Undo, Redo, Trash2, Download, Palette, Eraser } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  type: 'pen' | 'marker' | 'neon' | 'eraser';
}

interface MoodDoodleCanvasProps {
  onCapture: (blob: Blob) => void;
  width?: number;
  height?: number;
}

export default function MoodDoodleCanvas({ onCapture, width = 600, height = 400 }: MoodDoodleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [history, setHistory] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  
  // Brush Settings
  const [color, setColor] = useState('#6d28d9'); // Default Purple
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState<'pen' | 'marker' | 'neon' | 'eraser'>('pen');

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    // We don't resize the element, just the bitmap, to avoid layout shifts?
    // Actually, for better resolution, we should scale.
    // For now, let's keep it simple 1:1 or use CSS scaling.
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      redraw(ctx, history);
    }
  }, []);

  // Redraw function
  const redraw = (ctx: CanvasRenderingContext2D, strokes: Stroke[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    strokes.forEach(stroke => drawStroke(ctx, stroke));
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.lineWidth = stroke.size;

    if (stroke.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      
      if (stroke.type === 'marker') {
        ctx.globalAlpha = 0.6;
      } else if (stroke.type === 'neon') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = stroke.color;
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    // Quadratic curve smoothing
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
    }
    
    // Draw last segment
    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.stroke();

    // Reset settings
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  // Input Handlers
  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const point = getPoint(e);
    
    const newStroke: Stroke = {
      points: [point],
      color: brushType === 'eraser' ? '#ffffff' : color,
      size: brushSize,
      type: brushType
    };
    setCurrentStroke(newStroke);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke || !canvasRef.current) return;
    e.preventDefault();

    const point = getPoint(e);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    };
    
    setCurrentStroke(updatedStroke);

    // Live render
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      // Opt: Just draw the last segment for performance? 
      // For "satisfying" smoothness, full redraw requires clearing.
      // But clearing entire canvas every frame can be heavy.
      // Let's rely on full redraw for now, optimize later if laggy.
      redraw(ctx, [...history, updatedStroke]);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);
    setHistory(prev => [...prev, currentStroke]);
    setCurrentStroke(null);
    setRedoStack([]); // Clear redo on new action
  };

  // Actions
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setRedoStack(prev => [last, ...prev]);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) redraw(ctx, newHistory);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    const newRedo = redoStack.slice(1);
    const newHistory = [...history, next];
    setHistory(newHistory);
    setRedoStack(newRedo);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) redraw(ctx, newHistory);
  };

  const handleClear = () => {
    if (window.confirm('Clear your masterpiece?')) {
        setHistory([]);
        setRedoStack([]);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }
  };

  const handleExport = () => {
    canvasRef.current?.toBlob((blob) => {
        if (blob) onCapture(blob);
    }, 'image/png');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
        
        {/* Colors */}
        <div className="flex gap-2 items-center">
            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000'].map(c => (
                <button
                    key={c}
                    onClick={() => { setColor(c); setBrushType('pen'); }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c && brushType !== 'eraser' ? 'border-gray-600 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Tools */}
        <div className="flex gap-2">
            <button 
                onClick={() => setBrushType('pen')}
                className={`p-2 rounded-lg transition-colors ${brushType === 'pen' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Pen"
            >
                <Palette className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setBrushType('marker')}
                className={`p-2 rounded-lg transition-colors ${brushType === 'marker' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Marker"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
            </button>
            <button 
                onClick={() => setBrushType('neon')}
                className={`p-2 rounded-lg transition-colors ${brushType === 'neon' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Neon"
            >
                <SparklesIcon />
            </button>
            <button 
                onClick={() => setBrushType('eraser')}
                className={`p-2 rounded-lg transition-colors ${brushType === 'eraser' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Eraser"
            >
                <Eraser className="w-4 h-4" />
            </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* History */}
        <div className="flex gap-1">
            <button onClick={handleUndo} disabled={history.length === 0} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30">
                <Undo className="w-4 h-4" />
            </button>
            <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30">
                <Redo className="w-4 h-4" />
            </button>
            <button onClick={handleClear} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-white cursor-crosshair touch-none">
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-auto bg-white"
        />
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Size:</span>
            <input 
                type="range" 
                min="1" 
                max="50" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24 accent-purple-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        
        <button 
            onClick={handleExport}
            className="btn-zen bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-purple-200"
        >
            <Download className="w-4 h-4" />
            <span>Analyze Art</span>
        </button>
      </div>
    </div>
  );
}

function SparklesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            <path d="M19 11h2m-1 -1v2" />
        </svg>
    )
}
