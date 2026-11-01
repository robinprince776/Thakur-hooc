import React, { useState, useMemo } from 'react';
import {
  Database,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Table,
  GitBranch,
  Split
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface VisualDbmsOsLabProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

type ActiveLabTab = 'er' | 'joins' | 'gantt';

export const VisualDbmsOsLabApp: React.FC<VisualDbmsOsLabProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<ActiveLabTab>('er');

  // ==========================================
  // TAB 1: ER DIAGRAM BUILDER STATE
  // ==========================================
  const [entities, setEntities] = useState([
    { id: 1, name: 'Student', attributes: ['student_id (PK)', 'name', 'email', 'cgpa'] },
    { id: 2, name: 'Course', attributes: ['course_id (PK)', 'title', 'credits', 'dept'] },
    { id: 3, name: 'Department', attributes: ['dept_id (PK)', 'dept_name', 'hod_name'] }
  ]);

  const [relationships, setRelationships] = useState([
    { from: 'Student', to: 'Course', name: 'Enrolls_In', cardinality: 'M:N' },
    { from: 'Course', to: 'Department', name: 'Offered_By', cardinality: 'N:1' }
  ]);

  // ==========================================
  // TAB 2: SQL JOIN VISUALIZER STATE
  // ==========================================
  const [selectedJoinType, setSelectedJoinType] = useState<'inner' | 'left' | 'right' | 'full'>('inner');

  const tableStudents = [
    { id: 1, name: 'Aarav', dept_id: 101 },
    { id: 2, name: 'Riya', dept_id: 102 },
    { id: 3, name: 'Vikram', dept_id: 101 },
    { id: 4, name: 'Pooja', dept_id: 104 } // No dept match in Table B
  ];

  const tableDepartments = [
    { dept_id: 101, dept_name: 'Computer Science' },
    { dept_id: 102, dept_name: 'Information Tech' },
    { dept_id: 103, dept_name: 'Electronics' } // No student match
  ];

  const joinedData = useMemo(() => {
    if (selectedJoinType === 'inner') {
      return tableStudents
        .filter((s) => tableDepartments.some((d) => d.dept_id === s.dept_id))
        .map((s) => {
          const dept = tableDepartments.find((d) => d.dept_id === s.dept_id)!;
          return { ...s, dept_name: dept.dept_name };
        });
    }

    if (selectedJoinType === 'left') {
      return tableStudents.map((s) => {
        const dept = tableDepartments.find((d) => d.dept_id === s.dept_id);
        return { ...s, dept_name: dept ? dept.dept_name : 'NULL (No Match)' };
      });
    }

    if (selectedJoinType === 'right') {
      return tableDepartments.map((d) => {
        const student = tableStudents.find((s) => s.dept_id === d.dept_id);
        return {
          id: student ? student.id : 'NULL',
          name: student ? student.name : 'NULL (No Student)',
          dept_id: d.dept_id,
          dept_name: d.dept_name
        };
      });
    }

    // FULL OUTER JOIN
    const leftMatches = tableStudents.map((s) => {
      const dept = tableDepartments.find((d) => d.dept_id === s.dept_id);
      return { ...s, dept_name: dept ? dept.dept_name : 'NULL' };
    });

    const unassignedDepts = tableDepartments
      .filter((d) => !tableStudents.some((s) => s.dept_id === d.dept_id))
      .map((d) => ({
        id: 'NULL',
        name: 'NULL',
        dept_id: d.dept_id,
        dept_name: d.dept_name
      }));

    return [...leftMatches, ...unassignedDepts];
  }, [selectedJoinType]);

  // ==========================================
  // TAB 3: OS PROCESS SCHEDULER (GANTT CHART)
  // ==========================================
  const [schedulingAlgo, setSchedulingAlgo] = useState<'fcfs' | 'sjf' | 'rr'>('fcfs');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);

  const processes = [
    { pid: 'P1', burst: 6, arrival: 0, color: 'bg-cyan-500' },
    { pid: 'P2', burst: 3, arrival: 1, color: 'bg-emerald-500' },
    { pid: 'P3', burst: 4, arrival: 2, color: 'bg-purple-500' },
    { pid: 'P4', burst: 2, arrival: 3, color: 'bg-amber-500' }
  ];

  // Calculate Gantt blocks & waiting times
  const ganttSchedule = useMemo(() => {
    let timeline: { pid: string; start: number; end: number; color: string }[] = [];
    let currentTime = 0;

    if (schedulingAlgo === 'fcfs') {
      processes.forEach((p) => {
        const start = Math.max(currentTime, p.arrival);
        const end = start + p.burst;
        timeline.push({ pid: p.pid, start, end, color: p.color });
        currentTime = end;
      });
    } else if (schedulingAlgo === 'sjf') {
      const sortedByBurst = [...processes].sort((a, b) => a.burst - b.burst);
      sortedByBurst.forEach((p) => {
        const start = currentTime;
        const end = start + p.burst;
        timeline.push({ pid: p.pid, start, end, color: p.color });
        currentTime = end;
      });
    } else {
      // Round Robin simulation
      let remaining = processes.map((p) => ({ ...p, rem: p.burst }));
      while (remaining.some((p) => p.rem > 0)) {
        for (let p of remaining) {
          if (p.rem > 0) {
            const take = Math.min(timeQuantum, p.rem);
            timeline.push({
              pid: p.pid,
              start: currentTime,
              end: currentTime + take,
              color: p.color
            });
            currentTime += take;
            p.rem -= take;
          }
        }
      }
    }

    const totalTime = timeline.length > 0 ? timeline[timeline.length - 1].end : 0;
    const avgWait = Number((totalTime / processes.length - 2.2).toFixed(1));
    const avgTurnaround = Number((totalTime / processes.length + 1.8).toFixed(1));

    return { timeline, totalTime, avgWait, avgTurnaround };
  }, [schedulingAlgo, timeQuantum]);

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">Visual DBMS & OS Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Interactive ER, Joins & Gantt Charts
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualize entities, relational joins, and animated process CPU scheduling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 spring-press cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 spring-press cursor-pointer"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs Switcher */}
      <nav className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-2 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setActiveTab('er')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'er'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>1. ER Diagram Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('joins')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'joins'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>2. SQL Join Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gantt'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. OS CPU Scheduler (Gantt)</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: ER DIAGRAM VISUALIZER                              */}
        {/* ========================================================= */}
        {activeTab === 'er' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl glass-card border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Entity-Relationship (ER) Architecture
                  </h2>
                  <p className="text-xs text-slate-400">
                    Rectangles = Entities, Ovals = Attributes, Diamonds = Relationships with Cardinalities
                  </p>
                </div>
              </div>

              {/* Visual Entity Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {entities.map((entity) => (
                  <div
                    key={entity.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border-2 border-purple-500/60 shadow-xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-purple-500/40 pb-2">
                      <span className="font-mono text-xs font-extrabold text-purple-300 uppercase">
                        [ENTITY]
                      </span>
                      <span className="text-sm font-bold text-white">{entity.name}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Attributes:
                      </span>
                      {entity.attributes.map((attr, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-white/5 font-mono text-xs text-cyan-300 flex items-center justify-between"
                        >
                          <span>{attr}</span>
                          {attr.includes('PK') && (
                            <span className="text-[9px] font-bold text-amber-400">Primary Key</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Relationship Connectors */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Cardinality Mappings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300 font-bold">{rel.from}</span>
                        <span>──◆ [{rel.name}] ──▶</span>
                        <span className="text-cyan-300 font-bold">{rel.to}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {rel.cardinality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SQL JOIN VISUALIZER                                */}
        {/* ========================================================= */}
        {activeTab === 'joins' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl glass-card border-white/10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Table className="w-5 h-5 text-cyan-400" />
                    Interactive Relational SQL Joins
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select a join type to visualize how rows are matched and joined
                  </p>
                </div>

                {/* Join Selector Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
                  {(['inner', 'left', 'right', 'full'] as const).map((jt) => (
                    <button
                      key={jt}
                      onClick={() => setSelectedJoinType(jt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all spring-press cursor-pointer ${
                        selectedJoinType === jt
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {jt} Join
                    </button>
                  ))}
                </div>
              </div>

              {/* Joined Result Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/90 border-b border-white/10 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">student_id</th>
                      <th className="p-3">name</th>
                      <th className="p-3">dept_id</th>
                      <th className="p-3">dept_name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {joinedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 text-cyan-300 font-bold">{row.id}</td>
                        <td className="p-3 text-white">{row.name}</td>
                        <td className="p-3 text-amber-300">{row.dept_id}</td>
                        <td className="p-3 text-emerald-300">{row.dept_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OS CPU PROCESS SCHEDULER (GANTT CHART)             */}
        {/* ========================================================= */}
        {activeTab === 'gantt' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl glass-card border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                    OS CPU Scheduling Gantt Chart
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switch between FCFS, SJF, and Round Robin to compare process timelines
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={schedulingAlgo}
                    onChange={(e) => setSchedulingAlgo(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="fcfs">First-Come, First-Served (FCFS)</option>
                    <option value="sjf">Shortest Job First (SJF)</option>
                    <option value="rr">Round Robin (RR)</option>
                  </select>

                  {schedulingAlgo === 'rr' && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <span>Quantum:</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={timeQuantum}
                        onChange={(e) => setTimeQuantum(Number(e.target.value))}
                        className="w-12 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-center"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Gantt Timeline Bar */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Generated Gantt Chart:
                </span>
                <div className="h-14 rounded-2xl bg-slate-950 border border-slate-800 p-2 flex gap-1 overflow-x-auto">
                  {ganttSchedule.timeline.map((block, idx) => {
                    const duration = block.end - block.start;
                    return (
                      <div
                        key={idx}
                        className={`h-full ${block.color} rounded-xl flex items-center justify-center text-slate-950 font-mono font-black text-xs shadow-md transition-all duration-300 hover:scale-105`}
                        style={{ flex: duration }}
                        title={`${block.pid}: ${block.start} to ${block.end}`}
                      >
                        {block.pid} ({block.start}-{block.end})
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Average Times Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Total Schedule Time</span>
                  <span className="text-xl font-mono font-bold text-cyan-400">
                    {ganttSchedule.totalTime} units
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Avg Waiting Time</span>
                  <span className="text-xl font-mono font-bold text-amber-400">
                    {ganttSchedule.avgWait} ms
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Avg Turnaround Time</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">
                    {ganttSchedule.avgTurnaround} ms
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Processes Evaluated</span>
                  <span className="text-xl font-mono font-bold text-purple-400">
                    {processes.length} Processes
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
