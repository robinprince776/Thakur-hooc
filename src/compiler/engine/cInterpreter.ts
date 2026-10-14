import { ExecutionResult, VariableWatch } from '../types';

/**
 * In-browser C Language Interpreter & Virtual Machine
 * Handles standard C syntax, printf/scanf, arrays, loops, functions, and pointers.
 * Designed for BCA/CS students and developers by Prince Thakur.
 */

interface InterpreterScope {
  parent?: InterpreterScope;
  variables: Map<string, any>;
  types: Map<string, string>;
  pointers: Map<string, { targetName: string; isPointer: boolean }>;
}

export class CInterpreter {
  private code: string;
  private stdinTokens: string[];
  private stdout: string[] = [];
  private stderr: string[] = [];
  private steps: number = 0;
  private readonly maxSteps: number = 50000;
  private variablesWatch: VariableWatch[] = [];

  constructor(code: string, stdin: string = '') {
    this.code = code;
    // Split stdin by whitespace, preserving tokens
    this.stdinTokens = stdin
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }

  public run(): ExecutionResult {
    const startTime = performance.now();
    this.stdout = [];
    this.stderr = [];
    this.steps = 0;
    this.variablesWatch = [];

    try {
      this.executeProgram();
    } catch (err: any) {
      this.stderr.push(err.message || String(err));
    }

    const duration = Math.max(1, Math.round(performance.now() - startTime));

    return {
      stdout: this.stdout.join(''),
      stderr: this.stderr.join('\n'),
      exitCode: this.stderr.length > 0 ? 1 : 0,
      executionTimeMs: duration,
      variables: this.variablesWatch,
      stepsCount: this.steps
    };
  }

  private cleanCode(raw: string): string {
    // Remove multi-line comments
    let code = raw.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single line comments
    code = code.replace(/\/\/[^\n]*/g, '');
    return code;
  }

  private executeProgram(): void {
    const cleaned = this.cleanCode(this.code);

    // Check for main function
    const mainMatch = cleaned.match(/(?:int|void)\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
    if (!mainMatch) {
      throw new Error(
        'Syntax Error: main() function nahi mila! Har C program mein int main() zaroori hota hai.'
      );
    }

    // Extract functions outside main
    const globalScope: InterpreterScope = {
      variables: new Map(),
      types: new Map(),
      pointers: new Map()
    };

    // Parse user-defined functions like void swap(int *x, int *y) { ... }
    const funcRegex = /(?:void|int|double|float|long)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g;
    const functions = new Map<string, { params: string[]; body: string; returnType: string }>();

    let funcMatch;
    while ((funcMatch = funcRegex.exec(cleaned)) !== null) {
      const name = funcMatch[1];
      if (name !== 'main') {
        const rawParams = funcMatch[2]
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        const body = funcMatch[3];
        functions.set(name, { params: rawParams, body, returnType: 'auto' });
      }
    }

    const mainBody = mainMatch[1];
    this.executeBlock(mainBody, globalScope, functions);

    // Populate variable watch from globalScope
    for (const [name, val] of globalScope.variables.entries()) {
      const type = globalScope.types.get(name) || 'auto';
      let displayVal = '';
      if (Array.isArray(val)) {
        if (Array.isArray(val[0])) {
          displayVal = JSON.stringify(val);
        } else {
          displayVal = `[${val.join(', ')}]`;
        }
      } else if (typeof val === 'object' && val !== null) {
        displayVal = JSON.stringify(val);
      } else {
        displayVal = String(val);
      }

      this.variablesWatch.push({
        name,
        type,
        value: displayVal,
        scope: 'main'
      });
    }
  }

  private executeBlock(
    block: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): any {
    const lines = this.splitStatements(block);

    for (let i = 0; i < lines.length; i++) {
      this.steps++;
      if (this.steps > this.maxSteps) {
        throw new Error(
          'Runtime Error: Maximum execution steps limit (50,000) cross ho gaya! Kripya infinite loop check karein.'
        );
      }

      const rawStmt = lines[i].trim();
      if (!rawStmt) continue;

      // Check return statement
      if (rawStmt.startsWith('return ') || rawStmt === 'return;') {
        const retValStr = rawStmt.replace(/^return\s*/, '').replace(/;$/, '').trim();
        if (retValStr) {
          return this.evaluateExpression(retValStr, scope);
        }
        return undefined;
      }

      // Check break or continue
      if (rawStmt === 'break;' || rawStmt === 'break') {
        return { __control: 'break' };
      }
      if (rawStmt === 'continue;' || rawStmt === 'continue') {
        return { __control: 'continue' };
      }

      // Printf call
      if (rawStmt.startsWith('printf(')) {
        this.executePrintf(rawStmt, scope);
        continue;
      }

      // Scanf call
      if (rawStmt.startsWith('scanf(')) {
        this.executeScanf(rawStmt, scope);
        continue;
      }

      // If / Else if / Else
      if (rawStmt.startsWith('if ') || rawStmt.startsWith('if(')) {
        const res = this.executeIfStatement(rawStmt, scope, functions);
        if (res && res.__control) return res;
        continue;
      }

      // For loop
      if (rawStmt.startsWith('for ') || rawStmt.startsWith('for(')) {
        const res = this.executeForLoop(rawStmt, scope, functions);
        if (res && res.__control === 'return') return res.value;
        continue;
      }

      // While loop
      if (rawStmt.startsWith('while ') || rawStmt.startsWith('while(')) {
        const res = this.executeWhileLoop(rawStmt, scope, functions);
        if (res && res.__control === 'return') return res.value;
        continue;
      }

      // Switch statement
      if (rawStmt.startsWith('switch ') || rawStmt.startsWith('switch(')) {
        this.executeSwitch(rawStmt, scope, functions);
        continue;
      }

      // Variable declaration: int x, y = 10, arr[10];
      if (
        /^(?:int|float|double|char|long|short|unsigned|void)\s+/.test(rawStmt) ||
        /^(?:int|float|double|char|long)\s*\*/.test(rawStmt)
      ) {
        this.executeDeclaration(rawStmt, scope);
        continue;
      }

      // User-defined function call as a statement: swap(&a, &b);
      const funcCallMatch = rawStmt.match(/^([a-zA-Z_]\w*)\s*\(([\s\S]*)\)\s*;?$/);
      if (funcCallMatch && functions.has(funcCallMatch[1])) {
        const fname = funcCallMatch[1];
        const argStr = funcCallMatch[2];
        this.callFunction(fname, argStr, scope, functions);
        continue;
      }

      // Assignment or expression statement: x = x + 1; or arr[i] = temp;
      this.executeAssignmentOrExpr(rawStmt.replace(/;$/, ''), scope);
    }
  }

  private splitStatements(block: string): string[] {
    const stmts: string[] = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < block.length; i++) {
      const char = block[i];

      if ((char === '"' || char === "'") && block[i - 1] !== '\\') {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (quoteChar === char) {
          inQuotes = false;
        }
      }

      if (!inQuotes) {
        if (char === '{' || char === '(') depth++;
        if (char === '}' || char === ')') depth--;

        if (depth === 0) {
          if (char === ';') {
            current += char;
            stmts.push(current.trim());
            current = '';
            continue;
          }

          // Complete blocks like if(...) { ... } or for(...) { ... }
          if (char === '}') {
            current += char;
            // Check if followed immediately by 'else'
            const rest = block.slice(i + 1).trim();
            if (rest.startsWith('else')) {
              // keep accumulating until end of else block
              continue;
            }
            stmts.push(current.trim());
            current = '';
            continue;
          }
        }
      }

      current += char;
    }

    if (current.trim()) {
      stmts.push(current.trim());
    }

    return stmts;
  }

  private executeDeclaration(stmt: string, scope: InterpreterScope): void {
    // e.g. int a, b = 20, sum; or int arr[6] = {1, 2, 3}; or int a[2][2] = {{1, 2}, {3, 4}};
    const cleaned = stmt.replace(/;$/, '').trim();
    const typeMatch = cleaned.match(/^(int|float|double|char|long|void)\s+/);
    if (!typeMatch) return;

    const baseType = typeMatch[1];
    let rest = cleaned.slice(typeMatch[0].length).trim();

    // Check 2D array: int a[2][2] = {{1, 2}, {3, 4}};
    const matrixMatch = rest.match(/^([a-zA-Z_]\w*)\s*\[(\d+)\]\s*\[(\d+)\](?:\s*=\s*\{([\s\S]*)\})?$/);
    if (matrixMatch) {
      const name = matrixMatch[1];
      const r = parseInt(matrixMatch[2], 10);
      const c = parseInt(matrixMatch[3], 10);
      const matrix: number[][] = Array.from({ length: r }, () => Array(c).fill(0));

      if (matrixMatch[4]) {
        // parse {{1, 2}, {3, 4}}
        const rows = matrixMatch[4].split(/\}\s*,\s*\{/);
        for (let ri = 0; ri < rows.length && ri < r; ri++) {
          const rowVals = rows[ri]
            .replace(/[{}]/g, '')
            .split(',')
            .map((v) => this.evaluateExpression(v.trim(), scope));
          for (let ci = 0; ci < rowVals.length && ci < c; ci++) {
            matrix[ri][ci] = rowVals[ci];
          }
        }
      }

      scope.variables.set(name, matrix);
      scope.types.set(name, `${baseType}[${r}][${c}]`);
      return;
    }

    // Check 1D array: int arr[6] = {64, 34, 25, 12, 22, 11};
    const arrayMatch = rest.match(/^([a-zA-Z_]\w*)\s*\[(\d*)\](?:\s*=\s*\{([^}]*)\})?$/);
    if (arrayMatch) {
      const name = arrayMatch[1];
      const sizeStr = arrayMatch[2];
      const initVals = arrayMatch[3]
        ? arrayMatch[3].split(',').map((v) => this.evaluateExpression(v.trim(), scope))
        : [];
      const size = sizeStr ? parseInt(sizeStr, 10) : initVals.length;
      const arr = Array(size).fill(0);
      for (let i = 0; i < initVals.length; i++) {
        arr[i] = initVals[i];
      }
      scope.variables.set(name, arr);
      scope.types.set(name, `${baseType}[${size}]`);
      return;
    }

    // Regular comma-separated variables: int a, b = 10, *p = &a;
    const parts = this.splitComma(rest);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('*')) {
        // Pointer declaration: *p = &a;
        const pMatch = trimmed.slice(1).trim().split('=');
        const pName = pMatch[0].trim();
        scope.types.set(pName, `${baseType}*`);
        if (pMatch[1]) {
          const targetStr = pMatch[1].trim().replace(/^&/, '');
          scope.pointers.set(pName, { targetName: targetStr, isPointer: true });
          scope.variables.set(pName, `&${targetStr}`);
        } else {
          scope.pointers.set(pName, { targetName: '', isPointer: true });
          scope.variables.set(pName, 'NULL');
        }
        continue;
      }

      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const varName = trimmed.slice(0, eqIdx).trim();
        const initExpr = trimmed.slice(eqIdx + 1).trim();
        const val = this.evaluateExpression(initExpr, scope);
        scope.variables.set(varName, val);
        scope.types.set(varName, baseType);
      } else {
        scope.variables.set(trimmed, 0);
        scope.types.set(trimmed, baseType);
      }
    }
  }

  private splitComma(str: string): string[] {
    const res: string[] = [];
    let cur = '';
    let depth = 0;
    for (const c of str) {
      if (c === '{' || c === '(') depth++;
      if (c === '}' || c === ')') depth--;
      if (c === ',' && depth === 0) {
        res.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    if (cur.trim()) res.push(cur.trim());
    return res;
  }

  private executeAssignmentOrExpr(stmt: string, scope: InterpreterScope): void {
    const s = stmt.trim();
    if (!s) return;

    // Pointer assignment: *x = temp;
    if (s.startsWith('*')) {
      const eqIdx = s.indexOf('=');
      if (eqIdx !== -1) {
        const ptrName = s.slice(1, eqIdx).trim();
        const valExpr = s.slice(eqIdx + 1).trim();
        const val = this.evaluateExpression(valExpr, scope);
        const ptr = scope.pointers.get(ptrName);
        if (ptr && ptr.targetName) {
          scope.variables.set(ptr.targetName, val);
          return;
        }
      }
    }

    // 2D Array assignment: sum[i][j] = a[i][j] + b[i][j];
    const matrixAssign = s.match(/^([a-zA-Z_]\w*)\s*\[([^\]]+)\]\s*\[([^\]]+)\]\s*=\s*(.+)$/);
    if (matrixAssign) {
      const name = matrixAssign[1];
      const r = this.evaluateExpression(matrixAssign[2], scope);
      const c = this.evaluateExpression(matrixAssign[3], scope);
      const val = this.evaluateExpression(matrixAssign[4], scope);
      const mat = scope.variables.get(name);
      if (Array.isArray(mat) && mat[r]) {
        mat[r][c] = val;
      }
      return;
    }

    // 1D Array assignment: arr[j] = temp;
    const arrayAssign = s.match(/^([a-zA-Z_]\w*)\s*\[([^\]]+)\]\s*=\s*(.+)$/);
    if (arrayAssign) {
      const name = arrayAssign[1];
      const idx = this.evaluateExpression(arrayAssign[2], scope);
      const val = this.evaluateExpression(arrayAssign[3], scope);
      const arr = scope.variables.get(name);
      if (Array.isArray(arr)) {
        arr[idx] = val;
      }
      return;
    }

    // Increments / Decrements: i++ or ++i or i--
    if (/^[a-zA-Z_]\w*\+\+$/.test(s)) {
      const name = s.replace('++', '');
      scope.variables.set(name, (scope.variables.get(name) || 0) + 1);
      return;
    }
    if (/^\+\+[a-zA-Z_]\w*$/.test(s)) {
      const name = s.replace('++', '');
      scope.variables.set(name, (scope.variables.get(name) || 0) + 1);
      return;
    }
    if (/^[a-zA-Z_]\w*--$/.test(s)) {
      const name = s.replace('--', '');
      scope.variables.set(name, (scope.variables.get(name) || 0) - 1);
      return;
    }

    // Compound assignment: a += 5;
    const compoundMatch = s.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=)\s*(.+)$/);
    if (compoundMatch) {
      const name = compoundMatch[1];
      const op = compoundMatch[2];
      const val = this.evaluateExpression(compoundMatch[3], scope);
      const cur = scope.variables.get(name) || 0;
      let next = cur;
      if (op === '+=') next += val;
      if (op === '-=') next -= val;
      if (op === '*=') next *= val;
      if (op === '/=') next = Math.floor(cur / val);
      if (op === '%=') next = cur % val;
      scope.variables.set(name, next);
      return;
    }

    // Regular assignment: x = 10;
    const eqIdx = s.indexOf('=');
    if (eqIdx !== -1) {
      const name = s.slice(0, eqIdx).trim();
      const expr = s.slice(eqIdx + 1).trim();
      const val = this.evaluateExpression(expr, scope);
      scope.variables.set(name, val);
      return;
    }

    // Just an expression
    this.evaluateExpression(s, scope);
  }

  private executePrintf(stmt: string, scope: InterpreterScope): void {
    const inside = stmt.slice(stmt.indexOf('(') + 1, stmt.lastIndexOf(')'));
    const args = this.splitComma(inside);
    if (args.length === 0) return;

    // First arg is format string
    let format = args[0].trim();
    if (format.startsWith('"') && format.endsWith('"')) {
      format = format.slice(1, -1);
    }

    // Unescape \n and \t
    format = format.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');

    const evalArgs = args.slice(1).map((a) => this.evaluateExpression(a.trim(), scope));

    let argIdx = 0;
    const formatted = format.replace(/%(\.?\d*)?([difsclpu%])/g, (match, precision, spec) => {
      if (spec === '%') return '%';
      if (argIdx >= evalArgs.length) return match;

      const val = evalArgs[argIdx++];
      if (spec === 'd' || spec === 'i') {
        return String(Math.floor(Number(val)));
      }
      if (spec === 'f' || spec === 'lf') {
        if (precision && precision.startsWith('.')) {
          const dec = parseInt(precision.slice(1), 10);
          return Number(val).toFixed(dec);
        }
        return Number(val).toFixed(6);
      }
      if (spec === 'c') {
        return typeof val === 'number' ? String.fromCharCode(val) : String(val);
      }
      if (spec === 's') {
        return String(val);
      }
      return String(val);
    });

    this.stdout.push(formatted);
  }

  private executeScanf(stmt: string, scope: InterpreterScope): void {
    const inside = stmt.slice(stmt.indexOf('(') + 1, stmt.lastIndexOf(')'));
    const args = this.splitComma(inside);
    if (args.length < 2) return;

    const targets = args.slice(1).map((t) => t.trim().replace(/^&/, ''));

    for (const target of targets) {
      if (this.stdinTokens.length > 0) {
        const token = this.stdinTokens.shift()!;
        // Parse into number if numeric
        if (/^-?\d+\.\d+$/.test(token)) {
          scope.variables.set(target, parseFloat(token));
        } else if (/^-?\d+$/.test(token)) {
          scope.variables.set(target, parseInt(token, 10));
        } else {
          scope.variables.set(target, token);
        }
      } else {
        // Default prompt value if user didn't pre-feed stdin
        const curType = scope.types.get(target) || 'int';
        if (curType === 'char') {
          scope.variables.set(target, 'A');
        } else if (curType === 'float' || curType === 'double') {
          scope.variables.set(target, 0.0);
        } else {
          scope.variables.set(target, 0);
        }
      }
    }
  }

  private executeIfStatement(
    stmt: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): any {
    // if (...) { ... } else if (...) { ... } else { ... }
    const condMatch = stmt.match(/^if\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\}([\s\S]*)$/);
    if (!condMatch) {
      // Single line if without braces
      const simpleMatch = stmt.match(/^if\s*\(([\s\S]*?)\)\s*([^;]+;)([\s\S]*)$/);
      if (simpleMatch) {
        const cond = this.evaluateExpression(simpleMatch[1], scope);
        if (this.isTruthy(cond)) {
          return this.executeBlock(simpleMatch[2], scope, functions);
        } else if (simpleMatch[3] && simpleMatch[3].trim().startsWith('else')) {
          const restElse = simpleMatch[3].trim().replace(/^else\s*/, '');
          return this.executeBlock(restElse, scope, functions);
        }
        return;
      }
      return;
    }

    const cond = this.evaluateExpression(condMatch[1], scope);
    const ifBody = condMatch[2];
    const elsePart = condMatch[3].trim();

    if (this.isTruthy(cond)) {
      return this.executeBlock(ifBody, scope, functions);
    } else if (elsePart.startsWith('else')) {
      const rest = elsePart.replace(/^else\s*/, '').trim();
      if (rest.startsWith('if')) {
        return this.executeIfStatement(rest, scope, functions);
      } else if (rest.startsWith('{')) {
        const body = rest.slice(1, rest.lastIndexOf('}'));
        return this.executeBlock(body, scope, functions);
      } else {
        return this.executeBlock(rest, scope, functions);
      }
    }
  }

  private executeForLoop(
    stmt: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): any {
    const loopMatch = stmt.match(/^for\s*\(([^;]*);([^;]*);([^)]*)\)\s*\{([\s\S]*)\}$/);
    if (!loopMatch) return;

    const init = loopMatch[1].trim();
    const cond = loopMatch[2].trim();
    const step = loopMatch[3].trim();
    const body = loopMatch[4];

    if (init) {
      if (/^(?:int|float|double|char)\s+/.test(init)) {
        this.executeDeclaration(init, scope);
      } else {
        this.executeAssignmentOrExpr(init, scope);
      }
    }

    while (true) {
      this.steps++;
      if (this.steps > this.maxSteps) {
        throw new Error('Runtime Error: Infinite loop detected in for-loop!');
      }

      if (cond && !this.isTruthy(this.evaluateExpression(cond, scope))) {
        break;
      }

      const res = this.executeBlock(body, scope, functions);
      if (res && res.__control === 'break') break;
      if (res && res.__control === 'return') return res;

      if (step) {
        this.executeAssignmentOrExpr(step, scope);
      }
    }
  }

  private executeWhileLoop(
    stmt: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): any {
    const loopMatch = stmt.match(/^while\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}$/);
    if (!loopMatch) return;

    const cond = loopMatch[1].trim();
    const body = loopMatch[2];

    while (this.isTruthy(this.evaluateExpression(cond, scope))) {
      this.steps++;
      if (this.steps > this.maxSteps) {
        throw new Error('Runtime Error: Infinite loop detected in while-loop!');
      }

      const res = this.executeBlock(body, scope, functions);
      if (res && res.__control === 'break') break;
      if (res && res.__control === 'return') return res;
    }
  }

  private executeSwitch(
    stmt: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): void {
    const match = stmt.match(/^switch\s*\(([^)]+)\)\s*\{([\s\S]*)\}$/);
    if (!match) return;

    const targetVal = this.evaluateExpression(match[1], scope);
    const body = match[2];

    // Parse cases
    const caseRegex = /(?:case\s+([^:]+):|default:)([\s\S]*?)(?=(?:case\s+[^:]+:|default:|$))/g;
    let cm;
    let matched = false;

    while ((cm = caseRegex.exec(body)) !== null) {
      const caseExpr = cm[1];
      const caseBody = cm[2];

      if (caseExpr) {
        const val = this.evaluateExpression(caseExpr.trim(), scope);
        if (val == targetVal || matched) {
          matched = true;
          const res = this.executeBlock(caseBody, scope, functions);
          if (res && res.__control === 'break') break;
        }
      } else {
        // default
        const res = this.executeBlock(caseBody, scope, functions);
        if (res && res.__control === 'break') break;
      }
    }
  }

  private callFunction(
    fname: string,
    argStr: string,
    scope: InterpreterScope,
    functions: Map<string, { params: string[]; body: string; returnType: string }>
  ): any {
    const fn = functions.get(fname);
    if (!fn) return undefined;

    const subScope: InterpreterScope = {
      parent: scope,
      variables: new Map(),
      types: new Map(),
      pointers: new Map()
    };

    const passedArgs = this.splitComma(argStr).map((a) => a.trim());

    for (let i = 0; i < fn.params.length; i++) {
      const pDecl = fn.params[i];
      const argVal = passedArgs[i];
      if (!argVal) continue;

      if (pDecl.includes('*')) {
        // Pointer parameter: int *x
        const pName = pDecl.replace(/.*?\*/, '').trim();
        const targetName = argVal.replace(/^&/, '').trim();
        subScope.pointers.set(pName, { targetName, isPointer: true });
        subScope.variables.set(pName, `&${targetName}`);
      } else {
        const pName = pDecl.replace(/^[a-zA-Z_]\w*\s+/, '').trim();
        subScope.variables.set(pName, this.evaluateExpression(argVal, scope));
      }
    }

    return this.executeBlock(fn.body, subScope, functions);
  }

  private isTruthy(val: any): boolean {
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'boolean') return val;
    return !!val;
  }

  private evaluateExpression(expr: string, scope: InterpreterScope): any {
    let s = expr.trim();
    if (!s) return 0;

    // String literal: "hello"
    if (s.startsWith('"') && s.endsWith('"')) {
      return s.slice(1, -1);
    }
    // Char literal: 'A' or '+'
    if (s.startsWith("'") && s.endsWith("'")) {
      return s.slice(1, -1);
    }

    // Dereference pointer: *x
    if (s.startsWith('*') && /^\*[a-zA-Z_]\w*$/.test(s)) {
      const pName = s.slice(1);
      const ptr = scope.pointers.get(pName);
      if (ptr && ptr.targetName) {
        return scope.variables.get(ptr.targetName) ?? 0;
      }
      return 0;
    }

    // Address of variable: &a
    if (s.startsWith('&') && /^&[a-zA-Z_]\w*$/.test(s)) {
      return s;
    }

    // Matrix element: sum[i][j]
    s = s.replace(/([a-zA-Z_]\w*)\s*\[([^\]]+)\]\s*\[([^\]]+)\]/g, (_, name, rExpr, cExpr) => {
      const r = this.evaluateExpression(rExpr, scope);
      const c = this.evaluateExpression(cExpr, scope);
      const mat = scope.variables.get(name);
      if (Array.isArray(mat) && mat[r]) {
        return String(mat[r][c] ?? 0);
      }
      return '0';
    });

    // Array element: arr[i]
    s = s.replace(/([a-zA-Z_]\w*)\s*\[([^\]]+)\]/g, (_, name, idxExpr) => {
      const idx = this.evaluateExpression(idxExpr, scope);
      const arr = scope.variables.get(name);
      if (Array.isArray(arr)) {
        return String(arr[idx] ?? 0);
      }
      return '0';
    });

    // Replace Math functions: sqrt, pow, abs, floor, ceil
    s = s.replace(/\bsqrt\s*\(([^)]+)\)/g, (_, a) => `Math.sqrt(${this.evaluateExpression(a, scope)})`);
    s = s.replace(/\bpow\s*\(([^,]+),\s*([^)]+)\)/g, (_, a, b) => `Math.pow(${this.evaluateExpression(a, scope)}, ${this.evaluateExpression(b, scope)})`);
    s = s.replace(/\babs\s*\(([^)]+)\)/g, (_, a) => `Math.abs(${this.evaluateExpression(a, scope)})`);

    // Replace variable names with their runtime values
    s = s.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
      if (['true', 'false', 'null', 'Math', 'sqrt', 'pow', 'abs'].includes(match)) {
        return match;
      }
      if (scope.variables.has(match)) {
        const val = scope.variables.get(match);
        if (typeof val === 'number' || typeof val === 'boolean') {
          return String(val);
        }
        if (typeof val === 'string' && val.length === 1) {
          // char code for comparison
          return JSON.stringify(val);
        }
        return JSON.stringify(val);
      }
      return match;
    });

    try {
      // Safe mathematical/boolean evaluator
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${s});`)();
      if (typeof result === 'boolean') {
        return result ? 1 : 0;
      }
      return result;
    } catch {
      return 0;
    }
  }
}
