// Import the Question type definition
import { Question } from "../types/assessment";

// ============================
// Function: shouldShowQuestion
// ============================
// Determines whether a question should be displayed based on its condition
export const shouldShowQuestion = (
  question: Question,                  // The question to evaluate
  answers: Record<string, any>        // Object mapping question IDs to candidate answers
): boolean => {
  // If the question has no condition, always show it
  if (!question.condition) return true;

  // Destructure the condition (dependent question ID and expected value)
  const { questionId, value } = question.condition;

  // Show the question only if the answer to the dependent question matches the expected value
  return answers[questionId] === value;
};
