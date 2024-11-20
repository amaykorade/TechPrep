import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Code2, 
  Brain,
  Database,
  Globe,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { InterviewSession } from '../types';

const technologyIcons = {
  javascript: Code2,
  python: Brain,
  sql: Database,
  react: Globe,
};

export function FeedbackHistoryPage() {
  const navigate = useNavigate();
  
  // In a real app, this would come from your backend/localStorage
  const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interviewSessions') || '[]');

  const getTechnologyIcon = (technology: string) => {
    return technologyIcons[technology as keyof typeof technologyIcons] || Code2;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Interview History
          </h1>
        </div>

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-gray-700"
          >
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Interview Sessions Yet</h2>
            <p className="text-gray-400 mb-6">Complete your first interview to start building your history!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Start New Interview
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session, index) => {
              const TechnologyIcon = getTechnologyIcon(session.technology);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-700/50 rounded-lg">
                        <TechnologyIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-white capitalize">
                          {session.technology} Interview
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {session.duration} mins
                          </span>
                          <span>
                            {format(new Date(session.date), 'MMM d, yyyy')}
                          </span>
                          <span className="text-gray-500">
                            {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Overall Score</div>
                        <div className={`text-2xl font-bold ${getScoreColor(session.feedbackSummary.overallScore)}`}>
                          {session.feedbackSummary.overallScore}/10
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/feedback/${session.id}`)}
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                        aria-label="View details"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                      <div className="text-sm text-gray-400">Questions</div>
                      <div className="text-lg font-semibold text-white">
                        {session.questions.length} Total
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                      <div className="text-sm text-gray-400">Effectiveness</div>
                      <div className="text-lg font-semibold text-white">
                        {session.feedbackSummary.effectiveness}%
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                      <div className="text-sm text-gray-400">Accuracy</div>
                      <div className="text-lg font-semibold text-white">
                        {session.feedbackSummary.accuracy}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}