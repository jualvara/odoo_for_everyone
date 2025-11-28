
import React from 'react';
import { PRACTICE_CHALLENGES } from '../constants';
import { Challenge } from '../types';
import { Terminal, Shield, Database, ChevronRight, AlertTriangle, Zap } from 'lucide-react';

interface PracticeHubProps {
  onSelectChallenge: (challenge: Challenge) => void;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ onSelectChallenge }) => {
  const getIcon = (id: string) => {
    if (id.includes('singleton')) return <AlertTriangle className="text-orange-500" size={32} />;
    if (id.includes('sql')) return <Shield className="text-red-500" size={32} />;
    return <Database className="text-blue-500" size={32} />;
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-[#714B67] p-2 rounded-lg text-white">
                <Terminal size={24} />
            </div>
            Modo Práctica
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
            Resuelve problemas reales de desarrollo en Odoo. Sin teoría, solo código.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRACTICE_CHALLENGES.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => onSelectChallenge(challenge)}
            className="group bg-white rounded-2xl p-6 text-left border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#714B67]/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={64} />
            </div>
            
            <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    {getIcon(challenge.id)}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    challenge.difficulty === 'Principiante' ? 'bg-green-100 text-green-700' :
                    challenge.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {challenge.difficulty}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#714B67] transition-colors">{challenge.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{challenge.description}</p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400">
                    <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    {challenge.xp} XP
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#714B67] group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
