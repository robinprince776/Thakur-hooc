import { CProgram } from '../types';

export const C_PROGRAMS: CProgram[] = [
  {
    id: 'hello-world',
    title: 'Hello World Program',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['basic', 'first program', 'printf', 'syntax'],
    description: 'The classic introductory program in C that prints "Hello, World!" to the console.',
    code: `#include <stdio.h>

int main() {
    // printf function screen par text print karta hai
    printf("Hello, World!\\n");
    return 0; // return 0 ka matlab program successfully run hua
}`,
    hinglishExplanation: 'printf() function standard output screen par text print karta hai. \\n newline character hai jo cursor ko agli line par le jata hai. return 0 operating system ko signal deta hai ki program smoothly execute ho gaya.',
    keyLogicPoints: [
      '#include <stdio.h> standard input-output header file include karta hai',
      'main() function program ka entry point hota hai',
      'printf text print karta hai aur return 0 success indicate karta hai'
    ],
    sampleInput: 'No input required',
    sampleOutput: 'Hello, World!',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'arithmetic-operations',
    title: 'Basic Arithmetic Operations (+, -, *, /, %)',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['arithmetic', 'operators', 'addition', 'division'],
    description: 'Takes two numbers from user and computes Addition, Subtraction, Multiplication, Division and Modulus.',
    code: `#include <stdio.h>

int main() {
    int a, b;
    printf("Do numbers enter karein: ");
    scanf("%d %d", &a, &b);

    printf("Addition (Sum): %d + %d = %d\\n", a, b, a + b);
    printf("Subtraction: %d - %d = %d\\n", a, b, a - b);
    printf("Multiplication: %d * %d = %d\\n", a, b, a * b);

    if (b != 0) {
        printf("Division (Quotient): %d / %d = %.2f\\n", a, b, (float)a / b);
        printf("Modulus (Remainder): %d %% %d = %d\\n", a, b, a % b);
    } else {
        printf("Division by zero possible nahi hai!\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'scanf user se do numbers input leta hai. Basic operators (+, -, *, /, %) calculations perform karte hain. Division mein accurate decimal result pane ke liye (float)a typecasting ki gayi hai aur zero division check lagaya gaya hai.',
    keyLogicPoints: [
      'scanf("%d %d", &a, &b) do integers user se read karta hai',
      '(float)a / b type casting se floating point division milta hai',
      '%% operator remainder (modulus) nikalta hai'
    ],
    sampleInput: '15 4',
    sampleOutput: 'Addition: 19\nSubtraction: 11\nMultiplication: 60\nDivision: 3.75\nModulus: 3',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'even-odd',
    title: 'Even or Odd Number Check',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['even', 'odd', 'modulus', 'if-else'],
    description: 'Determines whether a given integer is Even or Odd using the modulus operator (%).',
    code: `#include <stdio.h>

int main() {
    int num;
    printf("Ek integer number enter karein: ");
    scanf("%d", &num);

    // Agar number 2 se divide hone par remainder 0 de toh Even hai
    if (num % 2 == 0) {
        printf("%d ek EVEN number hai.\\n", num);
    } else {
        printf("%d ek ODD number hai.\\n", num);
    }

    return 0;
}`,
    hinglishExplanation: 'Modulus operator % number ko 2 se divide karke remainder nikalta hai. Agar remainder 0 hota hai, toh number even hai, varna number odd hai.',
    keyLogicPoints: [
      'num % 2 remainder deta hai',
      'if (num % 2 == 0) true hone par even print hoga',
      'else block odd ke liye execute hota hai'
    ],
    sampleInput: '17',
    sampleOutput: '17 ek ODD number hai.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'largest-of-three',
    title: 'Largest of Three Numbers',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['largest', 'maximum', 'nested if', 'logical AND'],
    description: 'Finds the greatest among three user-provided numbers using relational and logical operators.',
    code: `#include <stdio.h>

int main() {
    int n1, n2, n3;
    printf("Teen numbers enter karein: ");
    scanf("%d %d %d", &n1, &n2, &n3);

    if (n1 >= n2 && n1 >= n3) {
        printf("Sabse bada number hai: %d\\n", n1);
    } else if (n2 >= n1 && n2 >= n3) {
        printf("Sabse bada number hai: %d\\n", n2);
    } else {
        printf("Sabse bada number hai: %d\\n", n3);
    }

    return 0;
}`,
    hinglishExplanation: 'Logical AND (&&) ka use karke hum check karte hain ki pehla number baaki dono se bada ya barabar hai. Agar nahi, toh doosre number ko compare karte hain, varna teesra number sabse bada hota hai.',
    keyLogicPoints: [
      'n1 >= n2 && n1 >= n3 dono conditions true hone par n1 largest',
      'else-if chain sequential evaluation ensure karti hai'
    ],
    sampleInput: '45 89 23',
    sampleOutput: 'Sabse bada number hai: 89',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'leap-year',
    title: 'Leap Year Check',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['leap year', 'calendar', 'modulo', 'conditions'],
    description: 'Checks whether a given year is a Leap Year according to Gregorian calendar rules.',
    code: `#include <stdio.h>

int main() {
    int year;
    printf("Saal (Year) enter karein: ");
    scanf("%d", &year);

    // Leap year rule:
    // (4 se divide ho AND 100 se na ho) OR (400 se divide ho)
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        printf("%d ek LEAP YEAR hai.\\n", year);
    } else {
        printf("%d leap year NAHI hai.\\n", year);
    }

    return 0;
}`,
    hinglishExplanation: 'Leap year ka complete rule: Year ko 4 se divide hona chahiye aur 100 se divide nahi hona chahiye, PAR agar year 400 se divisible hai (centurial leap year jaise 2000), tab bhi leap year mana jayega.',
    keyLogicPoints: [
      'Century years (jaise 1900) 4 se divide hote hain par leap year nahi hote',
      '(year % 400 == 0) 400-year cycle ko handle karta hai'
    ],
    sampleInput: '2024',
    sampleOutput: '2024 ek LEAP YEAR hai.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'simple-calculator',
    title: 'Simple Calculator using switch-case',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['calculator', 'switch case', 'menu driven', 'arithmetic'],
    description: 'Implements an interactive menu-driven calculator using the switch-case control structure in C.',
    code: `#include <stdio.h>

int main() {
    char op;
    double a, b;

    printf("Operator enter karein (+, -, *, /): ");
    scanf(" %c", &op); // Notice leading space before %c to ignore newline
    printf("Do numbers enter karein: ");
    scanf("%lf %lf", &a, &b);

    switch (op) {
        case '+':
            printf("Result: %.2lf + %.2lf = %.2lf\\n", a, b, a + b);
            break;
        case '-':
            printf("Result: %.2lf - %.2lf = %.2lf\\n", a, b, a - b);
            break;
        case '*':
            printf("Result: %.2lf * %.2lf = %.2lf\\n", a, b, a * b);
            break;
        case '/':
            if (b != 0)
                printf("Result: %.2lf / %.2lf = %.2lf\\n", a, b, a / b);
            else
                printf("Error: Zero se division allowed nahi hai!\\n");
            break;
        default:
            printf("Galat operator chuna hai! Kripya +, -, * ya / dalein.\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'switch-case construct operator character ke hisab se exact calculation block execute karta hai. Har case ke baad break lagana zaroori hai taaki fallthrough na ho.',
    keyLogicPoints: [
      'scanf(" %c", &op) mein leading space newline buffer ko clear karta hai',
      'switch() variable ki value se case match karta hai',
      'break execution ko switch block se bahar nikalta hai'
    ],
    sampleInput: '+ then 24.5 15.5',
    sampleOutput: 'Result: 24.50 + 15.50 = 40.00',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'swap-with-temp',
    title: 'Swap Two Numbers (with temp variable)',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['swap', 'temporary variable', 'variables'],
    description: 'Swaps values of two variables using an auxiliary temporary third variable.',
    code: `#include <stdio.h>

int main() {
    int a, b, temp;
    printf("a aur b enter karein: ");
    scanf("%d %d", &a, &b);

    printf("Pehle: a = %d, b = %d\\n", a, b);

    // Third variable temp ka use karke swap:
    temp = a; // a ki value temp mein store ki
    a = b;    // b ki value a mein daali
    b = temp; // temp ki purani a value b mein daali

    printf("Swap ke baad: a = %d, b = %d\\n", a, b);
    return 0;
}`,
    hinglishExplanation: 'Jaise do glass ka paani badalne ke liye teesra khali glass chahiye hota hai, waise hi variable temp me pehle a ki value rakhte hain, fir a me b ki value, aur fir b me temp ki value daal dete hain.',
    keyLogicPoints: [
      'temp = a (backup store kiya)',
      'a = b (overwrite)',
      'b = temp (restored)'
    ],
    sampleInput: '10 20',
    sampleOutput: 'Swap ke baad: a = 20, b = 10',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'swap-without-temp',
    title: 'Swap Two Numbers (without third variable)',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['swap', 'arithmetic trick', 'xor swap', 'no temp'],
    description: 'Swaps two numbers in-place without using any third/temporary variable via addition-subtraction arithmetic.',
    code: `#include <stdio.h>

int main() {
    int a, b;
    printf("a aur b enter karein: ");
    scanf("%d %d", &a, &b);

    printf("Pehle: a = %d, b = %d\\n", a, b);

    // Bina teesre variable ke swap:
    a = a + b; // a mein dono ka total aa gaya
    b = a - b; // total mein se b ghataane par original a mila, jo b ban gaya
    a = a - b; // total mein se naya b (original a) ghataane par original b mila, jo a ban gaya

    printf("Swap ke baad: a = %d, b = %d\\n", a, b);
    return 0;
}`,
    hinglishExplanation: 'Yeh arithmetic trick hai: a me dono ka sum store karo (a = a + b). Fir b = a - b karne par b me original a aa jayega, aur a = a - b karne par a me original b aa jayega.',
    keyLogicPoints: [
      'a = a + b (sum)',
      'b = a - b (yields old a)',
      'a = a - b (yields old b)'
    ],
    sampleInput: '5 9',
    sampleOutput: 'Swap ke baad: a = 9, b = 5',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'prime-number',
    title: 'Prime Number Check',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['prime', 'divisibility', 'math', 'square root'],
    description: 'Checks whether a number is prime (has only two distinct factors: 1 and itself) with sqrt(n) efficiency.',
    code: `#include <stdio.h>

int main() {
    int n, isPrime = 1;
    printf("Positive integer enter karein: ");
    scanf("%d", &n);

    if (n <= 1) {
        isPrime = 0; // 0 aur 1 prime nahi hote
    } else {
        // 2 se lekar n/2 tak divide karke dekho
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = 0; // factor mil gaya, yaani prime nahi hai
                break;
            }
        }
    }

    if (isPrime) {
        printf("%d ek PRIME number hai!\\n", n);
    } else {
        printf("%d prime number NAHI hai.\\n", n);
    }

    return 0;
}`,
    hinglishExplanation: 'Prime number wo hota hai jo sirf 1 aur khud se divide ho. Optimization: kisi bhi number ka factor uske square root (i * i <= n) se bada hone par redundant ho jata hai. Agar koi divisor mila to turant break kar dete hain.',
    keyLogicPoints: [
      'n <= 1 prime nahi hote (2 sabse chhota aur akela even prime hai)',
      'Loop i*i <= n tak chalane se time complexity O(√n) ho jati hai',
      'break loop ko turant rok kar execution fast karta hai'
    ],
    sampleInput: '29',
    sampleOutput: '29 ek PRIME number hai!',
    timeComplexity: 'O(√n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'factorial-loop',
    title: 'Factorial of a Number (using Loop)',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['factorial', 'loop', 'math', 'n!'],
    description: 'Calculates n! = n × (n-1) × ... × 1 using an iterative for loop.',
    code: `#include <stdio.h>

int main() {
    int n;
    unsigned long long fact = 1;

    printf("Non-negative integer enter karein: ");
    scanf("%d", &n);

    if (n < 0) {
        printf("Negative numbers ka factorial exist nahi karta!\\n");
    } else {
        for (int i = 1; i <= n; i++) {
            fact *= i; // fact = fact * i
        }
        printf("%d ka Factorial (%d!) = %llu\\n", n, n, fact);
    }

    return 0;
}`,
    hinglishExplanation: 'Factorial 1 se lekar n tak sabhi integers ka product hota hai. Kyuki factorial bahut tezi se badhta hai, isliye unsigned long long data type (%llu) use kiya gaya hai taaki overflow na ho.',
    keyLogicPoints: [
      '0! hamesha 1 hota hai',
      'fact *= i har step par agla number multiply karta hai',
      'unsigned long long 20! tak handle kar sakta hai'
    ],
    sampleInput: '5',
    sampleOutput: '5 ka Factorial (5!) = 120',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'factorial-recursion',
    title: 'Factorial of a Number (using Recursion)',
    category: 'Recursion & Files',
    difficulty: 'Medium',
    tags: ['factorial', 'recursion', 'function', 'base case'],
    description: 'Computes factorial using a recursive function demonstrating base cases and recursive stack calls.',
    code: `#include <stdio.h>

// Recursive function definition
unsigned long long factorial(int n) {
    // Base case: jab n 0 ya 1 ho toh ruk jao
    if (n <= 1) {
        return 1;
    }
    // Recursive case: n * factorial(n - 1)
    return n * factorial(n - 1);
}

int main() {
    int num;
    printf("Number enter karein: ");
    scanf("%d", &num);

    if (num < 0) {
        printf("Negative number ka factorial nahi hota.\\n");
    } else {
        printf("%d ka Factorial (via Recursion) = %llu\\n", num, factorial(num));
    }

    return 0;
}`,
    hinglishExplanation: 'Recursion me function khud ko call karta hai. Base condition if (n <= 1) return 1 hai jo infinite loop ko rokti hai. Function call stack me 5 * fact(4) * fact(3)... bankar evaluate hota hai.',
    keyLogicPoints: [
      'Base Case: if (n <= 1) return 1',
      'Recursive Step: return n * factorial(n - 1)',
      'Stack frames call unwinding ke time multiply hote hain'
    ],
    sampleInput: '6',
    sampleOutput: '6 ka Factorial (via Recursion) = 720',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion stack'
  },
  {
    id: 'fibonacci-series',
    title: 'Fibonacci Series (First N terms)',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['fibonacci', 'series', 'sequence', 'loop'],
    description: 'Generates first N terms of the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21...',
    code: `#include <stdio.h>

int main() {
    int n;
    long long t1 = 0, t2 = 1, nextTerm;

    printf("Fibonacci series ke kitne terms chahiye? ");
    scanf("%d", &n);

    printf("Fibonacci Series (%d terms): ", n);

    for (int i = 1; i <= n; i++) {
        if (i == 1) {
            printf("%lld, ", t1);
            continue;
        }
        if (i == 2) {
            printf("%lld, ", t2);
            continue;
        }
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
        printf("%lld%s", nextTerm, (i == n ? "" : ", "));
    }
    printf("\\n");

    return 0;
}`,
    hinglishExplanation: 'Fibonacci series mein har agla term pichle do terms ka jod hota hai (0 + 1 = 1, 1 + 1 = 2, 1 + 2 = 3...). Loop mein nextTerm = t1 + t2 karne ke baad values shift ki jati hain (t1 = t2, t2 = nextTerm).',
    keyLogicPoints: [
      'Initial terms: t1 = 0, t2 = 1',
      'nextTerm = t1 + t2 calculate kiya',
      'Variables shift karke aage badhte hain'
    ],
    sampleInput: '8',
    sampleOutput: 'Fibonacci Series (8 terms): 0, 1, 1, 2, 3, 5, 8, 13',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number Check',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['palindrome', 'reverse', 'while loop', 'digits'],
    description: 'Verifies whether a number reads the same forwards and backwards (e.g. 121, 1331).',
    code: `#include <stdio.h>

int main() {
    int n, original, reversed = 0, remainder;
    printf("Number enter karein: ");
    scanf("%d", &n);

    original = n; // Original number ko save karke rakho

    // Digits reverse karne ka loop
    while (n > 0) {
        remainder = n % 10;                     // aakhiri digit nikalo
        reversed = reversed * 10 + remainder;  // reversed mein append karo
        n = n / 10;                             // aakhiri digit hatao
    }

    if (original == reversed) {
        printf("%d ek PALINDROME number hai!\\n", original);
    } else {
        printf("%d palindrome NAHI hai (Reversed = %d).\\n", original, reversed);
    }

    return 0;
}`,
    hinglishExplanation: 'Number ko ulta karke original number se compare kiya jata hai. reversed = reversed * 10 + remainder se number ka reverse banta hai. Agar original == reversed ho to palindrome hai.',
    keyLogicPoints: [
      'original = n backup store karna zaroori hai kyuki loop ke baad n = 0 ho jata hai',
      'n % 10 last digit deta hai',
      'n / 10 last digit remove karta hai'
    ],
    sampleInput: '1221',
    sampleOutput: '1221 ek PALINDROME number hai!',
    timeComplexity: 'O(log10 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'armstrong-number',
    title: 'Armstrong Number Check',
    category: 'Math & Numbers',
    difficulty: 'Medium',
    tags: ['armstrong', 'digits', 'power', 'math'],
    description: 'Checks if a number equals the sum of its own digits raised to the power of the number of digits (e.g. 153 = 1³ + 5³ + 3³).',
    code: `#include <stdio.h>
#include <math.h>

int main() {
    int num, originalNum, remainder, count = 0;
    double result = 0.0;

    printf("Integer number enter karein: ");
    scanf("%d", &num);

    originalNum = num;

    // Step 1: Total digits count karo
    int temp = num;
    while (temp != 0) {
        temp /= 10;
        count++;
    }

    // Step 2: Har digit ki power (count) nikal kar sum karo
    temp = num;
    while (temp != 0) {
        remainder = temp % 10;
        result += pow(remainder, count);
        temp /= 10;
    }

    // Step 3: Compare with original number
    if ((int)result == originalNum) {
        printf("%d ek ARMSTRONG number hai!\\n", originalNum);
    } else {
        printf("%d Armstrong number NAHI hai.\\n", originalNum);
    }

    return 0;
}`,
    hinglishExplanation: 'Armstrong number (jaise 153, 370, 371, 9474) wo number hota hai jisme har digit ki power (total digits count) ka sum usi number ke barabar hota hai: 1³ + 5³ + 3³ = 1 + 125 + 27 = 153.',
    keyLogicPoints: [
      'Pehle number of digits count kiye',
      'pow(remainder, count) se power add kiya',
      'Final sum ko original number se compare kiya'
    ],
    sampleInput: '153',
    sampleOutput: '153 ek ARMSTRONG number hai!',
    timeComplexity: 'O(log10 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sum-of-digits',
    title: 'Sum of Digits of a Number',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['sum of digits', 'while loop', 'modulo'],
    description: 'Extracts every single digit of a number and computes their total sum.',
    code: `#include <stdio.h>

int main() {
    int n, temp, sum = 0, rem;
    printf("Number enter karein: ");
    scanf("%d", &n);

    temp = n;
    while (temp > 0) {
        rem = temp % 10;  // last digit
        sum += rem;       // sum mein add kiya
        temp /= 10;       // digit drop kiya
    }

    printf("%d ke digits ka sum = %d\\n", n, sum);
    return 0;
}`,
    hinglishExplanation: 'Modulo 10 (% 10) se aakhiri digit milta hai, use sum variable me add karte hain, fir temp /= 10 se aakhiri digit cut kar dete hain. Yeh tab tak chalta hai jab tak number 0 na ho jaye.',
    keyLogicPoints: [
      'rem = temp % 10 se right-most digit extract hota hai',
      'sum += rem accumulator me judta hai',
      'temp /= 10 right shift karta hai'
    ],
    sampleInput: '987',
    sampleOutput: '987 ke digits ka sum = 24',
    timeComplexity: 'O(log10 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'reverse-number',
    title: 'Reverse a Number',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['reverse', 'number', 'while loop'],
    description: 'Inverts the digits order of an integer (e.g. 12345 becomes 54321).',
    code: `#include <stdio.h>

int main() {
    int n, reversed = 0;
    printf("Number enter karein: ");
    scanf("%d", &n);

    int temp = n;
    while (temp != 0) {
        int rem = temp % 10;
        reversed = reversed * 10 + rem;
        temp /= 10;
    }

    printf("%d ka reverse = %d\\n", n, reversed);
    return 0;
}`,
    hinglishExplanation: 'reversed = reversed * 10 + rem logic se digits reverse order me judte jate hain (jaise 5 -> 54 -> 543 -> 5432).',
    keyLogicPoints: [
      'Multiply by 10 positional shift karta hai',
      'Negative numbers ke case mein sign preserve hota hai'
    ],
    sampleInput: '4567',
    sampleOutput: '4567 ka reverse = 7654',
    timeComplexity: 'O(log10 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'gcd-lcm',
    title: 'GCD and LCM of Two Numbers',
    category: 'Math & Numbers',
    difficulty: 'Medium',
    tags: ['gcd', 'hcf', 'lcm', 'euclidean algorithm'],
    description: 'Finds Greatest Common Divisor (GCD/HCF) using Euclidean algorithm and LCM using formula (a × b) / GCD.',
    code: `#include <stdio.h>

// Euclidean algorithm se GCD nikalne ka function
int findGCD(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int num1, num2;
    printf("Do positive numbers enter karein: ");
    scanf("%d %d", &num1, &num2);

    int gcd = findGCD(num1, num2);
    // LCM formula: (num1 * num2) / GCD
    long long lcm = ((long long)num1 * num2) / gcd;

    printf("Numbers: %d aur %d\\n", num1, num2);
    printf("GCD (HCF) = %d\\n", gcd);
    printf("LCM = %lld\\n", lcm);

    return 0;
}`,
    hinglishExplanation: 'Euclid method se remainder zero aane tak a % b nikalte hain, jisse fastest tarike se GCD milta hai. Formula: LCM × GCD = Product of two numbers, isliye LCM = (a × b) / GCD.',
    keyLogicPoints: [
      'Euclidean algorithm O(log(min(a,b))) complexity deta hai',
      'LCM nikalte waqt overflow bachane ke liye (long long) cast kiya'
    ],
    sampleInput: '24 36',
    sampleOutput: 'GCD (HCF) = 12\nLCM = 72',
    timeComplexity: 'O(log(min(a,b)))',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'multiplication-table',
    title: 'Multiplication Table of a Number',
    category: 'Loops & Patterns',
    difficulty: 'Easy',
    tags: ['table', 'loop', 'pahada', 'math'],
    description: 'Prints the complete multiplication table of any integer up to 10.',
    code: `#include <stdio.h>

int main() {
    int n;
    printf("Kis number ka table chahiye? ");
    scanf("%d", &n);

    printf("--- Table of %d ---\\n", n);
    for (int i = 1; i <= 10; i++) {
        printf("%d x %2d = %d\\n", n, i, n * i);
    }

    return 0;
}`,
    hinglishExplanation: 'for loop i ko 1 se 10 tak chalata hai, aur har iteration me n * i print karta hai. %2d spacing formatting ke liye use kiya hai taaki output neatly aligned dikhe.',
    keyLogicPoints: ['for (int i = 1; i <= 10; i++) loop 10 baar iterate hota hai'],
    sampleInput: '7',
    sampleOutput: '7 x  1 = 7\n7 x  2 = 14\n...\n7 x 10 = 70',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'star-right-triangle',
    title: 'Star Pattern - Right Triangle',
    category: 'Loops & Patterns',
    difficulty: 'Easy',
    tags: ['pattern', 'star', 'nested loop', 'triangle'],
    description: 'Prints a classic right-angled triangle star pattern using nested for loops.',
    code: `#include <stdio.h>

int main() {
    int rows;
    printf("Kitne rows chahiye? ");
    scanf("%d", &rows);

    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n"); // nayi line par jao
    }

    return 0;
}`,
    hinglishExplanation: 'Bahar wala loop i rows control karta hai (1 se n). Andar wala loop j har row me utne stars print karta hai jitna i ka number hai.',
    keyLogicPoints: [
      'Outer loop: rows count',
      'Inner loop: stars per row (j <= i)'
    ],
    sampleInput: '5',
    sampleOutput: '* \n* * \n* * * \n* * * * \n* * * * * ',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'star-pyramid',
    title: 'Star Pattern - Equilateral Full Pyramid',
    category: 'Loops & Patterns',
    difficulty: 'Medium',
    tags: ['pattern', 'pyramid', 'spaces', 'nested loop'],
    description: 'Prints an equilateral centered pyramid of stars with spaces alignment.',
    code: `#include <stdio.h>

int main() {
    int rows;
    printf("Pyramid rows enter karein: ");
    scanf("%d", &rows);

    for (int i = 1; i <= rows; i++) {
        // Step 1: Leading spaces print karo
        for (int space = 1; space <= rows - i; space++) {
            printf(" ");
        }
        // Step 2: Stars print karo (2*i - 1 stars)
        for (int j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Pyramid banane ke liye har line me pehle (rows - i) spaces print karte hain, fir (2 * i - 1) stars print karte hain taaki triangle centered dikhe.',
    keyLogicPoints: [
      'Spaces count = rows - i',
      'Stars count = 2*i - 1 (odd number progression 1, 3, 5, 7...)'
    ],
    sampleInput: '4',
    sampleOutput: '   *\n  ***\n *****\n*******',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'star-diamond',
    title: 'Star Pattern - Diamond Pattern',
    category: 'Loops & Patterns',
    difficulty: 'Medium',
    tags: ['diamond', 'pattern', 'stars', 'symmetric'],
    description: 'Generates a full symmetrical diamond pattern of stars combining an upright and inverted pyramid.',
    code: `#include <stdio.h>

int main() {
    int n;
    printf("Diamond half-rows enter karein (e.g. 5): ");
    scanf("%d", &n);

    // Upper half pyramid
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= n - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\\n");
    }

    // Lower half inverted pyramid
    for (int i = n - 1; i >= 1; i--) {
        for (int s = 1; s <= n - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Diamond do hisso me banta hai: Pehle upper normal pyramid print karte hain, fir lower inverted pyramid (i = n-1 se lekar 1 tak) print karte hain.',
    keyLogicPoints: [
      'Upper pyramid: 1 to n',
      'Lower inverted pyramid: n-1 down to 1'
    ],
    sampleInput: '3',
    sampleOutput: '  *\n ***\n*****\n ***\n  *',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'floyds-triangle',
    title: "Floyd's Triangle Pattern",
    category: 'Loops & Patterns',
    difficulty: 'Easy',
    tags: ['floyd', 'number pattern', 'counter'],
    description: 'Prints consecutive natural numbers in a right-angled triangular format.',
    code: `#include <stdio.h>

int main() {
    int rows, count = 1;
    printf("Kitne rows chahiye? ");
    scanf("%d", &rows);

    printf("--- Floyd's Triangle ---\\n");
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%-4d", count);
            count++;
        }
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: "Floyd's Triangle me ek continuous counter (count = 1) chalta hai jo har row me 1 se badhta jata hai. %-4d se output column formatted dikhta hai.",
    keyLogicPoints: [
      'count variable reset nahi hota, continuously increment hota hai',
      'Row i me total i numbers print hote hain'
    ],
    sampleInput: '4',
    sampleOutput: '1   \n2   3   \n4   5   6   \n7   8   9   10',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort Algorithm',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    tags: ['sorting', 'bubble sort', 'array', 'swap'],
    description: 'Sorts an array in ascending order by repeatedly stepping through the list and swapping adjacent elements out of order.',
    code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0; // optimization flag
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap adjacent elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        // Agar koi swap nahi hua toh array already sorted hai
        if (!swapped) break;
    }
}

int main() {
    int n;
    printf("Array size enter karein: ");
    scanf("%d", &n);

    int arr[n];
    printf("%d elements enter karein: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    bubbleSort(arr, n);

    printf("Sorted Array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    return 0;
}`,
    hinglishExplanation: 'Bubble sort paas-paas wale (adjacent) do elements ko compare karta hai. Agar pehla doosre se bada hai to unhe swap kar deta hai. Har pass ke baad sabse bada element aakhiri position (bubble hokar) par pahunch jata hai.',
    keyLogicPoints: [
      'Outer loop n-1 passes run karta hai',
      'Inner loop n-i-1 elements compare karta hai',
      'swapped flag se best case time complexity O(n) ho jati hai'
    ],
    sampleInput: '5 then 64 34 25 12 22',
    sampleOutput: 'Sorted Array: 12 22 25 34 64',
    timeComplexity: 'Worst: O(n²), Best: O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort Algorithm',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    tags: ['sorting', 'selection sort', 'min element', 'array'],
    description: 'Sorts an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.',
    code: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i; // assume karo current element sabse chhota hai
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j; // naya minimum index mila
            }
        }
        // Chhote element ko current position par swap karo
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

int main() {
    int arr[] = {29, 10, 14, 37, 13};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original Array: 29 10 14 37 13\\n");
    selectionSort(arr, n);

    printf("Selection Sorted Array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    return 0;
}`,
    hinglishExplanation: 'Selection sort me har round me unsorted hisse ka sabse chhota (minimum) element dhundha jata hai aur use aage wale position par swap kar diya jata hai.',
    keyLogicPoints: [
      'minIdx track karta hai smallest element ka index',
      'Total n-1 swaps hote hain',
      'Unsorted array se minimum select karke sorted array me place karte hain'
    ],
    sampleInput: '29 10 14 37 13',
    sampleOutput: 'Selection Sorted Array: 10 13 14 29 37',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort Algorithm',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    tags: ['sorting', 'insertion sort', 'cards sorting', 'inplace'],
    description: 'Builds the final sorted array one item at a time, like sorting playing cards in hand.',
    code: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // Elements jo key se bade hain unhe ek position right shift karo
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key; // sahi jagah par key insert karo
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

    insertionSort(arr, n);

    printf("Insertion Sorted Array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    return 0;
}`,
    hinglishExplanation: 'Insertion sort bilkul taash (cards) ki tarah kaam karta hai. Ek-ek element (key) uthaate hain aur pichle sorted elements me uski sahi jagah dhundh kar insert kar dete hain.',
    keyLogicPoints: [
      'key = arr[i] ko temporary store karte hain',
      'while loop elements ko right shift karta hai',
      'arr[j + 1] = key correct slot fill karta hai'
    ],
    sampleInput: '12 11 13 5 6',
    sampleOutput: 'Insertion Sorted Array: 5 6 11 12 13',
    timeComplexity: 'Worst: O(n²), Best: O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linear-search',
    title: 'Linear Search in Array',
    category: 'Sorting & Searching',
    difficulty: 'Easy',
    tags: ['search', 'linear search', 'array', 'traversal'],
    description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
    code: `#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // index mil gaya
        }
    }
    return -1; // nahi mila
}

int main() {
    int arr[] = {10, 50, 30, 70, 80, 20};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target;

    printf("Search karne ke liye element enter karein: ");
    scanf("%d", &target);

    int result = linearSearch(arr, n, target);

    if (result != -1) {
        printf("Element %d index %d par mil gaya (Position: %d).\\n", target, result, result + 1);
    } else {
        printf("Element %d array mein nahi mila.\\n", target);
    }

    return 0;
}`,
    hinglishExplanation: 'Linear search array ke pehle element se shuru karta hai aur aakhiri tak ek-ek karke check karta hai. Jaise hi element match hota hai, uska index return kar deta hai.',
    keyLogicPoints: [
      'Single loop se traversal',
      'Array sorted hona zaroori nahi hai',
      'Match na milne par -1 return hota hai'
    ],
    sampleInput: '70',
    sampleOutput: 'Element 70 index 3 par mil gaya (Position: 4).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'binary-search',
    title: 'Binary Search Algorithm (Iterative)',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    tags: ['binary search', 'search', 'sorted array', 'divide and conquer'],
    description: 'Search an element in a sorted array by repeatedly dividing the search interval in half.',
    code: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2; // overflow safe midpoint

        if (arr[mid] == target) {
            return mid; // Element mil gaya
        } else if (arr[mid] < target) {
            low = mid + 1; // Target right half mein hai
        } else {
            high = mid - 1; // Target left half mein hai
        }
    }

    return -1; // Element array mein nahi hai
}

int main() {
    // Binary search ke liye array hamesha SORTED hona chahiye!
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int key;

    printf("Sorted Array: 2, 5, 8, 12, 16, 23, 38, 56, 72, 91\\n");
    printf("Dhundhne wala number dalein: ");
    scanf("%d", &key);

    int idx = binarySearch(arr, n, key);

    if (idx != -1) {
        printf("Number %d index %d par paya gaya!\\n", key, idx);
    } else {
        printf("Number %d array mein maujood nahi hai.\\n", key);
    }

    return 0;
}`,
    hinglishExplanation: 'Binary search sirf SORTED array par kaam karta hai. Yeh array ko beech (mid) se divide karta hai. Agar key mid se badi hai toh right half dekhte hain, chhoti hai toh left half. Har step par search space aadhi ho jati hai.',
    keyLogicPoints: [
      'Prerequisite: Array must be sorted',
      'mid = low + (high - low) / 2 integer overflow rokta hai',
      'Logarithmic time complexity O(log n)'
    ],
    sampleInput: '23',
    sampleOutput: 'Number 23 index 5 par paya gaya!',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'matrix-addition',
    title: 'Matrix Addition (2D Arrays)',
    category: 'Arrays',
    difficulty: 'Medium',
    tags: ['matrix', '2D array', 'addition', 'nested loops'],
    description: 'Adds two matrices of dimensions R × C element-wise using 2D arrays.',
    code: `#include <stdio.h>

int main() {
    int r, c;
    printf("Rows aur Columns enter karein (e.g. 2 2): ");
    scanf("%d %d", &r, &c);

    int a[r][c], b[r][c], sum[r][c];

    printf("Pehle Matrix ke elements dalein:\\n");
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            scanf("%d", &a[i][j]);
        }
    }

    printf("Dusre Matrix ke elements dalein:\\n");
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            scanf("%d", &b[i][j]);
        }
    }

    // Matrix addition: sum[i][j] = a[i][j] + b[i][j]
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            sum[i][j] = a[i][j] + b[i][j];
        }
    }

    printf("Dono Matrices ka Sum:\\n");
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            printf("%d\\t", sum[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Do matrices ko add karne ke liye unka order (rows aur columns) barabar hona chahiye. Nested loops i aur j chala kar har corresponding position sum[i][j] = a[i][j] + b[i][j] calculate ki jati hai.',
    keyLogicPoints: [
      '2D arrays a[r][c] rows aur columns represent karte hain',
      'Corresponding cell-by-cell addition',
      'Nested loops se row-wise traversal'
    ],
    sampleInput: '2 2 then (1 2, 3 4) and (5 6, 7 8)',
    sampleOutput: '6\t8\n10\t12',
    timeComplexity: 'O(r × c)',
    spaceComplexity: 'O(r × c)'
  },
  {
    id: 'matrix-multiplication',
    title: 'Matrix Multiplication (2D Arrays)',
    category: 'Arrays',
    difficulty: 'Hard',
    tags: ['matrix', 'multiplication', 'dot product', 'triple loop'],
    description: 'Multiplies two matrices A (m×k) and B (k×n) to produce C (m×n).',
    code: `#include <stdio.h>

int main() {
    int r1, c1, r2, c2;

    printf("Matrix 1 ki rows aur columns: ");
    scanf("%d %d", &r1, &c1);
    printf("Matrix 2 ki rows aur columns: ");
    scanf("%d %d", &r2, &c2);

    // Multiplication rule: c1 == r2 hona zaroori hai
    if (c1 != r2) {
        printf("Matrix multiplication possible nahi hai! (c1 != r2)\\n");
        return 1;
    }

    int a[r1][c1], b[r2][c2], res[r1][c2];

    printf("Matrix 1 elements dalein:\\n");
    for (int i = 0; i < r1; i++)
        for (int j = 0; j < c1; j++)
            scanf("%d", &a[i][j]);

    printf("Matrix 2 elements dalein:\\n");
    for (int i = 0; i < r2; i++)
        for (int j = 0; j < c2; j++)
            scanf("%d", &b[i][j]);

    // Multiply: 3 nested loops
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            res[i][j] = 0;
            for (int k = 0; k < c1; k++) {
                res[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    printf("Multiplied Result Matrix:\\n");
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            printf("%d\\t", res[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Matrix multiplication ke liye pehle matrix ke columns doosre matrix ke rows ke barabar hone chahiye. Teesri loop k row 1 aur column 2 ke elements ka dot product calculate karti hai: res[i][j] += a[i][k] * b[k][j].',
    keyLogicPoints: [
      'Condition check: c1 == r2',
      'Result matrix size: r1 × c2',
      '3 Nested loops: O(r1 × c2 × c1)'
    ],
    sampleInput: '2 2, 2 2 then (1 2, 3 4) and (2 0, 1 2)',
    sampleOutput: '4\t4\n10\t8',
    timeComplexity: 'O(r1 × c1 × c2)',
    spaceComplexity: 'O(r1 × c2)'
  },
  {
    id: 'matrix-transpose',
    title: 'Transpose of a Matrix',
    category: 'Arrays',
    difficulty: 'Medium',
    tags: ['matrix', 'transpose', 'swap rows columns'],
    description: 'Swaps rows and columns of a matrix such that element at [i][j] moves to [j][i].',
    code: `#include <stdio.h>

int main() {
    int r, c;
    printf("Rows aur Columns dalein: ");
    scanf("%d %d", &r, &c);

    int a[r][c], trans[c][r];

    printf("Matrix ke elements dalein:\\n");
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            scanf("%d", &a[i][j]);
        }
    }

    // Transpose: rows ko columns aur columns ko rows banao
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            trans[j][i] = a[i][j];
        }
    }

    printf("Transpose Matrix (%d x %d):\\n", c, r);
    for (int i = 0; i < c; i++) {
        for (int j = 0; j < r; j++) {
            printf("%d\\t", trans[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Transpose ka matlab hota hai matrix ki rows ko columns me badalna.trans[j][i] = a[i][j] assignment se rows aur columns aasani se interchange ho jate hain.',
    keyLogicPoints: ['trans[j][i] = a[i][j]', 'Dimensions r×c se c×r ho jate hain'],
    sampleInput: '2 3 then (1 2 3, 4 5 6)',
    sampleOutput: '1\t4\n2\t5\n3\t6',
    timeComplexity: 'O(r × c)',
    spaceComplexity: 'O(r × c)'
  },
  {
    id: 'second-largest-array',
    title: 'Second Largest Element in Array',
    category: 'Arrays',
    difficulty: 'Medium',
    tags: ['second largest', 'array', 'single pass'],
    description: 'Finds the second greatest value in an array in a single O(n) pass without sorting.',
    code: `#include <stdio.h>
#include <limits.h>

int main() {
    int n;
    printf("Array size (kam se kam 2): ");
    scanf("%d", &n);

    if (n < 2) {
        printf("Second largest ke liye kam se kam 2 elements chahiye.\\n");
        return 1;
    }

    int arr[n];
    printf("%d elements dalein: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int first = INT_MIN, second = INT_MIN;

    for (int i = 0; i < n; i++) {
        if (arr[i] > first) {
            second = first; // purana largest ab second largest ban gaya
            first = arr[i]; // naya sabse bada element
        } else if (arr[i] > second && arr[i] != first) {
            second = arr[i];
        }
    }

    if (second == INT_MIN) {
        printf("Array mein sabhi elements barabar hain, koi second largest nahi mila.\\n");
    } else {
        printf("Sabse bada (First Largest) = %d\\n", first);
        printf("Dusra sabse bada (Second Largest) = %d\\n", second);
    }

    return 0;
}`,
    hinglishExplanation: 'Single loop me first aur second largest track kiya. Jab koi element first se bada hota hai toh purana first second ban jata hai, aur naya element first ban jata hai.',
    keyLogicPoints: [
      'Single pass O(n) approach (no sorting required)',
      'Duplicate elements check: arr[i] != first'
    ],
    sampleInput: '5 then 12 35 1 10 34',
    sampleOutput: 'First Largest = 35\nSecond Largest = 34',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'string-length-no-strlen',
    title: 'String Length without strlen()',
    category: 'Strings',
    difficulty: 'Easy',
    tags: ['string length', 'null character', 'while loop', 'no library'],
    description: 'Calculates the length of a string manually by iterating until the null terminator character "\\0".',
    code: `#include <stdio.h>

int main() {
    char str[100];
    int length = 0;

    printf("Ek string enter karein: ");
    scanf("%99[^\\n]", str); // Space ke sath poori line read karne ke liye

    // '\\0' (null character) aane tak count badhate raho
    while (str[length] != '\\0') {
        length++;
    }

    printf("String: \\"%s\\"\\n", str);
    printf("Total Length = %d characters\\n", length);

    return 0;
}`,
    hinglishExplanation: 'C language me har string ke aakhiri me ek special null character "\\0" hota hai. Jab tak loop str[length] != "\\0" check karta hai, hum count ko 1-1 badhate jate hain.',
    keyLogicPoints: [
      'String termination character "\\0" (ASCII 0)',
      'scanf("%[^\\n]") spaces ko bhi preserve karta hai'
    ],
    sampleInput: 'BCA Semester 1',
    sampleOutput: 'Total Length = 14 characters',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'vowel-consonant-count',
    title: 'Count Vowels and Consonants in String',
    category: 'Strings',
    difficulty: 'Easy',
    tags: ['vowels', 'consonants', 'string', 'character check'],
    description: 'Traverses a string and counts total vowels, consonants, spaces, and digits.',
    code: `#include <stdio.h>
#include <ctype.h>

int main() {
    char str[200];
    int vowels = 0, consonants = 0, digits = 0, spaces = 0;

    printf("Sentence enter karein: ");
    scanf("%199[^\\n]", str);

    for (int i = 0; str[i] != '\\0'; i++) {
        char ch = tolower(str[i]); // case insensitive banaya

        if (ch >= 'a' && ch <= 'z') {
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                vowels++;
            } else {
                consonants++;
            }
        } else if (ch >= '0' && ch <= '9') {
            digits++;
        } else if (ch == ' ') {
            spaces++;
        }
    }

    printf("--- Analysis Results ---\\n");
    printf("Vowels: %d\\n", vowels);
    printf("Consonants: %d\\n", consonants);
    printf("Digits: %d\\n", digits);
    printf("Spaces: %d\\n", spaces);

    return 0;
}`,
    hinglishExplanation: 'tolower() se pehle character ko lowercase banaya, fir check kiya ki kya ch vowel (a, e, i, o, u) hai ya consonant. Saath hi digits aur spaces ko bhi count kiya.',
    keyLogicPoints: [
      'tolower() function lowercase conversion ke liye',
      'ch >= "a" && ch <= "z" alphabetic boundaries check karta hai'
    ],
    sampleInput: 'Prince Thakur BCA 2026',
    sampleOutput: 'Vowels: 6\nConsonants: 11\nDigits: 4\nSpaces: 3',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'palindrome-string',
    title: 'Palindrome String Check',
    category: 'Strings',
    difficulty: 'Easy',
    tags: ['palindrome', 'string', 'two pointers'],
    description: 'Checks if a string reads the same forwards and backwards using two pointer technique.',
    code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    int isPalindrome = 1;

    printf("String enter karein: ");
    scanf("%s", str);

    int left = 0;
    int right = strlen(str) - 1;

    // Two pointers: ek shuru se, ek aakhiri se
    while (left < right) {
        if (str[left] != str[right]) {
            isPalindrome = 0; // mismatch ho gaya
            break;
        }
        left++;
        right--;
    }

    if (isPalindrome) {
        printf("\\"%s\\" ek PALINDROME string hai!\\n", str);
    } else {
        printf("\\"%s\\" palindrome NAHI hai.\\n", str);
    }

    return 0;
}`,
    hinglishExplanation: 'Two-pointer approach: left pointer pehle character par aur right pointer aakhiri par hota hai. Dono characters compare karte hue beech ki taraf aate hain. Agar kahin bhi mismatch mila toh palindrome nahi hai.',
    keyLogicPoints: [
      'left = 0, right = length - 1',
      'while (left < right) compare and move inwards',
      'No extra memory space needed'
    ],
    sampleInput: 'madam',
    sampleOutput: '"madam" ek PALINDROME string hai!',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'reverse-string-no-strrev',
    title: 'Reverse a String without strrev()',
    category: 'Strings',
    difficulty: 'Medium',
    tags: ['reverse string', 'no library', 'in place swap'],
    description: 'Reverses a character array in-place without using non-standard strrev() function.',
    code: `#include <stdio.h>
#include <string.h>

void reverseString(char str[]) {
    int i = 0;
    int j = strlen(str) - 1;

    while (i < j) {
        // Swap characters at i and j
        char temp = str[i];
        str[i] = str[j];
        str[j] = temp;
        i++;
        j--;
    }
}

int main() {
    char str[100];
    printf("String enter karein: ");
    scanf("%99[^\\n]", str);

    printf("Original String: %s\\n", str);
    reverseString(str);
    printf("Reversed String: %s\\n", str);

    return 0;
}`,
    hinglishExplanation: 'strrev() C standard library ka part nahi hota (GCC compiler me error deta hai). Isliye two pointer in-place swapping se string ko reverse karna standard BCA pattern hai.',
    keyLogicPoints: [
      'In-place character swap temp variable ke saath',
      'GCC standard compliant (works on all platforms)'
    ],
    sampleInput: 'Computer Science',
    sampleOutput: 'Reversed String: ecneicS retupmoC',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'string-copy-no-strcpy',
    title: 'Copy String without strcpy()',
    category: 'Strings',
    difficulty: 'Easy',
    tags: ['copy string', 'manual copy', 'null terminator'],
    description: 'Copies contents of one string into another string manually character-by-character.',
    code: `#include <stdio.h>

int main() {
    char source[100], destination[100];
    int i = 0;

    printf("Source string dalein: ");
    scanf("%99[^\\n]", source);

    // Character by character copy
    while (source[i] != '\\0') {
        destination[i] = source[i];
        i++;
    }
    destination[i] = '\\0'; // null terminator lagana na bhoolein!

    printf("Copied Destination String: %s\\n", destination);
    return 0;
}`,
    hinglishExplanation: 'Loop source string ke har character ko destination array me assign karta hai. Loop khatam hone par destination[i] = "\\0" lagana bahut zaroori hota hai taaki garbage print na ho.',
    keyLogicPoints: [
      'destination[i] = source[i]',
      'destination[i] = "\\0" ensures proper string termination'
    ],
    sampleInput: 'BCA Logic Solver',
    sampleOutput: 'Copied Destination String: BCA Logic Solver',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'student-structure',
    title: 'Student Record using Structure',
    category: 'Pointers & Structures',
    difficulty: 'Medium',
    tags: ['structure', 'struct', 'student record', 'user defined type'],
    description: 'Defines a struct Student to store Roll No, Name, and Marks, and displays student details.',
    code: `#include <stdio.h>

// Student structure define kiya
struct Student {
    int rollNo;
    char name[50];
    float marks;
};

int main() {
    struct Student s;

    printf("Student ka Roll No dalein: ");
    scanf("%d", &s.rollNo);

    printf("Student ka Name dalein: ");
    scanf(" %49[^\\n]", s.name);

    printf("Marks dalein: ");
    scanf("%f", &s.marks);

    printf("\\n--- Student Details ---\\n");
    printf("Roll Number: %d\\n", s.rollNo);
    printf("Name       : %s\\n", s.name);
    printf("Marks      : %.2f\\n", s.marks);

    if (s.marks >= 40.0) {
        printf("Result     : PASSED\\n");
    } else {
        printf("Result     : FAILED\\n");
    }

    return 0;
}`,
    hinglishExplanation: 'Structure alag-alag data types (int, char array, float) ko ek single unit me group karne ki suvidha deta hai. Dot operator (.) se structure ke members ko access kiya jata hai jaise s.rollNo, s.name.',
    keyLogicPoints: [
      'struct keyword se custom composite data type banta hai',
      'Dot (.) operator member variables access karta hai',
      'Memory contiguous allocate hoti hai'
    ],
    sampleInput: '101 then Prince Thakur then 92.5',
    sampleOutput: 'Roll Number: 101\nName: Prince Thakur\nMarks: 92.50\nResult: PASSED',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'swap-pointers-call-by-ref',
    title: 'Swap Two Numbers using Pointers (Call by Reference)',
    category: 'Pointers & Structures',
    difficulty: 'Medium',
    tags: ['pointers', 'call by reference', 'address-of', 'dereference'],
    description: 'Swaps values of two variables in another function using memory address pointers.',
    code: `#include <stdio.h>

// Pointers (*x aur *y) parameters hain
void swap(int *x, int *y) {
    int temp = *x; // *x ka matlab address par rakhi value
    *x = *y;
    *y = temp;
}

int main() {
    int a, b;
    printf("a aur b enter karein: ");
    scanf("%d %d", &a, &b);

    printf("Call se pehle: a = %d, b = %d\\n", a, b);

    // Addresses pass kiye (&a, &b)
    swap(&a, &b);

    printf("Call ke baad (Swapped): a = %d, b = %d\\n", a, b);
    return 0;
}`,
    hinglishExplanation: 'C me function call by value hota hai, isliye agar function ke andar original variables ki value change karni ho to memory addresses (&a, &b) pass karte hain. Function ke andar dereference operator (*) actual memory me jakar value swap kar deta hai.',
    keyLogicPoints: [
      '& operator variable ka memory address deta hai',
      '* pointer us address par rakhi value ko refer karta hai',
      'Call by reference original variables ko modify karta hai'
    ],
    sampleInput: '15 30',
    sampleOutput: 'Call ke baad (Swapped): a = 30, b = 15',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'dynamic-memory-malloc',
    title: 'Dynamic Memory Allocation (malloc and free)',
    category: 'Pointers & Structures',
    difficulty: 'Medium',
    tags: ['malloc', 'free', 'dynamic memory', 'heap'],
    description: 'Allocates memory dynamically at runtime using malloc() and deallocates it using free().',
    code: `#include <stdio.h>
#include <stdlib.h> // malloc aur free ke liye zaroori

int main() {
    int n;
    printf("Array mein kitne elements store karne hain? ");
    scanf("%d", &n);

    // Heap memory allocate ki
    int *arr = (int *)malloc(n * sizeof(int));

    // Check agar memory allocation fail ho gaya ho
    if (arr == NULL) {
        printf("Memory allocation fail ho gaya!\\n");
        return 1;
    }

    printf("%d elements enter karein:\\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }

    printf("Dynamic Array Elements ka Sum = %d\\n", sum);

    // Memory free karna zaroori hai memory leak se bachne ke liye
    free(arr);
    arr = NULL;
    printf("Memory successfully free kar di gayi.\\n");

    return 0;
}`,
    hinglishExplanation: 'Runtime par user ki zaroorat ke hisab se memory allocate karne ke liye malloc() use hota hai (Heap area me). Kaam poora hone ke baad free(arr) call karke memory release ki jati hai taaki memory leak na ho.',
    keyLogicPoints: [
      'malloc(n * sizeof(int)) bytes allocate karta hai',
      'NULL check lagana standard safety practice hai',
      'free() memory return karta hai'
    ],
    sampleInput: '4 then 10 20 30 40',
    sampleOutput: 'Dynamic Array Elements ka Sum = 100\nMemory successfully free kar di gayi.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'file-handling-write-read',
    title: 'File Handling: Write and Read from a File',
    category: 'Recursion & Files',
    difficulty: 'Hard',
    tags: ['file handling', 'fopen', 'fprintf', 'fgets', 'fclose'],
    description: 'Creates a text file, writes student data into it, and then reads it back to display on console.',
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *fp;
    char text[100];

    // Step 1: File write mode ("w") mein kholo
    fp = fopen("bca_notes.txt", "w");
    if (fp == NULL) {
        printf("File create nahi ho saki!\\n");
        return 1;
    }

    printf("File mein likhne ke liye text dalein: ");
    scanf(" %99[^\\n]", text);

    fprintf(fp, "%s\\n", text);
    fclose(fp); // File close ki
    printf("Data successfully file mein write ho gaya!\\n");

    // Step 2: File read mode ("r") mein kholo
    fp = fopen("bca_notes.txt", "r");
    if (fp == NULL) {
        printf("File open nahi ho saki!\\n");
        return 1;
    }

    char buffer[100];
    printf("\\n--- File se Read kiya gaya data ---\\n");
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    fclose(fp);
    return 0;
}`,
    hinglishExplanation: 'File handling me FILE pointer create hota hai. fopen() me mode "w" se write hota hai aur "r" se read. fprintf() file me write karta hai aur fgets() line-by-line read karta hai. Har operation ke baad fclose() zaroori hai.',
    keyLogicPoints: [
      'fopen("file.txt", "w") naya file banata ya overwrite karta hai',
      'fopen("file.txt", "r") read-only mode',
      'fclose(fp) file resource close karta hai'
    ],
    sampleInput: 'Prince Thakur is preparing for BCA exams.',
    sampleOutput: 'Data successfully file mein write ho gaya!\n--- File se Read kiya gaya data ---\nPrince Thakur is preparing for BCA exams.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'tower-of-hanoi',
    title: 'Tower of Hanoi (Recursion)',
    category: 'Recursion & Files',
    difficulty: 'Hard',
    tags: ['tower of hanoi', 'recursion', 'classic problem'],
    description: 'Solves the classic mathematical puzzle of moving N disks from Source rod to Destination rod using an Auxiliary rod.',
    code: `#include <stdio.h>

void towerOfHanoi(int n, char fromRod, char toRod, char auxRod) {
    if (n == 1) {
        printf("Disk 1 ko rod %c se rod %c par move karo\\n", fromRod, toRod);
        return;
    }
    // Step 1: n-1 disks ko source se aux par move karo
    towerOfHanoi(n - 1, fromRod, auxRod, toRod);

    // Step 2: nth disk ko source se dest par move karo
    printf("Disk %d ko rod %c se rod %c par move karo\\n", n, fromRod, toRod);

    // Step 3: n-1 disks ko aux se dest par move karo
    towerOfHanoi(n - 1, auxRod, toRod, fromRod);
}

int main() {
    int n;
    printf("Kitne disks hain? ");
    scanf("%d", &n);

    printf("Tower of Hanoi Steps (%d disks):\\n", n);
    towerOfHanoi(n, 'A', 'C', 'B'); // A=Source, C=Destination, B=Helper

    return 0;
}`,
    hinglishExplanation: 'Tower of Hanoi classic recursive problem hai. Iska formula hai: n-1 disks ko Helper rod par move karo, sabse badi disk ko Destination par daalo, fir n-1 disks ko Helper se Destination par move karo. Total moves = 2^n - 1 hote hain.',
    keyLogicPoints: [
      'Base case: n == 1 disk directly move',
      '3 recursive steps: Source→Aux, Move largest, Aux→Dest',
      'Total moves = 2^n - 1'
    ],
    sampleInput: '3',
    sampleOutput: 'Disk 1: A -> C\nDisk 2: A -> B\nDisk 1: C -> B\nDisk 3: A -> C\nDisk 1: B -> A\nDisk 2: B -> C\nDisk 1: A -> C',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n) recursion stack'
  },
  {
    id: 'strong-number',
    title: 'Strong Number Check (Krishnamurthy Number)',
    category: 'Math & Numbers',
    difficulty: 'Medium',
    tags: ['strong number', 'krishnamurthy', 'factorial sum'],
    description: 'Checks if sum of factorials of digits of a number equals the number itself (e.g. 145 = 1! + 4! + 5!).',
    code: `#include <stdio.h>

// Factorial helper
int factorial(int r) {
    int fact = 1;
    for (int i = 1; i <= r; i++) fact *= i;
    return fact;
}

int main() {
    int num, temp, rem, sum = 0;
    printf("Number enter karein: ");
    scanf("%d", &num);

    temp = num;
    while (temp > 0) {
        rem = temp % 10;
        sum += factorial(rem); // har digit ka factorial add kiya
        temp /= 10;
    }

    if (sum == num) {
        printf("%d ek STRONG NUMBER hai!\\n", num);
    } else {
        printf("%d strong number NAHI hai (Sum of factorials = %d).\\n", num, sum);
    }

    return 0;
}`,
    hinglishExplanation: 'Strong number (jaise 145) wo number hota hai jisme uske har digit ke factorial ka sum usi number ke barabar hota hai: 1! + 4! + 5! = 1 + 24 + 120 = 145.',
    keyLogicPoints: [
      'Har digit ka factorial calculate karke add kiya',
      'Agar sum == original number ho toh Strong number hai'
    ],
    sampleInput: '145',
    sampleOutput: '145 ek STRONG NUMBER hai!',
    timeComplexity: 'O(log10 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'perfect-number',
    title: 'Perfect Number Check',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['perfect number', 'divisors', 'sum of factors'],
    description: 'Checks if a number equals the sum of its positive proper divisors excluding itself (e.g. 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14).',
    code: `#include <stdio.h>

int main() {
    int num, sum = 0;
    printf("Positive integer enter karein: ");
    scanf("%d", &num);

    for (int i = 1; i <= num / 2; i++) {
        if (num % i == 0) {
            sum += i; // Proper divisor mila
        }
    }

    if (sum == num && num > 0) {
        printf("%d ek PERFECT NUMBER hai!\\n", num);
    } else {
        printf("%d perfect number NAHI hai (Divisors sum = %d).\\n", num, sum);
    }

    return 0;
}`,
    hinglishExplanation: 'Perfect number wo number hota hai jiske sabhi proper divisors (factors excluding the number itself) ka sum usi number ke barabar ho, jaise 6 ke factors 1, 2, 3 hain aur 1 + 2 + 3 = 6.',
    keyLogicPoints: [
      'Loop num / 2 tak chalana kafi hota hai',
      'Examples: 6, 28, 496, 8128'
    ],
    sampleInput: '28',
    sampleOutput: '28 ek PERFECT NUMBER hai!',
    timeComplexity: 'O(n/2)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'decimal-to-binary-c',
    title: 'Decimal to Binary Converter in C',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['decimal to binary', 'c program', 'division-by-2'],
    description: 'Converts a decimal number to binary format using array storage of remainders in C.',
    code: `#include <stdio.h>

int main() {
    int n, binary[32], i = 0;
    printf("Decimal number dalein: ");
    scanf("%d", &n);

    if (n == 0) {
        printf("Binary = 0\\n");
        return 0;
    }

    int temp = n;
    while (temp > 0) {
        binary[i] = temp % 2; // remainder store karo
        temp = temp / 2;      // quotient aage badhao
        i++;
    }

    printf("%d ka Binary = ", n);
    // Reverse order mein print karo (MSB se LSB)
    for (int j = i - 1; j >= 0; j--) {
        printf("%d", binary[j]);
    }
    printf("\\n");

    return 0;
}`,
    hinglishExplanation: 'Decimal ko binary me badalne ke liye number ko baar baar 2 se divide karke remainders ko array me store karte hain. Fir array ko reverse order me print kar dete hain.',
    keyLogicPoints: [
      'binary[i] = temp % 2 remainders track karta hai',
      'Reverse traversal j = i-1 down to 0 final binary deta hai'
    ],
    sampleInput: '25',
    sampleOutput: '25 ka Binary = 11001',
    timeComplexity: 'O(log2 n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'power-of-number',
    title: 'Power of a Number (Base ^ Exponent)',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['power', 'exponent', 'math', 'loop'],
    description: 'Computes base raised to power exponent (base^exp) using a simple loop without pow() library.',
    code: `#include <stdio.h>

int main() {
    int base, exp;
    long long result = 1;

    printf("Base aur Exponent enter karein (e.g. 2 5): ");
    scanf("%d %d", &base, &exp);

    for (int i = 1; i <= exp; i++) {
        result *= base;
    }

    printf("%d^%d = %lld\\n", base, exp, result);
    return 0;
}`,
    hinglishExplanation: 'Power nikalne ke liye result variable ko base se exp baar multiply karte hain (jaise 2^5 = 2*2*2*2*2 = 32).',
    keyLogicPoints: [
      'result *= base loop me exp times repeat hota hai',
      'long long overflow se bachata hai'
    ],
    sampleInput: '3 4',
    sampleOutput: '3^4 = 81',
    timeComplexity: 'O(exp)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sum-n-natural-numbers',
    title: 'Sum of First N Natural Numbers',
    category: 'Math & Numbers',
    difficulty: 'Easy',
    tags: ['sum', 'natural numbers', 'formula', 'loop'],
    description: 'Calculates 1 + 2 + 3 + ... + N using loop and compares with formula N*(N+1)/2.',
    code: `#include <stdio.h>

int main() {
    int n;
    long long sumLoop = 0;

    printf("N enter karein: ");
    scanf("%d", &n);

    // Method 1: Using for loop
    for (int i = 1; i <= n; i++) {
        sumLoop += i;
    }

    // Method 2: Direct Gauss formula N * (N + 1) / 2
    long long sumFormula = ((long long)n * (n + 1)) / 2;

    printf("Sum (Loop ke dwara): %lld\\n", sumLoop);
    printf("Sum (Formula N*(N+1)/2 ke dwara): %lld\\n", sumFormula);

    return 0;
}`,
    hinglishExplanation: 'Pehle n natural numbers ka sum do tariko se nikala: 1. Loop se har number add karke, 2. Direct Gauss formula n*(n+1)/2 se jo O(1) me answer deta hai.',
    keyLogicPoints: [
      'Loop method: O(n)',
      'Formula method: O(1) instantaneous calculation'
    ],
    sampleInput: '10',
    sampleOutput: 'Sum = 55',
    timeComplexity: 'O(1) via formula',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'character-frequency-string',
    title: 'Count Frequency of Characters in String',
    category: 'Strings',
    difficulty: 'Medium',
    tags: ['frequency', 'hash array', 'ascii count', 'string'],
    description: 'Determines the frequency of each distinct character appearing in a string using an ASCII hash count array.',
    code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[200];
    int freq[256] = {0}; // 256 ASCII characters ka count array

    printf("String enter karein: ");
    scanf("%199[^\\n]", str);

    // Har character ki frequency count badhao
    for (int i = 0; str[i] != '\\0'; i++) {
        freq[(unsigned char)str[i]]++;
    }

    printf("\\n--- Character Frequencies ---\\n");
    for (int i = 0; i < 256; i++) {
        if (freq[i] > 0 && i != ' ') {
            printf("Character '%c' : %d baar\\n", i, freq[i]);
        }
    }

    return 0;
}`,
    hinglishExplanation: 'ASCII table me 256 characters hote hain. freq[256] array banaya jisme character ki ASCII value index ban jati hai. Loop chalate hi freq[str[i]]++ se frequency count ho jati hai.',
    keyLogicPoints: [
      'freq[(unsigned char)str[i]]++ hash map ki tarah kaam karta hai',
      'Time complexity linear O(n) rehti hai'
    ],
    sampleInput: 'banana',
    sampleOutput: "Character 'a' : 3 baar\nCharacter 'b' : 1 baar\nCharacter 'n' : 2 baar",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) fixed 256 array'
  },
  {
    id: 'swap-without-temp-c',
    title: 'Swap Two Numbers Without Third Variable',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['swap', 'arithmetic', 'logic', 'basic'],
    description: 'Swaps the values of two variables using pure arithmetic addition and subtraction without creating any temporary storage.',
    code: `#include <stdio.h>

int main() {
    int a, b;
    printf("Do numbers enter karein (a aur b): ");
    scanf("%d %d", &a, &b);

    printf("Swap se pehle: a = %d, b = %d\\n", a, b);

    // Arithmetic swap logic
    a = a + b; // a ke paas dono ka total
    b = a - b; // b ke paas original a
    a = a - b; // a ke paas original b

    printf("Swap ke baad:  a = %d, b = %d\\n", a, b);
    return 0;
}`,
    hinglishExplanation: 'Pehle step me a = a + b kiya jisse total store ho gaya. Fir b = a - b karne se b me original a aa gaya. Aakhri me a = a - b karne se a me original b aa gaya. Zero extra memory use hui.',
    keyLogicPoints: [
      'a = a + b',
      'b = a - b',
      'a = a - b',
      'XOR method (a^=b; b^=a; a^=b) se bhi swap kiya ja sakta hai'
    ],
    sampleInput: '10 20',
    sampleOutput: 'Swap ke baad: a = 20, b = 10',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'temperature-celsius-fahrenheit',
    title: 'Temperature Converter (Celsius to Fahrenheit)',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['temperature', 'conversion', 'formula', 'basic'],
    description: 'Converts temperature from Celsius scale to Fahrenheit scale using standard thermodynamic conversion formula.',
    code: `#include <stdio.h>

int main() {
    float celsius, fahrenheit;

    printf("Temperature in Celsius (°C) dalein: ");
    scanf("%f", &celsius);

    // Formula: (Celsius * 9/5) + 32
    fahrenheit = (celsius * 9.0 / 5.0) + 32.0;

    printf("\\n%.2f°C = %.2f°F\\n", celsius, fahrenheit);
    return 0;
}`,
    hinglishExplanation: 'Celsius se Fahrenheit ka scientific formula (C * 9/5) + 32 hai. Division me 9.0/5.0 float values use kiye taaki integer truncation na ho.',
    keyLogicPoints: [
      'Formula: (C * 9.0 / 5.0) + 32.0',
      'Float data type precision ke liye zaroori hai'
    ],
    sampleInput: '37.0',
    sampleOutput: '37.00°C = 98.60°F',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'leap-year-checker-c',
    title: 'Leap Year Checker',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['leap year', 'calendar', 'conditional', 'modulo'],
    description: 'Checks if a given calendar year is a Leap Year (366 days with Feb 29) or a normal year using Gregorian rules.',
    code: `#include <stdio.h>

int main() {
    int year;
    printf("Saal (Year) enter karein: ");
    scanf("%d", &year);

    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
        printf("%d ek Leap Year hai (366 days).\\n", year);
    } else {
        printf("%d ek Normal Common Year hai (365 days).\\n", year);
    }

    return 0;
}`,
    hinglishExplanation: 'Leap year ka rule hai: Agar century year hai (divisible by 100) to 400 se divide hona zaroori hai (jaise 2000 leap year tha, par 1900 nahi tha). Normal years ke liye 4 se divide hona kaafi hai.',
    keyLogicPoints: [
      'Divisible by 400 -> Always Leap Year',
      'Divisible by 4 AND NOT divisible by 100 -> Leap Year'
    ],
    sampleInput: '2024',
    sampleOutput: '2024 ek Leap Year hai (366 days).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'circle-area-perimeter-c',
    title: 'Area and Circumference of Circle',
    category: 'Basic',
    difficulty: 'Easy',
    tags: ['circle', 'geometry', 'pi', 'area'],
    description: 'Calculates the 2D surface area (PI * r * r) and outer circumference (2 * PI * r) of a circle from user input radius.',
    code: `#include <stdio.h>

int main() {
    float r, area, circum;
    const float PI = 3.14159;

    printf("Circle ka radius (r) enter karein: ");
    scanf("%f", &r);

    area = PI * r * r;
    circum = 2 * PI * r;

    printf("Area of Circle:          %.2f\\n", area);
    printf("Circumference of Circle: %.2f\\n", circum);
    return 0;
}`,
    hinglishExplanation: 'Circle ka area nikalne ke liye PI * r * r aur perimeter/circumference ke liye 2 * PI * r formula use kiya gaya hai.',
    keyLogicPoints: [
      'const float PI = 3.14159 constant define karta hai',
      'Radius square calculation: r * r'
    ],
    sampleInput: '7',
    sampleOutput: 'Area of Circle: 153.94\nCircumference of Circle: 43.98',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  }
];
