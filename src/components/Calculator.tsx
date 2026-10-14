import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playKeySound, playUnlockSound, triggerHaptic } from '../utils/sound';
import { Delete, ArrowLeft, GraduationCap, FileText, Feather } from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

interface CalculatorProps {
  secretPin: string;
  onUnlockVault: () => void;
  onOpenInstall?: () => void;
  onBackToBca?: () => void;
  onOpenNotes?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const Calculator: React.FC<CalculatorProps> = ({
  secretPin,
  onUnlockVault,
  onBackToBca,
  onOpenNotes,
  onOpenSukhan,
  onOpenCompiler,
  soundEnabled,
  hapticsEnabled,
}) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [unlockingAnim, setUnlockingAnim] = useState(false);
  const displayRef = useRef(display);
  displayRef.current = display;
  const isUnlockingRef = useRef(false);

  // Play click sound and haptic on every button press
  const handleFeedback = useCallback(() => {
    if (soundEnabled) playKeySound();
    if (hapticsEnabled) triggerHaptic(12);
  }, [soundEnabled, hapticsEnabled]);

  // Check secret passcode: matches 1307, configured pin, or ends with it
  const checkAndUnlock = useCallback(
    (inputStr: string): boolean => {
      if (isUnlockingRef.current) return true;

      const digitsOnly = inputStr.replace(/\D/g, '');
      const cleanPin = (secretPin || '1307').trim().replace(/\D/g, '');

      const isMatch =
        digitsOnly === '1307' ||
        digitsOnly === cleanPin ||
        digitsOnly.endsWith('1307') ||
        (cleanPin.length >= 2 && digitsOnly.endsWith(cleanPin));

      if (isMatch) {
        isUnlockingRef.current = true;
        setUnlockingAnim(true);
        if (soundEnabled) playUnlockSound();
        if (hapticsEnabled) triggerHaptic([30, 60, 30]);

        setTimeout(() => {
          onUnlockVault();
          setUnlockingAnim(false);
          isUnlockingRef.current = false;
          setDisplay('0');
          setEquation('');
          setPrevValue(null);
          setOperation(null);
          setWaitingForOperand(false);
        }, 220);
        return true;
      }
      return false;
    },
    [secretPin, soundEnabled, hapticsEnabled, onUnlockVault]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      handleFeedback();
      setDisplay((prevDisplay) => {
        let next: string;
        if (
          prevDisplay === 'Error' ||
          prevDisplay === 'Infinity' ||
          prevDisplay === '-Infinity' ||
          prevDisplay === 'NaN'
        ) {
          setWaitingForOperand(false);
          next = digit;
        } else if (waitingForOperand) {
          setWaitingForOperand(false);
          next = digit;
        } else {
          next = prevDisplay === '0' ? digit : prevDisplay + digit;
        }

        // Auto-unlock as soon as 1307 / passcode is typed
        checkAndUnlock(next);
        return next;
      });
    },
    [handleFeedback, waitingForOperand, checkAndUnlock]
  );

  const handleDecimal = useCallback(() => {
    handleFeedback();
    setDisplay((prevDisplay) => {
      if (
        waitingForOperand ||
        prevDisplay === 'Error' ||
        prevDisplay === 'Infinity' ||
        prevDisplay === 'NaN'
      ) {
        setWaitingForOperand(false);
        return '0.';
      }
      if (!prevDisplay.includes('.')) {
        return prevDisplay + '.';
      }
      return prevDisplay;
    });
  }, [handleFeedback, waitingForOperand]);

  const handleClear = useCallback(() => {
    handleFeedback();
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, [handleFeedback]);

  const handleBackspace = useCallback(() => {
    handleFeedback();
    if (waitingForOperand) return;
    setDisplay((prevDisplay) => {
      if (
        prevDisplay === 'Error' ||
        prevDisplay === 'Infinity' ||
        prevDisplay === 'NaN'
      ) {
        return '0';
      }
      if (prevDisplay.length === 2 && prevDisplay.startsWith('-')) {
        return '0';
      }
      if (prevDisplay.length > 1) {
        return prevDisplay.slice(0, -1);
      }
      return '0';
    });
  }, [handleFeedback, waitingForOperand]);

  const handleToggleSign = useCallback(() => {
    handleFeedback();
    setDisplay((prevDisplay) => {
      const val = parseFloat(prevDisplay);
      if (!isNaN(val) && val !== 0) {
        return String(-val);
      }
      return prevDisplay;
    });
  }, [handleFeedback]);

  const handlePercentage = useCallback(() => {
    handleFeedback();
    setDisplay((prevDisplay) => {
      const val = parseFloat(prevDisplay);
      if (!isNaN(val)) {
        return String(val / 100);
      }
      return prevDisplay;
    });
  }, [handleFeedback]);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const handleOperator = useCallback((nextOp: string) => {
    handleFeedback();
    const currentVal = parseFloat(display);

    if (isNaN(currentVal)) {
      handleClear();
      return;
    }

    if (prevValue === null) {
      setPrevValue(currentVal);
      setEquation(`${display} ${nextOp}`);
    } else if (operation && !waitingForOperand) {
      const result = calculate(prevValue, currentVal, operation);
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setPrevValue(null);
        setOperation(null);
        setEquation('');
        setWaitingForOperand(true);
        return;
      }
      setDisplay(String(Number(result.toFixed(8))));
      setPrevValue(result);
      setEquation(`${result} ${nextOp}`);
    } else {
      setEquation(`${prevValue} ${nextOp}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  }, [display, prevValue, operation, waitingForOperand, handleFeedback, handleClear]);

  const handleEquals = useCallback(() => {
    handleFeedback();
    const currentDisplay = displayRef.current.trim();

    // Check secret passcode first
    if (checkAndUnlock(currentDisplay)) {
      return;
    }

    // Standard Math Calculation
    if (prevValue !== null && operation) {
      const currentVal = parseFloat(currentDisplay);
      if (isNaN(currentVal)) return;

      const result = calculate(prevValue, currentVal, operation);
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setEquation('');
      } else {
        setEquation(`${equation} ${currentDisplay} =`);
        setDisplay(String(Number(result.toFixed(8))));
      }
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [prevValue, operation, equation, handleFeedback, checkAndUnlock]);

  // Keyboard support for PC / external keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*' || e.key === 'x') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleEquals, handleBackspace, handleClear, handleOperator]);

  return (
    <div className="relative flex flex-col h-full max-h-full w-full max-w-md mx-auto bg-black text-white px-3.5 py-2.5 sm:px-5 sm:py-4 justify-between select-none overflow-hidden font-sans">
      {/* Top stealth bar */}
      <div className="shrink-0 flex items-center justify-between pt-0.5 pb-1 gap-2">
        <div className="flex items-center gap-1.5">
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="BCA Verse me wapas jayein"
            >
              <ArrowLeft size={12} className="text-zinc-400" />
              <GraduationCap size={12} className="text-indigo-400" />
              <span>BCA Verse</span>
            </button>
          )}

          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[11px] font-medium transition-colors cursor-pointer"
              title="Open Offline Notes Pad"
            >
              <FileText size={12} />
              <span>Notes</span>
            </button>
          )}

          {onOpenSukhan && (
            <button
              onClick={onOpenSukhan}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-[#C6A66B]/40 text-[#C6A66B] hover:text-[#FFF5EA] text-[11px] font-medium transition-colors cursor-pointer"
              title="Open SUKHAN Literary Lounge"
            >
              <SukhanPenIcon size={12} />
              <span className="font-serif">SUKHAN</span>
            </button>
          )}

          {onOpenCompiler && (
            <button
              onClick={onOpenCompiler}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Open Simple C Compiler"
            >
              <span className="w-3.5 h-3.5 rounded bg-cyan-600 text-white font-mono font-black text-[9px] flex items-center justify-center">
                C
              </span>
              <span>Compiler</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Stealth subtle mode indicator */}
          <span className="text-[10px] font-mono text-zinc-600 px-2 py-0.5 rounded bg-zinc-900">
            RAD
          </span>
        </div>
      </div>

      {/* Screen Display: PURE CALCULATOR DISPLAY */}
      <div className="flex flex-col justify-end items-end w-full px-2 py-2 sm:py-3 flex-1 min-h-[70px] max-h-[140px] overflow-hidden shrink-0">
        {equation && (
          <span className="text-xs sm:text-sm text-zinc-500 font-mono tracking-wider truncate max-w-full">
            {equation}
          </span>
        )}
        <div
          className={`font-light tracking-tight text-white transition-all duration-100 truncate max-w-full font-mono text-right ${
            display.length > 9
              ? 'text-3xl sm:text-4xl'
              : display.length > 6
              ? 'text-4xl sm:text-5xl'
              : 'text-5xl sm:text-6xl'
          } ${unlockingAnim ? 'text-amber-400 scale-105' : ''}`}
        >
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full pb-2 shrink-0">
        <button
          onClick={handleClear}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-700/80 text-white text-lg sm:text-xl font-medium active:bg-zinc-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-700/80 text-white text-lg sm:text-xl font-medium active:bg-zinc-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={handlePercentage}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-700/80 text-white text-lg sm:text-xl font-medium active:bg-zinc-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-colors flex items-center justify-center cursor-pointer ${
            operation === '÷' && waitingForOperand
              ? 'bg-white text-amber-500'
              : 'bg-amber-500 active:bg-amber-600'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleOperator('×')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-colors flex items-center justify-center cursor-pointer ${
            operation === '×' && waitingForOperand
              ? 'bg-white text-amber-500'
              : 'bg-amber-500 active:bg-amber-600'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleOperator('-')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-colors flex items-center justify-center cursor-pointer ${
            operation === '-' && waitingForOperand
              ? 'bg-white text-amber-500'
              : 'bg-amber-500 active:bg-amber-600'
          }`}
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => handleOperator('+')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-colors flex items-center justify-center cursor-pointer ${
            operation === '+' && waitingForOperand
              ? 'bg-white text-amber-500'
              : 'bg-amber-500 active:bg-amber-600'
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={handleBackspace}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-zinc-300 text-lg active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Backspace"
        >
          <Delete size={20} />
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-zinc-900 text-white text-xl sm:text-2xl font-normal active:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-amber-500 text-white text-xl sm:text-2xl font-semibold active:bg-amber-600 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-amber-500/20"
        >
          =
        </button>
      </div>
    </div>
  );
};
