import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, Difficulty } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateHeistQuestions = async (count: number = 5, difficulty: Difficulty = 'Medium'): Promise<Question[]> => {
  const ai = getAiClient();
  
  if (!ai) {
    console.warn("No API Key found, using static questions.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} general knowledge trivia questions. 
      The difficulty level for all questions must be strictly '${difficulty}'.
      Include a mix of Single Choice, Multi Choice, and True/False questions.
      Topics should cover Science, History, Geography, Arts, and Pop Culture.
      The output must be strictly valid JSON matching the schema provided.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: [QuestionType.SINGLE_CHOICE, QuestionType.MULTI_CHOICE, QuestionType.TRUE_FALSE] },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ['id', 'text']
                }
              },
              correctAnswerIds: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] }
            },
            required: ['id', 'text', 'type', 'options', 'correctAnswerIds', 'difficulty']
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as Question[];
      return parsed;
    }
    return [];
  } catch (error) {
    console.error("Failed to generate questions via Gemini:", error);
    return [];
  }
};
