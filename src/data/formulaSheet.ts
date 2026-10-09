export interface FormulaSection {
  id: string;
  title: string;
  description: string;
  items: {
    name: string;
    formula: string;
    explanation: string;
    example?: string;
  }[];
}

export const FORMULA_SHEETS: FormulaSection[] = [
  {
    id: 'number-systems',
    title: 'Number Systems & Radix Quick Reference',
    description: 'Basics of Binary, Octal, Decimal, and Hexadecimal representations used in BCA computer architecture.',
    items: [
      {
        name: 'Binary (Base 2)',
        formula: 'Radix r = 2, Allowed Digits: {0, 1}',
        explanation: 'Har position 2 ki power (2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128...) represent karti hai.',
        example: '(1101)₂ = 1×8 + 1×4 + 0×2 + 1×1 = 13₁₀'
      },
      {
        name: 'Octal (Base 8)',
        formula: 'Radix r = 8, Allowed Digits: {0, 1, 2, 3, 4, 5, 6, 7}',
        explanation: 'Har 1 octal digit theek 3 binary bits ke barabar hota hai (2³ = 8). Positional weights 8⁰=1, 8¹=8, 8²=64, 8³=512.',
        example: '(37)₈ = 3×8 + 7×1 = 31₁₀'
      },
      {
        name: 'Decimal (Base 10)',
        formula: 'Radix r = 10, Allowed Digits: {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}',
        explanation: 'Hum human beings daily life mein decimal number system use karte hain. Weights: 10⁰=1, 10¹=10, 10²=100...',
        example: '456 = 4×100 + 5×10 + 6×1'
      },
      {
        name: 'Hexadecimal (Base 16)',
        formula: 'Radix r = 16, Digits: {0-9, A=10, B=11, C=12, D=13, E=14, F=15}',
        explanation: 'Har 1 hex digit theek 4 binary bits (1 Nibble) ke barabar hota hai (2⁴ = 16). Memory addresses hex mein represent hote hain.',
        example: '(2F)₁₆ = 2×16 + 15×1 = 47₁₀'
      }
    ]
  },
  {
    id: 'binary-arithmetic',
    title: 'Binary Arithmetic & Complements Rules',
    description: 'Addition, subtraction, and complement rules essential for BCA exams.',
    items: [
      {
        name: 'Binary Addition Rules',
        formula: '0+0=0, 0+1=1, 1+0=1, 1+1=10 (Sum 0, Carry 1), 1+1+1=11 (Sum 1, Carry 1)',
        explanation: 'Right se left bit by bit add karte hain aur carry ko next high-order bit par forward karte hain.',
        example: '1011 + 0101 = 10000'
      },
      {
        name: "1's Complement Rule",
        formula: "1's Complement = Invert all bits (0 → 1, 1 → 0)",
        explanation: 'Binary number ke har bit ko flip kar dein. Ye NOT operation ke barabar hota hai.',
        example: "1's Complement of 11001010 = 00110101"
      },
      {
        name: "2's Complement Rule",
        formula: "2's Complement = (1's Complement) + 1",
        explanation: 'Pehle 1s complement nikalo, fir LSB (right-most bit) mein 1 jod do. Negative numbers computer mein 2s complement se store hote hain.',
        example: 'Number 0101 → 1s comp: 1010 → 2s comp: 1010 + 1 = 1011'
      },
      {
        name: "2's Complement Subtraction",
        formula: 'A - B = A + (2\'s Complement of B)',
        explanation: 'Agar end carry aata hai, toh use discard kar do aur result positive hai. Agar end carry nahi aata, toh result negative hai aur 2s complement form mein hai.',
        example: '7 - 5 = 0111 + (2s comp of 0101 = 1011) = 10010 → Discard 1 → 0010 (+2)'
      },
      {
        name: 'Octal Arithmetic Rules (Base 8)',
        formula: 'Addition: Sum ≥ 8 → Carry = 1, Digit = Sum - 8 | Subtraction: Borrow 1 = +8',
        explanation: 'Base 8 addition mein jab column sum 8 ya usse bada hota hai, toh 8 se divide karke quotient carry banta hai aur remainder digit. Subtraction mein borrow lene par +8 milta hai.',
        example: '7₈ + 5₈ = 14₈ (12₁₀ = 1×8 + 4)'
      },
      {
        name: 'Hexadecimal Arithmetic Rules (Base 16)',
        formula: 'Addition: Sum ≥ 16 → Carry = 1, Digit = Sum - 16 | Subtraction: Borrow 1 = +16',
        explanation: 'Base 16 mein letters A=10, B=11, C=12, D=13, E=14, F=15 hote hain. Sum ≥ 16 hone par remainder ko hex char likhte hain aur 1 carry aage jata hai. Subtraction mein borrow lene par +16 milta hai.',
        example: 'A₁₆ + B₁₆ = 15₁₆ (10 + 11 = 21₁₀ = 1×16 + 5)'
      }
    ]
  },
  {
    id: 'logic-gates',
    title: 'Logic Gates & Boolean Algebra Laws',
    description: 'Summary of logic gates, truth table relations, and boolean simplification laws.',
    items: [
      {
        name: 'AND Gate',
        formula: 'Y = A · B (A AND B)',
        explanation: 'Output sirf tab 1 hoga jab dono A aur B 1 honge. Baki sabhi cases mein 0.',
        example: '1·1=1, 1·0=0, 0·1=0, 0·0=0'
      },
      {
        name: 'OR Gate',
        formula: 'Y = A + B (A OR B)',
        explanation: 'Output 1 hoga agar koi bhi ek input 1 ho. Dono 0 hone par output 0 hoga.',
        example: '1+1=1, 1+0=1, 0+1=1, 0+0=0'
      },
      {
        name: 'NOT Gate',
        formula: 'Y = Ā (Inverter)',
        explanation: 'Input ko invert karta hai: 0 ka 1 aur 1 ka 0.',
        example: 'NOT(0) = 1, NOT(1) = 0'
      },
      {
        name: 'Universal Gates (NAND & NOR)',
        formula: 'NAND: Y = (A·B)̄ | NOR: Y = (A+B)̄',
        explanation: 'NAND aur NOR ko Universal gates kaha jata hai kyuki inki madad se koi bhi logic gate (AND, OR, NOT) banaya ja sakta hai.',
        example: 'NAND(1,1)=0, NOR(0,0)=1'
      },
      {
        name: 'XOR & XNOR Gates',
        formula: 'XOR: Y = A ⊕ B = ĀB + AB̄ | XNOR: Y = (A ⊕ B)̄ = AB + ĀB̄',
        explanation: 'XOR: Odd number of 1s par output 1 (different inputs). XNOR: Even number of 1s par output 1 (same inputs).',
        example: 'XOR(1,0)=1, XOR(1,1)=0'
      },
      {
        name: "De Morgan's Laws",
        formula: '(A + B)̄ = Ā · B̄   aur   (A · B)̄ = Ā + B̄',
        explanation: 'Break the line and change the sign. BCA exam mein har saal proof pucha jata hai!',
        example: 'Complement of sum = Product of complements'
      }
    ]
  },
  {
    id: 'c-format-specifiers',
    title: 'C Language Format Specifiers & Data Types',
    description: 'Complete memory sizes, ranges, and format specifiers used in printf and scanf.',
    items: [
      {
        name: 'int (Integer)',
        formula: '%d ya %i (Size: 4 bytes / 32 bits on modern GCC)',
        explanation: 'Range: -2,147,483,648 to +2,147,483,647. Whole numbers store karta hai.',
        example: 'int age = 19; printf("%d", age);'
      },
      {
        name: 'float (Single Precision)',
        formula: '%f (Size: 4 bytes)',
        explanation: 'Precision up to 6 decimal places. Decimals store karne ke liye.',
        example: 'float pi = 3.14159; printf("%.2f", pi);'
      },
      {
        name: 'double (Double Precision)',
        formula: '%lf (Size: 8 bytes)',
        explanation: 'Precision up to 15 decimal places. Badi scientific calculations ke liye.',
        example: 'double salary = 85000.75; printf("%lf", salary);'
      },
      {
        name: 'char (Character)',
        formula: '%c (Size: 1 byte / 8 bits)',
        explanation: 'Range: -128 to 127. Single character ya ASCII value store karta hai.',
        example: "char grade = 'A'; printf(\"%c\", grade);"
      },
      {
        name: 'char[] (String)',
        formula: '%s (Array of characters)',
        explanation: 'Null terminated string ("\\0" par end hoti hai). scanf mein & lagane ki zaroorat nahi hoti.',
        example: 'char name[50] = "Prince"; printf("%s", name);'
      },
      {
        name: 'Pointer Address',
        formula: '%p (Hexadecimal Memory Address)',
        explanation: 'Memory location ka address print karne ke liye.',
        example: 'int x = 10; printf("%p", &x);'
      }
    ]
  },
  {
    id: 'c-operator-precedence',
    title: 'C Operator Precedence Table (High to Low)',
    description: 'Evaluation order of operators in complex C expressions.',
    items: [
      {
        name: 'Level 1 (Highest)',
        formula: '() [] -> . ++ -- (postfix)',
        explanation: 'Parentheses aur postfix operators sabse pehle evaluate hote hain (Left to Right).',
        example: 'a + b * c mein pehle b*c hoga par (a + b) * c mein a+b pehle hoga'
      },
      {
        name: 'Level 2 (Unary)',
        formula: '++ -- + - ! ~ * & sizeof (type)',
        explanation: 'Unary operators Right to Left evaluate hote hain.',
        example: '!flag, ++i, &address, *ptr'
      },
      {
        name: 'Level 3 (Multiplicative)',
        formula: '* / %',
        explanation: 'Multiply, Divide aur Modulo. Left to Right.',
        example: '10 / 2 * 3 = 5 * 3 = 15'
      },
      {
        name: 'Level 4 (Additive)',
        formula: '+ -',
        explanation: 'Addition aur Subtraction. Left to Right.',
        example: '5 + 4 - 2 = 7'
      },
      {
        name: 'Level 5 (Relational)',
        formula: '< <= > >=',
        explanation: 'Comparison operators. Boolean result 1 ya 0 return karte hain.',
        example: 'a > 5 && b < 10'
      },
      {
        name: 'Level 6 (Equality)',
        formula: '== !=',
        explanation: 'Barabari check karne ke liye. (Note: = assignment hai, == comparison hai).',
        example: 'if (x == 10)'
      },
      {
        name: 'Level 7 (Logical AND / OR)',
        formula: '&& then ||',
        explanation: 'Short-circuit evaluation follow karta hai. Pehle && evaluate hota hai fir ||.',
        example: 'a && b || c'
      },
      {
        name: 'Level 8 (Lowest)',
        formula: '= += -= *= /= %= (Assignment)',
        explanation: 'Right to Left associativity. Variables mein value store karne ke liye.',
        example: 'a = b = 10 (b=10 first, then a=10)'
      }
    ]
  }
];
