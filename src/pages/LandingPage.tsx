import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Code2, 
  Mic, 
  Clock, 
  Award,
  ChevronRight,
  Users,
  Trophy,
  BookOpen,
  Star,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      value: "50,000+",
      label: "Active Users",
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      value: "95%",
      label: "Success Rate",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      value: "1M+",
      label: "Questions Answered",
    },
    {
      icon: <Star className="w-6 h-6 text-purple-400" />,
      value: "4.9/5",
      label: "User Rating",
    },
  ];

  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-blue-400" />,
      title: "Multiple Technologies",
      description: "Practice interviews across various programming languages and frameworks"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Feedback",
      description: "Get instant, detailed feedback on your responses using advanced AI"
    },
    {
      icon: <Mic className="w-6 h-6 text-pink-400" />,
      title: "Voice Recognition",
      description: "Practice speaking your answers naturally with voice recognition"
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-400" />,
      title: "Timed Responses",
      description: "Simulate real interview conditions with timed answer sessions"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Boost Your Confidence",
      description: "Practice in a risk-free environment to build your interview confidence"
    },
    {
      icon: <Target className="w-8 h-8 text-red-400" />,
      title: "Stay Current",
      description: "Access questions based on current industry trends and requirements"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      title: "Track Progress",
      description: "Monitor your improvement with detailed performance analytics"
    }
  ];

  return (
    <div className="bg-[#0B1120] min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Master Your Tech Interviews
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Practice with our AI-powered interview simulator. Get real-time feedback on
              your answers, confidence, and technical knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/practice')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
              >
                Start Practice Now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Create Free Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose TechPrep AI?
            </h2>
            <p className="text-xl text-gray-300">
              Elevate your interview preparation with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300">
              Our platform provides all the tools you need to prepare for technical interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Ace Your Technical Interviews?
          </h2>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}