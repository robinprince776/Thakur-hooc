import { CTemplate } from '../types';

export const C_TEMPLATES: CTemplate[] = [
  {
    id: 'hello_world',
    title: '01. Hello World',
    category: 'Basics',
    description: 'Sabse pehla C program — screen pe message print karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 01: Hello World in C
#include <stdio.h>

int main() {
    printf("Namaste, World!\\n");
    printf("Welcome to Simple C Compiler.\\n");
    printf("Created by Prince Thakur for students.\\n");
    
    return 0;
}`,
    defaultInput: ''
  },
  {
    id: 'sum_two_numbers',
    title: '02. Sum of Two Numbers (Interactive scanf)',
    category: 'Basics',
    description: 'User se 2 numbers input lekar unka jod (sum) nikalta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 02: User Input and Addition
#include <stdio.h>

int main() {
    int a, b, sum;
    
    printf("Pehla number dalein: ");
    scanf("%d", &a);
    
    printf("Doosra number dalein: ");
    scanf("%d", &b);
    
    sum = a + b;
    
    printf("\\nResult:\\n");
    printf("%d + %d = %d\\n", a, b, sum);
    
    return 0;
}`,
    defaultInput: '15 25'
  },
  {
    id: 'factorial',
    title: '03. Factorial of a Number',
    category: 'Control Flow',
    description: 'Loop use karke kisi number ka factorial (n!) calculate karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 03: Factorial Calculation
#include <stdio.h>

int main() {
    int n, i;
    long long fact = 1;
    
    printf("Ek number dalein: ");
    scanf("%d", &n);
    
    if (n < 0) {
        printf("Error: Negative numbers ka factorial nahi hota!\\n");
    } else {
        for (i = 1; i <= n; i++) {
            fact = fact * i;
        }
        printf("Factorial of %d = %lld\\n", n, fact);
    }
    
    return 0;
}`,
    defaultInput: '5'
  },
  {
    id: 'fibonacci',
    title: '04. Fibonacci Series',
    category: 'Control Flow',
    description: 'First N terms of Fibonacci sequence (0, 1, 1, 2, 3, 5, 8...) generate karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 04: Fibonacci Series
#include <stdio.h>

int main() {
    int n, t1 = 0, t2 = 1, nextTerm, i;
    
    printf("Kitne terms chahiye? ");
    scanf("%d", &n);
    
    printf("Fibonacci Series (%d terms):\\n", n);
    
    for (i = 1; i <= n; i++) {
        printf("%d ", t1);
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
    }
    printf("\\n");
    
    return 0;
}`,
    defaultInput: '8'
  },
  {
    id: 'prime_checker',
    title: '05. Prime Number Checker',
    category: 'Control Flow',
    description: 'Check karta hai ki diya gaya number Prime hai ya Composite.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 05: Prime Number Test
#include <stdio.h>

int main() {
    int n, i, isPrime = 1;
    
    printf("Ek positive number dalein: ");
    scanf("%d", &n);
    
    if (n <= 1) {
        isPrime = 0;
    } else {
        for (i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = 0;
                break;
            }
        }
    }
    
    if (isPrime == 1) {
        printf("%d ek PRIME number hai.\\n", n);
    } else {
        printf("%d ek COMPOSITE / NON-PRIME number hai.\\n", n);
    }
    
    return 0;
}`,
    defaultInput: '29'
  },
  {
    id: 'bubble_sort',
    title: '06. Array Bubble Sort',
    category: 'Arrays & Strings',
    description: 'Array ke elements ko Ascending order mein sort karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 06: Bubble Sort in C
#include <stdio.h>

int main() {
    int arr[6] = {64, 34, 25, 12, 22, 11};
    int n = 6;
    int i, j, temp;
    
    printf("Original Array:\\n");
    for (i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n\\n");
    
    // Bubble sort algorithm
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    printf("Sorted Array (Ascending):\\n");
    for (i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    return 0;
}`,
    defaultInput: ''
  },
  {
    id: 'palindrome_check',
    title: '07. Palindrome Number Checker',
    category: 'Math & Logic',
    description: 'Check karta hai ki number ulta karne par bhi wahi rehta hai ya nahi.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 07: Palindrome Number
#include <stdio.h>

int main() {
    int n, reversed = 0, remainder, original;
    
    printf("Number dalein: ");
    scanf("%d", &n);
    
    original = n;
    
    while (n != 0) {
        remainder = n % 10;
        reversed = reversed * 10 + remainder;
        n = n / 10;
    }
    
    printf("Original: %d | Reversed: %d\\n", original, reversed);
    if (original == reversed) {
        printf("Result: Yeh PALINDROME number hai!\\n");
    } else {
        printf("Result: Yeh Palindrome nahi hai.\\n");
    }
    
    return 0;
}`,
    defaultInput: '12321'
  },
  {
    id: 'matrix_addition',
    title: '08. Matrix Addition (2D Arrays)',
    category: 'Arrays & Strings',
    description: 'Do 2x2 matrices ka element-wise addition karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 08: 2D Matrix Addition
#include <stdio.h>

int main() {
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    int sum[2][2];
    int i, j;
    
    printf("Matrix A + Matrix B = Result:\\n\\n");
    
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            sum[i][j] = a[i][j] + b[i][j];
            printf("%d\\t", sum[i][j]);
        }
        printf("\\n");
    }
    
    return 0;
}`,
    defaultInput: ''
  },
  {
    id: 'pointer_swap',
    title: '09. Swap Two Numbers using Pointers',
    category: 'Pointers & Structs',
    description: 'Call by reference aur pointers se 2 values ko swap karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 09: Pointers & Value Swapping
#include <stdio.h>

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int a = 10;
    int b = 20;
    
    printf("Swap se pehle: a = %d, b = %d\\n", a, b);
    
    swap(&a, &b);
    
    printf("Swap ke baad:  a = %d, b = %d\\n", a, b);
    printf("Pointers ne memory addresses pe values swap kar di!\\n");
    
    return 0;
}`,
    defaultInput: ''
  },
  {
    id: 'calculator_switch',
    title: '10. Simple Calculator (Switch-Case)',
    category: 'Control Flow',
    description: 'Arithmetic operations (+, -, *, /) perform karne wala calculator.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 10: Simple Calculator
#include <stdio.h>

int main() {
    char op;
    double first, second;
    
    printf("Operator dalein (+, -, *, /): ");
    scanf(" %c", &op);
    
    printf("Do numbers dalein: ");
    scanf("%lf %lf", &first, &second);
    
    switch (op) {
        case '+':
            printf("%.2lf + %.2lf = %.2lf\\n", first, second, first + second);
            break;
        case '-':
            printf("%.2lf - %.2lf = %.2lf\\n", first, second, first - second);
            break;
        case '*':
            printf("%.2lf * %.2lf = %.2lf\\n", first, second, first * second);
            break;
        case '/':
            if (second != 0.0) {
                printf("%.2lf / %.2lf = %.2lf\\n", first, second, first / second);
            } else {
                printf("Error! Division by zero sambhav nahi hai.\\n");
            }
            break;
        default:
            printf("Error! Invalid operator '%c'\\n", op);
    }
    
    return 0;
}`,
    defaultInput: '+ 12.5 7.5'
  },
  {
    id: 'star_pyramid',
    title: '11. Star Pyramid Pattern',
    category: 'Control Flow',
    description: 'Nested loops se pyramid pattern print karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 11: Star Pyramid Pattern
#include <stdio.h>

int main() {
    int rows = 5;
    int i, j, space;
    
    printf("Pyramid Pattern with %d Rows:\\n\\n", rows);
    
    for (i = 1; i <= rows; i++) {
        // Spaces print karo
        for (space = 1; space <= rows - i; space++) {
            printf(" ");
        }
        // Stars print karo
        for (j = 1; j <= (2 * i - 1); j++) {
            printf("*");
        }
        printf("\\n");
    }
    
    return 0;
}`,
    defaultInput: ''
  },
  {
    id: 'even_odd',
    title: '12. Even or Odd Checker',
    category: 'Basics',
    description: 'Check karta hai number Even hai ya Odd modulus operator se.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 12: Even or Odd Checker
#include <stdio.h>

int main() {
    int num;
    
    printf("Ek integer number dalein: ");
    scanf("%d", &num);
    
    if (num % 2 == 0) {
        printf("%d ek EVEN (Sam) number hai.\\n", num);
    } else {
        printf("%d ek ODD (Visham) number hai.\\n", num);
    }
    
    return 0;
}`,
    defaultInput: '42'
  },
  {
    id: 'largest_three',
    title: '13. Largest of Three Numbers',
    category: 'Control Flow',
    description: 'If-else if ladder use karke 3 numbers me se sabse bada number nikalta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 13: Largest Among Three Numbers
#include <stdio.h>

int main() {
    int a, b, c;
    
    printf("Teen numbers dalein (space separated): ");
    scanf("%d %d %d", &a, &b, &c);
    
    printf("Values: a = %d, b = %d, c = %d\\n", a, b, c);
    
    if (a >= b && a >= c) {
        printf("Result: %d sabse bada (largest) number hai.\\n", a);
    } else if (b >= a && b >= c) {
        printf("Result: %d sabse bada (largest) number hai.\\n", b);
    } else {
        printf("Result: %d sabse bada (largest) number hai.\\n", c);
    }
    
    return 0;
}`,
    defaultInput: '45 89 23'
  },
  {
    id: 'leap_year',
    title: '14. Leap Year Checker',
    category: 'Control Flow',
    description: 'Check karta hai diya gaya saal Leap Year (366 din) hai ya Common Year.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 14: Leap Year Checker
#include <stdio.h>

int main() {
    int year;
    
    printf("Saal (Year) enter karein (e.g. 2024): ");
    scanf("%d", &year);
    
    // Leap year rule: Divisible by 400 OR (divisible by 4 AND NOT divisible by 100)
    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
        printf("%d ek LEAP YEAR hai (February me 29 din honge).\\n", year);
    } else {
        printf("%d ek COMMON YEAR hai (February me 28 din honge).\\n", year);
    }
    
    return 0;
}`,
    defaultInput: '2024'
  },
  {
    id: 'swap_without_third',
    title: '15. Swap Without Third Variable (Math & XOR)',
    category: 'Basics',
    description: 'Bina kisi 3rd extra variable ke 2 numbers ko aapas me swap karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 15: Swap Without 3rd Variable
#include <stdio.h>

int main() {
    int x, y;
    
    printf("Do numbers dalein (x aur y): ");
    scanf("%d %d", &x, &y);
    
    printf("Swap se pehle: x = %d, y = %d\\n", x, y);
    
    // Arithmetic logic:
    x = x + y; // x holds sum
    y = x - y; // y gets original x
    x = x - y; // x gets original y
    
    printf("Swap ke baad:  x = %d, y = %d\\n", x, y);
    printf("Success: Zero extra memory used!\\n");
    
    return 0;
}`,
    defaultInput: '15 40'
  },
  {
    id: 'multiplication_table',
    title: '16. Multiplication Table (Pahada)',
    category: 'Control Flow',
    description: 'Kisi bhi number ka 1 se 10 tak pura table (pahada) print karta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 16: Multiplication Table (Pahada)
#include <stdio.h>

int main() {
    int n, i;
    
    printf("Kiska table (pahada) chahiye? ");
    scanf("%d", &n);
    
    printf("\\n--- Multiplication Table of %d ---\\n", n);
    for (i = 1; i <= 10; i++) {
        printf("%d x %2d = %d\\n", n, i, n * i);
    }
    
    return 0;
}`,
    defaultInput: '7'
  },
  {
    id: 'sum_of_digits',
    title: '17. Sum of Digits of a Number',
    category: 'Math & Logic',
    description: 'Kisi number ke sabhi anko (digits) ka jod nikalta hai (e.g. 543 -> 5+4+3=12).',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 17: Sum of Digits
#include <stdio.h>

int main() {
    int num, temp, sum = 0, rem;
    
    printf("Ek number dalein: ");
    scanf("%d", &num);
    
    temp = num;
    while (temp > 0) {
        rem = temp % 10;
        sum += rem;
        temp /= 10;
    }
    
    printf("Number: %d\\n", num);
    printf("Sum of digits: %d\\n", sum);
    
    return 0;
}`,
    defaultInput: '482'
  },
  {
    id: 'celsius_fahrenheit',
    title: '18. Temperature Converter (Celsius to Fahrenheit)',
    category: 'Basics',
    description: 'Celsius temperature ko Fahrenheit mein convert karta hai: (C * 9/5) + 32.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 18: Temperature Converter
#include <stdio.h>

int main() {
    float celsius, fahrenheit;
    
    printf("Temperature in Celsius dalein (°C): ");
    scanf("%f", &celsius);
    
    fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
    
    printf("\\n%.2f°C = %.2f°F\\n", celsius, fahrenheit);
    if (celsius >= 37.0) {
        printf("Status: Garmi / Body fever range!\\n");
    } else if (celsius <= 15.0) {
        printf("Status: Thand / Winter weather!\\n");
    } else {
        printf("Status: Normal pleasant temperature.\\n");
    }
    
    return 0;
}`,
    defaultInput: '36.6'
  },
  {
    id: 'simple_interest',
    title: '19. Simple Interest Calculator',
    category: 'Basics',
    description: 'Principal, Rate aur Time par Simple Interest (P*R*T/100) nikalta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 19: Simple Interest Calculator
#include <stdio.h>

int main() {
    float principal, rate, time, si, total;
    
    printf("Principal Amount (P), Rate %% (R), Time in years (T) dalein: ");
    scanf("%f %f %f", &principal, &rate, &time);
    
    si = (principal * rate * time) / 100.0;
    total = principal + si;
    
    printf("\\n--- Loan / Investment Summary ---\\n");
    printf("Principal Amount: Rs %.2f\\n", principal);
    printf("Interest Rate:    %.2f%% per year\\n", rate);
    printf("Time Period:      %.2f years\\n", time);
    printf("Simple Interest:  Rs %.2f\\n", si);
    printf("Total Payable:    Rs %.2f\\n", total);
    
    return 0;
}`,
    defaultInput: '10000 7.5 2'
  },
  {
    id: 'circle_area',
    title: '20. Area & Circumference of Circle',
    category: 'Basics',
    description: 'Radius input lekar Circle ka Area (πr²) aur Circumference (2πr) nikalta hai.',
    code: `// Simple C Compiler - Made by Prince Thakur
// Program 20: Circle Geometry in C
#include <stdio.h>

int main() {
    float radius, area, circumference;
    const float PI = 3.14159;
    
    printf("Circle ka radius (r) dalein: ");
    scanf("%f", &radius);
    
    area = PI * radius * radius;
    circumference = 2 * PI * radius;
    
    printf("\\nRadius (r):        %.2f\\n", radius);
    printf("Area (PI * r^2):   %.2f sq units\\n", area);
    printf("Circumference:     %.2f units\\n", circumference);
    
    return 0;
}`,
    defaultInput: '5'
  }
];
