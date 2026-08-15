/**
 * Shared question types for Kwiz237.
 * Every question in the question bank has a `type`, plus type-specific
 * fields. This mirrors the range of formats Mentimeter supports, not
 * just multiple choice.
 */

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "open_text"
  | "word_cloud"
  | "rating_scale"
  | "ranking"
  | "image_choice";

interface BaseQuestion {
  id: string;
  type: QuestionType;
  category: string;
  prompt: string;
  difficulty?: "easy" | "medium" | "hard";
  timeLimitSeconds?: number;
  points?: number;
  imageUrl?: string;
}

/** Classic A/B/C/D with one correct answer. */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: { id: string; label: string; text: string }[];
  correctOptionId: string;
}

/** Simple true/false, scored the same way as multiple choice. */
export interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  correctAnswer: boolean;
}

/**
 * Free-text answer. Not auto-scorable in the general case, so this is
 * more like a survey/quiz-hybrid question - the host can mark answers
 * correct after the fact, or it can be ungraded (discussion prompt).
 */
export interface OpenTextQuestion extends BaseQuestion {
  type: "open_text";
  acceptedAnswers?: string[]; // optional, for auto-grading exact matches
  maxLength?: number;
}

/**
 * Players submit short words/phrases; the display aggregates them into
 * a live word cloud. Ungraded - this is a survey-style format, not a
 * quiz one, but it's part of the same session flow.
 */
export interface WordCloudQuestion extends BaseQuestion {
  type: "word_cloud";
  maxWordsPerPlayer?: number;
}

/** Players pick a value on a numeric scale, e.g. 1-5 or 1-10. */
export interface RatingScaleQuestion extends BaseQuestion {
  type: "rating_scale";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

/** Players drag items into what they believe is the correct order. */
export interface RankingQuestion extends BaseQuestion {
  type: "ranking";
  items: { id: string; label: string }[];
  correctOrder: string[]; // array of item ids, in correct order
}

/** Same as multiple choice, but each option is an image instead of text. */
export interface ImageChoiceQuestion extends BaseQuestion {
  type: "image_choice";
  options: { id: string; label: string; imageUrl: string }[];
  correctOptionId: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OpenTextQuestion
  | WordCloudQuestion
  | RatingScaleQuestion
  | RankingQuestion
  | ImageChoiceQuestion;

/** Whether a question type can be auto-scored by the server. */
export const isGraded = (type: QuestionType): boolean =>
  type === "multiple_choice" ||
  type === "true_false" ||
  type === "ranking" ||
  type === "image_choice";
