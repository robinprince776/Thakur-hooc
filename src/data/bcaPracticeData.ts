// 50+ C Programming Practice Questions & 100+ Digital Electronics Lab Practice Problems
export interface PracticeQuestion {
  id: string;
  module: 'c-programming' | 'digital-electronics';
  unit: number;
  category: 'Exam Question' | 'Viva Voce' | 'Lab Problem' | 'Numerical Calculation' | 'Code Tracing';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  problemStatement: string;
  solution: string;
  hinglishTip: string;
  codeOrMath?: string;
  tags: string[];
}

export const BCA_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ==========================================
  // C PROGRAMMING: UNIT 1 (15 Questions)
  // ==========================================
  {
    id: 'cp-q1',
    module: 'c-programming',
    unit: 1,
    category: 'Exam Question',
    difficulty: 'Easy',
    title: 'Structure of a C program explanation',
    problemStatement: 'Explain the basic structure of a C program with a neat sketch and purpose of each section.',
    solution: 'C program 6 sections me structure hota hai: 1) Documentation Section (Comments), 2) Link Section (#include header files), 3) Definition Section (#define constants), 4) Global Declaration Section, 5) main() function body, 6) Subprogram section (User-defined functions). Execution hamesha main() se start hota hai.',
    hinglishTip: 'Exam me documentation se subprogram tak ka block diagram zaroor banayein.',
    tags: ['structure', 'c-basics', 'unit-1']
  },
  {
    id: 'cp-q2',
    module: 'c-programming',
    unit: 1,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Tokens in C and their classification',
    problemStatement: 'What are tokens in C? How many categories of tokens exist?',
    solution: 'Program ki sabse chhoti individual unit ko token kehte hain. 6 categories hoti hain: Keywords (32 reserved words), Identifiers (names given to entities), Constants/Literals (fixed values), Strings ("hello"), Special Symbols ({}, [], ()), and Operators (+, -, *).',
    hinglishTip: 'Compiler sabse pehle source code ko tokens me tokenize karta hai.',
    tags: ['tokens', 'unit-1']
  },
  {
    id: 'cp-q3',
    module: 'c-programming',
    unit: 1,
    category: 'Code Tracing',
    difficulty: 'Medium',
    title: 'printf return value calculation',
    problemStatement: 'Predict the output: int x = printf("Hello BCA"); printf("%d", x);',
    solution: 'Output: Hello BCA9\nExplanation: printf() printed characters ki sankhya return karta hai. "Hello BCA" me 9 characters hain (including space). Isliye x = 9 store hoga aur screen par 9 print hoga.',
    hinglishTip: 'printf() screen par print karne ke sath-sath characters count bhi return karta hai.',
    codeOrMath: `int x = printf("Hello BCA");
printf("%d", x); // prints 9`,
    tags: ['printf', 'return-value', 'unit-1']
  },
  {
    id: 'cp-q4',
    module: 'c-programming',
    unit: 1,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Difference between getchar(), getch() and getche()',
    problemStatement: 'Explain the difference between getchar(), getch() and getche().',
    solution: 'getchar(): Buffered input, Enter key dabane par read hota hai aur screen par echo hota hai.\ngetch(): Non-buffered, character type karte hi read ho jata hai bina Enter ke aur screen par echo NAHI hota.\ngetche(): Non-buffered, character type karte hi read hota hai aur screen par echo (e) hota hai.',
    hinglishTip: 'e in getche stands for Echo!',
    tags: ['io-functions', 'getch', 'getchar', 'unit-1']
  },
  {
    id: 'cp-q5',
    module: 'c-programming',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Easy',
    title: 'Integer type conversion & evaluation',
    problemStatement: 'What is the value of float x = 5 / 2 vs float y = (float)5 / 2?',
    solution: 'x = 2.000000 (kyunki 5 aur 2 dono int hain, integer division 2 deta hai jo float me 2.00 banta hai).\ny = 2.500000 (kyunki (float)5 explicit type casting se numerator float ban jata hai, fir floating division se 2.50 milta hai).',
    hinglishTip: 'Integer / Integer hamesha integer result deta hai, chahe LHS variable float kyu na ho!',
    tags: ['type-casting', 'division', 'unit-1']
  },
  {
    id: 'cp-q6',
    module: 'c-programming',
    unit: 1,
    category: 'Exam Question',
    difficulty: 'Easy',
    title: 'Rules for naming identifiers in C',
    problemStatement: 'State any 4 essential rules for constructing valid identifier names in C.',
    solution: '1) Sirf letters (A-Z, a-z), digits (0-9) aur underscore (_) allow hain.\n2) Pehla character digit nahi ho sakta (e.g. 2ndYear invalid hai, year2nd valid hai).\n3) Keywords ko identifier ki tarah use nahi kar sakte.\n4) Case-sensitive hote hain (Age aur age do alag variables hain).',
    hinglishTip: 'Special symbols jaise $, @, # variable name me allow nahi hote (except underscore).',
    tags: ['identifiers', 'naming-rules', 'unit-1']
  },
  {
    id: 'cp-q7',
    module: 'c-programming',
    unit: 1,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Why gets() is deprecated and replaced by fgets()',
    problemStatement: 'Why is gets() dangerous to use in C programming?',
    solution: 'gets() buffer boundary check nahi karta. Agar buffer 10 bytes ka hai aur user 50 characters enter kar de, toh gets() memory ke adjacent stack data ko overwrite kar deta hai (Buffer Overflow Vulnerability). fgets() buffer size specify karne deta hai isliye safe hai.',
    hinglishTip: 'fgets(str, sizeof(str), stdin) is modern safe practice.',
    tags: ['gets', 'fgets', 'buffer-overflow', 'unit-1']
  },
  {
    id: 'cp-q8',
    module: 'c-programming',
    unit: 1,
    category: 'Exam Question',
    difficulty: 'Easy',
    title: 'Symbolic constants with #define vs const keyword',
    problemStatement: 'Differentiate between #define PI 3.14 and const float PI = 3.14.',
    solution: '#define preprocessor directive hai jo compile hone se pehle text replacement karta hai (koi memory allocate nahi hoti, scope global hota hai).\nconst keyword compiler level par variable banata hai jo memory consume karta hai aur scope rules follow karta hai.',
    hinglishTip: '#define me semicolon (;) nahi lagate!',
    tags: ['constants', 'preprocessor', 'unit-1']
  },
  {
    id: 'cp-q9',
    module: 'c-programming',
    unit: 1,
    category: 'Code Tracing',
    difficulty: 'Medium',
    title: 'Escape sequence byte count',
    problemStatement: 'What is the output of sizeof("\\n\\t\\0")?',
    solution: 'Output: 4 bytes\nExplanation: \\n is 1 byte, \\t is 1 byte, \\0 is 1 byte, aur string literal ke end me compiler ka hidden null terminator \\0 1 byte leta hai. Total = 4 bytes.',
    hinglishTip: 'Har escape sequence (\\n, \\t, \\a) single character (1 byte) hota hai.',
    tags: ['escape-sequences', 'sizeof', 'unit-1']
  },
  {
    id: 'cp-q10',
    module: 'c-programming',
    unit: 1,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Range of signed char vs unsigned char',
    problemStatement: 'State the numerical ranges of signed char and unsigned char in 8-bit architecture.',
    solution: 'Signed char: -128 to +127 (MSB is sign bit, values represented in 2\'s complement).\nUnsigned char: 0 to 255 (All 8 bits used for magnitude).',
    hinglishTip: 'Unsigned me negative values nahi hoti isliye upper limit 2^8 - 1 = 255 hoti hai.',
    tags: ['char-range', 'signed-unsigned', 'unit-1']
  },

  // ==========================================
  // C PROGRAMMING: UNIT 2 (15 Questions)
  // ==========================================
  {
    id: 'cp-q11',
    module: 'c-programming',
    unit: 2,
    category: 'Code Tracing',
    difficulty: 'Medium',
    title: 'Pre-increment vs Post-increment expression',
    problemStatement: 'Predict output: int a = 5, b; b = ++a + a++; printf("%d %d", a, b);',
    solution: 'Output: a = 7, b = 12 (in standard left-to-right evaluation)\nExplanation: ++a increments a from 5 to 6 and returns 6. Then 6 + 6 is computed for b, and post-increment increments a to 7.',
    hinglishTip: 'Ek hi expression me ek variable ko multiple baar increment karna C standard me sequence point issue (undefined behavior) hota hai.',
    tags: ['increment', 'operators', 'unit-2']
  },
  {
    id: 'cp-q12',
    module: 'c-programming',
    unit: 2,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Operator Precedence and Associativity Table',
    problemStatement: 'Evaluate the expression: 10 + 20 * 3 / 2 - 5. Explain step-by-step with precedence rules.',
    solution: 'Step 1: * and / have higher precedence than + and -, with Left-to-Right associativity.\nStep 2: 20 * 3 = 60\nStep 3: 60 / 2 = 30\nStep 4: Now expression is 10 + 30 - 5. + and - have equal precedence (Left-to-Right).\nStep 5: 10 + 30 = 40\nStep 6: 40 - 5 = 35. Final Answer = 35.',
    hinglishTip: 'Multiplication aur Division equal priority ke hote hain, Left wala pehle solve hota hai.',
    tags: ['precedence', 'associativity', 'unit-2']
  },
  {
    id: 'cp-q13',
    module: 'c-programming',
    unit: 2,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Short-circuit evaluation in logical operators',
    problemStatement: 'What is short-circuit evaluation in C? Give an example.',
    solution: 'In && (Logical AND), if the left condition is 0 (False), the right condition is never evaluated because the result is already False.\nIn || (Logical OR), if the left condition is 1 (True), the right condition is never evaluated.\nExample: int a = 0; if (a && ++b) -> ++b will not execute!',
    hinglishTip: 'Performance optimize karne ke liye compiler right operand check hi nahi karta agar result pehle se tay ho.',
    tags: ['short-circuit', 'logical-operators', 'unit-2']
  },
  {
    id: 'cp-q14',
    module: 'c-programming',
    unit: 2,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Differentiate between while loop and do-while loop',
    problemStatement: 'Compare while and do-while loop with syntax, execution flow, and min iteration count.',
    solution: 'while loop: Entry-controlled, condition loop body se pehle test hoti hai, min iterations = 0 (agar pehli baar false ho).\ndo-while loop: Exit-controlled, condition loop body ke baad test hoti hai, min iterations = 1 (body ek baar zaroor execute hoti hai chahe condition false ho).',
    hinglishTip: 'do-while ke end me semicolon ; lagana compulsory hai: do { ... } while(cond);',
    tags: ['while', 'do-while', 'loops', 'unit-2']
  },
  {
    id: 'cp-q15',
    module: 'c-programming',
    unit: 2,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Fall-through in switch-case statement',
    problemStatement: 'What happens if break is omitted from a matched case in a switch statement?',
    solution: 'Agar break nahi lagaya jaye toh execution subsequent agle cases me fall-through ho jata hai aur agle cases ka code bina unki condition match hue execute hota chala jata hai jab tak koi break na mile ya switch khatam na ho.',
    hinglishTip: 'Intentional fall-through tab use karte hain jab multiple cases ko same action lena ho (e.g. case \'a\': case \'e\': case \'i\': isVowel=1; break;).',
    tags: ['switch', 'break', 'fall-through', 'unit-2']
  },
  {
    id: 'cp-q16',
    module: 'c-programming',
    unit: 2,
    category: 'Code Tracing',
    difficulty: 'Medium',
    title: 'Bitwise shift trick for multiplication and division',
    problemStatement: 'What is the output of printf("%d %d", 12 << 2, 32 >> 3)?',
    solution: 'Output: 48 4\nExplanation: 12 << 2 = 12 * 2^2 = 12 * 4 = 48 (Left shift multiplies by 2^n).\n32 >> 3 = 32 / 2^3 = 32 / 8 = 4 (Right shift divides by 2^n).',
    hinglishTip: 'Left shift (<<) se value badhti hai (multiply), Right shift (>>) se value ghat-ti hai (divide).',
    tags: ['bitwise', 'shift', 'unit-2']
  },
  {
    id: 'cp-q17',
    module: 'c-programming',
    unit: 2,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Difference between break and continue statements',
    problemStatement: 'Differentiate between break and continue with code examples.',
    solution: 'break statement loop ya switch se completely bahar fek deta hai (terminates the loop).\ncontinue statement sirf current iteration ke bache hue code ko skip karke sidha agli iteration ke update/test condition par bhej deta hai.',
    hinglishTip: 'break se loop khatam hota hai, continue se sirf ek round skip hota hai.',
    tags: ['break', 'continue', 'jump-statements', 'unit-2']
  },

  // ==========================================
  // C PROGRAMMING: UNIT 3 (12 Questions)
  // ==========================================
  {
    id: 'cp-q18',
    module: 'c-programming',
    unit: 3,
    category: 'Numerical Calculation',
    difficulty: 'Medium',
    title: 'Address Calculation in 1D Array',
    problemStatement: 'An integer array A[10] starts at base address 2000. Assuming each int takes 4 bytes, calculate the memory address of element A[6].',
    solution: 'Formula: Address of A[i] = Base_Address + (i * size_of_element)\nGiven: Base Address = 2000, i = 6, size = 4 bytes\nAddress of A[6] = 2000 + (6 * 4) = 2000 + 24 = 2024.\nFinal Answer: 2024.',
    hinglishTip: '0-indexed array me 6th index 7th element hota hai, calculation 6 * 4 se hoti hai.',
    tags: ['arrays', 'address-calculation', 'unit-3']
  },
  {
    id: 'cp-q19',
    module: 'c-programming',
    unit: 3,
    category: 'Numerical Calculation',
    difficulty: 'Hard',
    title: 'Address Calculation in 2D Array (Row-Major Order)',
    problemStatement: 'A 2D array A[4][5] of floats (4 bytes each) has Base Address = 1000. Calculate address of A[2][3] using Row-Major Order.',
    solution: 'Formula for Row-Major: Address(A[i][j]) = Base_Address + [(i * total_cols) + j] * size\nGiven: Base = 1000, i = 2, j = 3, total_cols = 5, size = 4\nOffset = (2 * 5) + 3 = 10 + 3 = 13 elements\nAddress = 1000 + (13 * 4) = 1000 + 52 = 1052.\nFinal Answer: 1052.',
    hinglishTip: 'Row major me i ko total columns se multiply karte hain taaki pehli saari rows skip ho sakein.',
    tags: ['row-major', '2d-array', 'address-formula', 'unit-3']
  },
  {
    id: 'cp-q20',
    module: 'c-programming',
    unit: 3,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Difference between strlen() and sizeof() for string arrays',
    problemStatement: 'char str[20] = "Hello"; What is the value of strlen(str) and sizeof(str)?',
    solution: 'strlen(str) = 5 (sirf actual visible characters count karta hai: H, e, l, l, o).\nsizeof(str) = 20 bytes (array ko memory me allocate hue poore buffer ka size return karta hai).',
    hinglishTip: 'strlen null character ko nahi ginta, sizeof poori allocated memory batata hai.',
    tags: ['strlen', 'sizeof', 'strings', 'unit-3']
  },
  {
    id: 'cp-q21',
    module: 'c-programming',
    unit: 3,
    category: 'Lab Problem',
    difficulty: 'Medium',
    title: 'Reverse a string without using strrev() library function',
    problemStatement: 'Write C logic to reverse a character array in-place without using strrev().',
    solution: 'Logic: Do pointers/indices use karo: left = 0, right = strlen(str) - 1. Jab tak left < right ho, dono characters ko swap karo aur left++, right-- karo.',
    hinglishTip: 'Two-pointer technique in-place O(N) time aur O(1) space me string reverse karta hai.',
    codeOrMath: `void reverseString(char str[]) {
    int left = 0, right = strlen(str) - 1;
    while(left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++; right--;
    }
}`,
    tags: ['string-reverse', 'in-place', 'unit-3']
  },

  // ==========================================
  // C PROGRAMMING: UNIT 4 (15 Questions)
  // ==========================================
  {
    id: 'cp-q22',
    module: 'c-programming',
    unit: 4,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Call by Value vs Call by Reference comparison',
    problemStatement: 'Differentiate between Call by Value and Call by Reference with suitable C code.',
    solution: 'Call by Value: Actual argument ki copy pass hoti hai, called function me modification original variable ko alter nahi karta.\nCall by Reference: Memory address pass hota hai (&a, &b), called function pointer ke through original variable ko alter karta hai.',
    hinglishTip: 'Swap function Call by Reference ke bina kaam nahi kar sakta!',
    tags: ['call-by-value', 'call-by-reference', 'pointers', 'unit-4']
  },
  {
    id: 'cp-q23',
    module: 'c-programming',
    unit: 4,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Four storage classes in C comparison',
    problemStatement: 'State storage location, default initial value, scope, and lifetime of: auto, static, extern, register.',
    solution: 'auto: RAM, Garbage, Local, Block exit tak.\nstatic: RAM, 0 (Zero), Local/File, Poore program run tak.\nextern: RAM, 0 (Zero), Global, Poore program run tak.\nregister: CPU Register, Garbage, Local, Block exit tak (Fastest access).',
    hinglishTip: 'static variable function calls ke beech me apni previous value yaad rakhta hai.',
    tags: ['storage-classes', 'static', 'register', 'unit-4']
  },
  {
    id: 'cp-q24',
    module: 'c-programming',
    unit: 4,
    category: 'Exam Question',
    difficulty: 'Hard',
    title: 'Structure vs Union difference with memory diagram',
    problemStatement: 'Explain difference between structure and union. If a struct and union both contain int, char, and double, what are their sizes?',
    solution: 'Structure: Har member ko alag memory milti hai. Total size = sum of members + alignment padding (approx 16 bytes for int, char, double).\nUnion: Sabhi members ek hi shared memory location use karte hain. Total size = size of largest member (double = 8 bytes). Ek time par sirf 1 member active hota hai.',
    hinglishTip: 'Union memory save karne ke liye best hai jab ek time par ek hi data chahiyeh ho.',
    tags: ['structure', 'union', 'memory-size', 'unit-4']
  },
  {
    id: 'cp-q25',
    module: 'c-programming',
    unit: 4,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Dangling pointer vs Wild pointer vs NULL pointer',
    problemStatement: 'Explain Dangling pointer, Wild pointer and NULL pointer in C.',
    solution: 'NULL Pointer: Aisa pointer jo kisi valid address ko point nahi karta (ptr = NULL). Safe placeholder.\nWild Pointer: Uninitialized pointer jo kisi random/garbage memory location ko point kar raha hota hai.\nDangling Pointer: Aisa pointer jisme pehle valid memory thi, par wo memory free() ho chuki hai.',
    hinglishTip: 'free(ptr) ke baad ptr = NULL assign karna dangling pointer se bachata hai.',
    tags: ['pointers', 'dangling', 'null-pointer', 'unit-4']
  },

  // ==========================================
  // DIGITAL ELECTRONICS: UNIT 1 (25 Questions)
  // ==========================================
  {
    id: 'de-q1',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Easy',
    title: 'Decimal 25.625 to Binary conversion',
    problemStatement: 'Convert Decimal (25.625)_10 to Binary with complete fractional step-by-step calculation.',
    solution: 'Integer part (25): 25/2 = 12(R1), 12/2 = 6(R0), 6/2 = 3(R0), 3/2 = 1(R1), 1/2 = 0(R1) -> 11001\nFractional part (0.625): 0.625 * 2 = 1.250(Int 1), 0.250 * 2 = 0.500(Int 0), 0.500 * 2 = 1.000(Int 1) -> .101\nFinal Answer: (11001.101)_2',
    hinglishTip: 'Integer remainders bottom-to-top note hote hain, fractional carries top-to-bottom!',
    tags: ['fraction-conversion', 'binary', 'decimal', 'unit-1-de']
  },
  {
    id: 'de-q2',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Medium',
    title: 'Binary 11001.101 to Decimal conversion',
    problemStatement: 'Convert Binary (11001.101)_2 to its Decimal equivalent using positional weights.',
    solution: 'Weights: 1*2^4 + 1*2^3 + 0*2^2 + 0*2^1 + 1*2^0 + 1*2^-1 + 0*2^-2 + 1*2^-3\n= 16 + 8 + 0 + 0 + 1 + 0.5 + 0 + 0.125 = 25.625\nFinal Answer: (25.625)_10',
    hinglishTip: 'Point ke baad powers 2^-1 (0.5), 2^-2 (0.25), 2^-3 (0.125) hoti hain.',
    tags: ['binary-to-decimal', 'positional-weight', 'unit-1-de']
  },
  {
    id: 'de-q3',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Easy',
    title: 'Binary to Hexadecimal grouping conversion',
    problemStatement: 'Convert (1101111010101101)_2 to Hexadecimal.',
    solution: 'Divide into 4-bit nibbles from right to left: 1101 1110 1010 1101\n1101 = 13 = D\n1110 = 14 = E\n1010 = 10 = A\n1101 = 13 = D\nFinal Answer: (DEAD)_16',
    hinglishTip: 'Hexadecimal me har 4 binary bits 1 hex digit banati hain.',
    tags: ['hexadecimal', 'grouping', 'unit-1-de']
  },
  {
    id: 'de-q4',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Medium',
    title: '1\'s and 2\'s complement of 8-bit binary number',
    problemStatement: 'Find 1\'s complement and 2\'s complement of binary number (10101100)_2.',
    solution: '1\'s Complement: Invert each bit: 01010011\n2\'s Complement: Add 1 to 1\'s complement: 01010011 + 1 = 01010100\nQuick Trick: Rightmost first 1 tak same rakho (00 fir 1), baki left bits invert karo -> 01010100.',
    hinglishTip: 'Quick shortcut: Right se scan karo, pehle 1 tak same, baki sab invert!',
    tags: ['complements', '1s-complement', '2s-complement', 'unit-1-de']
  },
  {
    id: 'de-q5',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Hard',
    title: 'Subtraction using 2\'s complement with carry rule',
    problemStatement: 'Subtract (12)_10 - (7)_10 using 5-bit 2\'s complement binary arithmetic.',
    solution: 'M = 12 = 01100\nN = 7 = 00111\n1\'s comp of N = 11000\n2\'s comp of N = 11000 + 1 = 11001\nSum = M + (2\'s comp of N) = 01100 + 11001 = (1) 00101\nCarry = 1 (Generated). Discard carry!\nResult is positive: 00101 = +5.',
    hinglishTip: 'Carry aane ka matlab result positive hai, carry ko drop kar do.',
    tags: ['subtraction', '2s-complement', 'carry-rule', 'unit-1-de']
  },
  {
    id: 'de-q6',
    module: 'digital-electronics',
    unit: 1,
    category: 'Numerical Calculation',
    difficulty: 'Hard',
    title: 'Subtraction using 2\'s complement when result is negative',
    problemStatement: 'Subtract (7)_10 - (12)_10 using 5-bit 2\'s complement binary arithmetic.',
    solution: 'M = 7 = 00111\nN = 12 = 01100\n2\'s comp of N = 10011 + 1 = 10100\nSum = 00111 + 10100 = 11011 (No carry generated!).\nNo Carry Rule: Result is negative and in 2\'s complement form.\nMagnitude = 2\'s comp of 11011 = 00100 + 1 = 00101 = 5.\nFinal Answer: -5 (represented as 11011).',
    hinglishTip: 'Agar carry na aaye toh answer negative hai aur answer ka dobara 2\'s complement lekar magnitude nikalte hain.',
    tags: ['subtraction', 'negative-result', 'unit-1-de']
  },
  {
    id: 'de-q7',
    module: 'digital-electronics',
    unit: 1,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'BCD Addition and correction rule',
    problemStatement: 'Add BCD numbers 0101 (5) and 0111 (7). Explain the 0110 (6) correction rule.',
    solution: '0101 + 0111 = 1100 (Decimal 12). Since 1100 > 1001 (9) and invalid BCD, add correction factor 0110 (6):\n1100 + 0110 = (1) 0010 -> 0001 0010 in BCD = 12.\nCorrection Rule: Agar sum 9 se bada ho ya carry generate ho, toh 0110 (6) add kiya jata hai kyunki 4-bit me 6 invalid states (10-15) hoti hain.',
    hinglishTip: 'Invalid BCD 1010 se 1111 tak hote hain, unhe skip karne ke liye 6 add karte hain.',
    tags: ['bcd-addition', 'correction-factor', 'unit-1-de']
  },
  {
    id: 'de-q8',
    module: 'digital-electronics',
    unit: 1,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Why is Gray code called a unit-distance code?',
    problemStatement: 'Why is Gray code called a reflected and unit-distance code?',
    solution: 'Kyunki Gray code me kisi bhi do consecutive (lagatar) numbers ke code words me sirf ek single bit ka change hota hai (Hamming distance = 1). Ise K-Map aur rotary angle encoders me race hazards avoid karne ke liye use kiya jata hai.',
    hinglishTip: 'Binary me 7 (0111) se 8 (1000) me 4 bits change hoti hain, par Gray code me hamesha 1 bit change hoti hai.',
    tags: ['gray-code', 'unit-distance', 'unit-1-de']
  },

  // ==========================================
  // DIGITAL ELECTRONICS: UNIT 2 (25 Questions)
  // ==========================================
  {
    id: 'de-q9',
    module: 'digital-electronics',
    unit: 2,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Proof of De Morgan\'s First Law using Truth Table',
    problemStatement: 'State and prove De Morgan\'s First Law: (A + B)\' = A\' . B\' using truth table.',
    solution: 'A B | A+B | (A+B)\' | A\' B\' | A\'.B\'\n0 0 |  0  |   1    | 1  1  |   1\n0 1 |  1  |   0    | 1  0  |   0\n1 0 |  1  |   0    | 0  1  |   0\n1 1 |  1  |   0    | 0  0  |   0\nColumn (A+B)\' matches column A\'.B\' for all input combinations. Hence proved!',
    hinglishTip: 'NOR gate bubbled AND gate ke barabar hota hai.',
    tags: ['de-morgans-law', 'truth-table', 'proof', 'unit-2-de']
  },
  {
    id: 'de-q10',
    module: 'digital-electronics',
    unit: 2,
    category: 'Numerical Calculation',
    difficulty: 'Hard',
    title: '3-Variable K-Map Minimization',
    problemStatement: 'Simplify Boolean function F(A, B, C) = Σm(0, 2, 4, 5, 6) using K-Map.',
    solution: 'Cells m0, m2, m4, m6 form a Quad: Rows A=0 (m0,m2) and A=1 (m4,m6) -> C is 0 in both -> Term = C\'\nCells m4, m5 form a Pair: Row A=1, Columns BC = 00, 01 -> Term = AB\'\nFinal Minimized SOP: F = C\' + AB\'',
    hinglishTip: 'Corner wrap around Quad (0, 2, 4, 6) se B aur A eliminate ho kar sirf C\' bachta hai.',
    tags: ['kmap', '3-variable', 'quad', 'unit-2-de']
  },
  {
    id: 'de-q11',
    module: 'digital-electronics',
    unit: 2,
    category: 'Numerical Calculation',
    difficulty: 'Hard',
    title: '4-Variable K-Map with Don\'t Care condition',
    problemStatement: 'Minimize F(A, B, C, D) = Σm(1, 3, 7, 11, 15) + d(0, 2, 5) using K-Map.',
    solution: 'Minterms (1, 3, 5(d), 7) form a Quad in first two rows -> Term = A\'D\nMinterms (3, 7, 11, 15) form an Octet/Quad in column CD=11 -> Term = CD\nMinterms (0(d), 1, 2(d), 3) form another Quad -> A\'B\'\nOptimal cover: Quad (3, 7, 11, 15) gives CD, Quad (1, 3, 5(d), 7) gives A\'D.\nCombined minimal expression: F = CD + A\'D = D(A\' + C)',
    hinglishTip: 'Don\'t care cells ko sirf tab include karte hain jab wo group ko Quad ya Octet banane me madad karein.',
    tags: ['kmap', '4-variable', 'dont-care', 'unit-2-de']
  },

  // ==========================================
  // DIGITAL ELECTRONICS: UNIT 3 (25 Questions)
  // ==========================================
  {
    id: 'de-q12',
    module: 'digital-electronics',
    unit: 3,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Design Full Adder using two Half Adders and one OR gate',
    problemStatement: 'Draw logic circuit and derive Boolean expressions for Full Adder using two Half Adders.',
    solution: 'Half Adder 1 inputs: A, B -> Sum1 = A ⊕ B, Carry1 = A . B\nHalf Adder 2 inputs: Sum1, Cin -> Final Sum = (A ⊕ B) ⊕ Cin, Carry2 = (A ⊕ B) . Cin\nFinal Carry Cout = Carry1 + Carry2 = AB + Cin(A ⊕ B).\nRequires exactly 2 Half Adders + 1 OR gate.',
    hinglishTip: 'Sum do baar XOR karne se aata hai, Carry dono partial carries ka OR hota hai.',
    tags: ['full-adder', 'half-adder', 'combinational-circuit', 'unit-3-de']
  },
  {
    id: 'de-q13',
    module: 'digital-electronics',
    unit: 3,
    category: 'Exam Question',
    difficulty: 'Medium',
    title: 'Implement 2-input XOR gate using only NAND gates',
    problemStatement: 'How many minimum NAND gates are required to design an XOR gate? Draw diagram.',
    solution: 'Minimum 4 NAND gates are required!\nGate 1: N1 = (A . B)\'\nGate 2: N2 = (A . N1)\' = (A . (A.B)\')\'\nGate 3: N3 = (B . N1)\' = (B . (A.B)\')\'\nGate 4: Output = (N2 . N3)\' = A\'B + AB\' = A ⊕ B.',
    hinglishTip: 'XOR gate 4 NAND gates se banta hai, XNOR gate 5 NAND gates se banta hai.',
    tags: ['xor', 'nand-universal', 'gate-count', 'unit-3-de']
  },
  {
    id: 'de-q14',
    module: 'digital-electronics',
    unit: 3,
    category: 'Viva Voce',
    difficulty: 'Easy',
    title: 'Multiplexer vs Demultiplexer function',
    problemStatement: 'What is the primary difference between MUX (Multiplexer) and DEMUX (Demultiplexer)?',
    solution: 'MUX (Data Selector): Many inputs (2^n) to 1 output, controlled by n select lines.\nDEMUX (Data Distributor): 1 single input to many outputs (2^n), routed by n select lines.',
    hinglishTip: 'MUX many-to-one hota hai, DEMUX one-to-many hota hai.',
    tags: ['mux', 'demux', 'unit-3-de']
  },

  // ==========================================
  // DIGITAL ELECTRONICS: UNIT 4 (25 Questions)
  // ==========================================
  {
    id: 'de-q15',
    module: 'digital-electronics',
    unit: 4,
    category: 'Exam Question',
    difficulty: 'Hard',
    title: 'Race-around condition in JK Flip-Flop and its solution',
    problemStatement: 'What is Race-Around condition in JK Flip-Flop? How does Master-Slave JK eliminate it?',
    solution: 'Race-Around Condition: When J=1, K=1, and clock pulse duration (tp) is greater than flip-flop propagation delay (td), the output toggles repeatedly (0->1->0->1) during a single clock pulse, causing an undefined state.\nSolution: Master-Slave JK Flip-Flop eliminates this because Master responds to positive clock edge and Slave responds to negative clock edge (inverter), so state updates only once per clock period.',
    hinglishTip: 'Master aur Slave ek sath kabhi active nahi hote, isliye feedback loop break ho jata hai.',
    tags: ['race-around', 'jk-flipflop', 'master-slave', 'unit-4-de']
  },
  {
    id: 'de-q16',
    module: 'digital-electronics',
    unit: 4,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Excitation Table of JK Flip-Flop',
    problemStatement: 'Construct the excitation table of JK Flip-Flop for state transitions.',
    solution: 'Present State (Q) -> Next State (Q+1) | J  K\n0 -> 0 | 0  X\n0 -> 1 | 1  X\n1 -> 0 | X  1\n1 -> 1 | X  0\nWhere X represents Don\'t Care condition.',
    hinglishTip: 'Excitation table counter design me flip-flop inputs nirdharit karne ke kaam aati hai.',
    tags: ['excitation-table', 'jk-flipflop', 'unit-4-de']
  },
  {
    id: 'de-q17',
    module: 'digital-electronics',
    unit: 4,
    category: 'Numerical Calculation',
    difficulty: 'Easy',
    title: 'Number of flip-flops required for MOD-N counter',
    problemStatement: 'How many flip-flops are needed to construct a MOD-12 (divide-by-12) counter?',
    solution: 'Formula: 2^n >= MOD (where n is number of flip-flops)\nFor MOD-12: 2^3 = 8 (insufficient < 12), 2^4 = 16 (>= 12).\nTherefore, minimum 4 flip-flops are required (States 0000 to 1011). NAND reset gate triggers at 1100 (12) to reset counter to 0.',
    hinglishTip: 'Formula 2^n >= N hamesha yaad rakhein.',
    tags: ['counters', 'mod-n', 'flip-flop-count', 'unit-4-de']
  },
  {
    id: 'de-q18',
    module: 'digital-electronics',
    unit: 4,
    category: 'Viva Voce',
    difficulty: 'Medium',
    title: 'Synchronous vs Asynchronous (Ripple) counter comparison',
    problemStatement: 'Why are synchronous counters preferred over ripple counters in high-speed applications?',
    solution: 'Asynchronous (Ripple) counter me har agle flip-flop ko pichhle flip-flop ka output as clock milta hai, jisse propagation delay accumulate (add) hota jata hai aur counter high clock frequencies par fail ho jata hai.\nSynchronous counter me sabhi flip-flops ko common external clock ek sath milti hai, jisse cumulative delay zero hota hai aur high speed operation milta hai.',
    hinglishTip: 'Synchronous = Simultaneous clocking = Fast speed.',
    tags: ['synchronous', 'asynchronous', 'ripple-counter', 'propagation-delay', 'unit-4-de']
  }
];
