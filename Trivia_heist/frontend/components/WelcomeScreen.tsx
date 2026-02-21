import React, { useState } from 'react';
import { Play, Siren, Trophy, BarChart3, Skull, User } from 'lucide-react';
import { Difficulty } from '../../backend/types';

interface WelcomeScreenProps {
  onStart: (name: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isLoading }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const handleStart = () => {
    if (name.trim()) {
      onStart(name, difficulty);
    }
  };

  const difficulties: { type: Difficulty; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'Easy', label: 'Rookie', icon: <Trophy size={16} />, color: 'hover:border-green-500 hover:text-green-500' },
    { type: 'Medium', label: 'Professional', icon: <BarChart3 size={16} />, color: 'hover:border-yellow-500 hover:text-yellow-500' },
    { type: 'Hard', label: 'Mastermind', icon: <Skull size={16} />, color: 'hover:border-red-600 hover:text-red-600' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in">
      
      {/* Logo Area */}
      <div className="mb-10 relative group">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
          Trivia<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800">Heist</span>
        </h1>
        <div className="absolute -bottom-4 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
        <Siren className="absolute -top-8 -right-8 text-red-600 w-16 h-16 animate-pulse opacity-80" />
      </div>

      <div className="max-w-md w-full bg-black/60 backdrop-blur-sm border border-red-900/30 p-8 rounded-sm shadow-2xl transition-all duration-300">
        
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
          Intelligence Check
        </h2>
        <p className="text-gray-400 mb-6 font-light">
          "The Professor is recruiting. Choose your heist difficulty."
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">1. Alias</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                type="text"
                placeholder="Enter Alias"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-700 text-white pl-10 pr-4 py-3 rounded-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all font-bold tracking-wider placeholder-zinc-600 uppercase"
              />
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">2. Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.type;
                return (
                  <button
                    key={d.type}
                    onClick={() => setDifficulty(d.type)}
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-sm border-2 transition-all duration-200 
                      ${isSelected 
                        ? 'border-red-600 bg-red-900/20 text-white' 
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800'
                      } ${!isSelected ? d.color : ''}`}
                  >
                    <div className={`mb-1 ${isSelected ? 'text-red-500' : 'text-zinc-500'}`}>
                        {d.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">{d.type}</span>
                    <span className="text-[9px] opacity-60 uppercase">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleStart}
              disabled={!name.trim() || isLoading}
              className={`flex-grow group relative overflow-hidden bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                (!name.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <span className="flex items-center justify-center gap-2 text-lg uppercase tracking-widest">
                {isLoading ? 'Planning Heist...' : 'Begin Heist'}
                {!isLoading && <Play size={20} fill="currentColor" />}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-zinc-600 text-xs uppercase tracking-[0.2em]">
        Bella Ciao • Bella Ciao • Bella Ciao
      </div>
    </div>
  );
};