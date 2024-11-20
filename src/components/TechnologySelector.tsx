import React from 'react';
import { 
  Code2, 
  Database, 
  Globe, 
  Cpu, 
  Cloud, 
  Server, 
  Layers, 
  Smartphone,
  Boxes,
  Binary,
  Container,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';

const technologies = [
  { id: 'javascript', name: 'JavaScript', icon: Code2, color: 'from-yellow-400 to-yellow-600' },
  { id: 'python', name: 'Python', icon: Binary, color: 'from-blue-400 to-blue-600' },
  { id: 'java', name: 'Java', icon: Cpu, color: 'from-red-400 to-red-600' },
  { id: 'csharp', name: 'C#', icon: Boxes, color: 'from-purple-400 to-purple-600' },
  { id: 'react', name: 'React', icon: Globe, color: 'from-cyan-400 to-cyan-600' },
  { id: 'angular', name: 'Angular', icon: Layers, color: 'from-red-400 to-pink-600' },
  { id: 'vue', name: 'Vue.js', icon: Workflow, color: 'from-green-400 to-emerald-600' },
  { id: 'nodejs', name: 'Node.js', icon: Server, color: 'from-green-400 to-green-600' },
  { id: 'sql', name: 'SQL', icon: Database, color: 'from-blue-400 to-indigo-600' },
  { id: 'mongodb', name: 'MongoDB', icon: Container, color: 'from-green-400 to-green-600' },
  { id: 'aws', name: 'AWS', icon: Cloud, color: 'from-orange-400 to-orange-600' },
  { id: 'mobile', name: 'Mobile Dev', icon: Smartphone, color: 'from-purple-400 to-pink-600' }
];

interface TechnologySelectorProps {
  onSelect: (technology: string) => void;
}

export function TechnologySelector({ onSelect }: TechnologySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {technologies.map(({ id, name, icon: Icon, color }, index) => (
        <motion.button
          key={id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(id)}
          className="group relative flex items-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
          
          <div className="relative flex items-center w-full">
            <div className={`p-3 bg-gradient-to-br ${color} rounded-lg bg-opacity-10`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {name}
              </h3>
              <p className="text-sm text-gray-400">
                Start Practice
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}