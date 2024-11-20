import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Question, FeedbackSummary, InterviewSession } from '../types';
import { motion } from 'framer-motion';

export function FeedbackPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // Get session from localStorage
  const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B1120] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-200 mb-4">Session not found</h1>
          <button
            onClick={() => navigate('/history')}
            className="text-blue-400 hover:text-blue-300"
          >
            Return to History
          </button>
        </div>
      </div>
    );
  }

  const { questions, feedbackSummary } = session;

  return (
    <div className="min-h-screen bg-[#0B1120] py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8 border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Interview Performance Summary</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30">
              <h3 className="text-xl font-semibold text-blue-300 mb-2">Overall Score</h3>
              <p className="text-4xl font-bold text-blue-400">{feedbackSummary.overallScore}/10</p>
            </div>
            <div className="bg-green-900/30 p-6 rounded-lg border border-green-500/30">
              <h3 className="text-xl font-semibold text-green-300 mb-2">Effectiveness</h3>
              <p className="text-4xl font-bold text-green-400">{feedbackSummary.effectiveness}%</p>
            </div>
            <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Accuracy</h3>
              <p className="text-4xl font-bold text-purple-400">{feedbackSummary.accuracy}%</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-2">
              {feedbackSummary.improvementAreas.map((area, index) => (
                <li key={index} className="text-gray-300">{area}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recommended Learning Resources
            </h3>
            <div className="space-y-4">
              {feedbackSummary.recommendedResources.map((resource, index) => (
                <div key={index} className="border-l-4 border-blue-500/50 pl-4">
                  <h4 className="font-semibold text-gray-200 mb-1">{resource.title}</h4>
                  <p className="text-gray-400 mb-2">{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Visit Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Detailed Question Analysis</h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="border-b border-gray-700 pb-8 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">Question {q.id}</h3>
                  {q.skipped ? (
                    <span className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30">
                      Skipped
                    </span>
                  ) : (
                    <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                      Score: {q.score}/10
                    </span>
                  )}
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-700">
                  <p className="text-gray-300">{q.question}</p>
                </div>
                {!q.skipped && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-300 mb-2">Your Answer:</h4>
                      <p className="text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        {q.userAnswer}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Feedback:</h4>
                      <p className="text-gray-400">{q.feedback}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}