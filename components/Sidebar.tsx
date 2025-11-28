
import React from 'react';
import { Home, BookOpen, Award, Settings, LogOut, Code, User, Star, Terminal } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: 'dashboard' | 'practice-hub') => void;
  activeView: string;
  totalXP?: number; // Added optional prop to show level
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView, totalXP = 0 }) => {
  
  // Calculate Level Logic
  const getLevelInfo = (xp: number) => {
    if (xp < 2500) return { rank: 'Junior Developer', next: 'Middle', min: 0, max: 2500, color: 'bg-green-400' };
    if (xp < 6000) return { rank: 'Middle Developer', next: 'Senior', min: 2500, max: 6000, color: 'bg-yellow-400' };
    return { rank: 'Senior Architect', next: 'Odoo Master', min: 6000, max: 15000, color: 'bg-purple-400' };
  };

  const level = getLevelInfo(totalXP);
  const progressPercent = Math.min(100, Math.max(0, ((totalXP - level.min) / (level.max - level.min)) * 100));

  return (
    <div className="w-20 lg:w-64 h-full bg-[#714B67] text-white flex flex-col justify-between transition-all duration-300 shadow-xl z-30 relative">
      <div>
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <Code className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tight">OdooCamp</span>
        </div>

        <nav className="mt-8 flex flex-col gap-2 px-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${activeView === 'dashboard' ? 'bg-white/20 shadow-inner translate-x-1' : 'hover:bg-white/10 hover:translate-x-1'}`}
          >
            <Home className="w-5 h-5 min-w-[20px]" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => onNavigate('practice-hub')}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${activeView === 'practice-hub' ? 'bg-white/20 shadow-inner translate-x-1' : 'hover:bg-white/10 hover:translate-x-1'}`}
          >
            <Terminal className="w-5 h-5 min-w-[20px]" />
            <span className="hidden lg:block font-medium">Modo Práctica</span>
          </button>

          <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all opacity-70 cursor-not-allowed hover:translate-x-1">
            <BookOpen className="w-5 h-5 min-w-[20px]" />
            <span className="hidden lg:block font-medium">Cursos</span>
          </button>

          <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all opacity-70 cursor-not-allowed hover:translate-x-1">
            <Award className="w-5 h-5 min-w-[20px]" />
            <span className="hidden lg:block font-medium">Certificados</span>
          </button>
        </nav>
      </div>

      {/* Career Progress Widget */}
      <div className="hidden lg:block p-4 mx-4 mb-4 bg-black/20 rounded-xl backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-full bg-white/10`}>
                <Star size={14} className="text-yellow-300 fill-yellow-300" />
            </div>
            <div>
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Nivel Actual</p>
                <p className="text-sm font-bold text-white">{level.rank}</p>
            </div>
        </div>
        
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-2">
            <div 
                className={`h-full ${level.color} transition-all duration-1000 ease-out`} 
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        <div className="flex justify-between mt-1">
             <span className="text-[10px] text-white/50">{totalXP} XP</span>
             <span className="text-[10px] text-white/50">{level.max} XP</span>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 lg:block hidden">
        <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 w-full transition-colors text-white/70 hover:text-white">
          <Settings className="w-5 h-5 min-w-[20px]" />
          <span className="font-medium">Ajustes</span>
        </button>
      </div>
    </div>
  );
};
