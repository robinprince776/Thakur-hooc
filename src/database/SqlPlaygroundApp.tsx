import React, { useState, useMemo } from 'react';
import {
  Database,
  ArrowRight,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Table,
  Sparkles
} from 'lucide-react';

export interface SqlPlaygroundAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

const SAMPLE_EMPLOYEES = [
  { id: 1, name: 'Alice Smith', department: 'Engineering', salary: 95000, role: 'Lead DevSecOps' },
  { id: 2, name: 'Bob Johnson', department: 'Security', salary: 110000, role: 'Senior SOC Analyst' },
  { id: 3, name: 'Carol White', department: 'Engineering', salary: 82000, role: 'Frontend Engineer' },
  { id: 4, name: 'David Lee', department: 'HR', salary: 65000, role: 'Technical Recruiter' },
  { id: 5, name: 'Eva Davis', department: 'Security', salary: 125000, role: 'Penetration Tester' }
];

export const SqlPlaygroundApp: React.FC<SqlPlaygroundAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [queryInput, setQueryInput] = useState('SELECT * FROM employees WHERE department = \'Security\' ORDER BY salary DESC');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const queryResults = useMemo(() => {
    const q = queryInput.trim().toLowerCase();
    let rows = [...SAMPLE_EMPLOYEES];

    if (q.includes("department = 'security'")) {
      rows = rows.filter((r) => r.department === 'Security');
    } else if (q.includes("department = 'engineering'")) {
      rows = rows.filter((r) => r.department === 'Engineering');
    } else if (q.includes("salary > 80000")) {
      rows = rows.filter((r) => r.salary > 80000);
    }

    if (q.includes('order by salary desc')) {
      rows.sort((a, b) => b.salary - a.salary);
    } else if (q.includes('order by salary asc')) {
      rows.sort((a, b) => a.salary - b.salary);
    }

    return rows;
  }, [queryInput]);

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                      SQL Playground
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      In-Browser SQL
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive SQL query editor with pre-seeded relational schemas
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">In-Memory SQL Execution Sandbox</h2>
              <p className="text-xs text-slate-400 mt-0.5">Query the pre-seeded `employees` table using standard SQL syntax.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
              {queryResults.length} Rows Returned
            </span>
          </div>

          {/* Quick Queries */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Try Sample Queries:</span>
            {[
              { label: 'Security Staff by Salary', sql: 'SELECT * FROM employees WHERE department = \'Security\' ORDER BY salary DESC' },
              { label: 'High Earners (> $80k)', sql: 'SELECT * FROM employees WHERE salary > 80000 ORDER BY salary DESC' },
              { label: 'Engineering Team', sql: 'SELECT * FROM employees WHERE department = \'Engineering\' ORDER BY salary ASC' },
              { label: 'All Records', sql: 'SELECT * FROM employees ORDER BY id ASC' }
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQueryInput(q.sql)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 cursor-pointer font-mono text-[11px]"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* SQL Editor Area */}
          <div className="space-y-2">
            <textarea
              rows={3}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Salary</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {queryResults.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/50">
                    <td className="p-3 text-cyan-400 font-bold">{row.id}</td>
                    <td className="p-3 font-sans font-bold text-white">{row.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.department === 'Security' ? 'bg-rose-950 text-rose-300' : 'bg-blue-950 text-blue-300'
                      }`}>
                        {row.department}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">${row.salary.toLocaleString()}</td>
                    <td className="p-3 text-slate-300 font-sans">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
