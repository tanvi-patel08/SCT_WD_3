import React, { useState } from 'react';
import { Question, QuestionType } from '../types';
import { Check, X, Clock, SkipForward } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerSelect: (id: string) => void;
  onNext: () => void;
  onSkip: () => void;
  skipsLeft: number;
  timeLeft: number;
  totalTime: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  onNext,
  onSkip,
  skipsLeft,
  timeLeft,
  totalTime,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleAction = (action: () => void) => {
    setIsExiting(true);
    setTimeout(() => {
        action();
    }, 400); // Wait for shake animation
  };

  const isMulti = question.type === QuestionType.MULTI_CHOICE;
  const progress = (timeLeft / totalTime) * 100;
  const isUrgent = progress < 30;

  return (
    <div className={`w-full max-w-2xl mx-auto ${isExiting ? 'animate-shake' : 'animate-slide-up'}`}>
      {/* Timer Bar */}
      <div className="mb-6 relative h-2 bg-zinc-800 rounded-full overflow-hidden w-full border border-zinc-700">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${isUrgent ? 'bg-red-600 animate-pulse-urgent' : 'bg-white'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-start mb-6">
            <span className="bg-red-900/50 text-red-200 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider border border-red-900">
                {question.difficulty}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
                  <Clock size={16} className={isUrgent ? 'text-red-500 animate-pulse' : ''} />
                  <span>{timeLeft}s</span>
              </div>
            </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
          {question.text}
        </h3>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onAnswerSelect(option.id)}
                className={`w-full text-left p-4 rounded-sm border-2 transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'border-red-600 bg-red-900/20 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800'
                  }
                `}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-lg font-medium">{option.text}</span>
                  <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors
                    ${isMulti ? 'rounded-sm' : 'rounded-full'}
                    ${isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-zinc-600'}
                  `}>
                    {isSelected && <Check size={14} strokeWidth={4} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between items-center gap-4">
          <button
            onClick={() => handleAction(onSkip)}
            disabled={skipsLeft <= 0 || isExiting}
            className={`
              flex items-center gap-2 px-6 py-3 border border-yellow-600 text-yellow-500 font-bold uppercase tracking-widest text-sm rounded-sm
              transition-all hover:bg-yellow-900/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600
            `}
            title={skipsLeft > 0 ? "Skip current question" : "No skips remaining"}
          >
            <SkipForward size={18} />
            <span>Swap Question</span>
            <span className="bg-yellow-600 text-black text-[10px] px-1.5 py-0.5 rounded-full ml-1">{skipsLeft}</span>
          </button>

          <button
            onClick={() => handleAction(onNext)}
            disabled={selectedAnswers.length === 0 || isExiting}
            className={`
              px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-sm
              transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[0_0_20px_rgba(255,255,255,0.1)]
            `}
          >
            {isMulti ? 'Confirm Selection' : 'Lock In Answer'}
          </button>
        </div>
      </div>
      
      {isMulti && (
        <p className="text-center mt-4 text-zinc-500 text-sm animate-pulse">
          * Multiple answers required
        </p>
      )}
    </div>
  );
};
