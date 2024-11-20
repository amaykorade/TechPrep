import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { TechnologySelector } from '../components/TechnologySelector';
import { InterviewSetup } from '../components/InterviewSetup';
import { QuestionCard } from '../components/QuestionCard';
import { generateQuestions, evaluateAnswer, generateFeedbackSummary } from '../services/geminiService';
import { Question, InterviewState } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/authStore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export function PracticePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [state, setState] = useState<InterviewState>({
    currentQuestionIndex: 0,
    questions: [],
    selectedTechnology: '',
    difficulty: 'beginner',
    questionCount: 5,
    isStarted: false,
    isCompleted: false,
    isLoading: false
  });

  const handleTechnologySelect = (technology: string) => {
    setState(prev => ({
      ...prev,
      selectedTechnology: technology
    }));
  };

  const handleBack = () => {
    setState(prev => ({
      ...prev,
      selectedTechnology: '',
      isStarted: false,
      questions: [],
      currentQuestionIndex: 0
    }));
  };

  const handleStartInterview = async (difficulty: string, questionCount: number) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const questionTexts = await generateQuestions(state.selectedTechnology, difficulty, questionCount);
      const questions: Question[] = questionTexts.map((text, index) => ({
        id: index + 1,
        question: text,
        technology: state.selectedTechnology
      }));

      setState(prev => ({
        ...prev,
        questions,
        difficulty,
        questionCount,
        isStarted: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    try {
      const evaluation = await evaluateAnswer(currentQuestion.question, answer);
      
      const updatedQuestions = [...state.questions];
      updatedQuestions[state.currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: answer,
        feedback: evaluation.feedback,
        score: evaluation.score
      };

      setState(prev => ({
        ...prev,
        questions: updatedQuestions
      }));

      return true;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      return false;
    }
  };

  const handleSkip = () => {
    const updatedQuestions = [...state.questions];
    updatedQuestions[state.currentQuestionIndex] = {
      ...updatedQuestions[state.currentQuestionIndex],
      skipped: true
    };

    setState(prev => ({
      ...prev,
      questions: updatedQuestions,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  };

  const handleNext = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  };

  const handleComplete = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const feedbackSummary = await generateFeedbackSummary(state.questions);
      const sessionId = uuidv4();
      
      const session = {
        id: sessionId,
        date: new Date().toISOString(),
        technology: state.selectedTechnology,
        difficulty: state.difficulty,
        duration: Math.floor(Math.random() * 20) + 10,
        questions: state.questions,
        feedbackSummary,
        userId: user?.uid
      };

      const existingSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
      localStorage.setItem('interviewSessions', JSON.stringify([...existingSessions, session]));

      navigate(`/feedback/${sessionId}`);
    } catch (error) {
      console.error('Error generating feedback summary:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] pt-24 pb-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {!state.selectedTechnology && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <Brain className="w-16 h-16 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
                Choose Your Technology
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Select a technology to begin your practice interview. We'll generate relevant
                questions to help you prepare.
              </p>
            </motion.div>

            <TechnologySelector onSelect={handleTechnologySelect} />
          </>
        )}

        {state.selectedTechnology && !state.isStarted && (
          <InterviewSetup
            technology={state.selectedTechnology}
            onStart={handleStartInterview}
            onBack={handleBack}
          />
        )}

        {state.isStarted && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                  {state.selectedTechnology}
                </span>
                <span className="px-4 py-2 bg-purple-900/30 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 capitalize">
                  {state.difficulty}
                </span>
              </div>
              <span className="text-gray-400">
                Question {state.currentQuestionIndex + 1} of {state.questionCount}
              </span>
            </div>

            <QuestionCard
              question={state.questions[state.currentQuestionIndex]}
              isLastQuestion={state.currentQuestionIndex === state.questions.length - 1}
              onNext={handleNext}
              onSubmit={handleComplete}
              onAnswerSubmit={handleAnswerSubmit}
              onSkip={handleSkip}
              isCompleted={state.currentQuestionIndex >= state.questions.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}