import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionCard } from './components/QuestionCard';
import { ScoreScreen } from './components/ScoreScreen';
import { AudioPlayer } from './components/AudioPlayer';
import { Question, QuizState, MAX_TIME_PER_QUESTION, QuestionType, Difficulty } from './types';
import { FALLBACK_QUESTIONS, LOOT_VALUES, SFX_URLS } from './constants';
import { generateHeistQuestions } from './services/geminiService';
import { saveHighScore } from './services/storageService';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    status: 'IDLE',
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    questions: [],
    reserveQuestions: [],
    skipsLeft: 1,
    timeLeft: MAX_TIME_PER_QUESTION,
    playerName: '',
    difficulty: 'Medium',
  });

  const [currentSelection, setCurrentSelection] = useState<string[]>([]);

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (state.status === 'PLAYING' && state.timeLeft > 0) {
      timer = window.setInterval(() => {
        setState(prev => {
           if (prev.timeLeft <= 1) {
             return { ...prev, timeLeft: 0 };
           }
           return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.status, state.timeLeft]);

  // Effect to handle timeout auto-advance
  useEffect(() => {
      if (state.status === 'PLAYING' && state.timeLeft === 0) {
          handleNextQuestion(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeLeft, state.status]); 

  const playSfx = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {
        // Ignore playback errors (usually due to lack of interaction, but we are inside interaction handlers)
    });
  };

  const startGame = async (name: string, difficulty: Difficulty) => {
    setState(prev => ({ ...prev, status: 'LOADING', playerName: name, difficulty }));
    
    // Fetch 7 questions: 5 for the game, 2 reserves for skipping
    // We request a few more to handle potential filtering or duplicates if using fallback logic more complexly
    // But basic flow: ask for 7.
    let questions = await generateHeistQuestions(7, difficulty);
    
    // If API limit reached or failed (returning empty or few), use fallback
    if (questions.length < 5) {
       // Filter fallbacks by difficulty
       const filteredFallbacks = FALLBACK_QUESTIONS.filter(q => q.difficulty === difficulty);
       
       // Fill with others
       const otherFallbacks = FALLBACK_QUESTIONS.filter(q => q.difficulty !== difficulty);
       
       questions = [...filteredFallbacks, ...otherFallbacks].slice(0, 7);
    }

    const gameQuestions = questions.slice(0, 5);
    const reserveQuestions = questions.slice(5);

    setState({
      status: 'PLAYING',
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      questions: gameQuestions,
      reserveQuestions: reserveQuestions,
      skipsLeft: 1, // One skip per game
      timeLeft: MAX_TIME_PER_QUESTION,
      playerName: name,
      difficulty: difficulty,
    });
  };

  const handleAnswerSelect = (optionId: string) => {
    const currentQ = state.questions[state.currentQuestionIndex];
    
    if (currentQ.type === QuestionType.MULTI_CHOICE) {
      setCurrentSelection(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setCurrentSelection([optionId]);
    }
  };

  const handleSkipQuestion = () => {
    if (state.skipsLeft <= 0 || state.reserveQuestions.length === 0) return;

    playSfx(SFX_URLS.SKIP);

    const currentQIndex = state.currentQuestionIndex;
    const newQuestion = state.reserveQuestions[0];
    const remainingReserves = state.reserveQuestions.slice(1);
    
    const updatedQuestions = [...state.questions];
    updatedQuestions[currentQIndex] = newQuestion;

    setState(prev => ({
      ...prev,
      questions: updatedQuestions,
      reserveQuestions: remainingReserves,
      skipsLeft: prev.skipsLeft - 1,
      timeLeft: MAX_TIME_PER_QUESTION, // Reset timer for the new question
    }));
    
    setCurrentSelection([]);
  };

  const handleNextQuestion = (isTimeout: boolean = false) => {
    // Check if game is already finished to prevent double calls from timeout/click race
    if (state.status !== 'PLAYING') return;

    const currentQ = state.questions[state.currentQuestionIndex];
    // If timeout, selection might be empty or partial. We accept it as is.
    const finalSelection = currentSelection;
    
    // Calculate Score
    let points = 0;
    const correctIds = currentQ.correctAnswerIds;
    
    // Simple equality check
    const isCorrect = 
      finalSelection.length === correctIds.length && 
      finalSelection.every(id => correctIds.includes(id));
    
    if (isCorrect) points = 1;

    // Play Answer SFX
    if (isCorrect) {
        playSfx(SFX_URLS.CORRECT);
    } else {
        playSfx(SFX_URLS.WRONG);
    }

    const nextIndex = state.currentQuestionIndex + 1;
    const isFinished = nextIndex >= state.questions.length;
    const newScore = state.score + points;

    if (isFinished) {
      // Play Finish SFX
      playSfx(SFX_URLS.FINISH);

      const lootPerQ = LOOT_VALUES[state.difficulty] || 0;
      const totalLoot = newScore * lootPerQ;

      saveHighScore({
        name: state.playerName,
        score: newScore,
        total: state.questions.length,
        difficulty: state.difficulty,
        money: totalLoot,
        date: new Date().toISOString()
      });
    }

    setState(prev => ({
      ...prev,
      score: newScore,
      answers: { ...prev.answers, [currentQ.id]: finalSelection },
      currentQuestionIndex: isFinished ? prev.currentQuestionIndex : nextIndex,
      status: isFinished ? 'FINISHED' : 'PLAYING',
      timeLeft: MAX_TIME_PER_QUESTION,
    }));
    
    setCurrentSelection([]);
  };

  const restartGame = () => {
    setState({
      status: 'IDLE',
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      questions: [],
      reserveQuestions: [],
      skipsLeft: 1,
      timeLeft: MAX_TIME_PER_QUESTION,
      playerName: '',
      difficulty: 'Medium',
    });
    setCurrentSelection([]);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-red-600 selection:text-white">
      <Background />
      <AudioPlayer src="https://cdn.pixabay.com/audio/2021/11/01/audio_00fa5593f3.mp3" />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {state.status === 'IDLE' && (
          <WelcomeScreen onStart={startGame} isLoading={false} />
        )}

        {state.status === 'LOADING' && (
          <WelcomeScreen onStart={() => {}} isLoading={true} />
        )}

        {state.status === 'PLAYING' && state.questions.length > 0 && (
          <div className="flex flex-col h-full justify-center">
             <div className="mb-8 text-center">
                <div className="flex justify-between items-end mb-2 px-4 max-w-2xl mx-auto">
                    <p className="text-zinc-500 uppercase tracking-widest text-xs">
                    Heist Member: <span className="text-red-500 font-bold">{state.playerName}</span>
                    </p>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs">
                        Diff: <span className={`font-bold ${
                            state.difficulty === 'Hard' ? 'text-red-600' : 
                            state.difficulty === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>{state.difficulty}</span>
                    </p>
                </div>
                <div className="flex justify-center gap-1">
                  {state.questions.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 w-8 rounded-full ${
                        idx === state.currentQuestionIndex ? 'bg-white' :
                        idx < state.currentQuestionIndex ? 'bg-red-600' : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
             </div>
             
             <QuestionCard 
                key={state.questions[state.currentQuestionIndex].id}
                question={state.questions[state.currentQuestionIndex]}
                selectedAnswers={currentSelection}
                onAnswerSelect={handleAnswerSelect}
                onNext={() => handleNextQuestion(false)}
                onSkip={handleSkipQuestion}
                skipsLeft={state.skipsLeft}
                timeLeft={state.timeLeft}
                totalTime={MAX_TIME_PER_QUESTION}
             />
          </div>
        )}

        {state.status === 'FINISHED' && (
          <ScoreScreen state={state} onRestart={restartGame} />
        )}
      </main>
    </div>
  );
};

export default App;
