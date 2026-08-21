import type { Question, QuestionType } from "@/types/question";

/**
 * Strips the correct-answer field from a question's config before it
 * is ever sent to a player client. This is the one function every
 * player-facing route MUST call - never send a raw `questions` row
 * to a player, even accidentally, since config holds the answer key.
 */
export function sanitizeQuestionConfig(
  type: QuestionType,
  config: Record<string, unknown>,
): Record<string, unknown> {
  switch (type) {
    case "multiple_choice":
    case "image_choice": {
      const { correctOptionId: _correctOptionId, ...rest } = config;
      return rest;
    }
    case "true_false": {
      const { correctAnswer: _correctAnswer, ...rest } = config;
      return rest;
    }
    case "ranking": {
      const { correctOrder: _correctOrder, ...rest } = config;
      return rest;
    }
    case "open_text": {
      const { acceptedAnswers: _acceptedAnswers, ...rest } = config;
      return rest;
    }
    case "word_cloud":
    case "rating_scale":
      // No answer key to strip - these are ungraded/survey-style.
      return config;
    default:
      return config;
  }
}

/** Shape sent to player and display clients - never includes the answer key. */
export interface SanitizedQuestion {
  id: string;
  type: QuestionType;
  category: string | null;
  prompt: string;
  imageUrl: string | null;
  timeLimitSeconds: number;
  points: number;
  config: Record<string, unknown>;
}
