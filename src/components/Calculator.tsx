import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playKeySound, playUnlockSound, triggerHaptic } from '../utils/sound';
import { Delete, ArrowLeft, GraduationCap, FileText, Feather } from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

export interface CalculatorProps {
  secretPin: string;
  duressPin?: string;
  onUnlockVault?: (isDuress?: boolean) => void;
  onUnlock?: (isDuress?: boolean) => void;
  onClose?: () => void;
  onOpenSettings?: () => void;
  hasSecretCode?: boolean;
  onlineCount?: number;
  friendStatus?: any;
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
  duressPin = '0000',
  onUnlockVault,
  onUnlock,
  onClose,
  onOpenSettings,
  hasSecretCode: _hasSecretCode,
  onlineCount: _onlineCount,
  friendStatus: _friendStatus,
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

  // Check secret passcode: matches 1307, configured pin, or decoy duress pin
  const checkAndUnlock = useCallback(
    (inputStr: string): boolean => {
      if (isUnlockingRef.current) return true;

      const digitsOnly = inputStr.replace(/\D/g, '');
      const cleanRealPin = (secretPin || '1307').trim().replace(/\D/g, '') || '1307';
      const cleanDuressPin = (duressPin || '0000').trim().replace(/\D/g, '') || '0000';

      const isRealMatch =
        digitsOnly === '1307' ||
        digitsOnly === cleanRealPin ||
        digitsOnly.endsWith('1307') ||
        (cleanRealPin.length >= 2 && digitsOnly.endsWith(cleanRealPin));

      const isDuressMatch =
        !isRealMatch &&
        (digitsOnly === cleanDuressPin ||
          digitsOnly.endsWith(cleanDuressPin) ||
          digitsOnly.endsWith('0000'));

      if (isRealMatch || isDuressMatch) {
        const isDuress = isDuressMatch;
        isUnlockingRef.current = true;
        setUnlockingAnim(true);
        if (soundEnabled) playUnlockSound();
        if (hapticsEnabled) triggerHaptic([30, 60, 30]);

        setTimeout(() => {
          if (onUnlockVault) onUnlockVault(isDuress);
          else if (onUnlock) onUnlock(isDuress);
          setUnlockingAnim(false);
          isUnlockingRef.current = false;
          setDisplay('0');
          setEquation('');
          setPrevValue(null);
          setOperation(null);
          setWaitingForOperand(false);
        }, 160);
        return true;
      }
      return false;
    },
    [secretPin, duressPin, soundEnabled, hapticsEnabled, onUnlockVault, onUnlock]
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
    <div className="relative flex flex-col h-full max-h-full w-full max-w-md mx-auto bg-gradient-to-b from-[#080C1F] via-[#0E1533] to-[#121A3E] text-white px-3.5 py-2.5 sm:px-5 sm:py-4 justify-between select-none overflow-hidden font-sans border-x border-indigo-900/30 shadow-2xl">
      {/* Subtle ambient celestial glow */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top stealth bar */}
      <div className="shrink-0 flex items-center justify-between pt-0.5 pb-1 gap-2 z-10">
        <div className="flex items-center gap-1.5">
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-200 hover:text-white text-[11px] font-medium transition-all cursor-pointer shadow-xs active:scale-95"
              title="Return to BCA Verse"
            >
              <ArrowLeft size={12} className="text-indigo-300" />
              <GraduationCap size={12} className="text-purple-300" />
              <span>BCA Verse</span>
            </button>
          )}

          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-purple-500/30 text-purple-300 hover:text-purple-100 text-[11px] font-medium transition-all cursor-pointer active:scale-95"
              title="Open Offline Notes Pad"
            >
              <FileText size={12} />
              <span>Notes</span>
            </button>
          )}

          {onOpenSukhan && (
            <button
              onClick={onOpenSukhan}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-300 hover:text-amber-100 text-[11px] font-medium transition-all cursor-pointer active:scale-95"
              title="Open SUKHAN Literary Lounge"
            >
              <SukhanPenIcon size={12} />
              <span className="font-serif">SUKHAN</span>
            </button>
          )}

          {onOpenCompiler && (
            <button
              onClick={onOpenCompiler}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer active:scale-95"
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
          {/* Subtle mode indicator with starry accent */}
          <span className="text-[10px] font-mono text-purple-300/70 px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-800/50 flex items-center gap-1">
            <span>RAD</span>
            <span className="text-[9px] text-amber-300">✨</span>
          </span>
        </div>
      </div>

      {/* Screen Display: SLEEK MIDNIGHT GLASS DISPLAY */}
      <div className="flex flex-col justify-end items-end w-full px-4 py-3 sm:py-4 flex-1 min-h-[75px] max-h-[145px] overflow-hidden shrink-0 bg-[#0B1028]/70 border border-indigo-500/20 rounded-3xl shadow-inner z-10 backdrop-blur-xs my-1">
        {equation && (
          <span className="text-xs sm:text-sm text-indigo-300/70 font-mono tracking-wider truncate max-w-full">
            {equation}
          </span>
        )}
        <div
          className={`font-light tracking-tight text-white transition-all duration-100 truncate max-w-full font-mono text-right drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
            display.length > 9
              ? 'text-3xl sm:text-4xl'
              : display.length > 6
              ? 'text-4xl sm:text-5xl'
              : 'text-5xl sm:text-6xl'
          } ${unlockingAnim ? 'text-amber-300 scale-105 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : ''}`}
        >
          {display}
        </div>
      </div>

      {/* Keypad Grid: Sleek Midnight Glowing Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full pb-2 shrink-0 z-10">
        <button
          onClick={handleClear}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#1C2750]/90 hover:bg-[#253468] border border-purple-500/30 text-purple-200 text-lg sm:text-xl font-medium active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-indigo-950/40"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#1C2750]/90 hover:bg-[#253468] border border-purple-500/30 text-purple-200 text-lg sm:text-xl font-medium active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-indigo-950/40"
        >
          ±
        </button>
        <button
          onClick={handlePercentage}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#1C2750]/90 hover:bg-[#253468] border border-purple-500/30 text-purple-200 text-lg sm:text-xl font-medium active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-indigo-950/40"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md ${
            operation === '÷' && waitingForOperand
              ? 'bg-white text-purple-900 shadow-[0_0_16px_rgba(255,255,255,0.7)]'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          9
        </button>
        <button
          onClick={() => handleOperator('×')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md ${
            operation === '×' && waitingForOperand
              ? 'bg-white text-purple-900 shadow-[0_0_16px_rgba(255,255,255,0.7)]'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          6
        </button>
        <button
          onClick={() => handleOperator('-')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md ${
            operation === '-' && waitingForOperand
              ? 'bg-white text-purple-900 shadow-[0_0_16px_rgba(255,255,255,0.7)]'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
          }`}
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          3
        </button>
        <button
          onClick={() => handleOperator('+')}
          className={`h-13 sm:h-16 md:h-18 rounded-full text-white text-xl sm:text-2xl font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md ${
            operation === '+' && waitingForOperand
              ? 'bg-white text-purple-900 shadow-[0_0_16px_rgba(255,255,255,0.7)]'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={handleBackspace}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-purple-200 text-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
          title="Backspace"
        >
          <Delete size={20} />
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-[#131B3B]/90 hover:bg-[#1A2552] border border-indigo-500/20 text-slate-100 text-xl sm:text-2xl font-normal active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-13 sm:h-16 md:h-18 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xl sm:text-2xl font-semibold active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.35)]"
        >
          =
        </button>
      </div>
    </div>
  );
};
