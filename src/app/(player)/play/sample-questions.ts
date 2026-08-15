import type { Question } from "@/types/question";

/** Sample questions, one per type, used to preview the player UI. */
export const sampleQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple_choice",
    category: "Geography",
    prompt: "What is the capital of Cameroon?",
    options: [
      { id: "a", label: "A", text: "Douala" },
      { id: "b", label: "B", text: "Yaoundé" },
      { id: "c", label: "C", text: "Buea" },
      { id: "d", label: "D", text: "Bamenda" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q2",
    type: "true_false",
    category: "General Knowledge",
    prompt: "The University of Buea is located in the Southwest Region.",
    correctAnswer: true,
  },
  {
    id: "q3",
    type: "open_text",
    category: "Computer Science",
    prompt: "Name one language used for web frontend development.",
    maxLength: 60,
  },
  {
    id: "q4",
    type: "word_cloud",
    category: "Warm-up",
    prompt: "In one word, how are you feeling about today's competition?",
    maxWordsPerPlayer: 1,
  },
  {
    id: "q5",
    type: "rating_scale",
    category: "Feedback",
    prompt: "How difficult was the Physics round?",
    min: 1,
    max: 5,
    minLabel: "Very easy",
    maxLabel: "Very hard",
  },
  {
    id: "q6",
    type: "ranking",
    category: "History",
    prompt: "Order these events from earliest to most recent.",
    items: [
      { id: "i1", label: "Cameroon independence" },
      { id: "i2", label: "Reunification" },
      { id: "i3", label: "University of Buea founded" },
    ],
    correctOrder: ["i1", "i2", "i3"],
  },
  {
    id: "q7",
    type: "image_choice",
    category: "Geography",
    prompt: "Which flag belongs to Cameroon?",
    options: [
      { id: "a", label: "Option A", imageUrl: "/placeholder-flag-a.png" },
      { id: "b", label: "Option B", imageUrl: "/placeholder-flag-b.png" },
    ],
    correctOptionId: "a",
  },
];
