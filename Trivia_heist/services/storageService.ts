import { HighScore } from '../types';

const STORAGE_KEY = 'heist_quiz_high_scores';

export const getHighScores = (): HighScore[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading high scores', e);
    return [];
  }
};

export const saveHighScore = (entry: HighScore) => {
  if (typeof window === 'undefined') return [];
  const scores = getHighScores();
  scores.push(entry);
  
  // Sort by score desc, then by date (most recent first)
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const topScores = scores.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
  return topScores;
};
