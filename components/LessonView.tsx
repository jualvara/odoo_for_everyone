
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, Module } from '../types';
import { ArrowLeft, Send, Check, RefreshCw, Cpu, Terminal, Play, RotateCcw, Lock, BookOpen, MessageCircle, Split, GripVertical, Lightbulb, CheckCircle2, Copy, ArrowRight, Info, Zap, ChevronRight, ChevronLeft, Repeat, Book, Plus } from 'lucide-react';
import { generateTutorResponse, validateCodeSnippet, generateQuizQuestion } from '../services/geminiService';
import { SNIPPETS } from '../constants';

interface LessonViewProps {
  lesson: Lesson;
  module: Module;
  onBack: () => void;
  onComplete: (xp: number) => void;
}

type TabType = 'theory' | 'practice' | 'chat';

const ODOO_TIPS = [
    "Usa `scaffold` para crear la estructura de tu módulo: `odoo-bin scaffold my_module`.",
    "Siempre define `_description` en tus modelos para evitar warnings en los logs.",
    "Usa `fields.Monetary` para precios; maneja automáticamente la divisa.",
    "En XML, usa `position='after'` o `position='inside'` para heredar vistas sin romperlas.",
    "Recuerda añadir tus archivos CSV de seguridad en el `__manifest__.py`.",
    "Usa `sudo()` con cuidado: salta las reglas de registro y permisos.",
    "Para depurar JS en OWL, usa la extensión de Odoo Debug en Chrome."
];

// --- FLASHCARD COMPONENT ---
const FlashcardDeck = ({ content, onComplete }: { content: string, onComplete: () => void }) => {
    const cards = JSON.parse(content);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent flip
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        } else {
            setCompleted(true);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-96 animate-slide-up">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <AwardIcon size={64} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Repaso Completado!</h3>
                <p className="text-gray-500 mb-8">Has revisado todas las tarjetas.</p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => { setCompleted(false); setCurrentIndex(0); setIsFlipped(false); }}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <Repeat size={20} /> Repasar de nuevo
                    </button>
                    <button 
                        onClick={onComplete}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        Terminar <CheckCircle2 size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-10 perspective-1000">
             {/* Progress Dots */}
             <div className="flex gap-2 mb-8">
                {cards.map((_: any, idx: number) => (
                    <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#017E84]' : 'w-2 bg-gray-300'}`}></div>
                ))}
             </div>

             {/* Card Container */}
             <div 
                className="relative w-full max-w-xl h-80 cursor-pointer group perspective-1000"
                onClick={handleFlip}
             >
                <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* FRONT */}
                    <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-10 text-center hover:border-[#017E84]/30 hover:shadow-2xl transition-all">
                        <span className="text-xs font-bold text-[#017E84] uppercase tracking-widest mb-4">Pregunta</span>
                        <h3 className="text-2xl font-bold text-gray-800 leading-snug">{cards[currentIndex].q}</h3>
                        <p className="absolute bottom-6 text-xs text-gray-400 font-medium animate-pulse">Haz clic para voltear</p>
                    </div>

                    {/* BACK */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#017E84] to-[#01656a] text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-10 text-center">
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Respuesta</span>
                        <p className="text-xl font-medium leading-relaxed">{cards[currentIndex].a}</p>
                    </div>
                </div>
             </div>

             {/* Controls */}
             <div className="flex items-center gap-8 mt-10">
                 <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                 >
                     <ChevronLeft size={24} />
                 </button>
                 <span className="font-mono font-bold text-gray-400">{currentIndex + 1} / {cards.length}</span>
                 <button 
                    onClick={handleNext}
                    className="p-4 rounded-full bg-[#714B67] text-white hover:bg-[#5d3d54] transition-all shadow-lg hover:scale-110 active:scale-95"
                 >
                     <ChevronRight size={24} />
                 </button>
             </div>
             
             {/* Styles for 3D Flip (Inline since Tailwind arbitrary values can be tricky without config) */}
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
             `}</style>
        </div>
    );
};

// Helper Component for Scroll Animations
const FadeInBlock: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref}
            style={{ transitionDelay: `${delay || 0}ms` }}
            className={`transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            {children}
        </div>
    );
};

// Helper for Copy Code
const CodeBlock = ({ code, lang }: { code: string, lang: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-800 bg-[#1e1e1e] group hover:border-[#714B67] transition-colors duration-300">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="ml-3 text-xs text-gray-400 font-mono font-bold uppercase">{lang}</span>
                </div>
                <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
            </div>
            <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-300 leading-relaxed">{code.trim()}</pre>
            </div>
        </div>
    );
};

export const LessonView: React.FC<LessonViewProps> = ({ lesson, module, onBack, onComplete }) => {
  // Determine default tab based on lesson type
  const [activeTab, setActiveTab] = useState<TabType>(
      lesson.type === 'code' ? 'practice' : 'theory'
  );
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Code & Console State
  const [code, setCode] = useState(lesson.type === 'code' ? '# Escribe tu código aquí\n\n' : '# Área de pruebas (Sandbox)\n# Puedes ejecutar código Python aquí\n\nprint("Hola Odoo!")');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; feedback: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false); // Toggle Snippet panel
  
  // Quiz State
  const [quizData, setQuizData] = useState<any>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Lesson Progress State
  const [isSolved, setIsSolved] = useState(lesson.type === 'theory' || lesson.type === 'flashcard');
  
  // UI State: Resizing & Tips
  const [leftPanelWidth, setLeftPanelWidth] = useState(35); // Percentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTip, setCurrentTip] = useState(ODOO_TIPS[0]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Calculate Module Progress
  const currentLessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
  const progressPercentage = ((currentLessonIndex + (isSolved ? 1 : 0)) / module.lessons.length) * 100;

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput, activeTab]);

  // Random Tip
  useEffect(() => {
      setCurrentTip(ODOO_TIPS[Math.floor(Math.random() * ODOO_TIPS.length)]);
  }, [lesson.id]);

  // Load Quiz if lesson type is quiz
  useEffect(() => {
    if (lesson.type === 'quiz' && !quizData) {
      loadQuiz();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  // Resizing Logic
  const startResizing = (e: React.MouseEvent) => {
      setIsResizing(true);
      e.preventDefault();
  };

  const stopResizing = () => {
      setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
          if (newWidth > 20 && newWidth < 80) { // Min/Max constraints
              setLeftPanelWidth(newWidth);
          }
      }
  };

  useEffect(() => {
      if (isResizing) {
          window.addEventListener('mousemove', resize);
          window.addEventListener('mouseup', stopResizing);
      } else {
          window.removeEventListener('mousemove', resize);
          window.removeEventListener('mouseup', stopResizing);
      }
      return () => {
          window.removeEventListener('mousemove', resize);
          window.removeEventListener('mouseup', stopResizing);
      };
  }, [isResizing]);

  const loadQuiz = async () => {
     setQuizData(null);
     const q = await generateQuizQuestion(lesson.content);
     setQuizData(q);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsTyping(true);

    const response = await generateTutorResponse(
      chatInput,
      `Módulo: ${module.title}. Lección: ${lesson.title}. Contenido: ${lesson.content}`,
      newHistory
    );

    setChatHistory([...newHistory, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setValidationResult(null);
    setConsoleOutput('Iniciando entorno...\n');
    
    await new Promise(r => setTimeout(r, 600));

    const result = await validateCodeSnippet(lesson.title + "\n" + lesson.content, code);
    
    setValidationResult({ valid: result.valid, feedback: result.feedback });
    setConsoleOutput(prev => prev + result.consoleOutput);
    setIsExecuting(false);
    
    if(result.valid && lesson.type === 'code') {
        setIsSolved(true);
    }
  };

  const handleResetCode = () => {
      setCode(lesson.type === 'code' ? '# Escribe tu código aquí\n\n' : '# Sandbox\nprint("Hola Mundo")');
      setConsoleOutput('');
      setValidationResult(null);
      if (lesson.type === 'code') setIsSolved(false);
  };
  
  const insertSnippet = (snippetCode: string) => {
      setCode(prev => prev + '\n' + snippetCode);
      setShowSnippets(false);
  };

  const handleQuizSubmit = (index: number) => {
      setQuizSelected(index);
      if (index === quizData.correctIndex) {
          setQuizFeedback("¡Correcto! Bien hecho.");
          setIsSolved(true);
      } else {
          setQuizFeedback(`Incorrecto. ${quizData.explanation}`);
          setIsSolved(false);
      }
  };

  // Improved Theory Renderer with Blocks and Animations
  const renderTheoryContent = (fullWidth: boolean = false) => {
    if (lesson.type === 'flashcard') {
        return <FlashcardDeck content={lesson.content} onComplete={() => onComplete(lesson.xp)} />;
    }

    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(lesson.content)) !== null) {
        if (match.index > lastIndex) {
            const textChunk = lesson.content.substring(lastIndex, match.index);
            textChunk.split(/\n\n+/).forEach(t => {
                if(t.trim()) parts.push({ type: 'text', content: t });
            });
        }
        parts.push({ type: 'code', content: match[1] });
        lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < lesson.content.length) {
        const textChunk = lesson.content.substring(lastIndex);
        textChunk.split(/\n\n+/).forEach(t => {
             if(t.trim()) parts.push({ type: 'text', content: t });
        });
    }

    return (
      <div className={`space-y-6 pb-20 ${fullWidth ? 'mx-auto max-w-2xl' : ''}`}>
        {parts.map((part, i) => {
            let contentNode;
            const block = part.content;

            if (part.type === 'code') {
                 let codeLang = 'text';
                 let codeBody = block;
                 const firstLineBreak = block.indexOf('\n');
                 if (firstLineBreak !== -1) {
                     const firstLine = block.substring(0, firstLineBreak).trim();
                     if (firstLine && !firstLine.includes(' ')) {
                         codeLang = firstLine;
                         codeBody = block.substring(firstLineBreak + 1);
                     }
                 }
                 contentNode = <CodeBlock code={codeBody} lang={codeLang} />;
            } else {
                if (block.trim().startsWith('# ')) {
                     contentNode = (
                        <div className="mb-8 mt-2 text-center">
                            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{block.replace('# ', '')}</h1>
                            <div className="h-1.5 w-24 bg-[#714B67] rounded-full mx-auto mt-4"></div>
                        </div>
                    );
                } else if (block.trim().startsWith('### ')) {
                    contentNode = (
                        <div className="mt-8 mb-4 bg-white p-4 rounded-xl border-l-4 border-[#017E84] shadow-sm">
                            <h3 className="text-lg font-bold text-[#017E84] uppercase tracking-wider m-0">{block.replace('### ', '')}</h3>
                        </div>
                    );
                } else if (block.includes('**Nota:**') || block.includes('**Tip:**')) {
                    const isTip = block.includes('**Tip:**');
                    const cleanText = block.replace(/\*\*(Nota|Tip):\*\*/, '').trim();
                    contentNode = (
                         <div className={`my-6 p-6 rounded-2xl flex gap-4 items-start relative shadow-sm border-2 transform hover:scale-[1.02] transition-transform ${
                            isTip 
                            ? 'bg-amber-50 border-amber-200 text-amber-900' 
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}>
                            <div className="shrink-0 p-3 bg-white rounded-full shadow-sm border border-gray-100 -mt-2">
                                 {isTip ? <Cpu className="w-8 h-8 text-[#714B67]" /> : <Info className="w-8 h-8 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-xs uppercase opacity-70 mb-1">
                                    {isTip ? 'Consejo de OdooBot' : 'Nota Importante'}
                                </p>
                                <p className="m-0 font-medium text-lg leading-relaxed">{cleanText}</p>
                            </div>
                        </div>
                    );
                } else if (block.trim().startsWith('- ')) {
                    const items = block.trim().split('\n');
                    contentNode = (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 my-6">
                             {items.map((item, idx) => (
                                 <div key={idx} className="flex items-start gap-4 mb-4 last:mb-0 group">
                                     <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-gray-500 font-bold flex items-center justify-center shrink-0 group-hover:bg-[#714B67] group-hover:text-white transition-colors">
                                        {idx + 1}
                                     </div>
                                     <span className="text-gray-700 text-lg leading-relaxed pt-0.5">{item.replace('- ', '')}</span>
                                 </div>
                             ))}
                        </div>
                    );
                } else {
                     if (!block.trim()) return null;
                     contentNode = (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <p className="text-gray-600 leading-8 text-lg">{block}</p>
                        </div>
                     );
                }
            }

            return (
                <FadeInBlock key={i} delay={i < 4 ? i * 150 : 0}>
                    {contentNode}
                </FadeInBlock>
            );
        })}
        
        {lesson.type === 'quiz' && (
             <FadeInBlock delay={600}>
                {renderQuiz()}
             </FadeInBlock>
        )}

        {activeTab === 'theory' && fullWidth && lesson.type !== 'quiz' && (
             <FadeInBlock delay={800}>
                 <div className="mt-12 flex justify-center pb-10">
                    {lesson.type === 'theory' ? (
                        <button 
                            onClick={() => {
                                setIsSolved(true);
                                onComplete(lesson.xp);
                            }}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
                        >
                            <CheckCircle2 size={24} />
                            Completar y Continuar
                            <ArrowRight size={24} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => setActiveTab('practice')}
                            className="bg-[#017E84] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#016d72] hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
                        >
                            <Terminal size={24} />
                            Ir a la Práctica
                            <ArrowRight size={24} />
                        </button>
                    )}
                 </div>
             </FadeInBlock>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (!quizData) return (
         <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
             <RefreshCw className="animate-spin mx-auto text-[#017E84] mb-4 w-10 h-10" />
             <p className="text-gray-500 font-medium">OdooBot está preparando tu examen...</p>
         </div>
    );

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb size={120} />
            </div>
            
            <div className="mb-8 relative z-10">
                <div className="inline-block bg-[#017E84]/10 px-3 py-1 rounded-full mb-3">
                    <span className="text-xs font-extrabold text-[#017E84] uppercase tracking-wider">Desafío de Conocimiento</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 leading-tight">{quizData.question}</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
                {quizData.options.map((opt: string, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => handleQuizSubmit(idx)}
                        disabled={quizSelected !== null}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 ${
                            quizSelected === null 
                            ? 'bg-white hover:bg-gray-50 border-gray-200 hover:border-[#017E84] hover:shadow-md' 
                            : idx === quizData.correctIndex 
                                ? 'bg-green-50 border-green-500 text-green-900 shadow-md' 
                                : quizSelected === idx 
                                    ? 'bg-red-50 border-red-500 text-red-900' 
                                    : 'opacity-50 border-gray-200 grayscale'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">{opt}</span>
                            {quizSelected !== null && idx === quizData.correctIndex && 
                                <div className="bg-green-500 text-white rounded-full p-1 animate-pop-in"><Check size={20} /></div>
                            }
                        </div>
                    </button>
                ))}
            </div>
            
            {quizFeedback && (
                <div className={`mt-8 p-6 rounded-2xl flex items-start gap-4 animate-slide-up ${
                    quizSelected === quizData.correctIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                     <div className="shrink-0 p-2 bg-white/50 rounded-full">
                         {quizSelected === quizData.correctIndex ? <CheckCircle2 size={24}/> : <div className="text-2xl">⚠️</div>}
                     </div>
                    <div>
                        <p className="font-bold text-lg mb-1">{quizSelected === quizData.correctIndex ? '¡Excelente Trabajo!' : 'Ups, intentalo de nuevo'}</p>
                        <p className="leading-relaxed opacity-90">{quizFeedback}</p>
                        {quizSelected === quizData.correctIndex && (
                            <button 
                                onClick={() => onComplete(lesson.xp)}
                                className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-green-800 transition-all flex items-center gap-2"
                            >
                                Continuar <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="h-full flex flex-col bg-gray-50 font-sans">
      
      {/* 0. Module Progress Bar (Top) */}
      <div className="h-2 w-full bg-gray-200 flex items-center justify-start z-30">
        <div 
            className="h-full bg-green-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)] relative" 
            style={{ width: `${progressPercentage}%` }}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-green-500 shadow-sm"></div>
        </div>
      </div>

      {/* 1. Top Header: Navigation & Status */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-[#714B67]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                {lesson.title}
                {isSolved && <span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} strokeWidth={3}/></span>}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-[#714B67] uppercase tracking-wider">{module.title}</span>
                <span className="text-gray-300">|</span>
                <span>Lección {currentLessonIndex + 1} / {module.lessons.length}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-yellow-200">
               <span className="text-yellow-500">⚡</span>
               {lesson.xp} XP
           </div>
           <button 
             onClick={() => isSolved && onComplete(lesson.xp)}
             disabled={!isSolved}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                 isSolved 
                 ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 hover:translate-y-0.5' 
                 : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
             }`}
           >
             {!isSolved && <Lock size={14} />}
             Completar Lección
           </button>
        </div>
      </div>

      {/* 2. Tab Navigation Bar */}
      <div className="flex justify-center border-b bg-white px-6 shrink-0 shadow-sm z-10">
        <div className="flex gap-8">
            <button 
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 py-4 px-2 text-sm font-bold border-b-4 transition-all ${
                activeTab === 'theory' 
                ? 'border-[#714B67] text-[#714B67]' 
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
            }`}
            >
            <BookOpen size={18} strokeWidth={activeTab === 'theory' ? 3 : 2} />
            {lesson.type === 'flashcard' ? 'FLASHCARDS' : 'APRENDER'}
            </button>
            
            {lesson.type === 'code' && (
                <button 
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-bold border-b-4 transition-all ${
                    activeTab === 'practice' 
                    ? 'border-[#017E84] text-[#017E84]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}
                >
                <Terminal size={18} strokeWidth={activeTab === 'practice' ? 3 : 2} />
                PRACTICAR
                </button>
            )}

            <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-4 px-2 text-sm font-bold border-b-4 transition-all ${
                activeTab === 'chat' 
                ? 'border-purple-500 text-purple-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
            }`}
            >
            <MessageCircle size={18} strokeWidth={activeTab === 'chat' ? 3 : 2} />
            TUTOR IA
            </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        
        {/* VIEW: THEORY / FLASHCARDS */}
        {activeTab === 'theory' && (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <div className="max-w-3xl mx-auto py-10 px-6">
                    {renderTheoryContent(true)}
                </div>
            </div>
        )}

        {/* VIEW: PRACTICE (Split View: Instructions + IDE) */}
        {activeTab === 'practice' && (
            <div className="h-full flex flex-col md:flex-row" ref={containerRef}>
                {/* Left: Resizable Instructions */}
                <div 
                    className="hidden md:flex flex-col border-r bg-gray-50 overflow-hidden"
                    style={{ width: `${leftPanelWidth}%` }}
                >
                    <div className="p-6 overflow-y-auto scrollbar-thin h-full">
                        <div className="mb-6 flex items-center gap-2 text-gray-500 uppercase text-xs font-bold tracking-wider">
                            <Split size={14} /> Panel de Instrucciones
                        </div>
                        {renderTheoryContent()}

                        {/* Odoo Tips Card */}
                        <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-amber-200 w-16 h-16 rounded-full opacity-20"></div>
                            <div className="flex items-center gap-3 text-amber-700 mb-3">
                                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                    <Lightbulb size={18} className="fill-amber-400 text-amber-500" />
                                </div>
                                <span className="font-extrabold text-sm uppercase tracking-wide">Odoo Pro Tip</span>
                            </div>
                            <p className="text-amber-900 font-medium leading-relaxed italic">"{currentTip}"</p>
                        </div>
                    </div>
                </div>

                {/* Resizer Handle */}
                <div 
                    className="w-1.5 bg-gray-200 hover:bg-[#714B67] cursor-col-resize flex items-center justify-center transition-colors z-10 hidden md:flex group"
                    onMouseDown={startResizing}
                >
                     <div className="h-10 w-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></div>
                </div>

                {/* Right: IDE (Takes remaining width) */}
                <div className={`flex-1 flex flex-col bg-[#1e1e1e] h-full min-w-0 relative transition-all duration-500 ${validationResult?.valid ? 'border-green-500/50' : 'border-l border-gray-700'}`}>
                    
                    {/* Snippet Overlay Panel */}
                    {showSnippets && (
                        <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#252526] border-l border-gray-700 z-20 overflow-y-auto shadow-2xl animate-fade-in">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <span className="text-gray-300 font-bold text-sm flex items-center gap-2">
                                    <Book size={14} /> Cheatsheet
                                </span>
                                <button onClick={() => setShowSnippets(false)} className="text-gray-500 hover:text-white">x</button>
                            </div>
                            <div className="p-2 space-y-1">
                                {SNIPPETS.map((snip, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => insertSnippet(snip.code)}
                                        className="w-full text-left p-3 rounded hover:bg-white/10 group transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-gray-300 text-xs font-bold group-hover:text-white">{snip.label}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">{snip.category}</span>
                                        </div>
                                        <pre className="text-[10px] text-gray-500 truncate font-mono">{snip.code.substring(0, 30)}...</pre>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Success Overlay Animation & Next Lesson Button */}
                    {validationResult?.valid && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1e1e1e]/90 backdrop-blur-sm transition-all duration-500">
                            <div className="bg-green-500 text-white p-6 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-pop-in border-4 border-white/20 mb-8">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            
                            <div className="text-center animate-slide-up">
                                <h3 className="text-white text-4xl font-bold mb-3 tracking-tight">¡Misión Cumplida!</h3>
                                <p className="text-gray-300 mb-8 text-lg font-medium">El código funciona perfectamente.</p>
                                
                                <div className="flex gap-4 justify-center">
                                     <button 
                                        onClick={() => setValidationResult(null)}
                                        className="px-6 py-3.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        Quedarse aquí
                                    </button>
                                    <button 
                                        onClick={() => onComplete(lesson.xp)}
                                        className="bg-green-500 text-white px-10 py-3.5 rounded-xl font-bold text-xl shadow-xl hover:bg-green-400 hover:scale-105 hover:shadow-green-500/20 transition-all flex items-center gap-3"
                                    >
                                        Siguiente Lección <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                     {/* Editor Area */}
                    <div className="flex-1 relative border-b border-gray-700 flex flex-col min-h-0">
                        <div className="bg-[#252526] text-xs text-gray-400 px-4 py-2.5 flex justify-between items-center border-b border-black/20 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#017E84] shadow-[0_0_8px_rgba(1,126,132,0.6)]"></div>
                                <span className="font-mono text-gray-300 font-bold">main.py</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowSnippets(!showSnippets)}
                                    className={`hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded ${showSnippets ? 'bg-[#714B67] text-white' : 'bg-white/5'}`}
                                >
                                    <Book size={10} /> Snippets
                                </button>
                                <button onClick={handleResetCode} className="hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold bg-white/5 px-2 py-1 rounded">
                                    <RotateCcw size={10} /> Reiniciar
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full flex-1 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none outline-none p-6 leading-relaxed"
                            spellCheck={false}
                        />
                    </div>

                    {/* Console Area */}
                    <div className="h-[35%] flex flex-col bg-[#0e0e0e] text-white font-mono text-sm border-t-4 border-[#2d2d2d] min-h-0">
                        <div className="bg-[#1a1a1a] text-xs text-gray-400 px-4 py-2 flex justify-between shrink-0 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Terminal size={12} />
                                <span className="font-bold uppercase tracking-wider">Terminal</span>
                            </div>
                            {validationResult && (
                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${validationResult.valid ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                                    {validationResult.valid ? <Check size={10} /> : <div className="w-2 h-2 rounded-sm bg-red-500"></div>}
                                    {validationResult.valid ? "Aprobado" : "Error"}
                                </span>
                            )}
                        </div>
                        <div className="p-4 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700" ref={consoleRef}>
                            {!consoleOutput && !isExecuting && (
                                <div className="text-gray-600 italic mt-2 flex flex-col gap-1">
                                    <span>$ waiting for input...</span>
                                    <span>$ ready to execute python3 main.py</span>
                                </div>
                            )}
                            
                            {consoleOutput && (
                                <div className={`whitespace-pre-wrap font-mono text-xs leading-5 ${validationResult?.valid ? 'text-green-400' : 'text-gray-300'}`}>
                                    {consoleOutput}
                                </div>
                            )}
                            
                            {isExecuting && (
                                <div className="mt-2 text-yellow-500 flex items-center gap-2">
                                    <span className="animate-spin">◴</span>
                                    <span>Compilando...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-[#1e1e1e] border-t border-gray-700 flex justify-end gap-4 shrink-0 shadow-2xl z-10">
                        {validationResult && (
                            <div className={`flex-1 flex items-center px-4 rounded-xl text-sm border-l-4 ${validationResult.valid ? 'bg-green-900/10 text-green-300 border-green-500' : 'bg-red-900/10 text-red-300 border-red-500'}`}>
                                <span className="truncate font-medium">{validationResult.feedback}</span>
                            </div>
                        )}
                        <button 
                            onClick={handleRunCode}
                            disabled={isExecuting}
                            className={`font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg min-w-[180px] transform active:scale-95 ${
                                isExecuting 
                                ? 'bg-gray-700 cursor-wait text-gray-400' 
                                : 'bg-gradient-to-r from-[#017E84] to-[#015f63] hover:brightness-110 text-white shadow-[#017E84]/20'
                            }`}
                        >
                            {isExecuting ? <RefreshCw className="animate-spin" size={20}/> : <Play size={20} fill="currentColor" />}
                            {isExecuting ? 'Ejecutando...' : 'Ejecutar Código'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: CHAT (Tutor) */}
        {activeTab === 'chat' && (
             <div className="h-full flex flex-col bg-gray-50 max-w-4xl mx-auto shadow-xl border-x border-gray-100">
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatContainerRef}>
                  {chatHistory.length === 0 && (
                      <div className="text-center text-gray-400 mt-20 p-8">
                          <div className="bg-white p-6 rounded-3xl shadow-sm w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-gray-100">
                              <Cpu className="text-[#714B67]" size={48} />
                          </div>
                          <h3 className="font-bold text-gray-800 text-xl">Hola, soy OdooBot</h3>
                          <p className="text-gray-500 mt-2 max-w-xs mx-auto text-lg">Pregúntame sobre cualquier duda que tengas en esta lección.</p>
                      </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[85%] rounded-3xl p-5 text-sm shadow-sm border ${
                        msg.role === 'user' 
                          ? 'bg-[#714B67] text-white rounded-br-none border-[#714B67]' 
                          : 'bg-white text-gray-800 border-gray-100 rounded-bl-none'
                      }`}>
                         {msg.text.split('\n').map((t, idx) => <p key={idx} className={`leading-relaxed ${idx > 0 ? "mt-3" : ""}`}>{t}</p>)}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-none p-5 flex gap-1.5 shadow-sm">
                        <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t bg-white">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200 focus-within:border-[#714B67] focus-within:ring-2 focus-within:ring-[#714B67]/10 transition-all shadow-inner">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Escribe tu pregunta aquí..."
                      className="flex-1 bg-transparent border-none outline-none text-base px-2 text-gray-700 placeholder-gray-400"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      className="p-3 bg-[#714B67] text-white rounded-xl hover:bg-[#5d3d54] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
        )}

      </div>
    </div>
  );
};

// Check Circle Icon
const CheckCircle = ({ size, className }: { size: number, className?: string }) => (
    <svg 
    className={className}
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
const AwardIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
);
