import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Plus, Play, Clock, Sparkles, BookOpen, CheckCircle2, 
  XCircle, RotateCcw, Award, ChevronRight, Filter, Download, Upload, 
  Trash2, Brain, BarChart3, AlertCircle 
} from 'lucide-react';
import { useGamificationStore } from '../../store/useGamificationStore';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  questions: QuizQuestion[];
  isCustom?: boolean;
}

const DEFAULT_QUIZ_SETS: QuizSet[] = [
  {
    id: 'bca-sem1-dsa',
    title: 'Data Structures & Algorithms Sprint',
    description: 'Arrays, Stacks, Queues, Trees, and Time Complexity fundamentals.',
    category: 'Computer Science',
    tags: ['DSA', 'BCA Sem 2', 'Algorithms'],
    questions: [
      {
        id: 'dsa-1',
        question: 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL tree)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'Because AVL trees maintain balance factor within [-1, 1], height is guaranteed to be O(log n).',
        topic: 'Trees',
        difficulty: 'medium'
      },
      {
        id: 'dsa-2',
        question: 'Which data structure is naturally utilized to evaluate postfix arithmetic expressions?',
        options: ['Queue', 'Stack', 'Linked List', 'Max Heap'],
        correctIndex: 1,
        explanation: 'Postfix evaluation processes operands by pushing to a stack and popping two operands when an operator is encountered.',
        topic: 'Stacks',
        difficulty: 'easy'
      },
      {
        id: 'dsa-3',
        question: 'What is the average time complexity of QuickSort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'QuickSort divides problem in half on average, leading to recurrence T(n) = 2T(n/2) + O(n) which solves to O(n log n).',
        topic: 'Sorting',
        difficulty: 'medium'
      },
      {
        id: 'dsa-4',
        question: 'In a circular queue with array size N, which condition confirms that the queue is full?',
        options: [
          '(rear + 1) % N == front',
          'rear == front',
          'rear == N - 1',
          'front == -1'
        ],
        correctIndex: 0,
        explanation: 'Circular queue uses modulo arithmetic. When next rear position matches front, the queue is full.',
        topic: 'Queues',
        difficulty: 'medium'
      },
      {
        id: 'dsa-5',
        question: 'Which graph traversal algorithm uses a FIFO Queue?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra with priority stack', 'Topological Sort with recursion'],
        correctIndex: 1,
        explanation: 'BFS explores neighbor vertices level by level, necessitating a FIFO queue to maintain exploration order.',
        topic: 'Graphs',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'bca-dbms-sql',
    title: 'DBMS & Relational Query Mastery',
    description: 'Normalization, ACID properties, Joins, and Relational Algebra.',
    category: 'Database Systems',
    tags: ['DBMS', 'SQL', 'BCA Sem 3'],
    questions: [
      {
        id: 'dbms-1',
        question: 'Which normal form eliminates transitive dependency of non-prime attributes on candidate keys?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctIndex: 2,
        explanation: '3NF requires 2NF and mandates that no non-prime attribute is transitively dependent on any candidate key (X -> Y requires X is superkey or Y is prime).',
        topic: 'Normalization',
        difficulty: 'medium'
      },
      {
        id: 'dbms-2',
        question: 'Which ACID property guarantees that changes of a committed transaction survive system crashes?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 3,
        explanation: 'Durability ensures that once a transaction commits, its modifications are permanently recorded via write-ahead logging (WAL) even during power failure.',
        topic: 'Transactions',
        difficulty: 'easy'
      },
      {
        id: 'dbms-3',
        question: 'What is the result of a LEFT OUTER JOIN between table A (5 rows) and table B (0 matching rows)?',
        options: ['0 rows', '5 rows with NULL values for table B columns', 'Compilation SQL syntax error', 'Cartesian product'],
        correctIndex: 1,
        explanation: 'LEFT JOIN retains all rows from the left table; unmatched rows from the right table are padded with NULLs.',
        topic: 'SQL Joins',
        difficulty: 'easy'
      },
      {
        id: 'dbms-4',
        question: 'What distinguishes BCNF from 3NF?',
        options: [
          'BCNF allows partial dependencies',
          'In BCNF, for every functional dependency X -> A, X MUST strictly be a superkey without exception',
          '3NF is strictly stronger than BCNF',
          'BCNF only applies to non-relational tables'
        ],
        correctIndex: 1,
        explanation: '3NF allows an exception if A is a prime attribute; BCNF removes this exception, requiring X to be a superkey for every non-trivial dependency.',
        topic: 'Normalization',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'bca-webdev-js',
    title: 'Modern Web & JavaScript Architecture',
    description: 'ES6, Event Loop, Closures, DOM, and Asynchronous JS.',
    category: 'Web Technology',
    tags: ['JavaScript', 'Frontend', 'WebDev'],
    questions: [
      {
        id: 'js-1',
        question: 'In the JavaScript event loop, which queue has precedence: Microtask Queue (Promises, queueMicrotask) or Macrotask Queue (setTimeout, setInterval)?',
        options: [
          'Macrotask queue always runs first',
          'Microtask queue is fully cleared before the next macrotask is processed',
          'They alternate in round-robin fashion',
          'Precedence is decided randomly by OS thread scheduler'
        ],
        correctIndex: 1,
        explanation: 'The event loop checks and drains the microtask queue to exhaustion after every single task before picking the next task from the macrotask queue.',
        topic: 'Event Loop',
        difficulty: 'hard'
      },
      {
        id: 'js-2',
        question: 'What is the primary advantage of `const` and `let` over `var` in modern JavaScript?',
        options: [
          'Faster execution by V8 engine',
          'Block scoping and prevention of accidental window pollution / hoisting hazards',
          'Automatic serialization to JSON',
          'Variables can never be reassigned'
        ],
        correctIndex: 1,
        explanation: '`let` and `const` adhere to lexical block scoping (`{}`) and exist in the Temporal Dead Zone (TDZ) before declaration, avoiding loose function-scoping bugs.',
        topic: 'ES6',
        difficulty: 'easy'
      },
      {
        id: 'js-3',
        question: 'What creates a JavaScript closure?',
        options: [
          'A function combined with references to its surrounding lexical environment',
          'A try/catch block enclosing asynchronous fetch',
          'An object created using Object.freeze()',
          'A web worker running in parallel'
        ],
        correctIndex: 0,
        explanation: 'A closure gives an inner function access to an outer enclosing function\'s scope variables even after the outer function has returned.',
        topic: 'Closures',
        difficulty: 'medium'
      }
    ]
  }
];

export const MyQuizModule: React.FC = () => {
  const { addXp, completeDailyMission } = useGamificationStore();
  const [quizSets, setQuizSets] = useState<QuizSet[]>(() => {
    try {
      const saved = localStorage.getItem('bca_custom_quizzes');
      if (saved) {
        return [...DEFAULT_QUIZ_SETS, ...JSON.parse(saved)];
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_QUIZ_SETS;
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'import' | 'play' | 'result'>('browse');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'revision'>('practice');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Custom Quiz Creation Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Computer Science');
  const [customDescription, setCustomDescription] = useState('');
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);
  const [qInput, setQInput] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);
  const [explanationInput, setExplanationInput] = useState('');

  // Import raw text state
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // Timer logic for timed mode
  useEffect(() => {
    if (activeTab !== 'play' || quizMode !== 'timed') return;
    if (timerSeconds <= 0) {
      // Auto advance or submit
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => {
      setTimerSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, quizMode, timerSeconds]);

  const startQuiz = (set: QuizSet, mode: 'practice' | 'timed' | 'revision') => {
    setSelectedQuiz(set);
    setQuizMode(mode);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimerSeconds(30);
    setActiveTab('play');
  };

  const handleSelectOption = (optIndex: number) => {
    if (userAnswers[currentQIndex] !== undefined && quizMode === 'practice') {
      return; // Already answered in practice mode
    }
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQIndex < selectedQuiz.questions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setTimerSeconds(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!selectedQuiz) return;
    let correctCount = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / selectedQuiz.questions.length) * 100);
    const earnedXp = Math.max(25, Math.round(correctCount * 15));

    // Award XP and complete daily mission
    addXp(earnedXp, `Quiz Completed: ${selectedQuiz.title}`);
    completeDailyMission('quiz-challenger');

    setActiveTab('result');
  };

  const handleAddQuestionToCustom = () => {
    if (!qInput.trim() || !opt0.trim() || !opt1.trim()) {
      alert('Please fill in the question and at least two options.');
      return;
    }

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}-${customQuestions.length}`,
      question: qInput.trim(),
      options: [opt0.trim(), opt1.trim(), opt2.trim() || 'N/A', opt3.trim() || 'N/A'],
      correctIndex: correctOpt,
      explanation: explanationInput.trim() || 'Correct answer verified.',
      topic: customCategory,
      difficulty: 'medium'
    };

    setCustomQuestions([...customQuestions, newQ]);
    setQInput('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanationInput('');
  };

  const handleSaveCustomQuiz = () => {
    if (!customTitle.trim() || customQuestions.length === 0) {
      alert('Please provide a quiz title and at least one question.');
      return;
    }

    const newQuiz: QuizSet = {
      id: `custom-quiz-${Date.now()}`,
      title: customTitle.trim(),
      description: customDescription.trim() || 'Custom user created quiz deck.',
      category: customCategory,
      tags: ['Custom', customCategory],
      questions: customQuestions,
      isCustom: true
    };

    const updated = [...quizSets, newQuiz];
    setQuizSets(updated);
    try {
      const customOnly = updated.filter(q => q.isCustom);
      localStorage.setItem('bca_custom_quizzes', JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }

    alert('Quiz saved successfully to your offline vault!');
    setCustomTitle('');
    setCustomDescription('');
    setCustomQuestions([]);
    setActiveTab('browse');
  };

  const handleImportText = () => {
    setImportError('');
    try {
      // Try JSON first
      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        if (questionsArray.length === 0) throw new Error('No questions found in JSON');
        
        const importedSet: QuizSet = {
          id: `import-${Date.now()}`,
          title: parsed.title || 'Imported Knowledge Deck',
          description: parsed.description || 'Imported from notes JSON',
          category: 'Imported',
          tags: ['Imported', 'Notes'],
          questions: questionsArray.map((q: any, i: number) => ({
            id: `imp-${i}`,
            question: q.question || 'Untitled Question',
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: q.explanation || 'Verified answer from notes',
            topic: q.topic || 'General',
            difficulty: q.difficulty || 'medium'
          })),
          isCustom: true
        };

        const updated = [...quizSets, importedSet];
        setQuizSets(updated);
        localStorage.setItem('bca_custom_quizzes', JSON.stringify(updated.filter(q => q.isCustom)));
        setActiveTab('browse');
        return;
      }

      // Plain text parser:
      // Q: question
      // A: opt1
      // B: opt2
      // C: opt3
      // D: opt4
      // Ans: A
      const blocks = importText.split(/\n\s*\n/);
      const parsedQuestions: QuizQuestion[] = [];

      blocks.forEach((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const qLine = lines.find(l => l.startsWith('Q:') || l.startsWith('Question:'));
        const ansLine = lines.find(l => l.startsWith('Ans:') || l.startsWith('Answer:'));
        const optLines = lines.filter(l => /^[A-D][\.\:\)]\s*/i.test(l));

        if (qLine && optLines.length >= 2) {
          const qText = qLine.replace(/^(Q:|Question:)\s*/i, '');
          const options = optLines.map(o => o.replace(/^[A-D][\.\:\)]\s*/i, ''));
          let correctIdx = 0;
          if (ansLine) {
            const letter = ansLine.replace(/^(Ans:|Answer:)\s*/i, '').trim().toUpperCase();
            if (letter === 'B') correctIdx = 1;
            else if (letter === 'C') correctIdx = 2;
            else if (letter === 'D') correctIdx = 3;
          }

          parsedQuestions.push({
            id: `txt-${idx}`,
            question: qText,
            options,
            correctIndex: correctIdx,
            explanation: 'Imported from text notes.',
            topic: 'Imported Notes',
            difficulty: 'medium'
          });
        }
      });

      if (parsedQuestions.length === 0) {
        throw new Error('Could not parse any valid questions. Ensure format is Q: ... / A: ... / B: ... / Ans: A');
      }

      const importedQuiz: QuizSet = {
        id: `import-${Date.now()}`,
        title: 'Imported Revision Deck',
        description: `Imported ${parsedQuestions.length} questions from text notes.`,
        category: 'Notes',
        tags: ['Imported', 'Text'],
        questions: parsedQuestions,
        isCustom: true
      };

      const updated = [...quizSets, importedQuiz];
      setQuizSets(updated);
      localStorage.setItem('bca_custom_quizzes', JSON.stringify(updated.filter(q => q.isCustom)));
      setActiveTab('browse');
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse questions.');
    }
  };

  const categories = ['all', ...Array.from(new Set(quizSets.map(q => q.category)))];
  const filteredQuizzes = filterCategory === 'all' 
    ? quizSets 
    : quizSets.filter(q => q.category === filterCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pt-20">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Brain className="w-3.5 h-3.5" />
              Active Recall Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Quiz & Active Recall Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Customizable test decks, note-to-quiz converter, timed speed drills, and XP mastery rewards.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Browse Decks
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Plus className="w-4 h-4" /> Build Custom
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Upload className="w-4 h-4" /> Import Notes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* TAB 1: BROWSE QUIZ DECKS */}
        {activeTab === 'browse' && (
          <div>
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    filterCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quiz Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                        {quiz.category}
                      </span>
                      <span className="text-xs font-semibold text-cyan-400">
                        {quiz.questions.length} Questions
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {quiz.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center gap-2">
                    <button
                      onClick={() => startQuiz(quiz, 'practice')}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Practice
                    </button>
                    <button
                      onClick={() => startQuiz(quiz, 'timed')}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors flex items-center justify-center gap-1 shadow-md shadow-cyan-500/10"
                    >
                      <Clock className="w-3.5 h-3.5" /> Timed (30s)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE QUIZ PLAY */}
        {activeTab === 'play' && selectedQuiz && (
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Play Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                  {selectedQuiz.title} • {quizMode.toUpperCase()} MODE
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">
                  Question {currentQIndex + 1} of {selectedQuiz.questions.length}
                </h2>
              </div>

              {quizMode === 'timed' && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timerSeconds <= 10 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                    : 'bg-slate-800 text-amber-400 border-slate-700'
                }`}>
                  <Clock className="w-4 h-4" />
                  {timerSeconds}s
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Topic: {selectedQuiz.questions[currentQIndex].topic}
              </span>
              <p className="text-lg sm:text-xl font-medium text-slate-100 mt-3 leading-relaxed">
                {selectedQuiz.questions[currentQIndex].question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {selectedQuiz.questions[currentQIndex].options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQIndex] === optIdx;
                const isAnswered = userAnswers[currentQIndex] !== undefined;
                const isCorrect = optIdx === selectedQuiz.questions[currentQIndex].correctIndex;

                let optionClass = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

                if (isAnswered && quizMode === 'practice') {
                  if (isCorrect) {
                    optionClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    optionClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionClass = 'bg-cyan-500/20 border-cyan-500 text-cyan-200';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${optionClass}`}
                  >
                    <span>{option}</span>
                    {isAnswered && quizMode === 'practice' && (
                      <span>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Practice Explanation */}
            {quizMode === 'practice' && userAnswers[currentQIndex] !== undefined && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mb-6 leading-relaxed">
                <span className="font-semibold text-cyan-400 block mb-1">Concept Breakdown:</span>
                {selectedQuiz.questions[currentQIndex].explanation}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('browse')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Exit Quiz
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={userAnswers[currentQIndex] === undefined}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 transition-colors flex items-center gap-1.5"
              >
                {currentQIndex === selectedQuiz.questions.length - 1 ? 'Finish & View Score' : 'Next Question'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ RESULT SUMMARY */}
        {activeTab === 'result' && selectedQuiz && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
            <p className="text-sm text-slate-400 mt-1">{selectedQuiz.title}</p>

            {/* Score Stats */}
            {(() => {
              let correct = 0;
              selectedQuiz.questions.forEach((q, i) => {
                if (userAnswers[i] === q.correctIndex) correct++;
              });
              const pct = Math.round((correct / selectedQuiz.questions.length) * 100);

              return (
                <div className="grid grid-cols-3 gap-3 my-6">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-2xl font-black text-cyan-400">{pct}%</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-1">Accuracy</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-2xl font-black text-emerald-400">
                      {correct} / {selectedQuiz.questions.length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase mt-1">Correct Answers</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-2xl font-black text-amber-400">+{Math.max(25, correct * 15)}</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-1">XP Earned</div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => startQuiz(selectedQuiz, quizMode)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Retry Quiz
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
              >
                Back to Decks
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CREATE CUSTOM QUIZ */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-1">Create Custom Quiz Deck</h2>
            <p className="text-xs text-slate-400 mb-6">Build questions for your personal study routine or university exam preparation.</p>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Quiz Deck Title</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    placeholder="e.g. Operating Systems File Architecture"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    placeholder="e.g. Computer Science / Cyber / Web"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={customDescription}
                  onChange={e => setCustomDescription(e.target.value)}
                  placeholder="Key concepts covered in this deck..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Question Builder Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 mb-6">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Question #{customQuestions.length + 1}
              </h3>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={qInput}
                    onChange={e => setQInput(e.target.value)}
                    placeholder="Enter question statement..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={correctOpt === 0}
                      onChange={() => setCorrectOpt(0)}
                    />
                    <input
                      type="text"
                      value={opt0}
                      onChange={e => setOpt0(e.target.value)}
                      placeholder="Option A (radio selects correct)"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={correctOpt === 1}
                      onChange={() => setCorrectOpt(1)}
                    />
                    <input
                      type="text"
                      value={opt1}
                      onChange={e => setOpt1(e.target.value)}
                      placeholder="Option B"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={correctOpt === 2}
                      onChange={() => setCorrectOpt(2)}
                    />
                    <input
                      type="text"
                      value={opt2}
                      onChange={e => setOpt2(e.target.value)}
                      placeholder="Option C"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={correctOpt === 3}
                      onChange={() => setCorrectOpt(3)}
                    />
                    <input
                      type="text"
                      value={opt3}
                      onChange={e => setOpt3(e.target.value)}
                      placeholder="Option D"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={explanationInput}
                    onChange={e => setExplanationInput(e.target.value)}
                    placeholder="Short explanation for practice mode..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestionToCustom}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
                >
                  + Append Question
                </button>
              </div>
            </div>

            {/* List of Questions Added */}
            {customQuestions.length > 0 && (
              <div className="mb-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium">Added Questions ({customQuestions.length}):</span>
                {customQuestions.map((q, i) => (
                  <div key={q.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="truncate max-w-md">{i + 1}. {q.question}</span>
                    <button
                      onClick={() => setCustomQuestions(customQuestions.filter(x => x.id !== q.id))}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomQuiz}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors"
              >
                Save Deck to Vault
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: IMPORT FROM NOTES */}
        {activeTab === 'import' && (
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-1">Import Questions from Notes</h2>
            <p className="text-xs text-slate-400 mb-6">
              Paste questions directly from your class notes or JSON exports. Supports standard format:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 mb-4 leading-relaxed">
              Q: What is a deadlock in OS?<br />
              A: Condition where processes are blocked waiting for each other<br />
              B: Memory leak in kernel<br />
              C: Infinite loop in CPU<br />
              D: Thread preemption<br />
              Ans: A
            </div>

            <textarea
              rows={8}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste notes or JSON here..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 mb-3"
            />

            {importError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {importError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('browse')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back to Decks
              </button>
              <button
                onClick={handleImportText}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Upload className="w-4 h-4" /> Convert & Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
