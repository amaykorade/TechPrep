import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Send, SkipForward, MessageSquare } from 'lucide-react';
import { Question } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  isLastQuestion: boolean;
  onNext: () => void;
  onSubmit: () => void;
  onAnswerSubmit: (answer: string) => Promise<boolean>;
  onSkip: () => void;
  isCompleted: boolean;
}

export function QuestionCard({
  question,
  isLastQuestion,
  onNext,
  onSubmit,
  onAnswerSubmit,
  onSkip,
  isCompleted,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return;
    setIsEvaluating(true);
    const success = await onAnswerSubmit(answer);
    setIsEvaluating(false);
    
    if (success) {
      setAnswer('');
      if (isLastQuestion) {
        onSubmit();
      } else {
        onNext();
      }
    }
  };

  const handleSkip = () => {
    onSkip();
    setAnswer('');
    if (isLastQuestion) {
      onSubmit();
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setAnswer(text);
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Interview Complete!
        </h2>
        <p className="text-gray-300 mb-6">
          You have completed all the questions. Let us review your performance!
        </p>
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
        >
          View Detailed Feedback
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <span className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
          Question {question.id} of 5
        </span>
        <button
          onClick={handleSkip}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-700/50"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip Question
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {question.question}
            </h3>
            <p className="text-gray-400 text-sm">
              Provide a clear and concise answer. You can use voice recording or type directly.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <VoiceRecorder
          onTranscriptionComplete={handleTranscriptionComplete}
          isRecording={isRecording}
          onRecordingComplete={() => setIsRecording(false)}
          onToggleRecording={() => setIsRecording(!isRecording)}
        />

        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-40 p-4 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Your answer will appear here after speaking, or type directly..."
            disabled={isEvaluating || isRecording}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {isEvaluating ? "Evaluating your answer..." : "Click submit when you are ready to continue"}
            </p>
            <button
              onClick={handleAnswerSubmit}
              disabled={isEvaluating || !answer.trim() || isRecording}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Evaluating...
                </>
              ) : (
                <>
                  Submit & Continue
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}