// Complete BCA Syllabus Notes Data: C Programming Hub & Digital Electronics Lab
export interface SyllabusUnit {
  id: string;
  module: 'c-programming' | 'digital-electronics';
  unitNumber: number;
  unitTitle: string;
  syllabusCode: string;
  summary: string;
  topics: SyllabusTopic[];
}

export interface SyllabusTopic {
  id: string;
  title: string;
  shortOverview: string;
  hinglishContent: string;
  bulletPoints: string[];
  codeSnippet?: string;
  diagramAscii?: string;
  examPointers: string[];
  vivaQnA: { question: string; answer: string }[];
  tags: string[];
}

export const BCA_SYLLABUS_MODULES: SyllabusUnit[] = [
  // ==========================================
  // MODULE 1: C PROGRAMMING HUB (CAP-101 & SEC-106)
  // ==========================================
  {
    id: 'c-unit-1',
    module: 'c-programming',
    unitNumber: 1,
    unitTitle: 'UNIT-I: Basics of C Programming',
    syllabusCode: 'CAP-101 / SEC-106',
    summary: 'History, Structure of C, Character Set, Tokens, Data Types, Symbolic Constants, I/O Functions & Type Casting.',
    topics: [
      {
        id: 'c-hist-struct',
        title: 'C History, Importance & Structure of C Program',
        shortOverview: 'Dennis Ritchie dwara 1972 me AT&T Bell Labs me C language develop ki gayi thi.',
        hinglishContent: 'C language Dennis Ritchie ne 1972 me AT&T Bell Laboratories (USA) me banayi thi UNIX operating system develop karne ke liye. C ko "Mother of all programming languages" kaha jata hai kyunki C++, Java, C# sabhi C ke syntax se inspire hain. Ye ek middle-level, structured programming language hai jisme low-level memory access (pointers) aur high-level abstraction dono milte hain.',
        bulletPoints: [
          'History: Developed in 1972 by Dennis Ritchie at Bell Labs from B language (Ken Thompson).',
          'Middle-Level: Hardware interaction (bits, registers, memory) aur user abstraction dono support karta hai.',
          'Portability: Ek platform par likha C code thode changes ke saath doosre system par compile ho jata hai.',
          'Standard Program Structure: Documentation Section -> Preprocessor/Link Section -> Definition Section -> Global Declarations -> main() function -> Subprograms/UDTs.'
        ],
        codeSnippet: `/* Documentation Section: Author & Purpose */
#include <stdio.h>    // Link Section: Header file include
#define PI 3.14159    // Definition Section: Symbolic constant

int globalVar = 10;   // Global Declaration

int main() {          // Main function execution starts here
    // Local Declarations & Executable Statements
    printf("Value of PI = %.2f\\n", PI);
    return 0;         // Return statement to OS
}`,
        examPointers: [
          'Exam me C program ka basic structure 5 marks me pucha jata hai (Draw clear diagram).',
          'Dennis Ritchie & AT&T Bell Labs 1972 1-mark objective questions me aksar aata hai.',
          'C middle-level language kyu hai? Answer: Ye high-level english-like syntax aur low-level pointer arithmetic dono provide karti hai.'
        ],
        vivaQnA: [
          {
            question: 'Why is C called a structured/modular programming language?',
            answer: 'C program ko chhote functional modules (functions) me divide kiya ja sakta hai jisse code readability, debugging aur reusability aasan ho jaati hai.'
          },
          {
            question: 'What is the role of return 0 in main()?',
            answer: 'return 0 Operating System ko signal deta hai ki program smoothly bina kisi run-time error ke execute ho gaya.'
          }
        ],
        tags: ['c-basics', 'history', 'structure', 'dennis-ritchie', 'unit-1']
      },
      {
        id: 'c-tokens',
        title: 'Character Set & Tokens (Keywords, Identifiers, Literals, Escape Sequences)',
        shortOverview: 'C program ki sabse chhoti individual unit ko Token kehte hain (Keywords, Identifiers, Constants, Strings, Operators, Special Symbols).',
        hinglishContent: 'Compiler C code ko character set se tokenize karta hai. C character set me alphabets (A-Z, a-z), digits (0-9) aur special characters shamil hain. Tokens program ke building blocks hote hain. C me kul 32 standard keywords hote hain (C89/90) jo reserved hote hain aur unhe variable name nahi banaya ja sakta.',
        bulletPoints: [
          'Keywords (32): int, float, char, double, if, else, for, while, do, switch, case, break, continue, return, struct, union, pointer storage classes (auto, static, extern, register), etc.',
          'Identifiers: User-defined names (variable, function, array). Rules: Sirf letters, digits aur underscore (_) allow hain. Pehla character digit nahi ho sakta. Case sensitive hote hain (Count vs count alag hain).',
          'Literals / Constants: Fixed values jo execution ke dauran badalti nahi (Integer: 42, Float: 3.14, Char: \'A\', String: "Hello").',
          'Escape Sequences: Special non-printing characters jaise \\n (Newline), \\t (Tab - 8 spaces), \\r (Carriage Return), \\b (Backspace), \\\\ (Backslash), \\0 (Null character for strings).'
        ],
        codeSnippet: `// Examples of C Tokens
int total_marks = 95;   // int = keyword, total_marks = identifier, 95 = literal
const float TAX = 0.18; // TAX = symbolic constant

printf("Roll\\tName\\tGrade\\n"); // \\t and \\n are escape sequences`,
        examPointers: [
          'Variable naming rules exam me 2-mark me fix aate hain (e.g. 1var invalid hai, _var1 valid hai).',
          'Keywords list me se identifying question pucha jata hai (e.g. is "main" a keyword? No, main is an identifier/predefined function!).',
          'Escape sequences chart: \\0, \\n, \\t, \\a (alert bell).'
        ],
        vivaQnA: [
          {
            question: 'Is "main" a keyword in C?',
            answer: 'Nahi! main ek user-defined identifier hai jo compiler ke liye program ka predefined starting point hai. Ye 32 keywords ki list me nahi aata.'
          },
          {
            question: 'What is the difference between \'A\' and "A"?',
            answer: '\'A\' ek single character literal hai jo 1 byte leta hai (ASCII 65), jabki "A" ek string literal hai jisme 2 bytes lagte hain (\'A\' aur ending null terminator \'\\0\').'
          }
        ],
        tags: ['tokens', 'keywords', 'identifiers', 'escape-sequences', 'unit-1']
      },
      {
        id: 'c-datatypes',
        title: 'Data Types (Primitive, Derived & User-Defined)',
        shortOverview: 'Data types variable ke memory size aur type of value ko define karte hain.',
        hinglishContent: 'C language me data types 3 broad categories me divided hote hain: 1) Primitive/Fundamental (int, char, float, double, void), 2) Derived (Arrays, Pointers, Functions), 3) User-Defined (Structure, Union, Enum, Typedef). Primitive data types ke aage qualifiers lagaye ja sakte hain jaise signed, unsigned, short, long.',
        bulletPoints: [
          'char: 1 byte (-128 to 127 signed, 0 to 255 unsigned). Format specifier: %c',
          'int: 2 ya 4 bytes (System dependent, 16-bit me 2 bytes: -32768 to 32767, 32/64-bit me 4 bytes). Format specifier: %d ya %i',
          'float: 4 bytes (Single precision floating point, 6 decimal digits accuracy). Format: %f',
          'double: 8 bytes (Double precision, 14-15 decimal digits accuracy). Format: %lf',
          'void: Empty data type (no value), function return ya generic pointer (void*) me use hota hai.'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    printf("Size of char: %zu byte\\n", sizeof(char));
    printf("Size of int: %zu bytes\\n", sizeof(int));
    printf("Size of float: %zu bytes\\n", sizeof(float));
    printf("Size of double: %zu bytes\\n", sizeof(double));
    return 0;
}`,
        examPointers: [
          'sizeof() operator ka use karke size print karne ka program exam me ata hai.',
          'Format specifier table: %d (int), %f (float), %c (char), %s (string), %u (unsigned), %p (pointer address), %x (hexadecimal).',
          'Signed vs Unsigned int difference: Unsigned sirf non-negative values store karta hai isliye range 0 to 65535 (2 bytes) tak double positive ho jaati hai.'
        ],
        vivaQnA: [
          {
            question: 'What is the size of int in 16-bit vs 64-bit compilers?',
            answer: 'Turbo C (16-bit architecture) me int 2 bytes ka hota hai (-32768 to +32767). Modern GCC/Clang (32/64-bit) me int 4 bytes ka hota hai (-2^31 to +2^31 - 1).'
          },
          {
            question: 'What is void pointer (void*)?',
            answer: 'Void pointer ek generic pointer hota hai jo kisi bhi data type ka address store kar sakta hai bina type mismatch ke.'
          }
        ],
        tags: ['datatypes', 'primitive', 'sizeof', 'specifiers', 'unit-1']
      },
      {
        id: 'c-io-functions',
        title: 'Input & Output Functions: Formatted vs Unformatted',
        shortOverview: 'Formatted (scanf, printf) aur Unformatted (gets, puts, getchar, putchar, getch, getche) functions ka complete guide.',
        hinglishContent: 'C me I/O operations <stdio.h> aur <conio.h> header files me defined hote hain. Formatted I/O functions format specifiers (%d, %f, etc.) ka use karke data ko specific format me read aur print karte hain. Unformatted functions seedhe raw characters ya string lines read karte hain bina kisi format conversion ke.',
        bulletPoints: [
          'Formatted Functions: printf() [stdout par print karta hai], scanf() [stdin se address (&) par value store karta hai].',
          'Character Unformatted: getchar() [single character read karta hai buffer ke saath], putchar() [single character print karta hai].',
          'Console Specific: getch() [press karte hi character read, screen par echo nahi hota], getche() [read + screen par echo hota hai].',
          'String Unformatted: gets() [space ke saath poori line read karta hai, insecure], puts() [string print karke automatically newline add karta hai].'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    char ch;
    char name[50];
    
    printf("Single char enter karein: ");
    ch = getchar(); // Reads single char
    printf("Aapne enter kiya: ");
    putchar(ch);
    printf("\\n");
    
    // Clearing input buffer
    while (getchar() != '\\n');
    
    printf("Apna poora naam enter karein (fgets safe approach): ");
    fgets(name, sizeof(name), stdin); // Safe replacement of gets()
    printf("Namaste, ");
    puts(name);
    return 0;
}`,
        examPointers: [
          'scanf me & (Address-of operator) kyu lagate hain? Answer: scanf ko variable ka memory location chahiye hota hai jahan user ka input save kiya ja sake.',
          'gets() vs scanf("%s") difference: scanf space aate hi string read karna rok deta hai, jabki gets() poori line space ke saath read karta hai jab tak Enter na dabaya jaye.',
          'getch() vs getche() difference: getch() screen par input dikhata nahi, getche() (e = echo) character screen par dikhata hai.'
        ],
        vivaQnA: [
          {
            question: 'Why is gets() deprecated/dangerous in modern C?',
            answer: 'gets() me buffer size limit check nahi hoti, agar user buffer se lamba input de toh memory me Buffer Overflow ho jata hai jo security hazard hai. Isliye fgets() use karna chahiye.'
          },
          {
            question: 'What is the return value of printf() and scanf()?',
            answer: 'printf() screen par printed characters ki sankhya (count) return karta hai. scanf() successfully read hue input items ki count return karta hai.'
          }
        ],
        tags: ['io-functions', 'printf', 'scanf', 'getchar', 'getch', 'fgets', 'unit-1']
      },
      {
        id: 'c-typecasting',
        title: 'Type Casting & Type Conversion (Implicit vs Explicit)',
        shortOverview: 'Ek data type ko doosre data type me badalna Type Conversion kehlata hai.',
        hinglishContent: 'Type conversion do tarah ka hota hai: 1) Implicit Type Conversion (Type Promotion): Compiler automatically chhoti data type ko badi data type me convert karta hai bina data loss ke (e.g. int + float = float). 2) Explicit Type Conversion (Type Casting): Programmer manually operator (type) ka use karke value ko force convert karta hai (e.g. (float)a / b integer division ko floating point division banane ke liye).',
        bulletPoints: [
          'Implicit Order of Promotion: bool -> char -> short int -> int -> unsigned int -> long -> unsigned long -> float -> double -> long double.',
          'Explicit Syntax: (target_datatype) expression;',
          'Need: Jab accurate mathematical result chahiye ho (jaise 5 / 2 = 2 hota hai integer me, par (float)5 / 2 = 2.50 hota hai).'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    int totalMarks = 485;
    int subjectCount = 5;
    
    // Without casting: Integer division drops decimal!
    float avg1 = totalMarks / subjectCount; // 97.00
    
    // With explicit casting:
    float avg2 = (float)totalMarks / subjectCount; // 97.00 (or accurate decimal)
    
    int a = 7, b = 2;
    printf("Without cast: 7 / 2 = %d\\n", a / b);       // 3
    printf("With cast: (float)7 / 2 = %.2f\\n", (float)a / b); // 3.50
    return 0;
}`,
        examPointers: [
          'Difference between implicit and explicit type conversion 3-mark me fix exam question hai.',
          'Expression evaluation questions: (float)9 / 2 vs (float)(9 / 2). Pehla 4.5 dega, doosra (float)(4) = 4.0 dega!'
        ],
        vivaQnA: [
          {
            question: 'What is truncation in C?',
            answer: 'Jab floating-point number ko integer me convert kiya jata hai, toh decimal part bina rounding ke discard ho jata hai (e.g. 5.99 ban jata hai 5). Ise truncation kehte hain.'
          }
        ],
        tags: ['typecasting', 'implicit', 'explicit', 'type-promotion', 'unit-1']
      }
    ]
  },

  // ==========================================
  // MODULE 1: C PROGRAMMING HUB - UNIT 2
  // ==========================================
  {
    id: 'c-unit-2',
    module: 'c-programming',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Operators, Expressions & Control Flow',
    syllabusCode: 'CAP-101 / SEC-106',
    summary: 'Operators (Arithmetic, Relational, Logical, Bitwise, Conditional), Precedence & Associativity, Decision (if-else, switch), Iteration (for, while, do-while), Jump statements.',
    topics: [
      {
        id: 'c-operators-all',
        title: 'Operators in C: Comprehensive Classification & Hierarchy',
        shortOverview: 'C me 8 types ke operators hote hain jo alag-alag operations perform karte hain.',
        hinglishContent: 'Operator ek symbol hota hai jo compiler ko mathematical ya logical operations perform karne ka nirdesh deta hai. C me operators ko 3 groups on operands me baanta jata hai: Unary (1 operand, e.g. ++, --, sizeof), Binary (2 operands, e.g. +, -, &&), Ternary (3 operands, e.g. ?:). Functional categories me: Arithmetic, Relational, Logical, Bitwise, Assignment, Conditional aur Special operators aate hain.',
        bulletPoints: [
          'Arithmetic (+, -, *, /, %): % sirf integer operands par kaam karta hai (float % float syntax error deta hai!).',
          'Relational (==, !=, >, <, >=, <=): Comparison karte hain aur Boolean 1 (True) ya 0 (False) return karte hain.',
          'Logical (&&, ||, !): Logical AND, OR, NOT. Short-circuit evaluation: && me pehla false milte hi doosra evaluate nahi hota; || me pehla true milte hi doosra evaluate nahi hota.',
          'Bitwise (&, |, ^, ~, <<, >>): Bit level operations. Left Shift (a << 1) number ko 2 se multiply karta hai. Right Shift (a >> 1) number ko 2 se divide karta hai.',
          'Conditional / Ternary (condition ? true_val : false_val): if-else ka compact one-line alternative.',
          'Special: sizeof() [byte size], & [address-of], * [dereference/pointer], , (comma operator) [left-to-right evaluation, rightmost value return].'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    int a = 5, b = 2;
    // Ternary operator example
    int max = (a > b) ? a : b;
    printf("Maximum: %d\\n", max);

    // Bitwise shift trick:
    int x = 8;
    printf("8 left shift 1 (8 * 2) = %d\\n", x << 1);  // 16
    printf("8 right shift 1 (8 / 2) = %d\\n", x >> 1); // 4
    
    // Pre-increment vs Post-increment
    int p = 5;
    printf("Post: %d, then becomes %d\\n", p++, p); // prints 5, then 6
    return 0;
}`,
        examPointers: [
          'Precedence table hierarchy: () [] -> . (Level 1) >> ++ -- ! ~ (Unary Level 2, Right-to-Left) >> * / % >> + - >> << >> >> Relational >> Equality >> Bitwise >> Logical >> Ternary >> Assignment.',
          'Pre-increment (++x) vs Post-increment (x++) differences code output questions me aksar aate hain.',
          'Bitwise XOR (^) ka use do numbers ko bina third variable ke swap karne ke liye kiya jata hai: a^=b; b^=a; a^=b;'
        ],
        vivaQnA: [
          {
            question: 'What is short-circuit evaluation in logical operators?',
            answer: 'Logical AND (&&) me agar left operand 0 (false) hai, toh right operand check hi nahi hota kyunki overall result false hi aayega. Isi tarah Logical OR (||) me agar left operand 1 hai toh right check nahi hota.'
          },
          {
            question: 'Can modulo operator (%) work on float values?',
            answer: 'Nahi! Modulo operator (%) C me sirf integer data types (char, int, short, long) par valid hai. Floating point numbers ke liye <math.h> ka fmod() function use hota hai.'
          }
        ],
        tags: ['operators', 'precedence', 'bitwise', 'ternary', 'unit-2']
      },
      {
        id: 'c-decision-control',
        title: 'Decision Control: if, if-else, nested if, ladder & switch-case',
        shortOverview: 'Conditions ke aadhar par execution branch karne ke liye decision control statements use hote hain.',
        hinglishContent: 'Decision control statements program ko conditions check karke alag-alag code blocks run karne ki shamta dete hain. Simple if ek single condition test karta hai. if-else true aur false dono cases handle karta hai. else-if ladder multiple conditions ko sequential order me check karta hai. switch-case ek integer ya character expression ko multiple constant case labels ke saath compare karta hai.',
        bulletPoints: [
          'if statement: Agar condition true (non-zero) hai toh statement block execute hoga.',
          'if-else: True hone par if block, false (0) hone par else block.',
          'else-if ladder: Jab mutually exclusive multiple conditions check karni ho.',
          'switch-case: Multi-way branching ke liye best. Syntax: switch(expression) { case c1: ... break; default: ... }',
          'switch-case rules: Expression sirf int ya char hona chahiye (float/string not allowed!). Har case constant/literal hona chahiye (variable not allowed). break statement fall-through rokne ke liye zaroori hota hai.'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    char op;
    double a, b;
    printf("Operator enter karein (+, -, *, /): ");
    scanf(" %c", &op);
    printf("Do numbers enter karein: ");
    scanf("%lf %lf", &a, &b);

    switch(op) {
        case '+': printf("Result: %.2lf\\n", a + b); break;
        case '-': printf("Result: %.2lf\\n", a - b); break;
        case '*': printf("Result: %.2lf\\n", a * b); break;
        case '/': 
            if (b != 0) printf("Result: %.2lf\\n", a / b);
            else printf("Zero se divide nahi ho sakta!\\n");
            break;
        default: printf("Invalid operator selected!\\n");
    }
    return 0;
}`,
        examPointers: [
          'Switch statement me break miss hone par kya hota hai? Answer: Fall-through hota hai, agle cases bina condition match kiye execute hote chale jaate hain.',
          'Float switch case me allow kyu nahi hota? Answer: Float me internal precision rounding errors ki wajah se exact equality match unreliable hota hai.',
          'Nested if-else me "Dangling Else Problem" ko solve karne ke liye proper curly braces {} ka use kiya jata hai.'
        ],
        vivaQnA: [
          {
            question: 'What is fall-through in switch-case?',
            answer: 'Agar kisi matched case ke end me break statement na lagaya jaye, toh execution agle saare cases me execute hota jata hai jab tak break na mile ya switch khatam na ho. Ise fall-through kehte hain.'
          }
        ],
        tags: ['decision-control', 'if-else', 'switch-case', 'fall-through', 'unit-2']
      },
      {
        id: 'c-loops-control',
        title: 'Iterative Statements (for, while, do-while) & Jump Statements',
        shortOverview: 'Code block ko baar-baar repeat karne ke liye Loops aur unke flow ko control karne ke liye break, continue aur goto use hote hain.',
        hinglishContent: 'C me loops do categories me hote hain: 1) Entry-Controlled Loops (for, while): Jahan condition loop body me enter karne se pehle check hoti hai. Agar pehli baar me condition false hui toh loop ek baar bhi nahi chalega. 2) Exit-Controlled Loop (do-while): Jahan condition loop body execute hone ke baad check hoti hai. Isliye do-while loop kam se kam ek baar hamesha chalta hai chahe condition shuru me hi false kyu na ho.',
        bulletPoints: [
          'for loop: Syntax: for(init; condition; update) - jab iterations ki sankhya pehle se pata ho.',
          'while loop: Syntax: while(condition) - jab iterations kisi event/condition par depend karti ho.',
          'do-while loop: Syntax: do { ... } while(condition); - Menu-driven programs ke liye ideal.',
          'break: Current enclosing loop ya switch se turant bahar nikal deta hai.',
          'continue: Current iteration ke bache hue code ko skip karke sidha agli iteration ke update/condition par le jata hai.',
          'goto: Unconditional jump statement jo execution ko defined label: par bhej deta hai (Spaghetti code banane ki wajah se ise avoid kiya jata hai).'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    // Break vs Continue Demonstration
    printf("Continue example (skipping 3): ");
    for(int i = 1; i <= 5; i++) {
        if (i == 3) continue; // Skip printing 3
        printf("%d ", i);
    }
    printf("\\n");

    printf("Break example (stopping at 4): ");
    for(int i = 1; i <= 10; i++) {
        if (i == 4) break; // Exit loop completely
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`,
        examPointers: [
          'while vs do-while difference table 5-mark question me BCA semester exam ka favourite question hai.',
          'Infinite loop examples: for(;;), while(1).',
          'goto statement ka use kyu discouraged hai? Answer: Ye program ke logical flow ko unstructured bana deta hai jisse debugging aur maintenance bahut mushkil ho jati hai.'
        ],
        vivaQnA: [
          {
            question: 'What is the minimum number of times a do-while loop executes?',
            answer: 'Exactly 1 time! Kyunki test condition loop body ke baad evaluate hoti hai.'
          },
          {
            question: 'What happens if the condition in a for loop is omitted?',
            answer: 'for(;;) me condition omit karne par C compiler use automatically TRUE (non-zero) manta hai aur loop infinite loop ban jata hai.'
          }
        ],
        tags: ['loops', 'for', 'while', 'do-while', 'break', 'continue', 'unit-2']
      }
    ]
  },

  // ==========================================
  // MODULE 1: C PROGRAMMING HUB - UNIT 3
  // ==========================================
  {
    id: 'c-unit-3',
    module: 'c-programming',
    unitNumber: 3,
    unitTitle: 'UNIT-III: Arrays, Strings & Character Arrays',
    syllabusCode: 'CAP-101 / SEC-106',
    summary: '1D Arrays, 2D Arrays, Memory Representation, Row-Major vs Column-Major, Address Calculation, Strings, String Handling Functions, Array of Strings.',
    topics: [
      {
        id: 'c-arrays-1d-2d',
        title: '1D & 2D Arrays: Memory Representation & Address Calculation',
        shortOverview: 'Array ek homogeneous collection hai jisme same data type ke elements continuous memory locations me store hote hain.',
        hinglishContent: 'Array continuous (contiguous) memory blocks me data store karta hai. Array ka index 0 se shuru hota hai aur (size - 1) tak jata hai. 1D array linear sequence hoti hai. 2D array matrix (rows aur columns) ke roop me hoti hai. C language 2D arrays ko memory me Row-Major Order me store karti hai (pehli row ke saare elements, fir doosri row ke elements, etc.).',
        bulletPoints: [
          '1D Array Declaration: datatype arrayName[size]; (e.g. int arr[5]; -> 5 * 4 = 20 bytes).',
          '1D Address Formula: Address of arr[i] = Base_Address + (i * size_of_datatype)',
          '2D Array Declaration: datatype matrix[rows][cols];',
          'Row-Major Address Formula: Address(A[i][j]) = Base_Address + [(i * cols) + j] * size_of_datatype',
          'Column-Major Address Formula: Address(A[i][j]) = Base_Address + [(j * rows) + i] * size_of_datatype'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    int matrix[2][3] = {
        {10, 20, 30},
        {40, 50, 60}
    };

    printf("2D Array Row-Major Memory Addresses:\\n");
    for(int i = 0; i < 2; i++) {
        for(int j = 0; j < 3; j++) {
            printf("matrix[%d][%d] = %d at Address: %p\\n", 
                   i, j, matrix[i][j], (void*)&matrix[i][j]);
        }
    }
    return 0;
}`,
        examPointers: [
          'Address calculation numericals exam me 100% aate hain! (e.g. Base Address 1000, 4 bytes int, calculate address of A[3][4] in 5x5 matrix).',
          'Array index out of bound check: C language me array bound checking nahi hoti! Agar arr[10] access karoge 5 size ke array me toh compiler error nahi dega par garbage value ya Segmentation Fault aayega.'
        ],
        vivaQnA: [
          {
            question: 'Does C do automatic array boundary checking?',
            answer: 'Nahi! C compiler array bound checking perform nahi karta. Out-of-bounds access undefined behavior aur memory corruption cause karta hai.'
          },
          {
            question: 'What is Row-Major Order?',
            answer: 'Memory me multidimensional array ko row by row store karne ki vidhi ko Row-Major order kehte hain. C language isi standard ko follow karti hai.'
          }
        ],
        tags: ['arrays', '1d-array', '2d-array', 'address-calculation', 'row-major', 'unit-3']
      },
      {
        id: 'c-strings-functions',
        title: 'Strings, String I/O & Built-in Functions (<string.h>)',
        shortOverview: 'String ek null-terminated character array hota hai (\'\\0\'). Built-in functions: strlen, strcpy, strcat, strcmp, strstr.',
        hinglishContent: 'C language me koi dedicated "string" data type nahi hota; string ko 1D character array ke through represent kiya jata hai jo Null Character (\'\\0\', ASCII 0) par end hoti hai. Null character compiler ko batata hai ki string kahan khatam ho rahi hai. <string.h> library me strings par operations karne ke liye powerful functions provide kiye gaye hain.',
        bulletPoints: [
          'Declaration: char str[] = "Hello"; (Size = 6 bytes, 5 letters + 1 null character).',
          'strlen(str): String ki actual length return karta hai (null character ko chhod kar).',
          'strcpy(dest, src): src string ko dest buffer me copy karta hai.',
          'strcat(dest, src): src string ko dest string ke aage jodta (concatenate) hai.',
          'strcmp(str1, str2): Lexicographical compare karta hai. 0 (both equal), positive (str1 > str2), negative (str1 < str2).',
          'strstr(str, sub): Substring search karta hai aur pehle occurrence ka pointer return karta hai.'
        ],
        codeSnippet: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[50] = "BCA";
    char s2[] = " Verse";
    
    // Concatenation
    strcat(s1, s2);
    printf("Concatenated: %s\\n", s1); // "BCA Verse"
    printf("Length: %lu\\n", strlen(s1)); // 9
    
    // Comparison
    if (strcmp("Apple", "Banana") < 0) {
        printf("Apple alphabetically Banana se pehle aata hai.\\n");
    }
    return 0;
}`,
        examPointers: [
          'strlen() vs sizeof() difference: sizeof() character array ka allocated size batata hai (including \\0), jabki strlen() sirf visible characters count karta hai.',
          'Bina string.h ke string length ya reverse karne ka manual loop program exam me zaroor pucha jata hai.'
        ],
        vivaQnA: [
          {
            question: 'Why is the null character (\\0) required at the end of a string in C?',
            answer: 'Character array me koi fixed size metadata nahi hota, isliye printf aur string functions ko string ka ending point pehchanne ke liye \\0 ki zaroorat hoti hai.'
          }
        ],
        tags: ['strings', 'string-h', 'strlen', 'strcpy', 'strcat', 'strcmp', 'unit-3']
      }
    ]
  },

  // ==========================================
  // MODULE 1: C PROGRAMMING HUB - UNIT 4
  // ==========================================
  {
    id: 'c-unit-4',
    module: 'c-programming',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Functions, Pointers, Storage Classes & UDTs',
    syllabusCode: 'CAP-101 / SEC-106',
    summary: 'User-Defined Functions, Call by Value vs Reference, Recursion, Storage Classes (auto, static, extern, register), Pointers, Structures, Unions & Enums.',
    topics: [
      {
        id: 'c-functions-recursion',
        title: 'User-Defined Functions, Parameter Passing & Recursion',
        shortOverview: 'Functions modular programming enable karte hain. Call by Value vs Call by Reference aur Recursive functions.',
        hinglishContent: 'Function ek self-contained block of statements hota hai jo specific task perform karta hai. Function ke 3 main parts hote hain: 1) Prototype/Declaration (compiler ko return type aur parameters batana), 2) Definition (actual code body), 3) Call (function ko execute karna). Actual arguments calling function me hote hain, jabki Formal arguments called function ke header me hote hain.',
        bulletPoints: [
          'Call by Value: Actual argument ki copy pass hoti hai. Function ke andar kiye gaye changes main() ke original variable ko affect nahi karte.',
          'Call by Reference: Variable ka memory address pass hota hai (pointers ke through). Function ke andar badlaav original variable me reflect hote hain.',
          'Recursion: Jab function khud ko hi baar-baar call karta hai jab tak Base Condition meet na ho jaye (e.g. Factorial, Fibonacci). Har recursive call stack memory consume karti hai.'
        ],
        codeSnippet: `#include <stdio.h>

// Call by Value: No change outside
void swapValue(int x, int y) {
    int temp = x; x = y; y = temp;
}

// Call by Reference: Changes original variables
void swapReference(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

// Recursive Factorial
int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive case
}

int main() {
    int a = 10, b = 20;
    swapReference(&a, &b);
    printf("After swapRef: a = %d, b = %d\\n", a, b); // a=20, b=10
    printf("Factorial of 5 = %d\\n", factorial(5));     // 120
    return 0;
}`,
        examPointers: [
          'Call by value vs Call by reference ka comparison table 5-mark me har saal pucha jata hai.',
          'Recursion me Base Condition kyu zaroori hai? Answer: Base condition na hone par infinite recursion hoga aur Stack Overflow error aayega.'
        ],
        vivaQnA: [
          {
            question: 'What is Stack Overflow in recursion?',
            answer: 'Jab recursive function bina base condition ke chalta rehta hai, toh call stack frame memory poori tarah bhar jaati hai aur program crash ho jata hai.'
          }
        ],
        tags: ['functions', 'call-by-value', 'call-by-reference', 'recursion', 'unit-4']
      },
      {
        id: 'c-storage-classes',
        title: 'Storage Classes: auto, register, static & extern',
        shortOverview: 'Storage class variable ka scope, lifetime, default value aur storage location (RAM vs CPU Register) nirdharit karti hai.',
        hinglishContent: 'C me har variable ki do attributes hoti hain: data type aur storage class. Storage class 4 cheezein define karti hai: 1) Storage (RAM ya CPU Register), 2) Default Initial Value (Garbage ya Zero), 3) Scope (Local block ya Global), 4) Lifetime/Longevity (Kab tak memory me zinda rehta hai).',
        bulletPoints: [
          'auto: Default for local variables. Storage: RAM. Default: Garbage value. Scope: Local to block. Lifetime: Block exit par destroy.',
          'register: Storage: CPU Register (faster access). Default: Garbage. Scope: Local. Limitations: Address-of (&) operator register variable par use nahi kiya ja sakta!',
          'static: Storage: RAM. Default: 0 (Zero). Scope: Local to block/file. Lifetime: Poore program ke end tak value retain karta hai function calls ke beech me.',
          'extern: Global variable declaration jo multiple files me shared hota hai. Storage: RAM. Default: 0. Scope: Global across files.'
        ],
        codeSnippet: `#include <stdio.h>

void counterFunction() {
    auto int a = 0;        // Re-initialized every call
    static int s = 0;      // Retains value across function calls
    a++;
    s++;
    printf("auto: %d | static: %d\\n", a, s);
}

int main() {
    counterFunction(); // auto: 1 | static: 1
    counterFunction(); // auto: 1 | static: 2
    counterFunction(); // auto: 1 | static: 3
    return 0;
}`,
        examPointers: [
          'Comparison matrix table of 4 storage classes 5-mark theory question me aana tai hai.',
          'register variable ka address (&var) kyu nahi nikal sakte? Answer: Register variable CPU registers me rehta hai jiska system memory address bus par RAM address nahi hota.'
        ],
        vivaQnA: [
          {
            question: 'What is the default initial value of a static variable?',
            answer: 'Static variable ki default initial value hamesha Zero (0) hoti hai, jabki auto variable me indeterminate garbage value hoti hai.'
          }
        ],
        tags: ['storage-classes', 'auto', 'register', 'static', 'extern', 'unit-4']
      },
      {
        id: 'c-pointers-basics',
        title: 'Pointers: Declaration, Address-Of (&), Dereferencing (*) & Pointer Arithmetic',
        shortOverview: 'Pointer ek special variable hota hai jo kisi doosre variable ka memory address store karta hai.',
        hinglishContent: 'Pointers C language ka sabse powerful feature hain. & (address-of operator) variable ka address nikalta hai, jabki * (dereference operator / value-at-address) us address par rakhi value ko access ya modify karta hai. Pointer arithmetic me jab hum ptr + 1 karte hain, toh wo 1 byte aage nahi badhta, balki us data type ke size ke barabar bytes aage badhta hai (e.g. int pointer 4 bytes aage jayega).',
        bulletPoints: [
          'Declaration: int *ptr; (ptr ek pointer hai jo int type ke address ko point karta hai).',
          'Assignment: ptr = &var;',
          'Dereferencing: *ptr = 50; (var ki value badal kar 50 ho jayegi).',
          'Pointer Arithmetic: Address of (ptr + n) = Current_Address + (n * sizeof(data_type)).',
          'Array-Pointer Relationship: Array ka naam khud pehle element ka base pointer hota hai (arr == &arr[0]).'
        ],
        codeSnippet: `#include <stdio.h>

int main() {
    int num = 100;
    int *ptr = &num; // ptr holds address of num
    
    printf("Value of num: %d\\n", num);
    printf("Address of num (&num): %p\\n", (void*)&num);
    printf("Value via pointer (*ptr): %d\\n", *ptr);
    
    *ptr = 250; // Modifying num via pointer
    printf("Updated num: %d\\n", num);
    return 0;
}`,
        examPointers: [
          'Pointer to Pointer (Double pointer int **ptr) concept: pointer ka address store karne wala pointer.',
          'Dangling Pointer, NULL pointer aur Wild pointer ke beech ka difference viva me pucha jata hai.'
        ],
        vivaQnA: [
          {
            question: 'What is a NULL pointer?',
            answer: 'Aisa pointer jo memory me kisi valid location ko point nahi kar raha hota (ptr = NULL ya 0). Iska use safe initialisation ke liye hota hai taaki accidental memory overwrite na ho.'
          },
          {
            question: 'What is a dangling pointer?',
            answer: 'Aisa pointer jo kisi aisi memory location ko point kar raha hota hai jo deallocate ya free ho chuki hai.'
          }
        ],
        tags: ['pointers', 'address-of', 'dereference', 'pointer-arithmetic', 'unit-4']
      },
      {
        id: 'c-structures-unions',
        title: 'Structures, Unions & Enumerations (enum)',
        shortOverview: 'User-Defined Data Types jo alag-alag types ke variables ko single entity me group karte hain.',
        hinglishContent: 'Structure (struct) alag-alag data types ke collection ko ek single user-defined type banata hai. Structure ke har member ko apni alag dedicated memory milti hai, isliye structure ka total size uske sabhi members ke sizes ke sum ke barabar (ya alignment padding ke saath) hota hai. Union me sabhi members ek hi common shared memory space share karte hain, isliye Union ka size uske sabse bade member ke size ke barabar hota hai.',
        bulletPoints: [
          'Structure: Keyword struct. Members accessed via dot (.) operator ya arrow (->) operator pointer ke saath.',
          'Union: Keyword union. Shared memory. Ek samay par sirf ek hi member valid value hold kar sakta hai.',
          'Size Difference: Agar struct me int (4B), char (1B), double (8B) ho toh struct size ~ 16B (with padding), jabki union size exactly 8B (sabse bada double) hoga.',
          'Enumeration (enum): User-defined integer constants ka set (e.g. enum Day {MON, TUE, WED} -> 0, 1, 2).'
        ],
        codeSnippet: `#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    float marks;
};

union Data {
    int i;
    float f;
    char ch;
};

int main() {
    struct Student s1 = {101, "Aman", 92.5};
    printf("Student: %d, Name: %s, Marks: %.1f\\n", s1.roll, s1.name, s1.marks);
    
    printf("Size of Student Struct: %zu bytes\\n", sizeof(struct Student));
    printf("Size of Data Union: %zu bytes\\n", sizeof(union Data));
    return 0;
}`,
        examPointers: [
          'Difference between Structure and Union 5-mark question me 100% fixed pucha jata hai.',
          'Dot operator (.) vs Arrow operator (->): Arrow operator pointer to structure ke sath use hota hai (ptr->roll is equivalent to (*ptr).roll).'
        ],
        vivaQnA: [
          {
            question: 'Why do we use Union instead of Structure?',
            answer: 'Jab memory ki sakht kami ho (embedded systems) aur hume pata ho ki program me ek time par sirf ek hi variable ki zaroorat padegi, tab memory save karne ke liye Union use kiya jata hai.'
          }
        ],
        tags: ['structures', 'unions', 'enum', 'user-defined-types', 'unit-4']
      }
    ]
  },

  // ==========================================
  // MODULE 2: DIGITAL ELECTRONICS LAB (BCA 2023)
  // ==========================================
  {
    id: 'de-unit-1',
    module: 'digital-electronics',
    unitNumber: 1,
    unitTitle: 'UNIT-I: Number Systems, Binary Codes & Representations',
    syllabusCode: 'BCA-DE-102',
    summary: 'Binary, Octal, Decimal, Hexadecimal conversions, BCD codes, Error Detecting/Correcting codes, ASCII/Unicode, 1s & 2s Complement, Floating-Point.',
    topics: [
      {
        id: 'de-number-systems',
        title: 'Number Systems & Base Conversions (Bin, Oct, Dec, Hex with Fractions)',
        shortOverview: 'Radix/Base concepts: Binary (base 2), Octal (base 8), Decimal (base 10), Hexadecimal (base 16) aur unka inter-conversion.',
        hinglishContent: 'Digital electronics me numbers ko alag-alag bases me represent kiya jata hai. Base (radix) batata hai ki us number system me kitne unique digits use hote hain: Binary me 2 (0, 1), Octal me 8 (0-7), Decimal me 10 (0-9), Hexadecimal me 16 (0-9 aur A-F). Integer part ko target base se lagatar divide kiya jata hai aur remainders ko bottom-to-top note kiya jata hai. Fractional part ko target base se multiply kiya jata hai aur integer carries ko top-to-bottom note kiya jata hai.',
        bulletPoints: [
          'Binary to Hex: 4-4 bits ke groups banaye jaate hain (e.g. 1101 1010_2 = DA_16).',
          'Binary to Octal: 3-3 bits ke groups banaye jaate hain (e.g. 101 110_2 = 56_8).',
          'Decimal Fraction to Binary: Fractional part ko 2 se multiply karte jao, integer part likhte jao.',
          'Hexadecimal digits: A=10, B=11, C=12, D=13, E=14, F=15.'
        ],
        diagramAscii: `Decimal 25.625 to Binary:
Integer: 25 / 2 = 12 (R: 1)
         12 / 2 = 6  (R: 0)
          6 / 2 = 3  (R: 0)
          3 / 2 = 1  (R: 1)
          1 / 2 = 0  (R: 1)  -> Bottom to top: 11001

Fraction: 0.625 * 2 = 1.250 (Int: 1)
          0.250 * 2 = 0.500 (Int: 0)
          0.500 * 2 = 1.000 (Int: 1) -> Top to bottom: .101
Result: (25.625)_10 = (11001.101)_2`,
        examPointers: [
          'Point wale conversion (e.g. 25.625 or 105.15) exam me 5-mark calculation questions me compulsory hote hain.',
          'Hex to Binary 4-bit grouping rule step-by-step likhna chahiye.'
        ],
        vivaQnA: [
          {
            question: 'Why do computers use binary instead of decimal?',
            answer: 'Electronic switches (transistors) sirf do physical states ko reliably represent kar sakte hain: ON (high voltage ~ 5V/1) aur OFF (low voltage ~ 0V/0). Binary me do states handle karna sabse error-free aur simple hota hai.'
          }
        ],
        tags: ['number-systems', 'binary', 'octal', 'hexadecimal', 'conversions', 'unit-1-de']
      },
      {
        id: 'de-codes-error',
        title: 'BCD Codes, Gray Code & Error Detection (Parity & Hamming Code)',
        shortOverview: 'Weighted vs Non-weighted codes, Self-complementing codes, Cyclic Gray code aur Hamming single-bit error correction.',
        hinglishContent: 'Binary Codes ko data representation ke liye design kiya jata hai. BCD (8421 Natural BCD) har decimal digit ko 4-bit binary me encode karta hai (invalid BCD: 1010 to 1111). Excess-3 ek unweighted, self-complementing code hai (BCD + 0011). Gray Code ek cyclic/unit-distance code hai jisme consecutive numbers ke beech sirf ek hi bit change hoti hai. Error detection me Parity Bit aur error correction me Hamming Code use hota hai.',
        bulletPoints: [
          'BCD (8421): Har decimal digit (0-9) ko 4-bit binary diya jata hai. E.g., 25 = 0010 0101.',
          'Excess-3 Code: Decimal digit + 3 karke 4-bit binary me convert karo. Ye 9\'s complement direct deta hai (Self-Complementing).',
          'Gray Code: K-Map labeling aur shaft encoders me use hota hai taaki race condition aur noise na aaye.',
          'Parity Bit: Even parity me total number of 1s ko even banaya jata hai; Odd parity me 1s ko odd banaya jata hai.',
          'Hamming Code: Parity bits (P1, P2, P4...) ko positions 2^n par place karke single-bit error detect aur correct dono karta hai.'
        ],
        diagramAscii: `Binary to Gray Code Conversion:
Binary: b3   b2   b1   b0
        g3 = b3
        g2 = b3 XOR b2
        g1 = b2 XOR b1
        g0 = b1 XOR b0`,
        examPointers: [
          'Why is Gray code called Reflected/Unit-Distance code? Answer: Consecutive codes me sirf ek single bit change hoti hai.',
          'Invalid BCD numbers: 10 to 15 (1010, 1011, 1100, 1101, 1110, 1111). BCD addition me agar sum > 9 ya carry aaye toh 6 (0110) add kiya jata hai.'
        ],
        vivaQnA: [
          {
            question: 'What is a self-complementing code?',
            answer: 'Aisa code jiska 1\'s complement nikalne par uske decimal equivalent ka 9\'s complement automatically mil jaye. E.g. Excess-3 code aur 2421 code.'
          }
        ],
        tags: ['bcd', 'gray-code', 'excess-3', 'hamming-code', 'parity', 'unit-1-de']
      },
      {
        id: 'de-complements-rep',
        title: 'Signed Numbers: Sign-Magnitude, 1\'s & 2\'s Complement & Floating-Point',
        shortOverview: 'Negative numbers representation, 2\'s complement arithmetic, Overflow detection aur IEEE 754 Floating-Point format.',
        hinglishContent: 'Computers me positive aur negative numbers ko represent karne ke 3 tareeqe hote hain: 1) Sign-Magnitude: MSB (Most Significant Bit) sign bit hoti hai (0 = positive, 1 = negative) aur baki bits magnitude. 2) 1\'s Complement: Negative number pane ke liye positive binary ke sabhi 0s ko 1 aur 1s ko 0 me invert karte hain. 3) 2\'s Complement: 1\'s complement me 1 add karke 2\'s complement banta hai. 2\'s complement hardware me subtraction ko addition circuit se perform karne ki suvidha deta hai.',
        bulletPoints: [
          '1\'s Complement: Invert bits (0 -> 1, 1 -> 0). Disadvantage: Do zeros hote hain (+0 = 0000, -0 = 1111).',
          '2\'s Complement: (1\'s Complement + 1). Advantage: Sirf ek zero hota hai (0000), aur subtraction simply addition ban jata hai.',
          '2\'s Complement Subtraction Rule: M - N = M + (2\'s comp of N). Agar final carry aaye toh carry discard karo (result positive). Agar carry na aaye toh answer ka dobara 2\'s complement lo aur negative sign lagao.',
          'IEEE 754 Floating Point (Single 32-bit): 1-bit Sign, 8-bit Exponent (Bias 127), 23-bit Mantissa/Fraction.'
        ],
        diagramAscii: `2's Complement Subtraction Example: 7 - 4 = +3 (4-bit)
M = 7  = 0111
N = 4  = 0100 -> 1's comp = 1011 -> 2's comp = 1100
Sum = 0111 + 1100 = (1) 0011
Carry (1) is generated -> Discard carry!
Final Answer = +0011 = +3`,
        examPointers: [
          '2\'s complement subtraction ke numericals exam me 5-mark me aate hain.',
          'Range of numbers in 8-bit: Unsigned = 0 to 255. 2\'s Complement = -128 to +127.'
        ],
        vivaQnA: [
          {
            question: 'Why is 2\'s complement universally used in modern ALUs?',
            answer: 'Kyunki 2\'s complement me subtraction ke liye alag se subtractor circuit nahi lagta; wahi binary adder circuit 2\'s complement add karke subtraction kar leta hai, aur isme zero ka koi ambiguous double representation nahi hota.'
          }
        ],
        tags: ['complements', '1s-complement', '2s-complement', 'signed-numbers', 'unit-1-de']
      }
    ]
  },

  // ==========================================
  // MODULE 2: DIGITAL ELECTRONICS LAB - UNIT 2
  // ==========================================
  {
    id: 'de-unit-2',
    module: 'digital-electronics',
    unitNumber: 2,
    unitTitle: 'UNIT-II: Binary Arithmetic, Boolean Algebra & K-Maps',
    syllabusCode: 'BCA-DE-102',
    summary: 'Binary Arithmetic, Boolean Postulates & Theorems, De Morgan\'s Laws, SOP & POS Canonical Forms, 2 to 4 Variable K-Maps with Don\'t Care conditions.',
    topics: [
      {
        id: 'de-boolean-theorems',
        title: 'Boolean Algebra: Postulates, Theorems & De Morgan\'s Laws',
        shortOverview: 'Boolean logic ke fundamental niyam jo digital circuits ko minimize karne ke kaam aate hain.',
        hinglishContent: 'Boolean Algebra George Boole dwara banayi gayi ek mathematical system hai jo binary variables (0 aur 1) par kaam karti hai. Boolean functions ko simplify karne se circuit me gates aur transistors ki sankhya kam ho jaati hai, jisse circuit fast, sasta aur kam power consume karne wala banta hai.',
        bulletPoints: [
          'Identity Law: A + 0 = A, A . 1 = A',
          'Null / Annulment Law: A + 1 = 1, A . 0 = 0',
          'Idempotent Law: A + A = A, A . A = A',
          'Complement Law: A + A\' = 1, A . A\' = 0',
          'Involution (Double Negation): (A\')\' = A',
          'Commutative Law: A + B = B + A, A . B = B . A',
          'Distributive Law: A . (B + C) = (A . B) + (A . C), aur A + (B . C) = (A + B) . (A + C)',
          'De Morgan\'s 1st Law: (A + B)\' = A\' . B\' (NOR is equivalent to Bubbled AND)',
          'De Morgan\'s 2nd Law: (A . B)\' = A\' + B\' (NAND is equivalent to Bubbled OR)'
        ],
        diagramAscii: `De Morgan's Laws:
1. NOT(A OR B)   = (NOT A) AND (NOT B)  -> (A + B)' = A' . B'
2. NOT(A AND B)  = (NOT A) OR (NOT B)   -> (A . B)' = A' + B'`,
        examPointers: [
          'Prove De Morgan\'s Laws using Truth Table (5 marks fixed university exam question).',
          'Distributive law ka second variant [A + BC = (A+B)(A+C)] simplification me sabse zyada use hota hai.'
        ],
        vivaQnA: [
          {
            question: 'What is the Principle of Duality in Boolean algebra?',
            answer: 'Kisi bhi valid Boolean expression me AND (.) ko OR (+) se, OR ko AND se, aur 0 ko 1 tatha 1 ko 0 se replace karne par jo nayi expression milti hai wo bhi mathematically valid hoti hai.'
          }
        ],
        tags: ['boolean-algebra', 'de-morgans-laws', 'postulates', 'duality', 'unit-2-de']
      },
      {
        id: 'de-canonical-sop-pos',
        title: 'Canonical Forms: Sum of Products (SOP) & Product of Sums (POS)',
        shortOverview: 'Minterms (m) aur Maxterms (M) ke terms me Boolean functions ko standard representation me likhna.',
        hinglishContent: 'Boolean functions ko do canonical (standard) forms me express kiya jata hai: 1) Sum of Products (SOP): Minterms ka logical OR (sum). Minterm ek aisa product term hai jisme function ke saare variables either complemented ya uncomplemented form me hote hain (output 1 ke liye). 2) Product of Sums (POS): Maxterms ka logical AND (product). Maxterm ek sum term hota hai jisme saare variables aate hain (output 0 ke liye).',
        bulletPoints: [
          'Minterm (m): Binary 1 = uncomplemented variable (A), Binary 0 = complemented variable (A\'). Notation: F = Σm(1, 3, 5, 7).',
          'Maxterm (M): Binary 0 = uncomplemented variable (A), Binary 1 = complemented variable (A\'). Notation: F = ΠM(0, 2, 4, 6).',
          'Conversion: Agar F = Σm(1, 3, 5), toh F = ΠM(0, 2, 4, 6, 7) (bache hue indices).'
        ],
        codeSnippet: `// Canonical SOP vs POS Example for 2 variables (A, B)
// Minterms:
// m0 = A'B' (00)
// m1 = A'B  (01)
// m2 = AB'  (10)
// m3 = AB   (11)

// Function F = A XOR B
// SOP = A'B + AB' = Σm(1, 2)
// POS = (A + B)(A' + B') = ΠM(0, 3)`,
        examPointers: [
          'Convert given expression into standard/canonical SOP form (har term me missing variable introduce karna multiply by (X + X\')).',
          'Minterms aur Maxterms ka relationship formula: m_i\' = M_i.'
        ],
        vivaQnA: [
          {
            question: 'What is a minterm?',
            answer: 'Minterm n-variables ka aisa Boolean product term hota hai jo truth table ki exactly ek specific input combination ke liye value 1 (True) deta hai.'
          }
        ],
        tags: ['canonical-forms', 'sop', 'pos', 'minterms', 'maxterms', 'unit-2-de']
      },
      {
        id: 'de-kmaps-solver',
        title: 'K-Map Simplification (2, 3 & 4 Variables) with Don\'t Care (X)',
        shortOverview: 'Karnaugh Map graphical minimization tool hai jo Gray code arrangement se grouping karke minimal SOP/POS deta hai.',
        hinglishContent: 'Karnaugh Map (K-Map) Maurice Karnaugh dwara develop kiya gaya graphical minimization method hai. 2-variable K-Map me 4 cells (2^2), 3-variable me 8 cells (2^3), aur 4-variable me 16 cells (2^4) hote hain. Cells ko Gray code (00, 01, 11, 10) sequence me rakha jata hai taaki adjacent cells me sirf 1 bit ka difference ho. 1s ke groups powers of 2 (1, 2, 4, 8, 16) me banaye jaate hain. Don\'t Care conditions (d ya X) ko groups bada karne ke liye 1 maana ja sakta hai ya ignore kiya ja sakta hai.',
        bulletPoints: [
          'Grouping Rules: Groups powers of 2 (1, 2, 4, 8, 16) me banaye jaate hain. Bada group = Zyada variable eliminate hote hain (Quad 4 cells ka 2 variables eliminate karta hai, Octet 8 cells ka 3 variables eliminate karta hai).',
          'Wrap-Around: K-Map edges wrap-around hoti hain (left-most column right-most se adjacent hai, top row bottom row se adjacent hai).',
          'Don\'t Care (X): Aise input combinations jo reality me kabhi occur nahi honge ya unka output matter nahi karta (jaise BCD me 1010 to 1111). Inhe 1 maan kar group bada banaya ja sakta hai.'
        ],
        diagramAscii: `4-Variable K-Map Layout (AB \\ CD):
       CD=00  CD=01  CD=11  CD=10
AB=00 |  m0  |  m1  |  m3  |  m2  |
AB=01 |  m4  |  m5  |  m7  |  m6  |
AB=11 | m12  | m13  | m15  | m14  |
AB=10 |  m8  |  m9  | m11  | m10  |
Note the 11 before 10 sequence (Gray code)!`,
        examPointers: [
          '4-variable K-map with Don\'t care condition (e.g. F(A,B,C,D) = Σm(0,1,2,5,8,9,10) + d(7,14,15)) exam me guaranteed 10-mark question hota hai.',
          'Always check 4 corners wrap-around group (m0, m2, m8, m10) - ye 4 corners milkar ek Quad banate hain jiska answer B\'D\' hota hai!'
        ],
        vivaQnA: [
          {
            question: 'Why are K-map rows and columns labeled in Gray code (00, 01, 11, 10)?',
            answer: 'Taaki kisi bhi do adjacent cells ke beech sirf ek hi variable complement/uncomplement ho (Hamming distance 1), jisse A + A\' = 1 apply hokar variable eliminate ho sake.'
          },
          {
            question: 'What is a Don\'t Care condition?',
            answer: 'Aisi input condition jiske liye output system ke liye irrelevant ho. K-Map me hum iska use groups ko bada karne ke liye 1 ki tarah kar sakte hain, par akele Don\'t care ko group karne ki zaroorat nahi hoti.'
          }
        ],
        tags: ['kmap', 'simplification', 'dont-care', 'gray-code', 'quad', 'octet', 'unit-2-de']
      }
    ]
  },

  // ==========================================
  // MODULE 2: DIGITAL ELECTRONICS LAB - UNIT 3
  // ==========================================
  {
    id: 'de-unit-3',
    module: 'digital-electronics',
    unitNumber: 3,
    unitTitle: 'UNIT-III: Logic Gates & Combinational Circuits',
    syllabusCode: 'BCA-DE-102',
    summary: 'Basic Gates, Universal Gates (NAND/NOR), XOR/XNOR, Half/Full Adder & Subtractor, Multiplexers, Demultiplexers, Decoders, Encoders, Comparators.',
    topics: [
      {
        id: 'de-gates-universal',
        title: 'Basic Gates, Universal Gates (NAND, NOR) & XOR/XNOR',
        shortOverview: 'AND, OR, NOT basic gates hain. NAND aur NOR universal gates hain jinse kisi bhi digital circuit ko banaya ja sakta hai.',
        hinglishContent: 'Logic gate digital electronics ka fundamental building block hai. Basic gates me AND (Multiplication A.B), OR (Addition A+B), aur NOT (Inversion A\') hote hain. NAND aur NOR ko Universal Gates kaha jata hai kyunki kisi bhi Boolean function ya gate ko sirf aur sirf NAND ya sirf NOR gates se implement kiya ja sakta hai bina kisi doosre gate ki madad ke. XOR (Exclusive-OR) odd-1s detector hai jabki XNOR (Exclusive-NOR) equivalence detector hai.',
        bulletPoints: [
          'AND Gate: Output 1 tabhi jab sabhi inputs 1 hon. (Y = A . B)',
          'OR Gate: Output 1 agar koi bhi input 1 ho. (Y = A + B)',
          'NOT Gate: Inverter. (Y = A\')',
          'NAND Gate: AND followed by NOT. (Y = (A . B)\') - Universal Gate',
          'NOR Gate: OR followed by NOT. (Y = (A + B)\') - Universal Gate',
          'XOR Gate: Output 1 jab inputs different hon. (Y = A\'B + AB\' = A ⊕ B)',
          'XNOR Gate: Output 1 jab inputs same hon. (Y = AB + A\'B\' = (A ⊕ B)\')'
        ],
        diagramAscii: `Gate Implementation using only NAND gates:
NOT using NAND  : Join both inputs -> (A . A)' = A'
AND using NAND  : ( (A . B)' )' = A . B  [2 NAND gates]
OR using NAND   : (A' . B')' = A + B     [3 NAND gates]
XOR using NAND  : 4 NAND gates required!
XNOR using NAND : 5 NAND gates required!`,
        examPointers: [
          'Number of NAND gates needed to make other gates: NOT = 1, AND = 2, OR = 3, NOR = 4, XOR = 4, XNOR = 5.',
          'Number of NOR gates needed: NOT = 1, OR = 2, AND = 3, NAND = 4, XNOR = 4, XOR = 5.'
        ],
        vivaQnA: [
          {
            question: 'Why are NAND and NOR called Universal Gates?',
            answer: 'Kyunki basic gates (AND, OR, NOT) aur kisi bhi complex combinational ya sequential digital circuit ko sirf aur sirf NAND ya NOR gates ka use karke construct kiya ja sakta hai.'
          }
        ],
        tags: ['logic-gates', 'nand', 'nor', 'xor', 'xnor', 'universal-gates', 'unit-3-de']
      },
      {
        id: 'de-adders-subtractors',
        title: 'Adders & Subtractors: Half Adder, Full Adder, Half Subtractor, Full Subtractor',
        shortOverview: 'Arithmetic circuits: 1-bit binary addition aur subtraction ke combinational logic circuits.',
        hinglishContent: 'Combinational circuits aise circuits hote hain jinka output sirf present inputs par depend karta hai (koi memory nahi hoti). Half Adder do 1-bit binary numbers ko add karta hai aur Sum tatha Carry generate karta hai. Full Adder teen 1-bit numbers (A, B aur previous Carry Cin) ko add karta hai. Subtractor subtraction karta hai aur Difference tatha Borrow generate karta hai.',
        bulletPoints: [
          'Half Adder: Inputs: A, B. Sum = A ⊕ B, Carry = A . B. (1 XOR + 1 AND gate).',
          'Full Adder: Inputs: A, B, Cin. Sum = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B) = AB + BCin + ACin. (2 Half Adders + 1 OR gate).',
          'Half Subtractor: Inputs: A, B. Difference = A ⊕ B, Borrow = A\' . B.',
          'Full Subtractor: Inputs: A, B, Bin. Diff = A ⊕ B ⊕ Bin, Bout = A\'B + Bin(A ⊕ B)\' = A\'B + A\'Bin + BBin.'
        ],
        diagramAscii: `Full Adder Truth Table & Equations:
A  B  Cin | Sum  Cout
0  0   0  |  0    0
0  0   1  |  1    0
0  1   0  |  1    0
0  1   1  |  0    1
1  0   0  |  1    0
1  0   1  |  0    1
1  1   0  |  0    1
1  1   1  |  1    1
Sum = A XOR B XOR Cin
Cout = AB + BCin + ACin`,
        examPointers: [
          'Design Full Adder using 2 Half Adders and 1 OR gate (Circuit diagram + Truth table is a 5-mark favorite).',
          'Design Half Adder using only NAND gates (Requires 5 NAND gates).'
        ],
        vivaQnA: [
          {
            question: 'How many NAND gates are required to design a Full Adder?',
            answer: 'A Full Adder can be designed using exactly 9 NAND gates (since 1 Half Adder takes 5 NAND, and cascading them with carry optimization requires 9 NANDs).'
          }
        ],
        tags: ['adders', 'subtractors', 'half-adder', 'full-adder', 'combinational', 'unit-3-de']
      },
      {
        id: 'de-mux-demux-decoder',
        title: 'Multiplexer (MUX), DEMUX, Decoders, Encoders & Comparators',
        shortOverview: 'Data routing circuits: 2^n to 1 MUX (Data Selector), 1 to 2^n DEMUX (Data Distributor), Decoders aur Priority Encoders.',
        hinglishContent: 'Multiplexer (MUX) ek aisa combinational circuit hai jisme multiple input lines (2^n) hoti hain, n selection lines hoti hain, aur sirf 1 single output line hoti hai. Ise Data Selector bhi kehte hain. Demultiplexer (DEMUX) iska ulta hota hai: 1 input ko n select lines ke aadhar par 2^n outputs me se kisi ek par bhejta hai. Decoder n input lines ko 2^n output lines me decode karta hai (jaise 3-to-8 decoder). Encoder 2^n inputs ko n-bit code me convert karta hai.',
        bulletPoints: [
          'Multiplexer (MUX): 2^n data inputs, n select lines, 1 output. Expression for 4:1 MUX: Y = S1\'S0\'I0 + S1\'S0I1 + S1S0\'I2 + S1S0I3.',
          'Demultiplexer (DEMUX): 1 input, n select lines, 2^n outputs.',
          'Decoder: n inputs -> 2^n outputs. E.g. Binary to Octal (3 to 8), BCD to 7-Segment Decoder.',
          'Encoder: 2^n inputs -> n binary outputs. Priority Encoder multiple active inputs hone par highest priority index deta hai.',
          'Digital Comparator: Do binary numbers A aur B ko compare karta hai aur 3 outputs deta hai: A > B, A = B, A < B.'
        ],
        diagramAscii: `4:1 Multiplexer Block:
I0 -----\\
I1 ------\\
          |--- Y (Output)
I2 ------/
I3 -----/
     |  |
     S1 S0 (Select lines)`,
        examPointers: [
          'Implement full adder using 8:1 MUX or 4:1 MUX (Frequent 5-mark design question).',
          'Difference between Multiplexer and Decoder.'
        ],
        vivaQnA: [
          {
            question: 'Why is a Multiplexer called a Data Selector?',
            answer: 'Kyunki select lines ke binary value ke anusaar ye kai data inputs me se kisi ek data input ko select karke single output line par bhejta hai.'
          }
        ],
        tags: ['mux', 'demux', 'decoder', 'encoder', 'comparator', 'unit-3-de']
      }
    ]
  },

  // ==========================================
  // MODULE 2: DIGITAL ELECTRONICS LAB - UNIT 4
  // ==========================================
  {
    id: 'de-unit-4',
    module: 'digital-electronics',
    unitNumber: 4,
    unitTitle: 'UNIT-IV: Sequential Circuits, Flip-Flops, Registers & Counters',
    syllabusCode: 'BCA-DE-102',
    summary: 'SR, Clocked RS, D, JK, T & Master-Slave Flip-Flops, Characteristic & Excitation Tables, Shift Registers (SISO, SIPO, PISO, PIPO), Asynchronous & Synchronous Counters.',
    topics: [
      {
        id: 'de-flipflops-all',
        title: 'Flip-Flops: SR, Clocked RS, D, JK, T & Master-Slave (Race-Around Condition)',
        shortOverview: 'Sequential circuits me memory hoti hai (feedback loop). Flip-Flop 1-bit memory cell hai.',
        hinglishContent: 'Sequential circuit ka output present inputs aur past history (memory state) dono par depend karta hai. Flip-Flop ek bistable multivibrator circuit hai jo 1-bit data (0 ya 1) store kar sakta hai. SR Flip-Flop me jab S=1, R=1 hota hai toh output indeterminate/invalid ban jata hai. Is problem ko JK Flip-Flop solve karta hai, lekin JK me Race-Around condition aa jati hai jab J=1, K=1 aur clock pulse ka duration flip-flop ke propagation delay se bada ho. Race-Around ko solve karne ke liye Master-Slave JK Flip-Flop ya Edge-Triggering use kiya jata hai.',
        bulletPoints: [
          'SR Flip-Flop: S=0,R=0 (No change), S=0,R=1 (Reset Q=0), S=1,R=0 (Set Q=1), S=1,R=1 (Invalid/Forbidden).',
          'JK Flip-Flop: J=1, K=1 par output Toggle karta hai (Q_next = Q\').',
          'D Flip-Flop (Data / Delay): Q_next = D. Transparent latch, data transfer ke liye ideal.',
          'T Flip-Flop (Toggle): T=0 (No change Q_next = Q), T=1 (Toggle Q_next = Q\'). Counters banane ke liye use hota hai.',
          'Master-Slave JK: Do flip-flops series me jude hote hain. Master positive edge par active hota hai, Slave negative edge par copy karta hai, jisse Race-Around condition 100% eliminate ho jaati hai.'
        ],
        diagramAscii: `Flip-Flop Truth Tables Comparison:
SR: J K | Q(next)       D: D | Q(next)       T: T | Q(next)
 0 0 | Q (Memory)          0 | 0                0 | Q (Hold)
 0 1 | 0 (Reset)           1 | 1                1 | Q' (Toggle)
 1 0 | 1 (Set)
 1 1 | Q' (Toggle in JK, Invalid in SR)`,
        examPointers: [
          'What is Race-Around condition in JK Flip-Flop and how is it resolved? (Guaranteed 5-mark theory question).',
          'Excitation Table of JK Flip-Flop: Q -> Q_next: 0->0 (0 X), 0->1 (1 X), 1->0 (X 1), 1->1 (X 0).'
        ],
        vivaQnA: [
          {
            question: 'What is the condition for Race-Around in JK flip-flop?',
            answer: 'Jab J=1, K=1 hon, level-triggered clock active ho, aur clock pulse width (tp) propagation delay (td) se zyada ho (tp > td), tab clock period ke dauran output lagatar 0 aur 1 ke beech toggle hota rehta hai jisse output unpredictable ho jata hai.'
          }
        ],
        tags: ['flip-flops', 'sr', 'jk', 'd-flipflop', 't-flipflop', 'master-slave', 'race-around', 'unit-4-de']
      },
      {
        id: 'de-registers-counters',
        title: 'Registers (SISO, SIPO, PISO, PIPO) & Counters (Asynchronous vs Synchronous)',
        shortOverview: 'Group of flip-flops ko Register kehte hain (n-bits storage). Counters clock pulses ko count karne ke kaam aate hain.',
        hinglishContent: 'Register n-bits binary data ko store karne ke liye n flip-flops ka group hota hai. Shift registers data ko clock pulse aane par left ya right shift karte hain. Data loading aur unloading ke tareeqe ke aadhar par 4 types hote hain: SISO (Serial-In Serial-Out), SIPO (Serial-In Parallel-Out), PISO (Parallel-In Serial-Out), PIPO (Parallel-In Parallel-Out). Counters sequential circuits hain jo input clock pulses count karte hain: Asynchronous (Ripple) counter me clock sirf pehle flip-flop ko milti hai aur agle flip-flop ko pichhle ka output clock banta hai. Synchronous counter me sabhi flip-flops ko ek sath common simultaneous clock milti hai.',
        bulletPoints: [
          'SISO: 4-bit data load karne me 4 clock pulses aur read karne me 4 clock pulses lagte hain (Slowest).',
          'PIPO: 1 clock pulse me sara data load aur 1 clock pulse me read (Fastest, bus registers me use hota hai).',
          'Asynchronous (Ripple) Counter: Simple hardware, par cumulative propagation delay zyada hone ki wajah se high frequency par slow hota hai.',
          'Synchronous Counter: Fast, saare flip-flops simultaneously trigger hote hain, koi propagation delay accumulate nahi hota.',
          'Modulus of a Counter (MOD-N): Counter kitni distinct states count kar sakta hai before resetting (e.g. MOD-10 Decade Counter 0 se 9 tak count karta hai).'
        ],
        diagramAscii: `Asynchronous vs Synchronous Counter:
Asynchronous (Ripple):
Clock ---> [FF 0] ---> Q0 (serves as clock for FF 1) ---> [FF 1] ---> Q1 ...
Synchronous:
Clock --------+-----------------+-----------------+
              |                 |                 |
            [FF 0]            [FF 1]            [FF 2]`,
        examPointers: [
          'Difference between Synchronous and Asynchronous counter (5 marks).',
          'Design MOD-10 (Decade) counter using JK or T flip-flops with NAND reset gate.'
        ],
        vivaQnA: [
          {
            question: 'How many flip-flops are needed to design a MOD-16 counter?',
            answer: 'Formula: 2^n >= MOD. Since 2^4 = 16, exactly 4 flip-flops are required.'
          },
          {
            question: 'Which shift register mode is the fastest?',
            answer: 'PIPO (Parallel-In Parallel-Out) fastest hota hai kyunki data ek hi single clock cycle me simultaneously load aur read ho jata hai.'
          }
        ],
        tags: ['registers', 'counters', 'siso', 'sipo', 'piso', 'pipo', 'synchronous', 'ripple-counter', 'unit-4-de']
      }
    ]
  }
];
