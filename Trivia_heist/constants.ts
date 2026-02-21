import { Question, QuestionType } from './types';

export const LOOT_VALUES: Record<string, number> = {
  Easy: 10_000_000,   // 10 Million per question
  Medium: 20_000_000, // 20 Million per question
  Hard: 50_000_000    // 50 Million per question
};

export const SFX_URLS = {
  CORRECT: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3',
  WRONG: 'https://cdn.pixabay.com/audio/2021/08/09/audio_275e53e9c9.mp3',
  SKIP: 'https://cdn.pixabay.com/audio/2022/03/24/audio_7809623886.mp3',
  FINISH: 'https://cdn.pixabay.com/audio/2020/05/24/audio_f53444a775.mp3',
};

// Fallback questions in case API fails or for initial mix
export const FALLBACK_QUESTIONS: Question[] = [
  // Easy Questions
  {
    id: 'static-1',
    text: "Which planet is known as the Red Planet?",
    type: QuestionType.SINGLE_CHOICE,
    difficulty: 'Easy',
    options: [
      { id: 'a', text: 'Venus' },
      { id: 'b', text: 'Mars' },
      { id: 'c', text: 'Jupiter' },
      { id: 'd', text: 'Saturn' },
    ],
    correctAnswerIds: ['b'],
    explanation: "Mars appears red due to iron oxide on its surface."
  },
  {
    id: 'static-4',
    text: "Which chemical element has the symbol 'O'?",
    type: QuestionType.SINGLE_CHOICE,
    difficulty: 'Easy',
    options: [
      { id: 'a', text: 'Gold' },
      { id: 'b', text: 'Osmium' },
      { id: 'c', text: 'Oxygen' },
      { id: 'd', text: 'Oganesson' },
    ],
    correctAnswerIds: ['c'],
    explanation: "O is the symbol for Oxygen."
  },
  {
    id: 'static-6',
    text: "Water boils at 100 degrees Celsius at sea level.",
    type: QuestionType.TRUE_FALSE,
    difficulty: 'Easy',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswerIds: ['true'],
    explanation: "Standard boiling point of water is 100°C."
  },

  // Medium Questions
  {
    id: 'static-2',
    text: "Select all the primary colors in the RYB color model.",
    type: QuestionType.MULTI_CHOICE,
    difficulty: 'Medium',
    options: [
      { id: 'a', text: 'Red' },
      { id: 'b', text: 'Green' },
      { id: 'c', text: 'Blue' },
      { id: 'd', text: 'Yellow' },
    ],
    correctAnswerIds: ['a', 'c', 'd'],
    explanation: "In traditional color theory (RYB), the primary colors are Red, Yellow, and Blue."
  },
  {
    id: 'static-3',
    text: "The Great Wall of China is visible from space with the naked eye.",
    type: QuestionType.TRUE_FALSE,
    difficulty: 'Medium',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswerIds: ['false'],
    explanation: "This is a common myth. It is generally not visible to the naked eye from low Earth orbit without aid."
  },
  {
    id: 'static-7',
    text: "Who painted the Mona Lisa?",
    type: QuestionType.SINGLE_CHOICE,
    difficulty: 'Medium',
    options: [
      { id: 'a', text: 'Michelangelo' },
      { id: 'b', text: 'Leonardo da Vinci' },
      { id: 'c', text: 'Raphael' },
      { id: 'd', text: 'Donatello' },
    ],
    correctAnswerIds: ['b'],
    explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century."
  },

  // Hard Questions
  {
    id: 'static-5',
    text: "Select all countries that are part of the United Kingdom.",
    type: QuestionType.MULTI_CHOICE,
    difficulty: 'Hard',
    options: [
      { id: 'a', text: 'England' },
      { id: 'b', text: 'Scotland' },
      { id: 'c', text: 'Ireland' },
      { id: 'd', text: 'Wales' },
    ],
    correctAnswerIds: ['a', 'b', 'd'],
    explanation: "The UK consists of England, Scotland, Wales, and Northern Ireland. The Republic of Ireland is a separate sovereign nation."
  },
  {
    id: 'static-8',
    text: "Which physicist proposed the uncertainty principle?",
    type: QuestionType.SINGLE_CHOICE,
    difficulty: 'Hard',
    options: [
      { id: 'a', text: 'Niels Bohr' },
      { id: 'b', text: 'Werner Heisenberg' },
      { id: 'c', text: 'Erwin Schrödinger' },
      { id: 'd', text: 'Max Planck' },
    ],
    correctAnswerIds: ['b'],
    explanation: "Werner Heisenberg introduced the uncertainty principle in 1927."
  },
  {
    id: 'static-9',
    text: "The capital of Australia is Sydney.",
    type: QuestionType.TRUE_FALSE,
    difficulty: 'Hard',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswerIds: ['false'],
    explanation: "The capital of Australia is Canberra."
  }
];
