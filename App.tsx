
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonView } from './components/LessonView';
import { PracticeHub } from './components/PracticeHub';
import { ViewState, Track, Module, Lesson, UserProgress, Challenge } from './types';
import { BADGES } from './constants';

function App() {
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  
  // Navigation State
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // User State - Initialize with function to check localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('odooMastery_progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentTrackId: 'track-1',
      completedLessonIds: [],
      totalXP: 0,
      streakDays: 1,
      unlockedBadges: []
    };
  });

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('odooMastery_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Check for Badges Effect
  useEffect(() => {
    const newBadges: string[] = [];
    BADGES.forEach(badge => {
      if (!userProgress.unlockedBadges.includes(badge.id) && badge.condition(userProgress)) {
        newBadges.push(badge.id);
      }
    });

    if (newBadges.length > 0) {
      setUserProgress(prev => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, ...newBadges]
      }));
      // Optional: Add toast notification logic here for "Badge Unlocked!"
      // alert(`¡Nuevo logro desbloqueado!`); 
    }
  }, [userProgress.totalXP, userProgress.completedLessonIds, userProgress.streakDays]);


  const handleNavigate = (view: ViewState) => {
    setViewState(view);
  };

  const handleLessonSelect = (track: Track, module: Module, lesson: Lesson) => {
    setActiveTrack(track);
    setActiveModule(module);
    setActiveLesson(lesson);
    setViewState('lesson');
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    // Convert challenge to lesson structure to reuse LessonView
    const challengeLesson: Lesson = {
        id: challenge.id,
        title: challenge.title,
        type: 'code',
        xp: challenge.xp,
        content: `
# ${challenge.title}
### Misión:
${challenge.task}

### Descripción:
${challenge.description}

\`\`\`python
${challenge.initialCode}
\`\`\`
        `
    };

    const challengeModule: Module = {
        id: 'mod-practice',
        title: 'Modo Práctica',
        description: 'Desafíos del Mundo Real',
        difficulty: challenge.difficulty,
        lessons: [challengeLesson] // Dummy list
    };

    setActiveLesson(challengeLesson);
    setActiveModule(challengeModule);
    setViewState('lesson');
  };

  const handleLessonComplete = (xp: number) => {
    if (!activeLesson) return;

    // Award XP only if not completed before
    if (!userProgress.completedLessonIds.includes(activeLesson.id)) {
        setUserProgress(prev => ({
            ...prev,
            totalXP: prev.totalXP + xp,
            completedLessonIds: [...prev.completedLessonIds, activeLesson.id]
        }));
    }
    
    // Return to dashboard or practice hub depending on context
    if (activeLesson.id.startsWith('chal-')) {
        setViewState('practice-hub');
    } else {
        setViewState('dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        onNavigate={handleNavigate} 
        activeView={viewState} 
        totalXP={userProgress.totalXP}
      />
      
      <main className="flex-1 h-full relative">
        {viewState === 'dashboard' && (
          <Dashboard 
            userProgress={userProgress}
            onSelectLesson={handleLessonSelect}
          />
        )}

        {viewState === 'practice-hub' && (
          <PracticeHub 
            onSelectChallenge={handleChallengeSelect}
          />
        )}
        
        {viewState === 'lesson' && activeLesson && activeModule && (
          <div className="absolute inset-0 bg-white z-10 animate-fade-in">
             <LessonView 
               lesson={activeLesson}
               module={activeModule}
               onBack={() => setViewState(activeLesson.id.startsWith('chal-') ? 'practice-hub' : 'dashboard')}
               onComplete={handleLessonComplete}
             />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
