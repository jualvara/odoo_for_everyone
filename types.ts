
export enum Difficulty {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado'
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content OR JSON string for flashcards
  type: 'theory' | 'code' | 'quiz' | 'flashcard';
  xp: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: string;
  level: 'Junior' | 'Middle' | 'Senior'; // Added level property
  description: string;
  icon: string;
  modules: Module[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}

export interface Snippet {
  label: string;
  code: string;
  category: 'Fields' | 'Methods' | 'ORM' | 'XML';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  initialCode: string;
  task: string;
}

export interface UserProgress {
  currentTrackId: string;
  completedLessonIds: string[];
  totalXP: number;
  streakDays: number;
  unlockedBadges: string[]; // IDs of unlocked badges
}

export type ViewState = 'dashboard' | 'lesson' | 'practice-hub';
