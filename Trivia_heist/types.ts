export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  correctAnswerIds: string[]; // For multi-choice, multiple IDs. For single/TF, one ID.
  explanation?: string;
  difficulty: Difficulty;
}

export interface HighScore {
  name: string;
  score: number;
  total: number;
  difficulty: Difficulty;
  money: number;
  date: string;
}

export interface QuizState {
  status: 'IDLE' | 'LOADING' | 'PLAYING' | 'FINISHED' | 'ERROR';
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string[]>; // questionId -> selectedOptionIds
  questions: Question[];
  reserveQuestions: Question[]; // Questions available for swapping
  skipsLeft: number;
  timeLeft: number;
  playerName: string;
  difficulty: Difficulty;
}

export const MAX_TIME_PER_QUESTION = 30;
export const TOTAL_QUESTIONS_TO_FETCH = 10;
