import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Code2,
  Terminal,
  Database,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ArrowRight,
  Monitor,
  Activity,
  Server,
  Cloud,
  Shield,
  Smartphone,
  BarChart3,
  Bot,
  Compass,
  FileCode,
  FolderGit2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface BcaSemesterSuiteProps {
  initialSubject?: string;
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (app: CurrentAppType) => void;
}

export type BcaSemester = 1 | 2 | 3 | 4 | 5 | 6;

export interface SubjectModule {
  id: string;
  title: string;
  semester: BcaSemester;
  iconName: string;
  color: string;
  tagline: string;
  topics: {
    title: string;
    description: string;
    codeSnippet?: string;
    interactiveDemo?: string;
  }[];
}

export const BCA_SUBJECTS: SubjectModule[] = [
  // SEMESTER 1 & 2
  {
    id: 'python',
    title: 'Python Programming',
    semester: 1,
    iconName: 'code',
    color: 'from-amber-500 to-yellow-600',
    tagline: 'Syntax, Data Types, OOP, File I/O & NumPy Basics',
    topics: [
      {
        title: 'Python Basics & Dynamic Typing',
        description: 'Variables in Python do not need explicit type declarations. Memory is managed automatically via reference counting & garbage collection.',
        codeSnippet: `# Variables & Dynamic Typing
name = "BCA Student"
semester = 1
cgpa = 9.4
skills = ["Python", "C", "SQL"]

print(f"Welcome {name}! Semester: {semester}, Target CGPA: {cgpa}")
print(f"Primary Skills: {', '.join(skills)}")`
      },
      {
        title: 'List Comprehensions & Lambdas',
        description: 'Concise syntax for creating lists based on existing iterables. Lambdas allow anonymous inline functions.',
        codeSnippet: `# List Comprehension & Lambda
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares_of_evens = [x**2 for x in numbers if x % 2 == 0]

double = lambda x: x * 2
print("Squares of Evens:", squares_of_evens) # [4, 16, 36, 64, 100]
print("Lambda Double(7):", double(7))`
      },
      {
        title: 'Object-Oriented Programming (OOP)',
        description: 'Classes, Objects, Constructors (__init__), Encapsulation, and Polymorphism in Python.',
        codeSnippet: `class Student:
    def __init__(self, roll_no, name, stream="BCA"):
        self.roll_no = roll_no
        self.name = name
        self.stream = stream

    def display(self):
        return f"Roll: {self.roll_no} | Name: {self.name} | Course: {self.stream}"

s1 = Student(101, "Aarav")
print(s1.display())`
      }
    ]
  },
  {
    id: 'java',
    title: 'Java Programming',
    semester: 2,
    iconName: 'terminal',
    color: 'from-orange-500 to-red-600',
    tagline: 'Core Java, OOP, Exception Handling, Collections & Threads',
    topics: [
      {
        title: 'Core OOP: Encapsulation & Inheritance',
        description: 'Java is strictly class-based. Objects encapsulate state (private fields) and behavior (public getters/setters).',
        codeSnippet: `public class Main {
    public static void main(String[] args) {
        Student s = new Student("Prince", 101);
        s.study();
    }
}

class Student {
    private String name;
    private int roll;

    public Student(String name, int roll) {
        this.name = name;
        this.roll = roll;
    }

    public void study() {
        System.out.println(name + " (Roll " + roll + ") is compiling Java!");
    }
}`
      },
      {
        title: 'Exception Handling (Try-Catch-Finally)',
        description: 'Robust error handling mechanism to maintain normal application flow without sudden crashes.',
        codeSnippet: `try {
    int numerator = 50;
    int denominator = 0;
    int result = numerator / denominator;
} catch (ArithmeticException e) {
    System.err.println("Cannot divide by zero: " + e.getMessage());
} finally {
    System.out.println("Cleanup executed successfully.");
}`
      },
      {
        title: 'Java Collections Framework (ArrayList, HashMap)',
        description: 'Standardized data structure containers providing high-efficiency storage and retrieval algorithms.',
        codeSnippet: `import java.util.*;

List<String> list = new ArrayList<>();
list.add("Java"); list.add("Spring Boot");

Map<Integer, String> map = new HashMap<>();
map.put(1, "First Year");
map.put(2, "Second Year");
System.out.println("Collection Size: " + list.size());`
      }
    ]
  },
  {
    id: 'cpp',
    title: 'C++ Object-Oriented Programming',
    semester: 1,
    iconName: 'code',
    color: 'from-blue-600 to-indigo-700',
    tagline: 'Classes, Inheritance, Polymorphism, STL & Pointers',
    topics: [
      {
        title: 'Classes, Objects & Constructors',
        description: 'C++ brings object-oriented features to C, enabling data abstraction, public/private access specifiers, and RAII.',
        codeSnippet: `#include <iostream>
using namespace std;

class Rectangle {
private:
    int width, height;
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    int area() const { return width * height; }
};

int main() {
    Rectangle rect(10, 5);
    cout << "Area of Rectangle: " << rect.area() << endl;
    return 0;
}`
      },
      {
        title: 'Runtime Polymorphism & Virtual Functions',
        description: 'Virtual functions enable dynamic binding so derived class methods are resolved at runtime via vtable.',
        codeSnippet: `class Base {
public:
    virtual void show() { cout << "Base Class" << endl; }
};

class Derived : public Base {
public:
    void show() override { cout << "Derived Class" << endl; }
};

// Base pointer pointing to Derived object invokes Derived method!`
      },
      {
        title: 'C++ Standard Template Library (STL)',
        description: 'Vectors, maps, pairs, and standard algorithms (std::sort, std::find) for zero-overhead performance.',
        codeSnippet: `#include <vector>
#include <algorithm>

vector<int> v = {40, 10, 50, 20};
sort(v.begin(), v.end());
// Sorted: 10, 20, 40, 50`
      }
    ]
  },
  {
    id: 'webdev',
    title: 'Web Technologies & JavaScript',
    semester: 2,
    iconName: 'monitor',
    color: 'from-cyan-500 to-blue-600',
    tagline: 'HTML5, CSS3 Grid/Flexbox, ES6+ JS, DOM & REST APIs',
    topics: [
      {
        title: 'Modern ES6+ JavaScript Features',
        description: 'Arrow functions, Destructuring, Promises, Async/Await, and Module Imports.',
        codeSnippet: `// Modern ES6+ Async Fetch
async function loadUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return { name: data.name, role: data.role };
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}`
      },
      {
        title: 'DOM Manipulation & Event Listeners',
        description: 'Selecting elements via querySelector and handling user interactions with addEventListener.',
        codeSnippet: `const btn = document.querySelector("#submitBtn");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("dark-mode");
});`
      }
    ]
  },
  {
    id: 'dbms',
    title: 'Database Management Systems (DBMS)',
    semester: 2,
    iconName: 'database',
    color: 'from-emerald-500 to-teal-700',
    tagline: 'Normalization (1NF-BCNF), ER Diagrams, SQL & ACID Properties',
    topics: [
      {
        title: 'Database Normalization (1NF to BCNF)',
        description: '1NF removes repeating groups. 2NF removes partial dependency. 3NF removes transitive dependency. BCNF ensures every determinant is a candidate key.',
        codeSnippet: `-- 1NF: Atomic values in columns
-- 2NF: 1NF + Non-prime attributes fully dependent on candidate key
-- 3NF: 2NF + No transitive dependency (X -> Y and Y -> Z)`
      },
      {
        title: 'Advanced SQL Joins & Subqueries',
        description: 'Combining rows from two or more tables based on a related column between them.',
        codeSnippet: `SELECT 
    students.name, 
    courses.course_name, 
    enrollments.grade
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id
INNER JOIN courses ON courses.id = enrollments.course_id
WHERE enrollments.grade = 'A';`
      }
    ]
  },
  {
    id: 'maths',
    title: 'Discrete Maths & Statistics',
    semester: 1,
    iconName: 'bar-chart',
    color: 'from-purple-500 to-pink-600',
    tagline: 'Set Theory, Matrices, Probability, Permutations & Combinations',
    topics: [
      {
        title: 'Matrices: Determinant & Multiplication',
        description: 'Matrix multiplication is row by column. Determinants are used to check invertibility ($det(A) \\neq 0$).',
        codeSnippet: `// 2x2 Matrix Determinant Formula:
// | a  b |
// | c  d | = (a*d) - (b*c)`
      },
      {
        title: 'Probability & Bayes Theorem',
        description: 'Conditional probability measures the probability of an event given that another event has occurred.',
        codeSnippet: `// P(A|B) = [ P(B|A) * P(A) ] / P(B)`
      }
    ]
  },

  // SEMESTER 3 & 4
  {
    id: 'os',
    title: 'Operating Systems & Scheduling',
    semester: 3,
    iconName: 'cpu',
    color: 'from-violet-500 to-purple-700',
    tagline: 'Process Scheduling, Banker Deadlock, Paging & Virtual Memory',
    topics: [
      {
        title: 'CPU Scheduling Algorithms',
        description: 'FCFS (First-Come, First-Served), SJF (Shortest Job First), Round Robin (Time Quantum), and Priority Scheduling.',
        codeSnippet: `// Round Robin (RR)
// Each process gets a fixed time quantum.
// If process burst > quantum, it goes back to ready queue tail.`
      },
      {
        title: "Banker's Algorithm for Deadlock Avoidance",
        description: 'Tests for safe state by simulating allocation for predetermined maximum possible amounts of all resources.',
        codeSnippet: `// Need Matrix = Max Matrix - Allocation Matrix
// Safety Check: Work = Available; while(finish[i] == false && need[i] <= Work)`
      }
    ]
  },
  {
    id: 'softwareeng',
    title: 'Software Engineering & Agile',
    semester: 3,
    iconName: 'folder-git',
    color: 'from-blue-500 to-cyan-600',
    tagline: 'SDLC Models, Agile Scrum, White/Black Box Testing & Design Patterns',
    topics: [
      {
        title: 'SDLC: Waterfall vs Agile Scrum',
        description: 'Waterfall is linear-sequential. Agile is iterative and flexible with 2-week sprints, daily standups, and continuous backlog refinement.',
        codeSnippet: `// Agile Sprint Lifecycle:
// 1. Sprint Planning -> 2. Daily Standup -> 3. Sprint Review -> 4. Retrospective`
      },
      {
        title: 'Testing: Black Box vs White Box',
        description: 'Black Box tests functional requirements without knowing internal code. White Box inspects internal code paths and branch coverage.',
        codeSnippet: `// Boundary Value Analysis (BVA): Test Min, Min+1, Nominal, Max-1, Max`
      }
    ]
  },
  {
    id: 'graphics',
    title: 'Computer Graphics & Transformations',
    semester: 4,
    iconName: 'monitor',
    color: 'from-emerald-500 to-teal-600',
    tagline: 'DDA & Bresenham Line Drawing, 2D/3D Transforms & Clipping',
    topics: [
      {
        title: 'DDA & Bresenham Line Drawing',
        description: 'DDA uses floating-point additions. Bresenham uses only integer additions and subtractions for blazing fast hardware rendering.',
        codeSnippet: `// Bresenham Decision Parameter:
// Pk = 2 * dy - dx
// If Pk < 0: Pk+1 = Pk + 2*dy
// Else: Pk+1 = Pk + 2*dy - 2*dx, increment y`
      },
      {
        title: '2D Transformations Matrix',
        description: 'Translation, Rotation around origin ($x\' = x\\cos\\theta - y\\sin\\theta$), and Scaling ($x\' = x \\cdot S_x$).',
        codeSnippet: `// Homogeneous Coordinates (3x3 Matrix)`
      }
    ]
  },
  {
    id: 'daa',
    title: 'Design & Analysis of Algorithms',
    semester: 4,
    iconName: 'activity',
    color: 'from-rose-500 to-red-700',
    tagline: 'Asymptotic Analysis, Greedy, Dynamic Programming & Backtracking',
    topics: [
      {
        title: 'Dynamic Programming: 0/1 Knapsack',
        description: 'Break problem into subproblems. Store results in a 2D table to avoid redundant exponential recalculations.',
        codeSnippet: `// DP recurrence:
// if weight[i-1] <= w:
//   dp[i][w] = max(val[i-1] + dp[i-1][w-weight[i-1]], dp[i-1][w])
// else:
//   dp[i][w] = dp[i-1][w]`
      },
      {
        title: 'Backtracking: N-Queens Problem',
        description: 'Place N queens on an NxN chessboard such that no two queens attack each other. Backtrack whenever a conflict occurs.',
        codeSnippet: `// Safe Check: Same column, left diagonal (r-c), right diagonal (r+c)`
      }
    ]
  },

  // SEMESTER 5 & 6
  {
    id: 'ai',
    title: 'Artificial Intelligence & Agents',
    semester: 5,
    iconName: 'bot',
    color: 'from-purple-500 to-indigo-600',
    tagline: 'Search Algorithms (BFS, DFS, A*), Knowledge Bases & Agents',
    topics: [
      {
        title: 'Informed Search: A* Algorithm',
        description: 'A* uses evaluation function f(n) = g(n) + h(n), where g is exact cost from start and h is heuristic estimate to goal.',
        codeSnippet: `// f(n) = g(n) + h(n)
// Guarantees optimal path if heuristic h(n) is admissible (never overestimates).`
      },
      {
        title: 'AI Agent Architecture (PEAS)',
        description: 'Performance Measure, Environment, Actuators, Sensors. Defines task environments for autonomous software and robotics.',
        codeSnippet: `// Example: Self-driving car
// Sensors: Camera, LiDAR, Radar, GPS
// Actuators: Steering, Accelerator, Brakes`
      }
    ]
  },
  {
    id: 'ml',
    title: 'Machine Learning & Neural Nets',
    semester: 5,
    iconName: 'activity',
    color: 'from-teal-500 to-emerald-600',
    tagline: 'Supervised, Unsupervised, Perceptron & Gradient Descent',
    topics: [
      {
        title: 'Single-Layer Perceptron',
        description: 'The fundamental building block of neural networks: Linear combination of inputs passed through an activation function.',
        codeSnippet: `// y = Activation(w1*x1 + w2*x2 + ... + wn*xn + bias)
// Activation: Step, Sigmoid, ReLU (max(0, x))`
      },
      {
        title: 'Gradient Descent Optimization',
        description: 'Iteratively adjusting weights in the opposite direction of the cost function gradient to minimize loss.',
        codeSnippet: `// Weight Update: W_new = W_old - (learning_rate * dLoss/dW)`
      }
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud Computing & Serverless',
    semester: 6,
    iconName: 'cloud',
    color: 'from-sky-500 to-blue-700',
    tagline: 'IaaS, PaaS, SaaS, AWS/Azure Services, Docker & Kubernetes',
    topics: [
      {
        title: 'Cloud Service Models: IaaS vs PaaS vs SaaS',
        description: 'IaaS gives raw VMs (EC2). PaaS manages runtime and OS (Heroku, Cloud Run). SaaS provides full software (Google Workspace).',
        codeSnippet: `// Serverless Architecture:
// Events trigger ephemeral containers (AWS Lambda, Cloud Functions)
// Zero idle cost, scales to zero.`
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Development (Android & Flutter)',
    semester: 6,
    iconName: 'smartphone',
    color: 'from-emerald-500 to-cyan-600',
    tagline: 'Android Activity Lifecycle, Jetpack Compose, Flutter Widgets',
    topics: [
      {
        title: 'Android Activity Lifecycle',
        description: 'onCreate() -> onStart() -> onResume() -> onPause() -> onStop() -> onDestroy(). Essential for managing memory and orientation changes.',
        codeSnippet: `// Kotlin Jetpack Compose sample
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!", style = MaterialTheme.typography.titleMedium)
}`
      }
    ]
  },
  {
    id: 'datascience',
    title: 'Data Science & Big Data',
    semester: 6,
    iconName: 'bar-chart',
    color: 'from-amber-500 to-orange-600',
    tagline: 'Pandas DataFrames, Data Cleaning, Matplotlib & Hadoop MapReduce',
    topics: [
      {
        title: 'Pandas Data Wrangling',
        description: 'Filtering, grouping, aggregating, and handling missing data (NaN) with DataFrame operations.',
        codeSnippet: `import pandas as pd

df = pd.read_csv("bca_students.csv")
top_scorers = df[df['gpa'] >= 9.0].groupby('semester').size()
print(top_scorers)`
      }
    ]
  }
];

export const BcaSemesterSuiteApp: React.FC<BcaSemesterSuiteProps> = ({
  initialSubject,
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [selectedSemester, setSelectedSemester] = useState<BcaSemester>(() => {
    if (initialSubject) {
      const match = BCA_SUBJECTS.find((s) => s.id === initialSubject);
      if (match) return match.semester;
    }
    return 1;
  });

  const [activeSubjectId, setActiveSubjectId] = useState<string>(() => {
    if (initialSubject) {
      const match = BCA_SUBJECTS.find((s) => s.id === initialSubject);
      if (match) return match.id;
    }
    return 'python';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Active Subject Object
  const currentSubject = useMemo(() => {
    return BCA_SUBJECTS.find((s) => s.id === activeSubjectId) || BCA_SUBJECTS[0];
  }, [activeSubjectId]);

  // Semester filtered subjects
  const semesterSubjects = useMemo(() => {
    return BCA_SUBJECTS.filter((s) => s.semester === selectedSemester);
  }, [selectedSemester]);

  // Handle Copy Code
  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">BCA 6-Semester Academic Suite</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Semesters 1 to 6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Core syllabus: Python, Java, C++, DBMS, OS, DAA, AI/ML, Cloud & Web
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

      {/* Semester Selector Bar */}
      <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-2 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {([1, 2, 3, 4, 5, 6] as BcaSemester[]).map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    const firstInSem = BCA_SUBJECTS.find((s) => s.semester === sem);
                    if (firstInSem) setActiveSubjectId(firstInSem.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap spring-press cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Semester {sem}
                </button>
              );
            })}
          </div>

          {/* Search filter for subjects */}
          <div className="relative min-w-[180px] max-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Semester Subjects Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Semester {selectedSemester} Subjects
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {semesterSubjects.length} Core Courses
            </span>
          </div>

          <div className="space-y-2">
            {semesterSubjects
              .filter(
                (s) =>
                  !searchQuery ||
                  s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((subject) => {
                const isSelected = activeSubjectId === subject.id;
                return (
                  <div
                    key={subject.id}
                    onClick={() => {
                      setActiveSubjectId(subject.id);
                      window.location.hash = subject.id;
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer glass-card-hover ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-tr ${subject.color}`}
                      >
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-sm text-white truncate">{subject.title}</h3>
                          <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                            #{subject.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{subject.tagline}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="mt-6 p-4 rounded-2xl glass-card border-white/10 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              ⚡ Advanced Out-Of-The-Box Labs
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  if (onSelectApp) onSelectApp('exam' as any);
                  else window.location.hash = 'exam';
                }}
                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-left spring-press cursor-pointer"
              >
                🎯 Exam Simulator
              </button>
              <button
                onClick={() => {
                  if (onSelectApp) onSelectApp('playground' as any);
                  else window.location.hash = 'playground';
                }}
                className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-left spring-press cursor-pointer"
              >
                🧑‍💻 Live Playground
              </button>
              <button
                onClick={() => {
                  if (onSelectApp) onSelectApp('visuallab' as any);
                  else window.location.hash = 'visuallab';
                }}
                className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-left spring-press cursor-pointer"
              >
                📊 Visual DBMS/OS
              </button>
              <button
                onClick={() => {
                  if (onSelectApp) onSelectApp('placement' as any);
                  else window.location.hash = 'placement';
                }}
                className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-left spring-press cursor-pointer"
              >
                🏆 Placement Prep
              </button>
            </div>
          </div>
        </div>

        {/* Right: Subject Interactive Syllabus & Code Play */}
        <div className="lg:col-span-8 space-y-5 animate-fade-in">
          {/* Header Banner for Subject */}
          <div className="p-5 rounded-3xl glass-card border-white/10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    Semester {currentSubject.semester}
                  </span>
                  <span className="text-xs text-slate-400">#{currentSubject.id}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{currentSubject.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentSubject.tagline}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectApp) onSelectApp('playground' as any);
                    else window.location.hash = 'playground';
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 spring-press cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open in Playground</span>
                </button>
              </div>
            </div>
          </div>

          {/* Topics List with Code Snippets */}
          <div className="space-y-4">
            {currentSubject.topics.map((topic, idx) => (
              <div key={idx} className="p-5 rounded-3xl glass-card border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{topic.title}</h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                  {topic.description}
                </p>

                {topic.codeSnippet && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 font-mono text-xs">
                    <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Executable Source Example</span>
                      <button
                        onClick={() => handleCopyCode(topic.codeSnippet!, idx)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 text-cyan-300 overflow-x-auto leading-relaxed select-text">
                      <code>{topic.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
