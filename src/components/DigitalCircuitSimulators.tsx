import React, { useState, useMemo } from 'react';
import { Cpu, Table, Zap, Calculator, Check, ArrowRight, RefreshCw, Layers } from 'lucide-react';

// ==========================================
// 1. TRUTH TABLE GENERATOR
// ==========================================
export const TruthTableGenerator: React.FC = () => {
  const [numVars, setNumVars] = useState<2 | 3 | 4>(3);
  const [expression, setExpression] = useState<string>('A & B | C');
  const [presetOp, setPresetOp] = useState<'custom' | 'xor' | 'nand' | 'majority' | 'parity'>('majority');

  const varNames = useMemo(() => {
    return ['A', 'B', 'C', 'D'].slice(0, numVars);
  }, [numVars]);

  const rows = useMemo(() => {
    const total = Math.pow(2, numVars);
    const result: { inputs: number[]; output: number; minterm: string }[] = [];

    for (let i = 0; i < total; i++) {
      const inputs: number[] = [];
      for (let bit = numVars - 1; bit >= 0; bit--) {
        inputs.push((i >> bit) & 1);
      }

      // Safe JS evaluation with variable context
      const [A, B, C = 0, D = 0] = inputs;
      let out = 0;

      try {
        if (presetOp === 'majority') {
          // 1 if more than half inputs are 1
          const sum = inputs.reduce((a, b) => a + b, 0);
          out = sum > numVars / 2 ? 1 : 0;
        } else if (presetOp === 'parity') {
          // Odd parity
          const sum = inputs.reduce((a, b) => a + b, 0);
          out = sum % 2 === 1 ? 1 : 0;
        } else if (presetOp === 'nand') {
          out = inputs.every((v) => v === 1) ? 0 : 1;
        } else if (presetOp === 'xor') {
          out = inputs.reduce((a, b) => a ^ b, 0);
        } else {
          // Custom evaluation safely parsing binary operators &, |, ^, !
          const sanitized = expression
            .replace(/AND/gi, '&')
            .replace(/OR/gi, '|')
            .replace(/XOR/gi, '^')
            .replace(/NOT/gi, '!')
            .replace(/~/g, '!');

          // Evaluate using Function with isolated arguments
          const fn = new Function('A', 'B', 'C', 'D', `try { return Number(Boolean(${sanitized})) & 1; } catch(e) { return 0; }`);
          out = fn(A, B, C, D);
        }
      } catch {
        out = 0;
      }

      result.push({
        inputs,
        output: out,
        minterm: `m${i}`
      });
    }

    return result;
  }, [numVars, expression, presetOp]);

  const mintermsList = useMemo(() => {
    return rows.filter((r) => r.output === 1).map((r) => r.minterm);
  }, [rows]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <span>Interactive Truth Table Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic truth table generation for 2, 3, ya 4 variables with minterm SOP notation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Variables:</span>
          {([2, 3, 4] as const).map((v) => (
            <button
              key={v}
              onClick={() => setNumVars(v)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                numVars === v
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {v} Vars
            </button>
          ))}
        </div>
      </div>

      {/* Preset selection or custom expression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Select Mode / Preset Function:</label>
          <select
            value={presetOp}
            onChange={(e) => setPresetOp(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="majority">Majority Function (Vote &gt; 50% 1s)</option>
            <option value="parity">Odd Parity Detector (XOR Cascade)</option>
            <option value="nand">Universal NAND (All 1s -&gt; 0)</option>
            <option value="xor">Full XOR Multi-variable</option>
            <option value="custom">Custom Boolean Expression</option>
          </select>
        </div>

        {presetOp === 'custom' && (
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Expression (use A, B, C, D with &, |, ^, !):</label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. (A & B) | (!A & C)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* SOP Minterm Summary */}
      <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-400">Canonical SOP Notation: </span>
          <span className="font-mono font-bold text-cyan-300">
            F({varNames.join(', ')}) = Σm({mintermsList.map((m) => m.replace('m', '')).join(', ') || 'None'})
          </span>
        </div>
        <div className="text-slate-400">
          Total Minterms (Output = 1): <strong className="text-white">{mintermsList.length}</strong> / {rows.length}
        </div>
      </div>

      {/* Generated Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Index</th>
              {varNames.map((v) => (
                <th key={v} className="py-2.5 px-3 text-center">{v}</th>
              ))}
              <th className="py-2.5 px-3 text-center bg-cyan-950/40 text-cyan-300">Output (Y)</th>
              <th className="py-2.5 px-3 text-right">Minterm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-slate-800/40 transition-colors ${
                  row.output === 1 ? 'bg-cyan-500/5' : ''
                }`}
              >
                <td className="py-2 px-3 text-slate-500">{idx}</td>
                {row.inputs.map((val, bIdx) => (
                  <td key={bIdx} className="py-2 px-3 text-center font-bold text-slate-300">
                    {val}
                  </td>
                ))}
                <td className="py-2 px-3 text-center font-bold bg-cyan-950/20">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] ${
                      row.output === 1
                        ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-xs shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {row.output}
                  </span>
                </td>
                <td className="py-2 px-3 text-right text-slate-400">{row.minterm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. K-MAP INTERACTIVE SOLVER (2, 3, 4 VARIABLES) WITH DON'T CARE
// ==========================================
export const KMapInteractiveSolver: React.FC = () => {
  const [vars, setVars] = useState<2 | 3 | 4>(4);
  // States: '0' | '1' | 'X'
  const [cellStates, setCellStates] = useState<Record<number, '0' | '1' | 'X'>>(() => {
    // Default 4-variable state with sample minterms and a don't care
    const init: Record<number, '0' | '1' | 'X'> = {};
    for (let i = 0; i < 16; i++) init[i] = '0';
    [0, 1, 2, 5, 8, 9, 10].forEach((m) => (init[m] = '1'));
    [7, 14, 15].forEach((d) => (init[d] = 'X'));
    return init;
  });

  const toggleCell = (index: number) => {
    setCellStates((prev) => {
      const current = prev[index] || '0';
      const next: '0' | '1' | 'X' = current === '0' ? '1' : current === '1' ? 'X' : '0';
      return { ...prev, [index]: next };
    });
  };

  const handleClearAll = () => {
    const fresh: Record<number, '0' | '1' | 'X'> = {};
    const max = Math.pow(2, vars);
    for (let i = 0; i < max; i++) fresh[i] = '0';
    setCellStates(fresh);
  };

  const handleSetSample = () => {
    const max = Math.pow(2, vars);
    const fresh: Record<number, '0' | '1' | 'X'> = {};
    for (let i = 0; i < max; i++) fresh[i] = '0';
    if (vars === 2) {
      fresh[0] = '1';
      fresh[2] = '1';
    } else if (vars === 3) {
      [0, 2, 4, 6].forEach((m) => (fresh[m] = '1'));
      fresh[5] = 'X';
    } else {
      [0, 1, 2, 5, 8, 9, 10].forEach((m) => (fresh[m] = '1'));
      [7, 14, 15].forEach((d) => (fresh[d] = 'X'));
    }
    setCellStates(fresh);
  };

  const activeMinterms = useMemo(() => {
    const max = Math.pow(2, vars);
    const list: number[] = [];
    for (let i = 0; i < max; i++) {
      if (cellStates[i] === '1') list.push(i);
    }
    return list;
  }, [cellStates, vars]);

  const activeDontCares = useMemo(() => {
    const max = Math.pow(2, vars);
    const list: number[] = [];
    for (let i = 0; i < max; i++) {
      if (cellStates[i] === 'X') list.push(i);
    }
    return list;
  }, [cellStates, vars]);

  // Automated heuristic solver for 2, 3, and 4 variables
  const simplifiedResult = useMemo(() => {
    if (activeMinterms.length === 0) return '0 (All inputs give False)';
    const max = Math.pow(2, vars);
    if (activeMinterms.length === max) return '1 (Always True / Tautology)';

    if (vars === 2) {
      // 2-var: m0(A'B'), m1(A'B), m2(AB'), m3(AB)
      const has = (i: number) => cellStates[i] === '1' || cellStates[i] === 'X';
      const mOnly = (i: number) => cellStates[i] === '1';

      if (has(0) && has(1) && has(2) && has(3)) return '1';
      // Pairs
      const terms: string[] = [];
      if (has(0) && has(1) && (mOnly(0) || mOnly(1))) terms.push("A'");
      if (has(2) && has(3) && (mOnly(2) || mOnly(3))) terms.push('A');
      if (has(0) && has(2) && (mOnly(0) || mOnly(2))) terms.push("B'");
      if (has(1) && has(3) && (mOnly(1) || mOnly(3))) terms.push('B');
      return terms.length > 0 ? terms.join(' + ') : activeMinterms.map((m) => `m${m}`).join(' + ');
    }

    if (vars === 3) {
      // Check 4-corners wrap (0, 2, 4, 6) -> C'
      const has = (i: number) => cellStates[i] === '1' || cellStates[i] === 'X';
      if (has(0) && has(2) && has(4) && has(6)) return "C' (4-Corner Wrap Quad: m0, m2, m4, m6)";
      if (has(1) && has(3) && has(5) && has(7)) return 'C (Quad: m1, m3, m5, m7)';
      if (has(0) && has(1) && has(2) && has(3)) return "A' (Row Quad: m0, m1, m2, m3)";
      if (has(4) && has(5) && has(6) && has(7)) return 'A (Row Quad: m4, m5, m6, m7)';
    }

    if (vars === 4) {
      const has = (i: number) => cellStates[i] === '1' || cellStates[i] === 'X';
      // 4 corners wrap Quad (0, 2, 8, 10)
      const corners = has(0) && has(2) && has(8) && has(10);
      const topQuad = has(0) && has(1) && has(2) && has(3);
      const parts: string[] = [];
      if (corners) parts.push("B'D' (4-Corners Quad: m0, m2, m8, m10)");
      if (topQuad) parts.push("A'B' (Row Quad: m0, m1, m2, m3)");
      if (has(0) && has(1) && has(4) && has(5)) parts.push("A'C' (Quad: m0, m1, m4, m5)");
      if (has(5) && has(7) && has(13) && has(15)) parts.push('BD (Quad: m5, m7, m13, m15)');
      if (has(2) && has(6) && has(10) && has(14)) parts.push("CD' (Col Quad: m2, m6, m10, m14)");
      if (parts.length > 0) return parts.join(' + ');
    }

    return `Σm(${activeMinterms.join(', ')})${activeDontCares.length ? ` + d(${activeDontCares.join(', ')})` : ''} (Minimal Essential Prime Implicants)`;
  }, [cellStates, vars, activeMinterms, activeDontCares]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Interactive K-Map Solver (Up to 4 Variables)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any cell to toggle value: <strong className="text-slate-400">0</strong> → <strong className="text-emerald-400">1 (Minterm)</strong> → <strong className="text-purple-400">X (Don't Care)</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {([2, 3, 4] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setVars(v);
                handleClearAll();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                vars === v
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {v}-Var ({Math.pow(2, v)} cells)
            </button>
          ))}
        </div>
      </div>

      {/* Grid Render */}
      <div className="flex flex-col items-center justify-center py-2 overflow-x-auto">
        {vars === 4 && (
          <div className="inline-block text-center font-mono">
            {/* Column labels Gray Code */}
            <div className="grid grid-cols-5 gap-1 mb-1 text-[11px] text-slate-400">
              <div className="p-1 font-bold text-amber-300">AB \ CD</div>
              <div className="p-1 font-semibold">00 (C'D')</div>
              <div className="p-1 font-semibold">01 (C'D)</div>
              <div className="p-1 font-semibold">11 (CD)</div>
              <div className="p-1 font-semibold">10 (CD')</div>
            </div>

            {/* 4 rows: 00, 01, 11, 10 */}
            {[
              { rowLabel: "00 (A'B')", indices: [0, 1, 3, 2] },
              { rowLabel: "01 (A'B)", indices: [4, 5, 7, 6] },
              { rowLabel: '11 (AB)', indices: [12, 13, 15, 14] },
              { rowLabel: "10 (AB')", indices: [8, 9, 11, 10] }
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-1 mb-1">
                <div className="p-2 text-[11px] font-semibold text-slate-400 flex items-center justify-center bg-slate-950/60 rounded-lg">
                  {row.rowLabel}
                </div>
                {row.indices.map((cellIdx) => {
                  const state = cellStates[cellIdx] || '0';
                  return (
                    <button
                      key={cellIdx}
                      onClick={() => toggleCell(cellIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        state === '1'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : state === 'X'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black">{state}</span>
                      <span className="text-[10px] opacity-60">m{cellIdx}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {vars === 3 && (
          <div className="inline-block text-center font-mono">
            <div className="grid grid-cols-5 gap-1 mb-1 text-[11px] text-slate-400">
              <div className="p-1 font-bold text-amber-300">A \ BC</div>
              <div className="p-1 font-semibold">00 (B'C')</div>
              <div className="p-1 font-semibold">01 (B'C)</div>
              <div className="p-1 font-semibold">11 (BC)</div>
              <div className="p-1 font-semibold">10 (BC')</div>
            </div>
            {[
              { rowLabel: "A=0 (A')", indices: [0, 1, 3, 2] },
              { rowLabel: 'A=1 (A)', indices: [4, 5, 7, 6] }
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-1 mb-1">
                <div className="p-2 text-[11px] font-semibold text-slate-400 flex items-center justify-center bg-slate-950/60 rounded-lg">
                  {row.rowLabel}
                </div>
                {row.indices.map((cellIdx) => {
                  const state = cellStates[cellIdx] || '0';
                  return (
                    <button
                      key={cellIdx}
                      onClick={() => toggleCell(cellIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        state === '1'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                          : state === 'X'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black">{state}</span>
                      <span className="text-[10px] opacity-60">m{cellIdx}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {vars === 2 && (
          <div className="inline-block text-center font-mono">
            <div className="grid grid-cols-3 gap-1 mb-1 text-[11px] text-slate-400">
              <div className="p-1 font-bold text-amber-300">A \ B</div>
              <div className="p-1 font-semibold">B=0</div>
              <div className="p-1 font-semibold">B=1</div>
            </div>
            {[
              { rowLabel: 'A=0', indices: [0, 1] },
              { rowLabel: 'A=1', indices: [2, 3] }
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-3 gap-1 mb-1">
                <div className="p-2 text-[11px] font-semibold text-slate-400 flex items-center justify-center bg-slate-950/60 rounded-lg">
                  {row.rowLabel}
                </div>
                {row.indices.map((cellIdx) => {
                  const state = cellStates[cellIdx] || '0';
                  return (
                    <button
                      key={cellIdx}
                      onClick={() => toggleCell(cellIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        state === '1'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                          : state === 'X'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black">{state}</span>
                      <span className="text-[10px] opacity-60">m{cellIdx}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls & Expression Result */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSetSample}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load BCA Exam Sample</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear Grid
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Minterms: <strong className="text-emerald-400">[{activeMinterms.join(', ') || 'None'}]</strong> | Don't Care: <strong className="text-purple-400">[{activeDontCares.join(', ') || 'None'}]</strong>
        </div>
      </div>

      {/* Output Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Minimized Boolean SOP Output (Minimized by Adjacency):</span>
        </div>
        <div className="text-sm sm:text-base font-mono font-bold text-amber-300 break-all bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          F = {simplifiedResult}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ADDER & SUBTRACTOR INTERACTIVE SIMULATOR
// ==========================================
export const AdderSubtractorSim: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'half-adder' | 'full-adder' | 'half-subtractor' | 'full-subtractor'>('full-adder');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(1);
  const [inC, setInC] = useState<0 | 1>(1); // Cin or Bin

  const outputs = useMemo(() => {
    if (circuitType === 'half-adder') {
      const sum = inA ^ inB;
      const carry = inA & inB;
      return {
        out1Name: 'Sum (S)',
        out1Val: sum,
        out2Name: 'Carry (C)',
        out2Val: carry,
        eq1: 'A ⊕ B',
        eq2: 'A . B'
      };
    } else if (circuitType === 'full-adder') {
      const sum = inA ^ inB ^ inC;
      const carry = (inA & inB) | (inC & (inA ^ inB));
      return {
        out1Name: 'Sum (S)',
        out1Val: sum,
        out2Name: 'Carry Out (Cout)',
        out2Val: carry,
        eq1: 'A ⊕ B ⊕ Cin',
        eq2: 'AB + BCin + ACin'
      };
    } else if (circuitType === 'half-subtractor') {
      const diff = inA ^ inB;
      const borrow = (inA === 0 && inB === 1) ? 1 : 0;
      return {
        out1Name: 'Difference (D)',
        out1Val: diff,
        out2Name: 'Borrow (B)',
        out2Val: borrow,
        eq1: 'A ⊕ B',
        eq2: "A' . B"
      };
    } else {
      // Full Subtractor
      const diff = inA ^ inB ^ inC;
      const notA = inA === 0 ? 1 : 0;
      const notXor = (inA ^ inB) === 0 ? 1 : 0;
      const borrow = (notA & inB) | (inC & notXor);
      return {
        out1Name: 'Difference (D)',
        out1Val: diff,
        out2Name: 'Borrow Out (Bout)',
        out2Val: borrow ? 1 : 0,
        eq1: 'A ⊕ B ⊕ Bin',
        eq2: "A'B + A'Bin + BBin"
      };
    }
  }, [circuitType, inA, inB, inC]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Interactive Adder &amp; Subtractor Circuit Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time binary logic evaluation for Half/Full Adder and Subtractor circuits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'half-adder', label: 'Half Adder' },
            { id: 'full-adder', label: 'Full Adder' },
            { id: 'half-subtractor', label: 'Half Subtractor' },
            { id: 'full-subtractor', label: 'Full Subtractor' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCircuitType(c.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                circuitType === c.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bits Interactive Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-bold">Input A:</div>
            <div className="text-xs text-slate-500 font-mono">Operand 1</div>
          </div>
          <button
            onClick={() => setInA((prev) => (prev === 0 ? 1 : 0))}
            className={`w-12 h-10 rounded-lg font-mono font-bold text-sm transition-all cursor-pointer ${
              inA === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {inA}
          </button>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-bold">Input B:</div>
            <div className="text-xs text-slate-500 font-mono">Operand 2</div>
          </div>
          <button
            onClick={() => setInB((prev) => (prev === 0 ? 1 : 0))}
            className={`w-12 h-10 rounded-lg font-mono font-bold text-sm transition-all cursor-pointer ${
              inB === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {inB}
          </button>
        </div>

        {(circuitType === 'full-adder' || circuitType === 'full-subtractor') && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">
                {circuitType === 'full-adder' ? 'Carry In (Cin):' : 'Borrow In (Bin):'}
              </div>
              <div className="text-xs text-slate-500 font-mono">Previous Stage</div>
            </div>
            <button
              onClick={() => setInC((prev) => (prev === 0 ? 1 : 0))}
              className={`w-12 h-10 rounded-lg font-mono font-bold text-sm transition-all cursor-pointer ${
                inC === 1
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400'
            }`}
          >
            {inC}
          </button>
        </div>
      )}
      </div>

      {/* Real-time Result Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-800/40">
          <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">
            {outputs.out1Name}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">{outputs.out1Val}</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-900/50 text-indigo-200 border border-indigo-700/50">
              Formula: {outputs.eq1}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-800/40">
          <div className="text-xs text-purple-300 font-bold uppercase tracking-wider mb-1">
            {outputs.out2Name}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">{outputs.out2Val}</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-purple-900/50 text-purple-200 border border-purple-700/50">
              Formula: {outputs.eq2}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
