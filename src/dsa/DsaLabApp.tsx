import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Plus,
  Trash2,
  Search,
  Activity,
  Cpu
} from 'lucide-react';

export interface DsaLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const DsaLabApp: React.FC<DsaLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeDs, setActiveDs] = useState<'stack' | 'queue' | 'linkedlist' | 'bst'>('stack');

  // Stack Interactive State
  const [stackItems, setStackItems] = useState<number[]>([10, 20, 30]);
  const [stackInput, setStackInput] = useState<number>(40);

  const handlePushStack = () => {
    if (stackItems.length >= 8) return;
    setStackItems((prev) => [...prev, stackInput]);
    setStackInput((prev) => prev + 10);
  };

  const handlePopStack = () => {
    setStackItems((prev) => prev.slice(0, prev.length - 1));
  };

  // Queue Interactive State
  const [queueItems, setQueueItems] = useState<string[]>(['User A', 'User B', 'User C']);
  const [queueInput, setQueueInput] = useState('User D');

  const handleEnqueue = () => {
    if (queueItems.length >= 7) return;
    setQueueItems((prev) => [...prev, queueInput]);
    setQueueInput(`User ${String.fromCharCode(65 + queueItems.length + 1)}`);
  };

  const handleDequeue = () => {
    setQueueItems((prev) => prev.slice(1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      Data Structures Lab
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Visual DSA &amp; Big-O
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive Stack, Queue, Linked Lists, Trees &amp; side-by-side C/JS code
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'stack', label: '1. 📚 Stack (LIFO)' },
              { id: 'queue', label: '2. 🚶 Queue (FIFO)' },
              { id: 'linkedlist', label: '3. 🔗 Linked List' },
              { id: 'bst', label: '4. 🌲 Binary Search Tree' }
            ].map((tab) => {
              const isActive = activeDs === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDs(tab.id as any)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* STACK (LIFO) */}
        {activeDs === 'stack' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Stack Data Structure (Last-In, First-Out)</h2>
                <p className="text-xs text-slate-400 mt-1">Real-world applications: Function call stacks, browser Back/Forward, undo operations.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePushStack}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Push ({stackInput})
                </button>
                <button
                  onClick={handlePopStack}
                  disabled={stackItems.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Pop (Top)
                </button>
              </div>
            </div>

            {/* Visualizer Canvas & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-end min-h-[300px] space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Top of Stack (TOS)</div>
                <div className="w-48 flex flex-col-reverse gap-2">
                  {stackItems.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-bold text-center shadow-md animate-fade-in"
                    >
                      [{idx}] Value: {val}
                    </div>
                  ))}
                  {stackItems.length === 0 && (
                    <div className="p-6 text-center text-slate-600 italic">Stack is Empty (Underflow)</div>
                  )}
                </div>
                <div className="w-56 h-2 rounded-full bg-slate-700 mt-2" />
                <div className="text-[10px] text-slate-500">Base of Stack</div>
              </div>

              {/* Side-by-Side C Code Implementation */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span>C Language Implementation</span>
                  <span className="text-emerald-400 font-bold">Push/Pop: O(1)</span>
                </div>
                <pre className="text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`#define MAX 100
int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) { printf("Overflow\\n"); return; }
    stack[++top] = val;
}

int pop() {
    if (top == -1) { printf("Underflow\\n"); return -1; }
    return stack[top--];
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* QUEUE (FIFO) */}
        {activeDs === 'queue' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Queue Data Structure (First-In, First-Out)</h2>
                <p className="text-xs text-slate-400 mt-1">Real-world applications: CPU task scheduling, print queues, network packet buffers.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEnqueue}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Enqueue ({queueInput})
                </button>
                <button
                  onClick={handleDequeue}
                  disabled={queueItems.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Dequeue (Front)
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>&larr; FRONT (Deletes Here)</span>
                <span>REAR (Inserts Here) &rarr;</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto py-4">
                {queueItems.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono font-bold text-xs shrink-0 shadow-md"
                  >
                    [{idx}] {val}
                  </div>
                ))}
                {queueItems.length === 0 && (
                  <div className="text-slate-600 italic py-4">Queue is empty</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LINKED LIST & BST EXPLANATIONS */}
        {(activeDs === 'linkedlist' || activeDs === 'bst') && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white capitalize">{activeDs} Visual Architecture</h2>
            <p className="text-slate-300 leading-relaxed">
              {activeDs === 'linkedlist' && 'Unlike arrays with fixed contiguous memory, a Singly Linked List dynamically allocates non-contiguous nodes in the heap, connected via pointer references (`struct Node* next`). Insertion at head takes O(1) time without element shifting!'}
              {activeDs === 'bst' && 'In a Binary Search Tree (BST), all keys in the left subtree are smaller than the node, and all keys in the right subtree are larger. Search, insertion, and deletion operate in O(log n) average time!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
