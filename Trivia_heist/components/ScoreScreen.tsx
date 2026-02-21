import React, { useState } from 'react';
import { QuizState, Question } from '../types';
import { RotateCcw, Award, AlertTriangle, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LOOT_VALUES } from '../constants';

interface ScoreScreenProps {
  state: QuizState;
  onRestart: () => void;
}

const QuestionResultItem: React.FC<{
    question: Question;
    userAnswers: string[];
    lootPerQ: number;
    index: number;
}> = ({ question, userAnswers, lootPerQ, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isCorrect = 
        userAnswers.length === question.correctAnswerIds.length &&
        userAnswers.every(id => question.correctAnswerIds.includes(id));

    return (
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/30 overflow-hidden transition-all duration-200 hover:border-zinc-700">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/30 transition-colors group"
            >
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                        isCorrect ? 'border-green-600 bg-green-900/20 text-green-500' : 'border-red-600 bg-red-900/20 text-red-500'
                    }`}>
                        {isCorrect ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Question {index + 1}</span>
                        <span className={`text-sm font-medium truncate w-full pr-4 ${isCorrect ? 'text-zinc-200' : 'text-zinc-400'}`}>
                            {question.text}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-bold uppercase hidden md:block ${isCorrect ? 'text-green-500' : 'text-zinc-600'}`}>
                         {isCorrect ? `+ €${(lootPerQ/1000000).toFixed(0)}M` : '€0'}
                    </span>
                    {isOpen ? <ChevronUp size={18} className="text-zinc-500 group-hover:text-white" /> : <ChevronDown size={18} className="text-zinc-500 group-hover:text-white" />}
                </div>
            </button>

            {isOpen && (
                <div className="px-4 pb-4 pt-0 bg-zinc-900/30 animate-fade-in">
                    <div className="h-px w-full bg-zinc-800 mb-4"></div>
                    
                    {/* Full Question Text */}
                    <p className="text-lg text-white font-bold mb-4 leading-relaxed">{question.text}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        {/* User Answer */}
                        <div className={`p-3 rounded-sm border ${isCorrect ? 'bg-green-900/10 border-green-900/30' : 'bg-red-900/10 border-red-900/30'}`}>
                            <span className="block text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Your Answer</span>
                             {userAnswers.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {question.options
                                        .filter(o => userAnswers.includes(o.id))
                                        .map(o => (
                                            <li key={o.id} className={isCorrect ? 'text-green-300' : 'text-red-300'}>{o.text}</li>
                                        ))
                                    }
                                </ul>
                             ) : (
                                 <span className="text-zinc-500 italic">No answer provided</span>
                             )}
                        </div>

                        {/* Correct Answer */}
                        <div className="bg-zinc-800/30 p-3 rounded-sm border border-zinc-700">
                             <span className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Correct Answer</span>
                             <ul className="list-disc list-inside text-zinc-300">
                                {question.options
                                    .filter(o => question.correctAnswerIds.includes(o.id))
                                    .map(o => (
                                        <li key={o.id}>{o.text}</li>
                                    ))
                                }
                             </ul>
                        </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                        <div className="flex gap-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-sm">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-1 h-full bg-blue-500 rounded-full"></div>
                            </div>
                            <div>
                                <span className="block text-xs uppercase tracking-widest font-bold text-blue-400 mb-1">Intel Brief</span>
                                <p className="text-zinc-300 italic text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ state, onRestart }) => {
    const totalQuestions = state.questions.length;
    const percentage = (state.score / totalQuestions) * 100;
    
    // Calculate total loot
    const lootPerQ = LOOT_VALUES[state.difficulty] || 0;
    const totalLoot = state.score * lootPerQ;

    // Format loot currency
    const formattedLoot = new Intl.NumberFormat('en-DE', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0 
    }).format(totalLoot);

    let title = '';
    let message = '';
    let colorClass = '';

    if (percentage >= 80) {
        title = 'Heist Successful!';
        message = 'You cleaned out the vault. The Professor is impressed.';
        colorClass = 'text-green-500';
    } else if (percentage >= 50) {
        title = 'Partial Extraction';
        message = 'You got some bags out, but left plenty behind.';
        colorClass = 'text-yellow-500';
    } else {
        title = 'Busted!';
        message = 'The police apprehended you before you reached the van.';
        colorClass = 'text-red-500';
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in pb-20">
             {/* Header Section */}
             <div className="text-center mb-10">
                <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 ${colorClass} drop-shadow-xl`}>
                {title}
                </h2>
                <p className="text-xl text-zinc-300 font-light max-w-2xl mx-auto">{message}</p>
                
                {/* Loot Display */}
                <div className="mt-8 flex flex-col items-center justify-center">
                    <div className="text-zinc-500 uppercase tracking-widest text-sm mb-2 font-bold animate-fade-in">Total Loot Secured</div>
                    <div 
                        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] font-mono animate-pop-in" 
                        style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '0.3s' }}
                    >
                        {formattedLoot}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Debriefing List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Award className="text-red-500" /> Mission Debriefing
                        </h3>
                        <span className="text-xs text-zinc-500 font-mono uppercase">{state.score}/{totalQuestions} Cleared</span>
                    </div>
                    
                    <div className="space-y-3">
                        {state.questions.map((q, idx) => (
                            <QuestionResultItem 
                                key={q.id} 
                                question={q} 
                                userAnswers={state.answers[q.id] || []}
                                lootPerQ={lootPerQ}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Status & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Police Status Card */}
                     <div className="w-full bg-zinc-900/80 border border-zinc-800 p-6 rounded-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle size={80} />
                        </div>
                        <h4 className="text-red-500 font-bold uppercase mb-4 flex items-center justify-center gap-2">
                            <AlertTriangle size={20} /> Police Status
                        </h4>
                        
                        <div className="relative pt-4 pb-2">
                            <div className="w-full bg-zinc-800 h-6 rounded-full overflow-hidden border border-zinc-700">
                                <div 
                                    className={`h-full transition-all duration-1000 ${
                                        percentage < 50 ? 'bg-red-600 animate-pulse' : 
                                        percentage < 80 ? 'bg-yellow-500' : 'bg-green-600'
                                    }`}
                                    style={{ width: `${Math.max(0, 100 - percentage)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-mono uppercase text-zinc-500">
                                <span>Safe</span>
                                <span>Critical</span>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-white mt-2">{100 - percentage}% <span className="text-xs font-normal text-zinc-400">Heat Level</span></p>
                     </div>
                     
                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-zinc-900/50 p-4 rounded-sm border border-zinc-800 text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Difficulty</div>
                            <div className={`text-lg font-bold uppercase
                                ${state.difficulty === 'Hard' ? 'text-red-500' : state.difficulty === 'Medium' ? 'text-yellow-500' : 'text-green-500'}
                            `}>{state.difficulty}</div>
                         </div>
                         <div className="bg-zinc-900/50 p-4 rounded-sm border border-zinc-800 text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Accuracy</div>
                            <div className="text-lg font-bold text-white">{percentage.toFixed(0)}%</div>
                         </div>
                     </div>
        
                     <button
                        onClick={onRestart}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-white/10 group"
                    >
                        <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Attempt New Heist
                    </button>
                </div>
            </div>
        </div>
    );
};
