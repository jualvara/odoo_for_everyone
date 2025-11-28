
import React, { useMemo } from 'react';
import { CURRICULUM, BADGES } from '../constants';
import { Track, Module, Lesson } from '../types';
import { Play, CheckCircle, Lock, Award, Compass, Database, Code, Layers, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  userProgress: any;
  onSelectLesson: (track: Track, module: Module, lesson: Lesson) => void;
}

const data = [
  { name: 'Lun', xp: 20 },
  { name: 'Mar', xp: 50 },
  { name: 'Mie', xp: 30 },
  { name: 'Jue', xp: 90 },
  { name: 'Vie', xp: 40 },
  { name: 'Sab', xp: 120 },
  { name: 'Dom', xp: 100 },
];

const getTrackIcon = (iconName: string) => {
    switch (iconName) {
        case 'Compass': return <Compass className="w-8 h-8 opacity-80" />;
        case 'Database': return <Database className="w-8 h-8 opacity-80" />;
        case 'Code': return <Code className="w-8 h-8 opacity-80" />;
        case 'Layers': return <Layers className="w-8 h-8 opacity-80" />;
        default: return <Award className="w-8 h-8 opacity-80" />;
    }
};

const getLevelBadge = (level: string) => {
    switch(level) {
        case 'Junior': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">Junior</span>;
        case 'Middle': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-200">Middle</span>;
        case 'Senior': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-200">Senior</span>;
        default: return null;
    }
};

export const Dashboard: React.FC<DashboardProps> = ({ userProgress, onSelectLesson }) => {
  
  // Logic to find the next available lesson
  const nextStep = useMemo(() => {
    for (const track of CURRICULUM) {
      for (const module of track.modules) {
        for (const lesson of module.lessons) {
          if (!userProgress.completedLessonIds.includes(lesson.id)) {
            return { track, module, lesson };
          }
        }
      }
    }
    return null; // Course completed
  }, [userProgress.completedLessonIds]);

  // Group Tracks by Level
  const levels = {
      Junior: CURRICULUM.filter(t => t.level === 'Junior'),
      Middle: CURRICULUM.filter(t => t.level === 'Middle'),
      Senior: CURRICULUM.filter(t => t.level === 'Senior'),
  };

  const unlockedBadgesInfo = BADGES.filter(b => userProgress.unlockedBadges.includes(b.id));

  const renderTrackCard = (track: Track) => (
    <div key={track.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md mb-8">
        <div className={`p-6 bg-gradient-to-r text-white ${
            track.level === 'Junior' ? 'from-green-600 to-green-700' :
            track.level === 'Middle' ? 'from-yellow-600 to-yellow-700' :
            'from-purple-600 to-purple-800'
        }`}>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {getLevelBadge(track.level)}
                </div>
                <h3 className="text-xl font-bold">{track.title}</h3>
                <p className="text-white/80 text-sm mt-1 max-w-md">{track.description}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                {getTrackIcon(track.icon)}
            </div>
        </div>
        </div>
        <div className="p-4">
        {track.modules.map((module) => (
            <div key={module.id} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-3 px-1">
                <div>
                    <h4 className="font-bold text-gray-800">{module.title}</h4>
                    <p className="text-xs text-gray-500">{module.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                module.difficulty === 'Principiante' ? 'bg-green-100 text-green-700' :
                module.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
                }`}>{module.difficulty}</span>
            </div>
            
            <div className="space-y-2">
                {module.lessons.map((lesson) => {
                    const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
                    const isNext = nextStep?.lesson.id === lesson.id;
                    const isFlashcard = lesson.type === 'flashcard';
                    
                    return (
                    <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(track, module, lesson)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                        isNext 
                            ? 'bg-[#017E84]/5 border-[#017E84] ring-1 ring-[#017E84]/30' 
                            : isCompleted 
                                ? 'bg-green-50/50 border-green-100 opacity-80 hover:opacity-100'
                                : 'bg-white border-gray-200 hover:border-[#714B67] hover:bg-[#714B67]/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : isNext 
                                    ? 'bg-[#017E84] text-white shadow-md'
                                    : isFlashcard ? 'bg-indigo-100 text-indigo-500' : 'bg-gray-100 text-gray-400'
                        }`}>
                            {isCompleted ? <CheckCircle size={16} /> : 
                             isFlashcard ? <Zap size={14} fill="currentColor" /> :
                             <Play size={14} fill={isNext ? "currentColor" : "none"} />}
                        </div>
                        <span className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-700'}`}>
                            {lesson.title}
                        </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isNext && <span className="text-[10px] uppercase font-bold text-[#017E84] bg-[#017E84]/10 px-2 py-0.5 rounded">Siguiente</span>}
                            <span className="text-xs text-gray-400 font-semibold">{lesson.xp} XP</span>
                        </div>
                    </button>
                    );
                })}
            </div>
            </div>
        ))}
        </div>
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hola, Developer 👋</h1>
          <p className="text-gray-500 mt-1">Tu camino a Odoo Expert comienza aquí.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-6 w-full md:w-auto justify-around md:justify-start">
            <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold">Racha</p>
                <p className="text-xl font-bold text-orange-500">🔥 {userProgress.streakDays} días</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-semibold">XP Total</p>
                <p className="text-xl font-bold text-[#714B67]">{userProgress.totalXP} XP</p>
            </div>
        </div>
      </header>

      {/* NEXT LESSON HERO CARD */}
      {nextStep && (
        <div className="mb-12 bg-gradient-to-r from-[#017E84] to-[#015f63] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm border border-white/10">
                  Siguiente paso
                </span>
                <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                  <Star size={12} className="fill-white/80" /> {nextStep.track.level}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{nextStep.lesson.title}</h2>
              <p className="text-white/90 text-lg max-w-2xl">
                {nextStep.module.title} • {nextStep.module.description}
              </p>
            </div>
            
            <button 
              onClick={() => onSelectLesson(nextStep.track, nextStep.module, nextStep.lesson)}
              className="bg-white text-[#017E84] px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 whitespace-nowrap group-hover:bg-gray-50"
            >
              <Play fill="currentColor" size={20} />
              Continuar Aprendiendo
            </button>
          </div>
          
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-12"></div>
          <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
            <Compass size={200} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Curriculum Column */}
        <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
                 <Compass className="w-6 h-6 text-[#714B67]" />
                 <h2 className="text-2xl font-bold text-gray-800">Plan de Carrera</h2>
            </div>
          
            {levels.Junior.length > 0 && (
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                     <div className="h-px bg-gray-200 flex-1"></div>
                     <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nivel Junior</span>
                     <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                {levels.Junior.map(renderTrackCard)}
            </div>
            )}

            {levels.Middle.length > 0 && (
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                     <div className="h-px bg-gray-200 flex-1"></div>
                     <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nivel Middle</span>
                     <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                {levels.Middle.map(renderTrackCard)}
            </div>
            )}

            {levels.Senior.length > 0 && (
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                     <div className="h-px bg-gray-200 flex-1"></div>
                     <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nivel Senior</span>
                     <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                {levels.Senior.map(renderTrackCard)}
            </div>
            )}
        </div>

        {/* Sidebar Column: Stats & Activity */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Actividad Semanal</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            <Area type="monotone" dataKey="xp" stroke="#714B67" fillOpacity={1} fill="url(#colorXp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* BADGES SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Tus Logros</h3>
                    <span className="text-xs text-gray-500 font-medium">{unlockedBadgesInfo.length} / {BADGES.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {BADGES.map((badge) => {
                        const isUnlocked = userProgress.unlockedBadges.includes(badge.id);
                        return (
                            <div key={badge.id} className="relative group flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm transition-all ${isUnlocked ? 'bg-yellow-100 grayscale-0' : 'bg-gray-100 grayscale opacity-50'}`}>
                                    {badge.icon}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-black text-white text-[10px] p-2 rounded z-20 text-center pointer-events-none">
                                    <p className="font-bold">{badge.title}</p>
                                    <p className="opacity-80">{badge.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="bg-[#017E84] p-6 rounded-xl shadow-sm text-white relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Certificación Odoo</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">Al completar el nivel Middle, podrás optar al examen de certificación oficial simulado.</p>
                    <button className="bg-white text-[#017E84] px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity">
                        Ver Detalles
                    </button>
                 </div>
                 <div className="absolute -right-6 -bottom-6 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <ShieldCheck size={120} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
