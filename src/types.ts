export interface Question {
  id: number;
  question: string;
  technology: string;
  userAnswer?: string;
  feedback?: string;
  score?: number;
  skipped?: boolean;
}

export interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  selectedTechnology: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  isStarted: boolean;
  isCompleted: boolean;
  isLoading: boolean;
}

export interface FeedbackSummary {
  overallScore: number;
  improvementAreas: string[];
  effectiveness: number;
  accuracy: number;
  recommendedResources: {
    title: string;
    url: string;
    description: string;
  }[];
}

export interface InterviewSession {
  id: string;
  date: string;
  technology: string;
  difficulty: string;
  duration: number;
  questions: Question[];
  feedbackSummary: FeedbackSummary;
}