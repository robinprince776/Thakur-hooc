import React, { useState, useEffect } from 'react';
import { NumberSystemType, NumberSolverResult } from '../types';
import { solveNumberSystem } from '../utils/numberSolver';
import {
  Check,
  Copy,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Layers,
  Table as TableIcon
} from 'lucide-react';

interface LogicSolverProps {
  initialType?: NumberSystemType;
  initialInput?: string;
  onSaveBookmark: (item: {
    type: 'logic';
    title: string;
    subtitle: string;
    data: any;
  }) => void;
  isBookmarked: (id: string) => boolean;
}

export const LogicSolver: React.FC<LogicSolverProps> = ({
  initialType = 'dec-to-bin',
  initialInput = '25',
  onSaveBookmark,
  isBookmarked
}) => {
  const [selectedType, setSelectedType] = useState<NumberSystemType>(initialType);
  const [input1, setInput1] = useState<string>(initialInput);
  const [input2, setInput2] = useState<string>('');
  const [bitWidth, setBitWidth] = useState<number>(8);
  const [gateType, setGateType] = useState<string>('AND');
  const [gateInA, setGateInA] = useState<string>('1');
  const [gateInB, setGateInB] = useState<string>('0');
  const [kmapVars, setKmapVars] = useState<number>(2);
  const [kmapMinterms, setKmapMinterms] = useState<number[]>([1, 3]);
  const [arithmeticOp, setArithmeticOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [arithmeticBase, setArithmeticBase] = useState<number>(8);

  const [result, setResult] = useState<NumberSolverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedFullSteps, setCopiedFullSteps] = useState(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialType) setSelectedType(initialType);
    if (initialInput) setInput1(initialInput);
  }, [initialType, initialInput]);

  const conversionOptions: { value: NumberSystemType; label: string; group: string; placeholder: string; defaultVal: string }[] = [
    // Standard Base Conversions
    { value: 'dec-to-bin', label: 'Decimal → Binary (e.g. 25 or 25.625)', group: 'Base Conversions', placeholder: 'e.g. 25, 25.625, 10.5, 100', defaultVal: '25.625' },
    { value: 'dec-to-oct', label: 'Decimal → Octal (e.g. 75 or 25.625)', group: 'Base Conversions', placeholder: 'e.g. 75, 25.625, 128.5', defaultVal: '25.625' },
    { value: 'dec-to-hex', label: 'Decimal → Hexadecimal (e.g. 255 or 25.625)', group: 'Base Conversions', placeholder: 'e.g. 255, 25.625, 100.25', defaultVal: '25.625' },
    { value: 'bin-to-dec', label: 'Binary → Decimal (e.g. 1101 or 11001.101)', group: 'Base Conversions', placeholder: 'e.g. 1101, 11001.101, 10.11', defaultVal: '11001.101' },
    { value: 'bin-to-oct', label: 'Binary → Octal (e.g. 110101 or 11001.101)', group: 'Base Conversions', placeholder: 'e.g. 110101, 11001.101', defaultVal: '11001.101' },
    { value: 'bin-to-hex', label: 'Binary → Hexadecimal (e.g. 11011110 or 11001.101)', group: 'Base Conversions', placeholder: 'e.g. 11011110, 11001.101', defaultVal: '11001.101' },
    { value: 'oct-to-dec', label: 'Octal → Decimal (e.g. 37 or 31.5)', group: 'Base Conversions', placeholder: 'e.g. 37, 31.5, 77.2', defaultVal: '31.5' },
    { value: 'oct-to-bin', label: 'Octal → Binary (e.g. 45 or 31.5)', group: 'Base Conversions', placeholder: 'e.g. 45, 31.5, 72.4', defaultVal: '31.5' },
    { value: 'hex-to-dec', label: 'Hexadecimal → Decimal (e.g. 2F or 19.A)', group: 'Base Conversions', placeholder: 'e.g. 2F, 19.A, 3B.8', defaultVal: '19.A' },
    { value: 'hex-to-bin', label: 'Hexadecimal → Binary (e.g. A5 or 19.A)', group: 'Base Conversions', placeholder: 'e.g. A5, 19.A, 2F.8', defaultVal: '19.A' },
    { value: 'dec-to-all', label: 'Decimal → All (e.g. 25.625 to Bin+Oct+Hex)', group: 'Base Conversions', placeholder: 'e.g. 25.625, 64, 150', defaultVal: '25.625' },

    // Arithmetic (Binary, Octal, Hexadecimal)
    { value: 'bin-add', label: 'Binary Addition (A + B)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Binary A (e.g. 1011)', defaultVal: '1011' },
    { value: 'bin-sub', label: 'Binary Subtraction (A - B)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Binary A (e.g. 1100)', defaultVal: '1100' },
    { value: 'bin-mul', label: 'Binary Multiplication (A × B)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Binary A (e.g. 1011)', defaultVal: '1011' },
    { value: 'bin-div', label: 'Binary Division (A ÷ B)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Binary A (e.g. 1100)', defaultVal: '1100' },
    { value: 'oct-add', label: 'Octal Addition (A + B in Base 8)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Octal A (e.g. 75)', defaultVal: '75' },
    { value: 'oct-sub', label: 'Octal Subtraction (A - B in Base 8)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Octal A (e.g. 154)', defaultVal: '154' },
    { value: 'oct-mul', label: 'Octal Multiplication (A × B in Base 8)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Octal A (e.g. 25)', defaultVal: '25' },
    { value: 'oct-div', label: 'Octal Division (A ÷ B in Base 8)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Octal A (e.g. 74)', defaultVal: '74' },
    { value: 'hex-add', label: 'Hexadecimal Addition (A + B in Base 16)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Hex A (e.g. A5)', defaultVal: 'A5' },
    { value: 'hex-sub', label: 'Hexadecimal Subtraction (A - B in Base 16)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Hex A (e.g. 2F)', defaultVal: '2F' },
    { value: 'hex-mul', label: 'Hexadecimal Multiplication (A × B in Base 16)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Hex A (e.g. 1A)', defaultVal: '1A' },
    { value: 'hex-div', label: 'Hexadecimal Division (A ÷ B in Base 16)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Hex A (e.g. F0)', defaultVal: 'F0' },
    { value: 'oct-arithmetic', label: 'Octal Calculator (+, -, ×, ÷ Interactive)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Octal A (e.g. 75)', defaultVal: '75' },
    { value: 'hex-arithmetic', label: 'Hexadecimal Calculator (+, -, ×, ÷ Interactive)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Hex A (e.g. A5)', defaultVal: 'A5' },
    { value: 'base-arithmetic', label: 'Universal Base Calculator (+, -, ×, ÷ Any Base 2-16)', group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Number A', defaultVal: '101' },
    { value: 'complements', label: "1's Complement & 2's Complement", group: 'Arithmetic Operations (+, -, ×, ÷)', placeholder: 'Binary number (e.g. 10101100)', defaultVal: '10101100' },

    // Logic Gates & K-Map
    { value: 'logic-gates', label: 'Logic Gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)', group: 'Digital Electronics', placeholder: '', defaultVal: 'AND' },
    { value: 'kmap', label: 'K-Map Basics (2 & 3 Variable Truth Table & SOP)', group: 'Digital Electronics', placeholder: '', defaultVal: '2' }
  ];

  const currentOption = conversionOptions.find((o) => o.value === selectedType) || conversionOptions[0];

  const handleSolve = () => {
    setError(null);
    try {
      let res: NumberSolverResult;

      if (selectedType === 'logic-gates') {
        res = solveNumberSystem(selectedType, gateInA, gateInB, { gateType });
      } else if (selectedType === 'kmap') {
        res = solveNumberSystem(selectedType, `${kmapVars}-variable`, '', {
          kmapVars,
          kmapMinterms
        });
      } else if (selectedType === 'bin-add' || selectedType === 'bin-sub' || selectedType === 'bin-mul' || selectedType === 'bin-div') {
        const defaultB = selectedType === 'bin-div' ? '10' : '101';
        res = solveNumberSystem(selectedType, input1, input2 || defaultB);
      } else if (selectedType === 'oct-add' || selectedType === 'oct-sub' || selectedType === 'oct-mul' || selectedType === 'oct-div') {
        const defaultB = selectedType === 'oct-div' ? '4' : '24';
        res = solveNumberSystem(selectedType, input1, input2 || defaultB);
      } else if (selectedType === 'hex-add' || selectedType === 'hex-sub' || selectedType === 'hex-mul' || selectedType === 'hex-div') {
        const defaultB = selectedType === 'hex-div' ? '4' : '1F';
        res = solveNumberSystem(selectedType, input1, input2 || defaultB);
      } else if (selectedType === 'oct-arithmetic') {
        res = solveNumberSystem(selectedType, input1, input2 || '24', { arithmeticOp, arithmeticBase: 8 });
      } else if (selectedType === 'hex-arithmetic') {
        res = solveNumberSystem(selectedType, input1, input2 || '1F', { arithmeticOp, arithmeticBase: 16 });
      } else if (selectedType === 'base-arithmetic') {
        const defaultB = arithmeticBase === 2 ? '101' : arithmeticBase === 16 ? '1F' : '12';
        res = solveNumberSystem(selectedType, input1, input2 || defaultB, { arithmeticOp, arithmeticBase });
      } else if (selectedType === 'complements') {
        res = solveNumberSystem(selectedType, input1, '', { bitWidth });
      } else {
        res = solveNumberSystem(selectedType, input1);
      }

      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Error occurred while solving. Kripya input check karein.');
      setResult(null);
    }
  };

  // Run solve on mount or when changing type or arithmetic parameters
  useEffect(() => {
    handleSolve();
  }, [selectedType, arithmeticOp, arithmeticBase]);

  const handleCopyAnswer = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.finalAnswer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const handleCopyFullSteps = () => {
    if (!result) return;
    const text = [
      `=== BCA Verse: ${result.title} ===`,
      `Question: ${result.input}`,
      `Final Answer: ${result.finalAnswer}`,
      '',
      '--- Step-by-Step Procedure (Hinglish) ---',
      ...result.steps.map(
        (s) =>
          `Step ${s.stepNumber}: ${s.title}\n${s.explanation}${
            s.mathDetail ? `\nCalculation: ${s.mathDetail}` : ''
          }${s.subSteps ? `\n${s.subSteps.join('\n')}` : ''}\n`
      ),
      'Made with BCA Verse by Prince Thakur'
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedFullSteps(true);
    setTimeout(() => setCopiedFullSteps(false), 2000);
  };

  const handleSaveToBookmarks = () => {
    if (!result) return;
    onSaveBookmark({
      type: 'logic',
      title: result.title,
      subtitle: `${result.input} → ${result.finalAnswer}`,
      data: {
        type: selectedType,
        input1,
        input2,
        result
      }
    });
  };

  const bookmarkId = `logic-${selectedType}-${result?.input || input1}`;
  const isCurrentBookmarked = isBookmarked(bookmarkId);

  // Group options by category for the dropdown
  const categories = ['Base Conversions', 'Arithmetic Operations (+, -, ×, ÷)', 'Digital Electronics'];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step-by-Step Hinglish Explanations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Logic & Number System Solver
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Conversions, Binary Operations, Complements, Gates & K-Map solutions for BCA students.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-700 space-y-6">
        {/* Step 1: Conversion Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select Question Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              const newType = e.target.value as NumberSystemType;
              setSelectedType(newType);
              const opt = conversionOptions.find((o) => o.value === newType);
              if (opt) setInput1(opt.defaultVal);
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <optgroup key={cat} label={`── ${cat} ──`}>
                {conversionOptions
                  .filter((o) => o.group === cat)
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Dynamic Inputs depending on type */}
        <div className="space-y-4">
          {/* Logic Gates Inputs */}
          {selectedType === 'logic-gates' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gate Type:
                </label>
                <select
                  value={gateType}
                  onChange={(e) => setGateType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                >
                  <option value="AND">AND Gate (A · B)</option>
                  <option value="OR">OR Gate (A + B)</option>
                  <option value="NOT">NOT Gate (Ā - Inverter)</option>
                  <option value="NAND">NAND Gate ((A · B)̄)</option>
                  <option value="NOR">NOR Gate ((A + B)̄)</option>
                  <option value="XOR">XOR Gate (A ⊕ B)</option>
                  <option value="XNOR">XNOR Gate ((A ⊕ B)̄)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Input A:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGateInA('0')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      gateInA === '0'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    0 (LOW)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGateInA('1')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      gateInA === '1'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    1 (HIGH)
                  </button>
                </div>
              </div>

              {gateType !== 'NOT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Input B:
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGateInB('0')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        gateInB === '0'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      0 (LOW)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGateInB('1')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        gateInB === '1'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      1 (HIGH)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : selectedType === 'kmap' ? (
            /* K-Map Controls */
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Number of Variables:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setKmapVars(2);
                      setKmapMinterms([1, 3]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      kmapVars === 2
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    2 Variables (A, B) · 4 Cells
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setKmapVars(3);
                      setKmapMinterms([1, 3, 5, 7]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      kmapVars === 3
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    3 Variables (A, B, C) · 8 Cells
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Click minterms to toggle 1s in K-Map:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: kmapVars === 2 ? 4 : 8 }).map((_, idx) => {
                    const isSelected = kmapMinterms.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setKmapMinterms(kmapMinterms.filter((m) => m !== idx));
                          } else {
                            setKmapMinterms([...kmapMinterms, idx].sort((a, b) => a - b));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        m{idx} {isSelected ? '(1)' : '(0)'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : [
              'bin-add',
              'bin-sub',
              'bin-mul',
              'bin-div',
              'oct-add',
              'oct-sub',
              'oct-mul',
              'oct-div',
              'hex-add',
              'hex-sub',
              'hex-mul',
              'hex-div',
              'oct-arithmetic',
              'hex-arithmetic',
              'base-arithmetic'
            ].includes(selectedType) ? (
            /* Arithmetic Operations (Binary, Octal, Hexadecimal, Universal) */
            <div className="space-y-4">
              {/* If base-arithmetic, show base selector */}
              {selectedType === 'base-arithmetic' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Radix / Base:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { b: 2, label: 'Base 2 (Binary)' },
                      { b: 8, label: 'Base 8 (Octal)' },
                      { b: 10, label: 'Base 10 (Decimal)' },
                      { b: 16, label: 'Base 16 (Hexadecimal)' }
                    ].map((item) => (
                      <button
                        key={item.b}
                        type="button"
                        onClick={() => setArithmeticBase(item.b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          arithmeticBase === item.b
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* If interactive arithmetic calculator, show operation selector */}
              {['oct-arithmetic', 'hex-arithmetic', 'base-arithmetic'].includes(selectedType) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Arithmetic Operation:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { op: '+' as const, label: '+ Addition (Jodna)' },
                      { op: '-' as const, label: '- Subtraction (Ghatana)' },
                      { op: '*' as const, label: '× Multiplication (Guna)' },
                      { op: '/' as const, label: '÷ Division (Bhaag)' }
                    ].map((item) => (
                      <button
                        key={item.op}
                        type="button"
                        onClick={() => setArithmeticOp(item.op)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          arithmeticOp === item.op
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {selectedType.startsWith('bin')
                      ? 'Binary Number A (0 or 1):'
                      : selectedType.startsWith('oct')
                      ? 'Octal Number A (0 to 7):'
                      : selectedType.startsWith('hex')
                      ? 'Hexadecimal Number A (0-9, A-F):'
                      : `Number A (Base ${arithmeticBase}):`}
                  </label>
                  <input
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                    placeholder="Enter first number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 font-mono text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {selectedType.startsWith('bin')
                      ? 'Binary Number B (0 or 1):'
                      : selectedType.startsWith('oct')
                      ? 'Octal Number B (0 to 7):'
                      : selectedType.startsWith('hex')
                      ? 'Hexadecimal Number B (0-9, A-F):'
                      : `Number B (Base ${arithmeticBase}):`}
                  </label>
                  <input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    placeholder="Enter second number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Single Number Input */
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter Number to Convert:
                </label>
                {selectedType === 'complements' && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Width:</span>
                    <select
                      value={bitWidth}
                      onChange={(e) => setBitWidth(parseInt(e.target.value, 10))}
                      className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                    >
                      <option value={4}>4-Bit</option>
                      <option value={8}>8-Bit (Standard)</option>
                      <option value={16}>16-Bit</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
                  placeholder={currentOption.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
                {input1 && (
                  <button
                    onClick={() => setInput1('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Presets / Try buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-400 dark:text-slate-500">Try Sample:</span>
            {selectedType.startsWith('dec') && (
              <>
                {['25.625', '10.5', '75.25', '255.5', '25', '128'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setInput1(val);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </>
            )}
            {selectedType.startsWith('bin') && selectedType !== 'bin-add' && selectedType !== 'bin-sub' && (
              <>
                {['11001.101', '10.11', '1101', '101010.01', '11110000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setInput1(val);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </>
            )}
            {selectedType.startsWith('oct') && (
              <>
                {['31.5', '72.4', '37', '145.2', '77.7'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInput1(val)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </>
            )}
            {selectedType.startsWith('hex') && selectedType !== 'hex-arithmetic' && (
              <>
                {['19.A', '2F.8', 'A5.4', '3B.C', 'FF'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInput1(val)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </>
            )}
            {selectedType.startsWith('bin-') && (
              <>
                {[
                  { a: '1011', b: '101' },
                  { a: '11001', b: '1010' },
                  { a: '1111', b: '0101' }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInput1(sample.a);
                      setInput2(sample.b);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {sample.a} & {sample.b}
                  </button>
                ))}
              </>
            )}
            {selectedType === 'oct-arithmetic' && (
              <>
                {[
                  { a: '75', b: '24' },
                  { a: '154', b: '67' },
                  { a: '25', b: '5' },
                  { a: '144', b: '4' }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInput1(sample.a);
                      setInput2(sample.b);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {sample.a} & {sample.b}
                  </button>
                ))}
              </>
            )}
            {selectedType === 'hex-arithmetic' && (
              <>
                {[
                  { a: 'A5', b: '1F' },
                  { a: 'FF', b: '3C' },
                  { a: '2B', b: '4' },
                  { a: 'A0', b: '5' }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInput1(sample.a);
                      setInput2(sample.b);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {sample.a} & {sample.b}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Solve Button & Error Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSolve}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Solve Step-by-Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {result && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToBookmarks}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrentBookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={isCurrentBookmarked ? 'Bookmarked' : 'Save to Bookmarks'}
              >
                {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCopyFullSteps}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
                title="Copy Full Solution & Steps"
              >
                {copiedFullSteps ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Final Answer Highlight Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-1 shadow-lg">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Final Verified Answer</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  {result.finalAnswer}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Question: <span className="font-mono font-semibold">{result.input}</span> ({result.title})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAnswer}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/60 dark:border-indigo-800 transition-colors cursor-pointer"
                >
                  {copiedAnswer ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Division or Positional Weight Math Table (if present) */}
          {result.additionalInfo?.tableHeaders && result.additionalInfo.tableRows && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <TableIcon className="w-4 h-4 text-indigo-500" />
                <span>Division / Positional Weight Breakdown Table</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      {result.additionalInfo.tableHeaders.map((header, idx) => (
                        <th key={idx} className="py-2.5 px-4 font-bold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {result.additionalInfo.tableRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step-by-Step Procedure in Hinglish */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step-by-Step Procedure in Hinglish
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {result.steps.length} Steps
              </span>
            </div>

            <div className="space-y-4">
              {result.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    step.highlight
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>

                  {/* Hinglish Explanation */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    {step.explanation}
                  </p>

                  {/* Math detail or calculation code */}
                  {step.mathDetail && (
                    <div className="mt-2.5 ml-8 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold inline-block">
                      {step.mathDetail}
                    </div>
                  )}

                  {/* Sub-steps list */}
                  {step.subSteps && step.subSteps.length > 0 && (
                    <div className="mt-2.5 ml-8 space-y-1">
                      {step.subSteps.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="font-mono text-xs text-slate-600 dark:text-slate-300 py-0.5"
                        >
                          • {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Copy All Steps CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={handleCopyFullSteps}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                {copiedFullSteps ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Full Solution to Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
