export interface CTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Basics' | 'Control Flow' | 'Arrays & Strings' | 'Pointers & Structs' | 'Math & Logic';
  code: string;
  defaultInput?: string;
}

export interface VariableWatch {
  name: string;
  type: string;
  value: string;
  scope: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  variables: VariableWatch[];
  stepsCount: number;
  requiresInput?: boolean;
  inputPrompt?: string;
}

export type TerminalTheme = 'dark' | 'turbo-c' | 'matrix' | 'monokai';
