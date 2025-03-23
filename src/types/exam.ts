export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
  startTime: string;
  endTime: string;
  stream: string;
  year: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  timeTaken: number; // in minutes
}
