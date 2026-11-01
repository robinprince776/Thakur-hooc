import React, { useState, useEffect } from 'react';
import { Lock, Calculator, CheckSquare, Plus, Trash2, Unlock } from 'lucide-react';

interface StealthModeOverlayProps {
  isActive: boolean;
  onExitStealth: () => void;
}

export const StealthModeOverlay: React.FC<StealthModeOverlayProps> = ({
  isActive,
  onExitStealth
}) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'todo'>('calc');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcMemory, setCalcMemory] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [inputBuffer, setInputBuffer] = useState<string>('');

  // To-Do / Office Task Manager State
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([
    { id: 1, text: 'Quarterly financial report audit & Excel reconciling', completed: true },
    { id: 2, text: 'Client compliance risk assessment documentation', completed: false },
    { id: 3, text: 'Q3 vendor invoice processing & tax verification', completed: false },
    { id: 4, text: 'Review team weekly sprint performance metrics', completed: true }
  ]);
  const [newTaskText, setNewTaskText] = useState<string>('');

  // Pin Unlock Buffer
  const [secretPinCode, setSecretPinCode] = useState<string>('');
  const [showPinPrompt, setShowPinPrompt] = useState<boolean>(false);

  // Keyboard listener for stealth mode
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret code 1307 typing detection
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        setSecretPinCode((prev) => (prev + e.key).slice(-4));
      } else if (e.key === 'Enter') {
        if (secretPinCode.endsWith('1307') || calcDisplay === '1307' || calcDisplay.endsWith('1307')) {
          onExitStealth();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, secretPinCode, calcDisplay, onExitStealth]);

  if (!isActive) return null;

  // Real Calculator button click logic
  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setInputBuffer('');
      setCalcMemory(null);
      setCalcOp(null);
      return;
    }

    if (val === '=') {
      // Secret check
      if (calcDisplay === '1307' || inputBuffer === '1307' || secretPinCode.endsWith('1307')) {
        onExitStealth();
        return;
      }

      try {
        // Safe math evaluation
        const sanitized = (calcMemory && calcOp ? `${calcMemory}${calcOp}${calcDisplay}` : calcDisplay)
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        // evaluate simple math
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcDisplay(String(Math.round(res * 10000) / 10000));
        setCalcMemory(null);
        setCalcOp(null);
      } catch {
        setCalcDisplay('Error');
      }
      return;
    }

    if (['+', '-', '×', '÷'].includes(val)) {
      setCalcMemory(calcDisplay);
      setCalcOp(val);
      setCalcDisplay('0');
      return;
    }

    // Number or decimal
    setCalcDisplay((prev) => {
      const next = prev === '0' && val !== '.' ? val : prev + val;
      setInputBuffer(next);
      return next;
    });

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(val)) {
      setSecretPinCode((prev) => (prev + val).slice(-4));
    }
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 text-slate-100 flex flex-col font-sans select-none animate-fade-in">
      {/* Hyper-realistic Office Corporate Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Calculator className="w-4 h-4 text-slate-400" />
            <span>Workstation Utilities Suite v4.12</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
            <span>System Load: 12%</span>
            <span>·</span>
            <span>Memory: 4.2 GB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle Exit Lock for convenience */}
          <button
            onClick={() => setShowPinPrompt(!showPinPrompt)}
            className="p-1 rounded text-slate-700 hover:text-slate-500 transition-colors"
            title="System Security"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('calc')}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${
                activeTab === 'calc' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('todo')}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${
                activeTab === 'todo' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit To-Do
            </button>
          </div>
        </div>
      </header>

      {/* Secret PIN Modal prompt if user prefers manual unlock */}
      {showPinPrompt && (
        <div className="bg-slate-950/90 border-b border-slate-800 p-2 flex items-center justify-center gap-2 text-xs">
          <span className="text-slate-400">Unlock Pin:</span>
          <input
            type="password"
            maxLength={4}
            placeholder="****"
            value={secretPinCode}
            onChange={(e) => {
              const val = e.target.value;
              setSecretPinCode(val);
              if (val === '1307') {
                onExitStealth();
              }
            }}
            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono"
          />
          <button
            onClick={() => {
              if (secretPinCode === '1307') onExitStealth();
            }}
            className="px-2 py-1 rounded bg-slate-800 text-slate-200 hover:text-white"
          >
            Unlock
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        {activeTab === 'calc' ? (
          /* Realistic Standard Office Scientific Calculator */
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Standard 12-Digit Desk</span>
              <span className="text-slate-600">STEALTH-OFFICE</span>
            </div>

            {/* Display */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-right overflow-hidden">
              <div className="text-xs text-slate-500 font-mono h-4">
                {calcMemory} {calcOp}
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-slate-100 truncate">
                {calcDisplay}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2.5 font-mono font-bold text-sm">
              {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '00', '='].map(
                (btn) => {
                  const isOp = ['÷', '×', '-', '+', '='].includes(btn);
                  const isAction = ['C', '±', '%'].includes(btn);
                  return (
                    <button
                      key={btn}
                      onClick={() => handleCalcBtn(btn)}
                      className={`h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                        btn === '='
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                          : isOp
                          ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                          : isAction
                          ? 'bg-slate-850 hover:bg-slate-800 text-slate-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      {btn}
                    </button>
                  );
                }
              )}
            </div>

            <p className="text-[10px] text-center text-slate-600 font-mono">
              💡 Hint: Enter secret PIN (1307) and press "=" to return to ecosystem
            </p>
          </div>
        ) : (
          /* Realistic Boring Corporate Audit Task Manager */
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <span>Internal Project Sprint Tasks</span>
                </h2>
                <p className="text-xs text-slate-500">Corporate Compliance &amp; Regulatory Tracking</p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
              </span>
            </div>

            {/* Task Add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add compliance checklist item..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden"
              />
              <button
                onClick={handleAddTask}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 gap-3"
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="rounded accent-blue-600"
                    />
                    <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-slate-600 hover:text-slate-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onExitStealth}
                className="text-[11px] font-mono text-slate-700 hover:text-slate-500 transition-colors underline cursor-pointer"
              >
                Press Shift + Esc to unlock
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[10px] text-slate-600 font-mono">
        <span>Corporate Privacy Guard · Active Status: Anonymous</span>
        <span>Type PIN 1307 to unlock</span>
      </footer>
    </div>
  );
};
