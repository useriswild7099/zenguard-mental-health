import { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';
import { generateDeepDivePrompts } from '../utils/prompts';

interface DeepDivePromptsProps {
  mood: number;
  energy: number;
  activities: string[];
  responses: { prompt: string; response: string }[];
  onChange: (responses: { prompt: string; response: string }[]) => void;
}

export function DeepDivePrompts({
  mood,
  energy,
  activities,
  responses,
  onChange,
}: DeepDivePromptsProps) {
  const [prompts, setPrompts] = useState<string[]>(() =>
    generateDeepDivePrompts(mood, energy, activities)
  );
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');

  const regeneratePrompts = () => {
    const newPrompts = generateDeepDivePrompts(mood, energy, activities);
    setPrompts(newPrompts);
    setCurrentPromptIndex(0);
    setCurrentResponse('');
  };

  const handleSaveResponse = () => {
    if (currentResponse.trim()) {
      const newResponses = [
        ...responses,
        { prompt: prompts[currentPromptIndex], response: currentResponse },
      ];
      onChange(newResponses);
      
      // Move to next prompt
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
        setCurrentResponse('');
      } else {
        // All prompts answered
        setCurrentResponse('');
      }
    }
  };

  const handleSkip = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setCurrentResponse('');
    }
  };

  const currentPrompt = prompts[currentPromptIndex];
  const isLastPrompt = currentPromptIndex === prompts.length - 1;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Label className="text-lg font-medium">Deep Dive</Label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={regeneratePrompts}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Prompts
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2">
        {prompts.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index < currentPromptIndex
                ? 'bg-primary'
                : index === currentPromptIndex
                ? 'bg-primary/50'
                : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Current Prompt */}
      <div className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl border-l-4 border-gradient-to-b from-purple-500 to-blue-500 shadow-lg">
          <p className="text-lg font-medium leading-relaxed">{currentPrompt}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Prompt {currentPromptIndex + 1} of {prompts.length}
          </p>
        </div>

        <Textarea
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder="Take your time... There's no right or wrong answer."
          className="min-h-[200px] resize-none text-base leading-relaxed"
          autoFocus
        />

        <div className="flex gap-3">
          <Button
            onClick={handleSaveResponse}
            disabled={!currentResponse.trim()}
            className="flex-1"
          >
            {isLastPrompt && responses.length === prompts.length - 1
              ? 'Finish'
              : 'Continue'}
          </Button>
          {!isLastPrompt && (
            <Button onClick={handleSkip} variant="outline">
              Skip
            </Button>
          )}
        </div>
      </div>

      {/* Answered Prompts Summary */}
      {responses.length > 0 && (
        <div className="mt-8 space-y-3">
          <Label className="text-sm text-muted-foreground">
            You've answered {responses.length} prompt{responses.length !== 1 ? 's' : ''}
          </Label>
          {responses.map((r, index) => (
            <div key={index} className="p-4 bg-secondary/20 rounded-lg border-l-2 border-primary/30">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {r.prompt}
              </p>
              <p className="text-sm line-clamp-2">{r.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}