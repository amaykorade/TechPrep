import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, GraduationCap, Hash, ArrowLeft } from 'lucide-react';

interface InterviewSetupProps {
  technology: string;
  onStart: (difficulty: string, questionCount: number) => void;
  onBack: () => void;
}

export function InterviewSetup({ technology, onStart, onBack }: InterviewSetupProps) {
  const [difficulty, setDifficulty] = React.useState('beginner');
  const [questionCount, setQuestionCount] = React.useState(5);

  const difficulties = [
    { id: 'beginner', label: 'Beginner', description: 'Fundamental concepts and basic questions' },
    { id: 'intermediate', label: 'Intermediate', description: 'Advanced concepts and practical scenarios' },
    { id: 'advanced', label: 'Advanced', description: 'Expert-level problems and system design' },
  ];

  const questionCounts = [3, 5, 7, 10];

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to technology selection
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
          Customize Your {technology} Interview
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Select your proficiency level and the number of questions
        </p>

        <div className="space-y-6">
          <div>
            <label className="flex items-center text-gray-300 mb-4">
              <GraduationCap className="w-5 h-5 mr-2" />
              Select Difficulty
            </label>
            <div className="grid gap-4">
              {difficulties.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setDifficulty(level.id)}
                  className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                    difficulty === level.id
                      ? 'bg-blue-900/30 border-blue-500/50'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-white mb-1">{level.label}</div>
                  <div className="text-sm text-gray-400">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-gray-300 mb-4">
              <Hash className="w-5 h-5 mr-2" />
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-3">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                    questionCount === count
                      ? 'bg-blue-900/30 border-blue-500/50 text-white'
                      : 'bg-gray-900/30 border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onStart(difficulty, questionCount)}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
          >
            Start Interview
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}