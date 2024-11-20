import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Brain } from 'lucide-react';
import { TechnologySelector } from '../components/TechnologySelector';
import { QuestionCard } from '../components/QuestionCard';
import { generateQuestions, evaluateAnswer, generateFeedbackSummary } from '../services/geminiService';
import { Question, InterviewState } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [state, setState] = useState<InterviewState>({
    currentQuestionIndex: 0,
    questions: [],
    selectedTechnology: '',
    isStarted: false,
    isCompleted: false,
    isLoading: false
  });

  const handleTechnologySelect = async (technology: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const questionTexts = await generateQuestions(technology);
      const questions: Question[] = questionTexts.map((text, index) => ({
        id: index + 1,
        question: text,
        technology
      }));

      setState(prev => ({
        ...prev,
        selectedTechnology: technology,
        questions,
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!state.isStarted) {
    return (
      <div className="min-h-screen bg-[#0B1120] py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
        
        <div className="max-w-7xl mx-auto relative z-10">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
      
      <div className="max-w-3xl mx-auto relative z-10">
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
    </div>
  );
}