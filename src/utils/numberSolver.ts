import { NumberSolverResult, NumberSystemType, StepItem } from '../types';

// Helper to convert single hex char to decimal
export const hexCharToDec = (char: string): number => {
  const upper = char.toUpperCase();
  if (upper >= '0' && upper <= '9') return parseInt(upper, 10);
  if (upper === 'A') return 10;
  if (upper === 'B') return 11;
  if (upper === 'C') return 12;
  if (upper === 'D') return 13;
  if (upper === 'E') return 14;
  if (upper === 'F') return 15;
  return 0;
};

// Helper to convert decimal (0-15) to hex char
export const decToHexChar = (num: number): string => {
  if (num < 10) return num.toString();
  return String.fromCharCode(55 + num); // 10 -> 'A', 15 -> 'F'
};

// Helper for converting fractional part of decimal number to any base (2, 8, 16)
interface FractionConversionResult {
  fractionDigits: string;
  steps: StepItem[];
  tableRows: (string | number)[][];
}

function convertDecimalFraction(
  fractionVal: number,
  base: number,
  baseName: string,
  maxDigits = 8
): FractionConversionResult {
  if (fractionVal <= 0) {
    return { fractionDigits: '', steps: [], tableRows: [] };
  }

  let currentFrac = fractionVal;
  const digits: string[] = [];
  const tableRows: (string | number)[][] = [];
  const subSteps: string[] = [];

  let count = 0;
  while (currentFrac > 0.0000001 && count < maxDigits) {
    const multiplied = currentFrac * base;
    const integerPart = Math.floor(multiplied + 0.00000001); // precision buffer
    const nextFrac = Number((multiplied - integerPart).toFixed(8));

    const digitChar = base === 16 ? decToHexChar(integerPart) : integerPart.toString();
    digits.push(digitChar);

    const stepText = `${currentFrac.toFixed(
      4
    )} × ${base} = ${multiplied.toFixed(4)} → Integer part = ${digitChar}, Remainder fraction = ${nextFrac.toFixed(4)}`;
    subSteps.push(stepText);

    tableRows.push([
      currentFrac.toFixed(4),
      `× ${base}`,
      multiplied.toFixed(4),
      digitChar,
      nextFrac.toFixed(4)
    ]);

    currentFrac = nextFrac;
    count++;
  }

  const fractionDigits = digits.join('');
  const steps: StepItem[] = [
    {
      stepNumber: 0, // will be indexed by caller
      title: `Fractional Part (.${fractionVal.toString().split('.')[1] || fractionVal}) ka Multiplication-by-${base} Method`,
      explanation: `Point ke baad wale hisse (${fractionVal}) ko lagatar ${base} se multiply karte hain. Har step par integer part ko note karte hain aur use TOP TO BOTTOM (upar se neeche) likhte hain.${
        count >= maxDigits ? ` (Up to ${maxDigits} digits precision calculate kiya gaya).` : ''
      }`,
      subSteps
    }
  ];

  return { fractionDigits, steps, tableRows };
}

// ----------------------------------------------------------------------------
// Base Arithmetic Helper Functions (Binary, Octal, Hexadecimal, Decimal)
// ----------------------------------------------------------------------------

export function parseCharInBase(char: string, base: number): number {
  const upper = char.toUpperCase();
  let val = 0;
  if (upper >= '0' && upper <= '9') val = parseInt(upper, 10);
  else if (upper >= 'A' && upper <= 'F') val = 10 + (upper.charCodeAt(0) - 65);
  else throw new Error(`Invalid character '${char}' for Base ${base}`);
  if (val >= base) {
    throw new Error(`Digit '${char}' Base ${base} mein valid nahi hai (allowed range: 0 se ${base - 1})`);
  }
  return val;
}

export function formatDigitInBase(val: number, base: number): string {
  if (base === 16) return decToHexChar(val);
  return val.toString();
}

export function getBaseName(base: number): string {
  if (base === 2) return 'Binary';
  if (base === 8) return 'Octal';
  if (base === 10) return 'Decimal';
  if (base === 16) return 'Hexadecimal';
  return `Base ${base}`;
}

export function validateBaseString(str: string, base: number): void {
  const clean = str.trim().toUpperCase();
  if (!clean) throw new Error(`Kripya valid ${getBaseName(base)} number enter karein.`);
  for (let i = 0; i < clean.length; i++) {
    parseCharInBase(clean[i], base);
  }
}

export function solveBaseAddition(base: number, aStr: string, bStr: string): NumberSolverResult {
  const baseName = getBaseName(base);
  validateBaseString(aStr, base);
  validateBaseString(bStr, base);

  const cleanA = aStr.trim().toUpperCase();
  const cleanB = bStr.trim().toUpperCase();

  const maxLen = Math.max(cleanA.length, cleanB.length);
  const padA = cleanA.padStart(maxLen, '0');
  const padB = cleanB.padStart(maxLen, '0');

  let carry = 0;
  const resultDigits: string[] = [];
  const bitSteps: string[] = [];
  const tableRows: (string | number)[][] = [];

  for (let i = maxLen - 1; i >= 0; i--) {
    const d1 = parseCharInBase(padA[i], base);
    const d2 = parseCharInBase(padB[i], base);
    const sum = d1 + d2 + carry;
    const outVal = sum % base;
    const nextCarry = Math.floor(sum / base);
    const outChar = formatDigitInBase(outVal, base);

    const pos = maxLen - 1 - i;
    bitSteps.unshift(
      `Column (Weight ${base}^${pos}): ${padA[i]} (${d1}) + ${padB[i]} (${d2}) + carry(${carry}) = sum ${sum}₁₀ → Output Digit = '${outChar}', Next Carry = ${nextCarry}`
    );
    tableRows.unshift([`${base}^${pos}`, carry, padA[i], padB[i], `${sum}₁₀`, outChar, nextCarry]);

    resultDigits.unshift(outChar);
    carry = nextCarry;
  }

  if (carry > 0) {
    const carryChar = formatDigitInBase(carry, base);
    resultDigits.unshift(carryChar);
    bitSteps.unshift(`Final End Carry: leftover carry = ${carry} ko aage add kiya → '${carryChar}'`);
  }

  const finalResult = resultDigits.join('');
  const decA = parseInt(cleanA, base);
  const decB = parseInt(cleanB, base);
  const decSum = decA + decB;

  return {
    title: `${baseName} Addition (${cleanA} + ${cleanB})`,
    input: `${cleanA} + ${cleanB} (${baseName})`,
    type: base === 2 ? 'bin-add' : base === 8 ? 'oct-arithmetic' : base === 16 ? 'hex-arithmetic' : 'base-arithmetic',
    finalAnswer: `(${finalResult})_${base}`,
    steps: [
      {
        stepNumber: 1,
        title: `${baseName} Addition Rules (Radix ${base})`,
        explanation: `${baseName} (Base ${base}) addition right-to-left column-wise kiya jata hai. Agar kisi column ka sum ≥ ${base} ho jaye, toh (Sum % ${base}) ko digit likhte hain aur ⌊Sum / ${base}⌋ ko agle column mein carry forward karte hain.`,
        mathDetail: `Rule: Sum ≥ ${base} hone par Next Carry = Math.floor(Sum ÷ ${base}), Output Digit = Sum % ${base}`
      },
      {
        stepNumber: 2,
        title: 'Column-wise Calculation Steps',
        explanation: 'Right to left sabhi digits ka detailed addition:',
        subSteps: bitSteps
      },
      {
        stepNumber: 3,
        title: 'Decimal Verification Check',
        explanation: `Decimal cross-check: ${cleanA} (${decA}₁₀) + ${cleanB} (${decB}₁₀) = ${decSum}₁₀. Aur (${decSum})₁₀ ka ${baseName} (${finalResult})_${base} hota hai. Bilkul sahi hai!`,
        mathDetail: `(${cleanA})_${base} + (${cleanB})_${base} = (${finalResult})_${base}`,
        highlight: true
      }
    ],
    additionalInfo: {
      tableHeaders: ['Column Weight', 'Carry-In', 'Digit A', 'Digit B', 'Decimal Sum', `Result Digit (${baseName})`, 'Next Carry'],
      tableRows
    }
  };
}

export function solveBaseSubtraction(base: number, aStr: string, bStr: string): NumberSolverResult {
  const baseName = getBaseName(base);
  validateBaseString(aStr, base);
  validateBaseString(bStr, base);

  const cleanA = aStr.trim().toUpperCase();
  const cleanB = bStr.trim().toUpperCase();

  const decA = parseInt(cleanA, base);
  const decB = parseInt(cleanB, base);
  const isNegative = decA < decB;

  const largerStr = isNegative ? cleanB : cleanA;
  const smallerStr = isNegative ? cleanA : cleanB;

  const maxLen = largerStr.length;
  const padLarger = largerStr.padStart(maxLen, '0');
  const padSmaller = smallerStr.padStart(maxLen, '0');

  const digitsL = padLarger.split('').map((c) => parseCharInBase(c, base));
  const digitsS = padSmaller.split('').map((c) => parseCharInBase(c, base));
  const resultDigits: string[] = [];
  const bitSteps: string[] = [];
  const tableRows: (string | number)[][] = [];

  for (let i = maxLen - 1; i >= 0; i--) {
    const origL = digitsL[i];
    const sVal = digitsS[i];
    let borrowed = false;

    if (digitsL[i] < sVal) {
      let j = i - 1;
      while (j >= 0 && digitsL[j] === 0) {
        digitsL[j] = base - 1;
        j--;
      }
      if (j >= 0) {
        digitsL[j] -= 1;
      }
      digitsL[i] += base;
      borrowed = true;
    }

    const diff = digitsL[i] - sVal;
    const diffChar = formatDigitInBase(diff, base);
    resultDigits.unshift(diffChar);

    const pos = maxLen - 1 - i;
    const borrowNote = borrowed
      ? `[Borrow Liya: +${base} mila → ${origL} ban gaya ${digitsL[i]}]`
      : '[No borrow]';
    bitSteps.unshift(
      `Column (Weight ${base}^${pos}): ${digitsL[i]} - ${sVal} = ${diff} → Digit = '${diffChar}' ${borrowNote}`
    );
    tableRows.unshift([`${base}^${pos}`, origL, borrowed ? `+${base} (Borrow)` : '0', digitsL[i], sVal, diffChar]);
  }

  let rawRes = resultDigits.join('').replace(/^0+(?!$)/, '') || '0';
  const finalResult = isNegative ? `-${rawRes}` : rawRes;
  const decDiff = decA - decB;

  return {
    title: `${baseName} Subtraction (${cleanA} - ${cleanB})`,
    input: `${cleanA} - ${cleanB} (${baseName})`,
    type: base === 2 ? 'bin-sub' : base === 8 ? 'oct-arithmetic' : base === 16 ? 'hex-arithmetic' : 'base-arithmetic',
    finalAnswer: `(${finalResult})_${base}`,
    steps: [
      {
        stepNumber: 1,
        title: `${baseName} Subtraction Rule (Base ${base} Borrow Concept)`,
        explanation: `${baseName} subtraction mein jab upar wala digit neeche wale digit se chhota hota hai, toh hum agle left column se 1 borrow lete hain. Kyunki Base = ${base} hai, isliye 1 borrow aane par current digit mein theek +${base} judta hai!`,
        mathDetail: `Rule: Borrowing 1 from adjacent left column gives +${base} to the current column`
      },
      ...(isNegative
        ? [
            {
              stepNumber: 2,
              title: 'Negative Result Notice (A < B)',
              explanation: `Kyunki pehla number (${cleanA} = ${decA}₁₀) doosre number (${cleanB} = ${decB}₁₀) se chhota hai, isliye answer negative hoga. Humne (${cleanB} - ${cleanA}) calculate kiya aur aage minus sign (-) lagaya.`,
              mathDetail: `${cleanA} < ${cleanB} → Result will be negative (-)`
            }
          ]
        : []),
      {
        stepNumber: isNegative ? 3 : 2,
        title: 'Column-by-Column Borrow & Subtraction Steps',
        explanation: 'Right to left borrow propagation aur subtraction steps:',
        subSteps: bitSteps
      },
      {
        stepNumber: isNegative ? 4 : 3,
        title: 'Decimal Verification Check',
        explanation: `Decimal check: ${cleanA} (${decA}₁₀) - ${cleanB} (${decB}₁₀) = ${decDiff}₁₀. (${decDiff})₁₀ ka ${baseName} equivalent (${finalResult})_${base} hai!`,
        mathDetail: `(${cleanA})_${base} - (${cleanB})_${base} = (${finalResult})_${base}`,
        highlight: true
      }
    ],
    additionalInfo: {
      tableHeaders: ['Column Weight', 'Original Digit A', 'Borrow Effect', 'Effective Digit A', 'Digit B', `Difference Digit (${baseName})`],
      tableRows
    }
  };
}

export function solveBaseMultiplication(base: number, aStr: string, bStr: string): NumberSolverResult {
  const baseName = getBaseName(base);
  validateBaseString(aStr, base);
  validateBaseString(bStr, base);

  const cleanA = aStr.trim().toUpperCase();
  const cleanB = bStr.trim().toUpperCase();

  const decA = parseInt(cleanA, base);
  const decB = parseInt(cleanB, base);
  const decProd = decA * decB;
  const finalResult = decProd.toString(base).toUpperCase();

  const partialProducts: { digitB: string; shift: number; product: string }[] = [];
  const stepsList: string[] = [];

  for (let j = cleanB.length - 1; j >= 0; j--) {
    const digitBChar = cleanB[j];
    const digitBVal = parseCharInBase(digitBChar, base);
    const shift = cleanB.length - 1 - j;

    let carry = 0;
    const partialDigits: string[] = [];

    for (let i = cleanA.length - 1; i >= 0; i--) {
      const digitAVal = parseCharInBase(cleanA[i], base);
      const prod = digitAVal * digitBVal + carry;
      const outVal = prod % base;
      carry = Math.floor(prod / base);
      partialDigits.unshift(formatDigitInBase(outVal, base));
    }

    if (carry > 0) {
      partialDigits.unshift(formatDigitInBase(carry, base));
    }

    const partialStr = partialDigits.join('').replace(/^0+(?!$)/, '') || '0';
    partialProducts.push({ digitB: digitBChar, shift, product: partialStr });

    const shiftSpaces = shift > 0 ? ` (shifted by ${shift} places: ${partialStr}${'0'.repeat(shift)})` : '';
    stepsList.push(
      `Step: ${cleanA} × '${digitBChar}' (in Base ${base}) = ${partialStr}${shiftSpaces}`
    );
  }

  return {
    title: `${baseName} Multiplication (${cleanA} × ${cleanB})`,
    input: `${cleanA} × ${cleanB} (${baseName})`,
    type: base === 2 ? 'bin-mul' : base === 8 ? 'oct-arithmetic' : base === 16 ? 'hex-arithmetic' : 'base-arithmetic',
    finalAnswer: `(${finalResult})_${base}`,
    steps: [
      {
        stepNumber: 1,
        title: `${baseName} Multiplication Concept`,
        explanation: `${baseName} multiplication traditional pencil-paper math ki tarah hota hai. Doosre number ke har digit se pehle number ko multiply karke partial products banate hain, aur har agle step par 1 position left shift karte hain.`,
        mathDetail: `Multiplier Digits: [${cleanB.split('').join(', ')}]`
      },
      {
        stepNumber: 2,
        title: 'Partial Products Calculation',
        explanation: 'Har digit ka partial product:',
        subSteps: stepsList
      },
      {
        stepNumber: 3,
        title: `Partial Products ko ${baseName} mein Add Karo`,
        explanation: `Sabhi shifted partial products ko ${baseName} addition rules se jodne par final product milta hai.`,
        mathDetail: `Sum of Partial Products = (${finalResult})_${base}`
      },
      {
        stepNumber: 4,
        title: 'Decimal Verification Check',
        explanation: `Decimal verification: ${cleanA} (${decA}₁₀) × ${cleanB} (${decB}₁₀) = ${decProd}₁₀. (${decProd})₁₀ ko base ${base} mein convert karne par (${finalResult})_${base} milta hai!`,
        mathDetail: `(${cleanA})_${base} × (${cleanB})_${base} = (${finalResult})_${base}`,
        highlight: true
      }
    ],
    additionalInfo: {
      tableHeaders: ['Multiplier Digit', 'Position Shift', `Partial Product (${baseName})`],
      tableRows: partialProducts.map((p) => [p.digitB, p.shift, p.shift > 0 ? `${p.product}${'0'.repeat(p.shift)}` : p.product])
    }
  };
}

export function solveBaseDivision(base: number, aStr: string, bStr: string): NumberSolverResult {
  const baseName = getBaseName(base);
  validateBaseString(aStr, base);
  validateBaseString(bStr, base);

  const cleanA = aStr.trim().toUpperCase();
  const cleanB = bStr.trim().toUpperCase();

  const decA = parseInt(cleanA, base);
  const decB = parseInt(cleanB, base);

  if (decB === 0) {
    throw new Error('Zero se division (÷ 0) mathematically possible nahi hai!');
  }

  const quotientDec = Math.floor(decA / decB);
  const remainderDec = decA % decB;

  const quotientBase = quotientDec.toString(base).toUpperCase();
  const remainderBase = remainderDec.toString(base).toUpperCase();

  const longDivSteps: string[] = [];
  let currentDec = 0;
  const qDigits: string[] = [];

  for (let i = 0; i < cleanA.length; i++) {
    const digitChar = cleanA[i];
    const digitVal = parseCharInBase(digitChar, base);
    currentDec = currentDec * base + digitVal;
    const currentBase = currentDec.toString(base).toUpperCase();

    if (currentDec >= decB) {
      const qVal = Math.floor(currentDec / decB);
      const subDec = qVal * decB;
      const subBase = subDec.toString(base).toUpperCase();
      const remDec = currentDec - subDec;
      const remBase = remDec.toString(base).toUpperCase();

      qDigits.push(formatDigitInBase(qVal, base));
      longDivSteps.push(
        `Step ${i + 1}: Bring down '${digitChar}' → Partial dividend = ${currentBase} (${currentDec}₁₀). ${currentBase} ÷ ${cleanB} = Quotient '${formatDigitInBase(qVal, base)}' (Subtracted ${subBase}), Remainder = ${remBase}.`
      );
      currentDec = remDec;
    } else {
      if (qDigits.length > 0) {
        qDigits.push('0');
        longDivSteps.push(
          `Step ${i + 1}: Bring down '${digitChar}' → Partial dividend = ${currentBase} chhota hai ${cleanB} se, isliye Quotient bit '0' likha.`
        );
      }
    }
  }

  return {
    title: `${baseName} Division (${cleanA} ÷ ${cleanB})`,
    input: `${cleanA} ÷ ${cleanB} (${baseName})`,
    type: base === 2 ? 'bin-div' : base === 8 ? 'oct-arithmetic' : base === 16 ? 'hex-arithmetic' : 'base-arithmetic',
    finalAnswer: `Quotient: (${quotientBase})_${base}  |  Remainder: (${remainderBase})_${base}`,
    steps: [
      {
        stepNumber: 1,
        title: `${baseName} Long Division Rules`,
        explanation: `Dividend (${cleanA}) ko Divisor (${cleanB}) se divide karte hain long division method se. Har step par next digit niche laya jata hai aur partial quotient note kiya jata hai.`,
        mathDetail: `Dividend = ${cleanA} (${decA}₁₀), Divisor = ${cleanB} (${decB}₁₀)`
      },
      ...(longDivSteps.length > 0
        ? [
            {
              stepNumber: 2,
              title: 'Long Division Step-by-Step Traversal',
              explanation: 'Digit by digit division procedure:',
              subSteps: longDivSteps
            }
          ]
        : []),
      {
        stepNumber: longDivSteps.length > 0 ? 3 : 2,
        title: 'Formula Check: Dividend = (Divisor × Quotient) + Remainder',
        explanation: `Cross verification in Base ${base}:\n(${cleanB}) × (${quotientBase}) + (${remainderBase}) = (${cleanA})_${base}.`,
        mathDetail: `Decimal check: (${decB} × ${quotientDec}) + ${remainderDec} = ${decA}₁₀`,
        highlight: true
      }
    ],
    additionalInfo: {
      tableHeaders: ['Component', `Base ${base} Value`, 'Decimal Value'],
      tableRows: [
        ['Dividend (A)', `(${cleanA})_${base}`, decA],
        ['Divisor (B)', `(${cleanB})_${base}`, decB],
        ['Quotient (Q)', `(${quotientBase})_${base}`, quotientDec],
        ['Remainder (R)', `(${remainderBase})_${base}`, remainderDec]
      ]
    }
  };
}

export function solveNumberSystem(
  type: NumberSystemType,
  input1: string,
  input2 = '',
  options?: {
    bitWidth?: number;
    gateType?: string;
    kmapVars?: number;
    kmapMinterms?: number[];
    arithmeticBase?: number;
    arithmeticOp?: '+' | '-' | '*' | '/';
  }
): NumberSolverResult {
  const cleanInput1 = input1.trim();
  const cleanInput2 = input2.trim();

  switch (type) {
    // ------------------------------------------------------------------------
    // 1. Decimal to Binary (With Full Point / Fractional Part Support)
    // ------------------------------------------------------------------------
    case 'dec-to-bin': {
      if (!/^\d+(\.\d+)?$/.test(cleanInput1)) {
        throw new Error('Kripya ek valid positive decimal number enter karein (jaise: 25 ya 25.625 ya 10.5).');
      }

      const parts = cleanInput1.split('.');
      const intNum = parseInt(parts[0], 10);
      const hasFraction = parts.length > 1 && parseFloat(`0.${parts[1]}`) > 0;
      const fracVal = hasFraction ? parseFloat(`0.${parts[1]}`) : 0;

      // --- Part A: Integer conversion via division by 2 ---
      let intBinary = '';
      const intSteps: StepItem[] = [];
      const tableRows: (string | number)[][] = [];

      intSteps.push({
        stepNumber: 1,
        title: hasFraction ? 'Step 1: Integer Part (' + intNum + ') ko Binary mein Badlo' : 'Division-by-2 Method Samjho',
        explanation: `${intNum} ko baar-baar 2 se divide karte rahenge jab tak quotient 0 na ho jaye. Har step ka remainder note karenge.`,
        mathDetail: 'Rule: Number ÷ 2 → Quotient aur Remainder note karo'
      });

      if (intNum === 0) {
        intBinary = '0';
        tableRows.push([0, 2, 0, 0]);
      } else {
        let current = intNum;
        const remainders: number[] = [];
        let stepCount = 2;

        while (current > 0) {
          const quotient = Math.floor(current / 2);
          const rem = current % 2;
          remainders.push(rem);

          intSteps.push({
            stepNumber: stepCount,
            title: `Divide by 2: ${current} ÷ 2`,
            explanation: `${current} ko 2 se divide kiya → Quotient = ${quotient}, Remainder = ${rem}.`,
            mathDetail: `${current} ÷ 2 = ${quotient} (Remainder = ${rem})`
          });

          tableRows.push([current, 2, quotient, rem]);
          current = quotient;
          stepCount++;
        }

        intBinary = remainders.slice().reverse().join('');

        intSteps.push({
          stepNumber: stepCount,
          title: 'Integer Remainders ko Reverse Order (Neeche se Upar) likho',
          explanation: `Sabhi remainders ko bottom-to-top padhein. Integer part ka binary mila: ${intBinary}`,
          mathDetail: `Integer (${intNum})₁₀ = (${intBinary})₂`
        });
      }

      // --- Part B: Fractional conversion via multiplication by 2 ---
      let fracBinary = '';
      const allSteps = [...intSteps];

      if (hasFraction) {
        const fracResult = convertDecimalFraction(fracVal, 2, 'Binary');
        fracBinary = fracResult.fractionDigits;

        allSteps.push({
          stepNumber: allSteps.length + 1,
          title: `Step 2: Point ke Baad Wale Fractional Part (0.${parts[1]}) ko 2 se Multiply Karo`,
          explanation: `Point ke baad wale hisse ko 2 se multiply karte hain aur integer part (0 ya 1) ko TOP TO BOTTOM likhte hain:`,
          subSteps: fracResult.steps[0].subSteps
        });
      }

      const finalBinary = hasFraction ? `${intBinary}.${fracBinary}` : intBinary;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Integer aur Fractional Parts ko Combine Karo',
        explanation: hasFraction
          ? `Integer part (${intBinary}) aur Fractional part (.${fracBinary}) ko jodkar final binary banaya.`
          : `Final verified binary number ready hai.`,
        mathDetail: `(${cleanInput1})₁₀ = (${finalBinary})₂`,
        highlight: true
      });

      return {
        title: 'Decimal to Binary Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalBinary})₂`,
        steps: allSteps,
        additionalInfo: {
          binary: finalBinary,
          decimal: cleanInput1,
          tableHeaders: ['Number / Frac', 'Divisor / Base', 'Quotient / Product', 'Remainder / Bit'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 2. Decimal to Octal (With Point / Fraction Support)
    // ------------------------------------------------------------------------
    case 'dec-to-oct': {
      if (!/^\d+(\.\d+)?$/.test(cleanInput1)) {
        throw new Error('Valid decimal number enter karein (jaise: 75 ya 25.625).');
      }

      const parts = cleanInput1.split('.');
      const intNum = parseInt(parts[0], 10);
      const hasFraction = parts.length > 1 && parseFloat(`0.${parts[1]}`) > 0;
      const fracVal = hasFraction ? parseFloat(`0.${parts[1]}`) : 0;

      let intOctal = '';
      const intSteps: StepItem[] = [];
      const tableRows: (string | number)[][] = [];

      intSteps.push({
        stepNumber: 1,
        title: hasFraction ? `Integer Part (${intNum}) ko Octal mein Badlo (÷ 8)` : 'Division-by-8 Rule',
        explanation: `Octal ka base 8 hota hai. ${intNum} ko lagatar 8 se divide karenge aur har step ka remainder note karenge.`,
        mathDetail: 'Formula: Number ÷ 8'
      });

      if (intNum === 0) {
        intOctal = '0';
        tableRows.push([0, 8, 0, 0]);
      } else {
        let current = intNum;
        const remainders: number[] = [];
        let stepCount = 2;

        while (current > 0) {
          const quotient = Math.floor(current / 8);
          const rem = current % 8;
          remainders.push(rem);

          intSteps.push({
            stepNumber: stepCount,
            title: `Divide by 8: ${current} ÷ 8`,
            explanation: `${current} ko 8 se divide kiya → Quotient = ${quotient}, Remainder = ${rem}.`,
            mathDetail: `${current} ÷ 8 = ${quotient} (Remainder = ${rem})`
          });

          tableRows.push([current, 8, quotient, rem]);
          current = quotient;
          stepCount++;
        }

        intOctal = remainders.slice().reverse().join('');
        intSteps.push({
          stepNumber: stepCount,
          title: 'Remainders ko Reverse Order mein likho',
          explanation: `Bottom-to-top padhne par Integer Octal = ${intOctal} milta hai.`,
          mathDetail: `Integer (${intNum})₁₀ = (${intOctal})₈`
        });
      }

      const allSteps = [...intSteps];
      let fracOctal = '';

      if (hasFraction) {
        const fracResult = convertDecimalFraction(fracVal, 8, 'Octal');
        fracOctal = fracResult.fractionDigits;

        allSteps.push({
          stepNumber: allSteps.length + 1,
          title: `Point ke Baad Wale Fraction (0.${parts[1]}) ko 8 se Multiply Karo`,
          explanation: `Point ke baad wale hisse ko 8 se multiply karte hain aur integer part (0-7) ko top to bottom likhte hain:`,
          subSteps: fracResult.steps[0].subSteps
        });
      }

      const finalOctal = hasFraction ? `${intOctal}.${fracOctal}` : intOctal;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Combine Integer & Fractional Octal',
        explanation: `Integer part (${intOctal}) aur fraction (.${fracOctal}) ko milaya:`,
        mathDetail: `(${cleanInput1})₁₀ = (${finalOctal})₈`,
        highlight: true
      });

      return {
        title: 'Decimal to Octal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalOctal})₈`,
        steps: allSteps,
        additionalInfo: {
          octal: finalOctal,
          decimal: cleanInput1,
          tableHeaders: ['Number', 'Base', 'Quotient', 'Remainder'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 3. Decimal to Hexadecimal (With Point / Fraction Support)
    // ------------------------------------------------------------------------
    case 'dec-to-hex': {
      if (!/^\d+(\.\d+)?$/.test(cleanInput1)) {
        throw new Error('Valid decimal number enter karein (jaise: 255 ya 25.625).');
      }

      const parts = cleanInput1.split('.');
      const intNum = parseInt(parts[0], 10);
      const hasFraction = parts.length > 1 && parseFloat(`0.${parts[1]}`) > 0;
      const fracVal = hasFraction ? parseFloat(`0.${parts[1]}`) : 0;

      let intHex = '';
      const intSteps: StepItem[] = [];
      const tableRows: (string | number)[][] = [];

      intSteps.push({
        stepNumber: 1,
        title: hasFraction ? `Integer Part (${intNum}) ko Hex mein Badlo (÷ 16)` : 'Division-by-16 & Hex Code Mapping',
        explanation: `Hexadecimal base 16 hota hai. Remainder 10=A, 11=B, 12=C, 13=D, 14=E, 15=F hote hain.`,
        mathDetail: '10→A, 11→B, 12→C, 13→D, 14→E, 15→F'
      });

      if (intNum === 0) {
        intHex = '0';
        tableRows.push([0, 16, 0, 0]);
      } else {
        let current = intNum;
        const remainders: string[] = [];
        let stepCount = 2;

        while (current > 0) {
          const quotient = Math.floor(current / 16);
          const rem = current % 16;
          const hexChar = decToHexChar(rem);
          remainders.push(hexChar);

          const hexNote = rem >= 10 ? ` (${rem} ko Hex mein '${hexChar}' likhte hain)` : '';

          intSteps.push({
            stepNumber: stepCount,
            title: `Divide by 16: ${current} ÷ 16`,
            explanation: `${current} ko 16 se divide kiya → Quotient = ${quotient}, Remainder = ${rem}${hexNote}.`,
            mathDetail: `${current} ÷ 16 = ${quotient} (Remainder = ${rem} → ${hexChar})`
          });

          tableRows.push([current, 16, quotient, `${rem} (${hexChar})`]);
          current = quotient;
          stepCount++;
        }

        intHex = remainders.slice().reverse().join('');
        intSteps.push({
          stepNumber: stepCount,
          title: 'Integer Hex ko Bottom-to-Top likho',
          explanation: `Remainders reverse karke Integer Hex mila: ${intHex}`,
          mathDetail: `Integer (${intNum})₁₀ = (${intHex})₁₆`
        });
      }

      const allSteps = [...intSteps];
      let fracHex = '';

      if (hasFraction) {
        const fracResult = convertDecimalFraction(fracVal, 16, 'Hexadecimal');
        fracHex = fracResult.fractionDigits;

        allSteps.push({
          stepNumber: allSteps.length + 1,
          title: `Point ke Baad Wale Fraction (0.${parts[1]}) ko 16 se Multiply Karo`,
          explanation: `Point ke baad wale hisse ko 16 se multiply karke integer part (0-F) ko top to bottom likhte hain:`,
          subSteps: fracResult.steps[0].subSteps
        });
      }

      const finalHex = hasFraction ? `${intHex}.${fracHex}` : intHex;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Combine Integer & Fractional Hexadecimal',
        explanation: `Integer part (${intHex}) aur fraction (.${fracHex}) ko jod kar final answer:`,
        mathDetail: `(${cleanInput1})₁₀ = (${finalHex})₁₆`,
        highlight: true
      });

      return {
        title: 'Decimal to Hexadecimal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalHex})₁₆`,
        steps: allSteps,
        additionalInfo: {
          hex: finalHex,
          decimal: cleanInput1,
          tableHeaders: ['Number', 'Base', 'Quotient', 'Remainder (Hex)'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 4. Binary to Decimal (With Point / Fractional Bits Support)
    // ------------------------------------------------------------------------
    case 'bin-to-dec': {
      const clean = cleanInput1.replace(/\s+/g, '');
      if (!/^[01]+(\.[01]+)?$/.test(clean)) {
        throw new Error('Binary number mein sirf 0, 1 aur point (.) allowed hai (jaise: 1101 ya 11001.101).');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      // Integer part calculation (positive powers of 2)
      let intTotal = 0;
      const intStepsList: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < intPart.length; i++) {
        const bit = parseInt(intPart[i], 10);
        const power = intPart.length - 1 - i;
        const weight = Math.pow(2, power);
        const prod = bit * weight;
        intTotal += prod;
        intStepsList.push(`${bit} × 2^${power} = ${bit} × ${weight} = ${prod}`);
        tableRows.push([bit, `2^${power}`, weight, prod]);
      }

      const allSteps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Positional Weight Formula Samjho',
          explanation: hasFraction
            ? `Point ke left side positive powers (2⁰, 2¹, 2²...) aur point ke right side negative powers (2⁻¹=0.5, 2⁻²=0.25, 2⁻³=0.125...) se multiply karke sabhi products ko add karte hain.`
            : `Binary se Decimal convert karne ke liye right-to-left har bit ko 2 ke badhte powers se multiply karke add karte hain.`,
          mathDetail: 'Decimal = (bₙ × 2ⁿ) + ... + (b₀ × 2⁰) + (b₋₁ × 2⁻¹) + (b₋₂ × 2⁻²)...'
        },
        {
          stepNumber: 2,
          title: 'Integer Part Calculation (Left of Point)',
          explanation: `Integer bits [${intPart}] ka calculation:`,
          subSteps: intStepsList,
          mathDetail: `Integer Sum = ${intTotal}`
        }
      ];

      // Fractional part calculation (negative powers of 2)
      let fracTotal = 0;
      const fracStepsList: string[] = [];

      if (hasFraction) {
        for (let i = 0; i < fracPart.length; i++) {
          const bit = parseInt(fracPart[i], 10);
          const power = -(i + 1);
          const weight = Math.pow(2, power);
          const prod = bit * weight;
          fracTotal += prod;
          fracStepsList.push(`${bit} × 2^(${power}) = ${bit} × ${weight} = ${prod}`);
          tableRows.push([bit, `2^(${power})`, weight, prod]);
        }

        allSteps.push({
          stepNumber: 3,
          title: 'Fractional Part Calculation (Right of Point)',
          explanation: `Point ke baad wale bits [.${fracPart}] ko 2⁻¹, 2⁻², 2⁻³ se multiply kiya:`,
          subSteps: fracStepsList,
          mathDetail: `Fractional Sum = ${fracTotal}`
        });
      }

      const finalTotal = intTotal + fracTotal;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Sabhi Values ko Add Karke Final Decimal Nikalo',
        explanation: hasFraction
          ? `Integer part (${intTotal}) aur Fractional part (${fracTotal}) ko add kiya.`
          : `Sabhi products ka sum calculate kiya:`,
        mathDetail: hasFraction
          ? `${intTotal} + ${fracTotal} = (${finalTotal})₁₀`
          : `Total = (${finalTotal})₁₀`,
        highlight: true
      });

      return {
        title: 'Binary to Decimal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalTotal})₁₀`,
        steps: allSteps,
        additionalInfo: {
          binary: clean,
          decimal: finalTotal.toString(),
          tableHeaders: ['Bit', 'Power of 2', 'Weight', 'Product'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 5. Binary to Octal (Group by 3 - Left & Right of Point)
    // ------------------------------------------------------------------------
    case 'bin-to-oct': {
      const clean = cleanInput1.replace(/\s+/g, '');
      if (!/^[01]+(\.[01]+)?$/.test(clean)) {
        throw new Error('Valid binary number daliye (sirf 0, 1 aur optional point).');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      // Group Integer part by 3 from RIGHT to LEFT
      let paddedInt = intPart;
      const remInt = paddedInt.length % 3;
      if (remInt !== 0) {
        paddedInt = '0'.repeat(3 - remInt) + paddedInt;
      }

      const intGroups: string[] = [];
      const intOctalDigits: number[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < paddedInt.length; i += 3) {
        const grp = paddedInt.slice(i, i + 3);
        intGroups.push(grp);
        const val = parseInt(grp, 2);
        intOctalDigits.push(val);
        tableRows.push([grp, `${grp[0]}×4 + ${grp[1]}×2 + ${grp[2]}×1`, val]);
      }
      const intOctal = intOctalDigits.join('');

      // Group Fractional part by 3 from LEFT to RIGHT
      let fracOctal = '';
      const fracGroups: string[] = [];
      const fracOctalDigits: number[] = [];

      if (hasFraction) {
        let paddedFrac = fracPart;
        const remFrac = paddedFrac.length % 3;
        if (remFrac !== 0) {
          // IMPORTANT: Pad trailing zeros on right for fractional bits!
          paddedFrac = paddedFrac + '0'.repeat(3 - remFrac);
        }

        for (let i = 0; i < paddedFrac.length; i += 3) {
          const grp = paddedFrac.slice(i, i + 3);
          fracGroups.push(grp);
          const val = parseInt(grp, 2);
          fracOctalDigits.push(val);
          tableRows.push([grp, `${grp[0]}×4 + ${grp[1]}×2 + ${grp[2]}×1`, val]);
        }
        fracOctal = fracOctalDigits.join('');
      }

      const finalOctal = hasFraction ? `${intOctal}.${fracOctal}` : intOctal;

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Group by 3 Rule (Before & After Decimal Point)',
          explanation: hasFraction
            ? `Octal base 8 (2³) hota hai. Point ke left side bits ko RIGHT to LEFT 3-3 ke sets mein baantte hain (aage 0 lagate hain). Aur point ke right side bits ko LEFT to RIGHT 3-3 ke sets mein baantte hain (peeche 0 lagate hain)!`
            : `Octal base 8 (2³) hota hai, isliye binary bits ko right side se 3-3 ke sets mein baantte hain.`,
          mathDetail: hasFraction
            ? `Integer Groups: [${intGroups.join(' | ')}]  .  Fraction Groups: [${fracGroups.join(' | ')}]`
            : `Groups: ${intGroups.join(' | ')}`
        },
        {
          stepNumber: 2,
          title: 'Har 3-bit Group ka Octal Value Nikalo (4-2-1 code)',
          explanation: 'Groups evaluation:',
          subSteps: [
            ...intGroups.map((g, idx) => `Integer "${g}" → ${intOctalDigits[idx]}`),
            ...(hasFraction
              ? fracGroups.map((g, idx) => `Fractional "${g}" → ${fracOctalDigits[idx]}`)
              : [])
          ]
        },
        {
          stepNumber: 3,
          title: 'Final Octal Result Combine Karo',
          explanation: `Sabhi octal digits ko sath mein point ke sath likhein:`,
          mathDetail: `(${clean})₂ = (${finalOctal})₈`,
          highlight: true
        }
      ];

      return {
        title: 'Binary to Octal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalOctal})₈`,
        steps,
        additionalInfo: {
          binary: clean,
          octal: finalOctal,
          tableHeaders: ['3-Bit Group', 'Calculation (4-2-1)', 'Octal Digit'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 6. Binary to Hexadecimal (Group by 4 - Left & Right of Point)
    // ------------------------------------------------------------------------
    case 'bin-to-hex': {
      const clean = cleanInput1.replace(/\s+/g, '');
      if (!/^[01]+(\.[01]+)?$/.test(clean)) {
        throw new Error('Valid binary number daliye (sirf 0, 1 aur optional point).');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      // Integer grouping by 4 from right to left
      let paddedInt = intPart;
      const remInt = paddedInt.length % 4;
      if (remInt !== 0) {
        paddedInt = '0'.repeat(4 - remInt) + paddedInt;
      }

      const intGroups: string[] = [];
      const intHexChars: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < paddedInt.length; i += 4) {
        const grp = paddedInt.slice(i, i + 4);
        intGroups.push(grp);
        const val = parseInt(grp, 2);
        const hexC = decToHexChar(val);
        intHexChars.push(hexC);
        tableRows.push([grp, `${grp[0]}×8 + ${grp[1]}×4 + ${grp[2]}×2 + ${grp[3]}×1`, val, hexC]);
      }
      const intHex = intHexChars.join('');

      // Fractional grouping by 4 from left to right (pad trailing zeros!)
      let fracHex = '';
      const fracGroups: string[] = [];
      const fracHexChars: string[] = [];

      if (hasFraction) {
        let paddedFrac = fracPart;
        const remFrac = paddedFrac.length % 4;
        if (remFrac !== 0) {
          paddedFrac = paddedFrac + '0'.repeat(4 - remFrac);
        }

        for (let i = 0; i < paddedFrac.length; i += 4) {
          const grp = paddedFrac.slice(i, i + 4);
          fracGroups.push(grp);
          const val = parseInt(grp, 2);
          const hexC = decToHexChar(val);
          fracHexChars.push(hexC);
          tableRows.push([grp, `${grp[0]}×8 + ${grp[1]}×4 + ${grp[2]}×2 + ${grp[3]}×1`, val, hexC]);
        }
        fracHex = fracHexChars.join('');
      }

      const finalHex = hasFraction ? `${intHex}.${fracHex}` : intHex;

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Group by 4 Rule (Nibble) - Before & After Decimal Point',
          explanation: hasFraction
            ? `Hexadecimal base 16 (2⁴) hota hai. Point ke pehle right-to-left 4-4 bits ke groups banayein (left mein 0s add karke). Aur point ke baad left-to-right 4-4 bits banayein (right mein trailing 0s add karke).`
            : `Right side se 4-4 bits ke sets banayein. Har 4 bits = 1 Hex character.`,
          mathDetail: hasFraction
            ? `Integer: [${intGroups.join(' | ')}] . Fraction: [${fracGroups.join(' | ')}]`
            : `Groups: ${intGroups.join(' | ')}`
        },
        {
          stepNumber: 2,
          title: 'Har 4-bit Group ko Hex mein Convert Karo (8-4-2-1 Code)',
          explanation: 'Groups conversion:',
          subSteps: [
            ...intGroups.map((g, idx) => `Integer "${g}" → ${intHexChars[idx]}`),
            ...(hasFraction
              ? fracGroups.map((g, idx) => `Fractional "${g}" → ${fracHexChars[idx]}`)
              : [])
          ]
        },
        {
          stepNumber: 3,
          title: 'Hex Result Combine Karo',
          explanation: 'Sabhi hex characters ko combine karein:',
          mathDetail: `(${clean})₂ = (${finalHex})₁₆`,
          highlight: true
        }
      ];

      return {
        title: 'Binary to Hexadecimal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalHex})₁₆`,
        steps,
        additionalInfo: {
          binary: clean,
          hex: finalHex,
          tableHeaders: ['4-Bit Group', 'Calculation (8-4-2-1)', 'Decimal Value', 'Hex Digit'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 7. Octal to Decimal (With Point / Fractional Support)
    // ------------------------------------------------------------------------
    case 'oct-to-dec': {
      const clean = cleanInput1.trim();
      if (!/^[0-7]+(\.[0-7]+)?$/.test(clean)) {
        throw new Error('Octal number mein sirf digits 0 se 7 aur point (.) allowed hain.');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      let intTotal = 0;
      const intMathSteps: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < intPart.length; i++) {
        const digit = parseInt(intPart[i], 10);
        const power = intPart.length - 1 - i;
        const weight = Math.pow(8, power);
        const prod = digit * weight;
        intTotal += prod;
        intMathSteps.push(`${digit} × 8^${power} = ${digit} × ${weight} = ${prod}`);
        tableRows.push([digit, `8^${power}`, weight, prod]);
      }

      const allSteps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Positional Weight Formula (Base 8)',
          explanation: hasFraction
            ? `Point ke pehle 8 ki positive powers (8⁰=1, 8¹=8, 8²=64...) aur point ke baad 8 ki negative powers (8⁻¹=0.125, 8⁻²=0.015625...) se multiply karke sum karenge.`
            : `Octal digits ko 8 ki powers (8⁰, 8¹, 8²...) se multiply karke sum karenge.`,
          mathDetail: 'Decimal = (dₙ × 8ⁿ) + ... + (d₀ × 8⁰) + (d₋₁ × 8⁻¹) + ...'
        },
        {
          stepNumber: 2,
          title: 'Integer Part Calculation (Left of Point)',
          explanation: 'Calculation steps:',
          subSteps: intMathSteps,
          mathDetail: `Integer Sum = ${intTotal}`
        }
      ];

      let fracTotal = 0;
      const fracMathSteps: string[] = [];

      if (hasFraction) {
        for (let i = 0; i < fracPart.length; i++) {
          const digit = parseInt(fracPart[i], 10);
          const power = -(i + 1);
          const weight = Math.pow(8, power);
          const prod = digit * weight;
          fracTotal += prod;
          fracMathSteps.push(`${digit} × 8^(${power}) = ${digit} × ${weight.toFixed(6)} = ${prod.toFixed(6)}`);
          tableRows.push([digit, `8^(${power})`, weight.toFixed(6), prod.toFixed(6)]);
        }

        allSteps.push({
          stepNumber: 3,
          title: 'Fractional Part Calculation (Right of Point)',
          explanation: 'Point ke baad wale digits ka calculation:',
          subSteps: fracMathSteps,
          mathDetail: `Fractional Sum = ${fracTotal}`
        });
      }

      const finalTotal = intTotal + fracTotal;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Final Total Calculate Karo',
        explanation: 'Integer aur fractional values ka jod:',
        mathDetail: hasFraction
          ? `${intTotal} + ${fracTotal} = (${finalTotal})₁₀`
          : `Total = (${finalTotal})₁₀`,
        highlight: true
      });

      return {
        title: 'Octal to Decimal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalTotal})₁₀`,
        steps: allSteps,
        additionalInfo: {
          octal: clean,
          decimal: finalTotal.toString(),
          tableHeaders: ['Octal Digit', 'Power of 8', 'Weight', 'Product'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 8. Octal to Binary (With Point / Fractional Support)
    // ------------------------------------------------------------------------
    case 'oct-to-bin': {
      const clean = cleanInput1.trim();
      if (!/^[0-7]+(\.[0-7]+)?$/.test(clean)) {
        throw new Error('Octal number mein sirf digits 0 se 7 aur point (.) allowed hain.');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      const intBinaryGroups: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < intPart.length; i++) {
        const d = parseInt(intPart[i], 10);
        const bin3 = d.toString(2).padStart(3, '0');
        intBinaryGroups.push(bin3);
        tableRows.push([d, 'Integer', `${bin3[0]}×4 + ${bin3[1]}×2 + ${bin3[2]}×1`, bin3]);
      }

      const intBinaryCombined = intBinaryGroups.join('').replace(/^0+(?!$)/, '') || '0';

      const fracBinaryGroups: string[] = [];
      if (hasFraction) {
        for (let i = 0; i < fracPart.length; i++) {
          const d = parseInt(fracPart[i], 10);
          const bin3 = d.toString(2).padStart(3, '0');
          fracBinaryGroups.push(bin3);
          tableRows.push([d, 'Fraction', `${bin3[0]}×4 + ${bin3[1]}×2 + ${bin3[2]}×1`, bin3]);
        }
      }

      const fracBinaryCombined = fracBinaryGroups.join('');
      const finalBinary = hasFraction ? `${intBinaryCombined}.${fracBinaryCombined}` : intBinaryCombined;

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Direct 3-Bit Substitution Rule',
          explanation: `Har octal digit ko sidha uske 3-bit binary equivalent mein badalte hain (jaise 7=111, 5=101, 2=010). Point ke pehle aur point ke baad har digit par yehi rule lagta hai.`,
          mathDetail: '1 Octal Digit = 3 Binary Bits (4-2-1 Code)'
        },
        {
          stepNumber: 2,
          title: 'Har Digit ko 3-bit Binary mein Badlo',
          explanation: 'Substitutions:',
          subSteps: [
            ...intPart.split('').map((d, i) => `Integer '${d}' → ${intBinaryGroups[i]}`),
            ...(hasFraction
              ? fracPart.split('').map((d, i) => `Fraction '${d}' → ${fracBinaryGroups[i]}`)
              : [])
          ]
        },
        {
          stepNumber: 3,
          title: 'Combined Binary Result',
          explanation: `Sabhi 3-bit groups ko combine kiya:`,
          mathDetail: `(${clean})₈ = (${finalBinary})₂`,
          highlight: true
        }
      ];

      return {
        title: 'Octal to Binary Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalBinary})₂`,
        steps,
        additionalInfo: {
          octal: clean,
          binary: finalBinary,
          tableHeaders: ['Octal Digit', 'Part', '4-2-1 Breakdown', '3-Bit Binary'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 9. Hexadecimal to Decimal (With Point / Fractional Support)
    // ------------------------------------------------------------------------
    case 'hex-to-dec': {
      const clean = cleanInput1.trim().toUpperCase();
      if (!/^[0-9A-F]+(\.[0-9A-F]+)?$/.test(clean)) {
        throw new Error('Hexadecimal number mein sirf 0-9, A-F aur point (.) allowed hain.');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      let intTotal = 0;
      const intMathSteps: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < intPart.length; i++) {
        const char = intPart[i];
        const val = hexCharToDec(char);
        const power = intPart.length - 1 - i;
        const weight = Math.pow(16, power);
        const prod = val * weight;
        intTotal += prod;

        intMathSteps.push(`${char} (${val}) × 16^${power} = ${val} × ${weight} = ${prod}`);
        tableRows.push([char, val, `16^${power}`, weight, prod]);
      }

      const allSteps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Hex Positional Weight Formula (Base 16)',
          explanation: hasFraction
            ? `Point ke pehle 16 ki positive powers (16⁰=1, 16¹=16, 16²=256...) aur point ke baad 16 ki negative powers (16⁻¹=0.0625, 16⁻²=0.00390625...) se multiply karke sum karenge. (A=10, B=11, C=12, D=13, E=14, F=15).`
            : `Hex digits ko 16 ki powers se multiply karke sum karenge.`,
          mathDetail: 'Decimal = (hₙ × 16ⁿ) + ... + (h₀ × 16⁰) + (h₋₁ × 16⁻¹) + ...'
        },
        {
          stepNumber: 2,
          title: 'Integer Part Calculation (Left of Point)',
          explanation: 'Calculation steps:',
          subSteps: intMathSteps,
          mathDetail: `Integer Sum = ${intTotal}`
        }
      ];

      let fracTotal = 0;
      const fracMathSteps: string[] = [];

      if (hasFraction) {
        for (let i = 0; i < fracPart.length; i++) {
          const char = fracPart[i];
          const val = hexCharToDec(char);
          const power = -(i + 1);
          const weight = Math.pow(16, power);
          const prod = val * weight;
          fracTotal += prod;

          fracMathSteps.push(`${char} (${val}) × 16^(${power}) = ${val} × ${weight.toFixed(6)} = ${prod.toFixed(6)}`);
          tableRows.push([char, val, `16^(${power})`, weight.toFixed(6), prod.toFixed(6)]);
        }

        allSteps.push({
          stepNumber: 3,
          title: 'Fractional Part Calculation (Right of Point)',
          explanation: 'Point ke baad wale hex characters ka calculation:',
          subSteps: fracMathSteps,
          mathDetail: `Fractional Sum = ${fracTotal}`
        });
      }

      const finalTotal = intTotal + fracTotal;

      allSteps.push({
        stepNumber: allSteps.length + 1,
        title: 'Final Total Calculate Karo',
        explanation: 'Integer aur fractional values ka jod:',
        mathDetail: hasFraction
          ? `${intTotal} + ${fracTotal} = (${finalTotal})₁₀`
          : `Total = (${finalTotal})₁₀`,
        highlight: true
      });

      return {
        title: 'Hexadecimal to Decimal Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalTotal})₁₀`,
        steps: allSteps,
        additionalInfo: {
          hex: clean,
          decimal: finalTotal.toString(),
          tableHeaders: ['Hex Char', 'Decimal Val', 'Power of 16', 'Weight', 'Product'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 10. Hexadecimal to Binary (With Point / Fractional Support)
    // ------------------------------------------------------------------------
    case 'hex-to-bin': {
      const clean = cleanInput1.trim().toUpperCase();
      if (!/^[0-9A-F]+(\.[0-9A-F]+)?$/.test(clean)) {
        throw new Error('Hexadecimal number mein sirf 0-9, A-F aur point (.) allowed hain.');
      }

      const parts = clean.split('.');
      const intPart = parts[0];
      const hasFraction = parts.length > 1 && parts[1].length > 0;
      const fracPart = hasFraction ? parts[1] : '';

      const intBinaryGroups: string[] = [];
      const tableRows: (string | number)[][] = [];

      for (let i = 0; i < intPart.length; i++) {
        const char = intPart[i];
        const val = hexCharToDec(char);
        const bin4 = val.toString(2).padStart(4, '0');
        intBinaryGroups.push(bin4);
        tableRows.push([char, val, 'Integer', bin4]);
      }
      const intBinaryCombined = intBinaryGroups.join('').replace(/^0+(?!$)/, '') || '0';

      const fracBinaryGroups: string[] = [];
      if (hasFraction) {
        for (let i = 0; i < fracPart.length; i++) {
          const char = fracPart[i];
          const val = hexCharToDec(char);
          const bin4 = val.toString(2).padStart(4, '0');
          fracBinaryGroups.push(bin4);
          tableRows.push([char, val, 'Fraction', bin4]);
        }
      }
      const fracBinaryCombined = fracBinaryGroups.join('');

      const finalBinary = hasFraction ? `${intBinaryCombined}.${fracBinaryCombined}` : intBinaryCombined;

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Direct 4-Bit (Nibble) Conversion Rule',
          explanation: `Har Hexadecimal character ko sidha uske 4-bit binary group mein badlein (8-4-2-1 rule). Point ke aage aur peeche dono jagah same rule apply hota hai.`,
          mathDetail: '1 Hex Character = 4 Binary Bits'
        },
        {
          stepNumber: 2,
          title: 'Har Character ko 4-bit Binary mein Badlo',
          explanation: 'Substitutions:',
          subSteps: [
            ...intPart.split('').map((c, i) => `Integer '${c}' (${hexCharToDec(c)}) → ${intBinaryGroups[i]}`),
            ...(hasFraction
              ? fracPart.split('').map((c, i) => `Fraction '${c}' (${hexCharToDec(c)}) → ${fracBinaryGroups[i]}`)
              : [])
          ]
        },
        {
          stepNumber: 3,
          title: 'Groups Combine Karo',
          explanation: 'Sabhi 4-bit groups ko mila kar final binary answer:',
          mathDetail: `(${clean})₁₆ = (${finalBinary})₂`,
          highlight: true
        }
      ];

      return {
        title: 'Hexadecimal to Binary Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `(${finalBinary})₂`,
        steps,
        additionalInfo: {
          hex: clean,
          binary: finalBinary,
          tableHeaders: ['Hex Char', 'Value', 'Part', '4-Bit Binary'],
          tableRows
        }
      };
    }

    // ------------------------------------------------------------------------
    // 11. Decimal to All (Binary + Octal + Hex with Point/Fraction Support)
    // ------------------------------------------------------------------------
    case 'dec-to-all': {
      if (!/^\d+(\.\d+)?$/.test(cleanInput1)) {
        throw new Error('Valid positive decimal number enter karein (jaise: 64 ya 25.625).');
      }

      const binRes = solveNumberSystem('dec-to-bin', cleanInput1);
      const octRes = solveNumberSystem('dec-to-oct', cleanInput1);
      const hexRes = solveNumberSystem('dec-to-hex', cleanInput1);

      const bin = binRes.finalAnswer.replace(/[()₂]/g, '');
      const oct = octRes.finalAnswer.replace(/[()₈]/g, '');
      const hex = hexRes.finalAnswer.replace(/[()₁₆]/g, '');

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Decimal to Binary (Base 2)',
          explanation: `Number ${cleanInput1} ko binary mein convert kiya:`,
          mathDetail: `(${cleanInput1})₁₀ = (${bin})₂`
        },
        {
          stepNumber: 2,
          title: 'Decimal to Octal (Base 8)',
          explanation: `Number ${cleanInput1} ko octal mein convert kiya:`,
          mathDetail: `(${cleanInput1})₁₀ = (${oct})₈`
        },
        {
          stepNumber: 3,
          title: 'Decimal to Hexadecimal (Base 16)',
          explanation: `Number ${cleanInput1} ko hexadecimal mein convert kiya:`,
          mathDetail: `(${cleanInput1})₁₀ = (${hex})₁₆`
        },
        {
          stepNumber: 4,
          title: 'Summary Comparison',
          explanation: `Number ${cleanInput1} ka sabhi number systems mein representation:`,
          mathDetail: `Binary: ${bin}₂ | Octal: ${oct}₈ | Hexadecimal: ${hex}₁₆`,
          highlight: true
        }
      ];

      return {
        title: 'Decimal to All Bases Conversion',
        input: cleanInput1,
        type,
        finalAnswer: `Bin: (${bin})₂  |  Oct: (${oct})₈  |  Hex: (${hex})₁₆`,
        steps,
        additionalInfo: {
          decimal: cleanInput1,
          binary: bin,
          octal: oct,
          hex: hex,
          tableHeaders: ['Base Name', 'Radix (Base)', 'Result'],
          tableRows: [
            ['Binary', 2, `(${bin})₂`],
            ['Octal', 8, `(${oct})₈`],
            ['Hexadecimal', 16, `(${hex})₁₆`]
          ]
        }
      };
    }

    // ------------------------------------------------------------------------
    // 12. Binary Addition
    // ------------------------------------------------------------------------
    case 'bin-add': {
      const bin1 = cleanInput1.replace(/\s+/g, '');
      const bin2 = (cleanInput2 || '0').replace(/\s+/g, '');

      if (!/^[01]+(\.[01]+)?$/.test(bin1) || !/^[01]+(\.[01]+)?$/.test(bin2)) {
        throw new Error('Dono binary inputs mein sirf 0, 1 aur point allowed hain.');
      }

      // Check if either has fraction
      const p1 = bin1.split('.');
      const p2 = bin2.split('.');
      const hasFraction = p1.length > 1 || p2.length > 1;

      if (!hasFraction) {
        // Pure integer addition
        const maxLen = Math.max(bin1.length, bin2.length);
        const pad1 = bin1.padStart(maxLen, '0');
        const pad2 = bin2.padStart(maxLen, '0');

        let carry = 0;
        const resultBits: number[] = [];
        const bitSteps: string[] = [];
        const tableRows: (string | number)[][] = [];

        for (let i = maxLen - 1; i >= 0; i--) {
          const b1 = parseInt(pad1[i], 10);
          const b2 = parseInt(pad2[i], 10);
          const sum = b1 + b2 + carry;
          const outBit = sum % 2;
          const nextCarry = Math.floor(sum / 2);

          bitSteps.unshift(`Pos ${maxLen - 1 - i}: ${b1} + ${b2} + carry(${carry}) = sum ${sum} → Bit = ${outBit}, Next Carry = ${nextCarry}`);
          tableRows.unshift([`2^${maxLen - 1 - i}`, carry, b1, b2, outBit, nextCarry]);

          resultBits.unshift(outBit);
          carry = nextCarry;
        }

        if (carry > 0) {
          resultBits.unshift(carry);
          bitSteps.unshift(`Final Carry: leftover carry = ${carry} aage jud gaya.`);
        }

        const finalBinary = resultBits.join('');

        return {
          title: 'Binary Addition',
          input: `${bin1} + ${bin2}`,
          type,
          finalAnswer: `(${finalBinary})₂`,
          steps: [
            {
              stepNumber: 1,
              title: 'Binary Addition Rules',
              explanation: 'Rules: 0+0=0, 0+1=1, 1+0=1, 1+1=0 (carry 1), 1+1+1=1 (carry 1).',
              mathDetail: 'Right to Left bit-by-bit add karein'
            },
            {
              stepNumber: 2,
              title: 'Bitwise Addition Steps',
              explanation: 'Bit by bit calculation:',
              subSteps: bitSteps
            },
            {
              stepNumber: 3,
              title: 'Verification via Decimal',
              explanation: `Decimal: ${parseInt(bin1, 2)} + ${parseInt(bin2, 2)} = ${parseInt(finalBinary, 2)}.`,
              mathDetail: `${bin1}₂ + ${bin2}₂ = ${finalBinary}₂`,
              highlight: true
            }
          ],
          additionalInfo: {
            binary: finalBinary,
            tableHeaders: ['Position', 'Carry-In', 'Bit A', 'Bit B', 'Sum Bit', 'Carry-Out'],
            tableRows
          }
        };
      } else {
        // Fractional addition with point alignment
        const int1 = p1[0];
        const frac1 = p1[1] || '';
        const int2 = p2[0];
        const frac2 = p2[1] || '';

        const maxFracLen = Math.max(frac1.length, frac2.length);
        const padFrac1 = frac1.padEnd(maxFracLen, '0');
        const padFrac2 = frac2.padEnd(maxFracLen, '0');

        const maxIntLen = Math.max(int1.length, int2.length);
        const padInt1 = int1.padStart(maxIntLen, '0');
        const padInt2 = int2.padStart(maxIntLen, '0');

        // Full aligned strings
        const fullA = padInt1 + padFrac1;
        const fullB = padInt2 + padFrac2;

        let carry = 0;
        const resultBits: number[] = [];
        const bitSteps: string[] = [];

        for (let i = fullA.length - 1; i >= 0; i--) {
          const b1 = parseInt(fullA[i], 10);
          const b2 = parseInt(fullB[i], 10);
          const sum = b1 + b2 + carry;
          const outBit = sum % 2;
          const nextCarry = Math.floor(sum / 2);

          const isFrac = i >= maxIntLen;
          const label = isFrac ? `Frac Pos ${i - maxIntLen + 1}` : `Int Pos ${maxIntLen - 1 - i}`;
          bitSteps.unshift(`${label}: ${b1} + ${b2} + carry(${carry}) → Bit ${outBit}, Next Carry ${nextCarry}`);

          resultBits.unshift(outBit);
          carry = nextCarry;
        }

        if (carry > 0) {
          resultBits.unshift(carry);
        }

        const intResultBits = resultBits.slice(0, resultBits.length - maxFracLen);
        const fracResultBits = resultBits.slice(resultBits.length - maxFracLen);
        const finalBinary = `${intResultBits.join('')}.${fracResultBits.join('')}`;

        return {
          title: 'Fractional Binary Addition',
          input: `${bin1} + ${bin2}`,
          type,
          finalAnswer: `(${finalBinary})₂`,
          steps: [
            {
              stepNumber: 1,
              title: 'Point Alignment & Trailing Zero Padding',
              explanation: `Point ke right side bits ko align karne ke liye chote fraction ke aage zeros lagaye: A=${padInt1}.${padFrac1}, B=${padInt2}.${padFrac2}`,
              mathDetail: `Aligned: ${padInt1}.${padFrac1} + ${padInt2}.${padFrac2}`
            },
            {
              stepNumber: 2,
              title: 'Right to Left Addition Steps',
              explanation: 'LSB se start karke carry aage pass kiya:',
              subSteps: bitSteps
            },
            {
              stepNumber: 3,
              title: 'Final Fractional Binary Sum',
              explanation: `Integer aur fractional parts ko decimal point se separate karke final result likha.`,
              mathDetail: `Result = (${finalBinary})₂`,
              highlight: true
            }
          ]
        };
      }
    }

    // ------------------------------------------------------------------------
    // Binary Subtraction
    // ------------------------------------------------------------------------
    case 'bin-sub': {
      const bin1 = cleanInput1.replace(/\s+/g, '');
      const bin2 = (cleanInput2 || '0').replace(/\s+/g, '');

      if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
        throw new Error('Dono numbers binary (0 aur 1) hone chahiye.');
      }

      const dec1 = parseInt(bin1, 2);
      const dec2 = parseInt(bin2, 2);

      const isNegative = dec1 < dec2;
      const diffDec = Math.abs(dec1 - dec2);
      const diffBin = diffDec.toString(2);

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: 'Binary Subtraction Concept (2\'s Complement Method)',
          explanation: `BCA exams mein A - B nikalne ke liye 2's Complement method sabse standard hota hai: A - B = A + (2's complement of B).`,
          mathDetail: `A = ${bin1}₂ (${dec1}₁₀), B = ${bin2}₂ (${dec2}₁₀)`
        }
      ];

      const bitLen = Math.max(bin1.length, bin2.length) + 1;
      const b2Padded = bin2.padStart(bitLen, '0');
      const onesComp = b2Padded.split('').map((b) => (b === '0' ? '1' : '0')).join('');
      const twosCompDec = parseInt(onesComp, 2) + 1;
      const twosComp = twosCompDec.toString(2).padStart(bitLen, '0');

      steps.push({
        stepNumber: 2,
        title: `B (${bin2}) ka 2's Complement Nikalo`,
        explanation: `1's complement: bits flip karo → ${onesComp}. Phir 1 add karo → ${twosComp}.`,
        mathDetail: `2's Complement of B = ${twosComp}`
      });

      const aPadded = bin1.padStart(bitLen, '0');
      const sumDec = parseInt(aPadded, 2) + twosCompDec;
      const sumBin = sumDec.toString(2);

      steps.push({
        stepNumber: 3,
        title: `A aur 2's complement of B ko Add Karo`,
        explanation: `${aPadded} + ${twosComp} = ${sumBin}`,
        mathDetail: `${aPadded} + ${twosComp} = ${sumBin}`
      });

      if (!isNegative) {
        steps.push({
          stepNumber: 4,
          title: 'End Carry Discard Karo',
          explanation: `Kyuki A ≥ B hai, end carry产生 hua jise discard karenge. Result positive hai.`,
          mathDetail: `Result = ${diffBin}₂ (${diffDec}₁₀)`,
          highlight: true
        });
      } else {
        steps.push({
          stepNumber: 4,
          title: 'Negative Result (No End Carry)',
          explanation: `Kyuki A < B tha, koi carry nahi aaya. Iska matlab result negative hai aur 2's complement form mein hai.`,
          mathDetail: `Result = -${diffBin}₂ (-${diffDec}₁₀)`,
          highlight: true
        });
      }

      const finalAns = isNegative ? `-${diffBin}₂` : `${diffBin}₂`;

      return {
        title: 'Binary Subtraction',
        input: `${bin1} - ${bin2}`,
        type,
        finalAnswer: `(${finalAns})`,
        steps,
        additionalInfo: {
          notes: `Decimal check: ${dec1} - ${dec2} = ${dec1 - dec2}`
        }
      };
    }

    // ------------------------------------------------------------------------
    // 13. 1's Complement & 2's Complement
    // ------------------------------------------------------------------------
    case 'complements': {
      const clean = cleanInput1.replace(/\s+/g, '');
      if (!/^[01]+$/.test(clean)) {
        throw new Error('Valid binary number enter karein (sirf 0 aur 1).');
      }

      const chosenWidth = options?.bitWidth || Math.max(8, clean.length);
      const padded = clean.padStart(chosenWidth, '0');

      const ones = padded
        .split('')
        .map((b) => (b === '0' ? '1' : '0'))
        .join('');

      const onesDec = parseInt(ones, 2);
      const twosDec = onesDec + 1;
      const twosRaw = twosDec.toString(2);
      const twos = twosRaw.slice(-chosenWidth).padStart(chosenWidth, '0');

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: `Bit Width Alignment (${chosenWidth}-bit representation)`,
          explanation: `Number ko fixed bit width (jaise 8-bit ya 16-bit) mein represent kiya jata hai. Left side mein zeros add kiye: ${padded}`,
          mathDetail: `Original: ${clean} → ${chosenWidth}-bit Padded: ${padded}`
        },
        {
          stepNumber: 2,
          title: "1's Complement Nikalo (Invert all bits)",
          explanation: "Har 0 ko 1 aur har 1 ko 0 bana diya jata hai (NOT operation).",
          mathDetail: `${padded} → Invert → ${ones}`
        },
        {
          stepNumber: 3,
          title: "2's Complement Nikalo (1's complement + 1)",
          explanation: "2's complement ka formula hai: (1's Complement) + 1. Rightmost bit (LSB) mein 1 add karein.",
          mathDetail: `${ones} + 1 = ${twos}`,
          highlight: true
        },
        {
          stepNumber: 4,
          title: 'Sign Significance (Signed Magnitude)',
          explanation: `MSB (pehla bit) agar 1 hai toh number negative represent karta hai computer memory mein.`,
          mathDetail: `MSB = ${twos[0]} (${twos[0] === '1' ? 'Negative' : 'Positive'})`
        }
      ];

      return {
        title: "1's & 2's Complement Calculator",
        input: cleanInput1,
        type,
        finalAnswer: `1's Comp: ${ones}  |  2's Comp: ${twos}`,
        steps,
        additionalInfo: {
          binary: clean,
          tableHeaders: ['Property', 'Value'],
          tableRows: [
            ['Original Input', clean],
            [`${chosenWidth}-bit Representation`, padded],
            ["1's Complement", ones],
            ["2's Complement", twos]
          ]
        }
      };
    }

    // ------------------------------------------------------------------------
    // 14. Logical Gates
    // ------------------------------------------------------------------------
    case 'logic-gates': {
      const gate = (options?.gateType || cleanInput1 || 'AND').toUpperCase();
      const inA = cleanInput1 === '1' || cleanInput1 === 'true' ? 1 : 0;
      const inB = cleanInput2 === '1' || cleanInput2 === 'true' ? 1 : 0;

      let gateFormula = '';
      let hinglishDesc = '';
      let testOutput = 0;
      let truthTable: [number, number, number][] = [];

      switch (gate) {
        case 'AND':
          gateFormula = 'Y = A · B';
          hinglishDesc = 'AND Gate: Output sirf tabhi 1 hoga jab DONO inputs A aur B 1 honge.';
          testOutput = inA & inB;
          truthTable = [
            [0, 0, 0],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 1]
          ];
          break;

        case 'OR':
          gateFormula = 'Y = A + B';
          hinglishDesc = 'OR Gate: Output 1 hoga agar koi BHI EK input (ya dono) 1 ho.';
          testOutput = inA | inB;
          truthTable = [
            [0, 0, 0],
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
          ];
          break;

        case 'NOT':
          gateFormula = 'Y = Ā (A bar)';
          hinglishDesc = 'NOT Gate (Inverter): Single input gate. 0 ka 1 aur 1 ka 0.';
          testOutput = inA === 1 ? 0 : 1;
          truthTable = [
            [0, 0, 1],
            [1, 0, 0]
          ];
          break;

        case 'NAND':
          gateFormula = 'Y = (A · B)̄';
          hinglishDesc = 'NAND Gate: Universal gate. AND gate ka ulta output deta hai.';
          testOutput = (inA & inB) === 1 ? 0 : 1;
          truthTable = [
            [0, 0, 1],
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
          ];
          break;

        case 'NOR':
          gateFormula = 'Y = (A + B)̄';
          hinglishDesc = 'NOR Gate: Universal gate. OR gate ka ulta output deta hai.';
          testOutput = (inA | inB) === 1 ? 0 : 1;
          truthTable = [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 0]
          ];
          break;

        case 'XOR':
          gateFormula = 'Y = A ⊕ B';
          hinglishDesc = 'XOR Gate: Output tabhi 1 hoga jab dono inputs ALAG-ALAG honge.';
          testOutput = inA ^ inB;
          truthTable = [
            [0, 0, 0],
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
          ];
          break;

        case 'XNOR':
        default:
          gateFormula = 'Y = (A ⊕ B)̄';
          hinglishDesc = 'XNOR Gate: Output tabhi 1 hota hai jab dono inputs SAME honge.';
          testOutput = (inA ^ inB) === 0 ? 1 : 0;
          truthTable = [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 1]
          ];
          break;
      }

      const steps: StepItem[] = [
        {
          stepNumber: 1,
          title: `${gate} Gate Definition & Boolean Expression`,
          explanation: hinglishDesc,
          mathDetail: `Boolean Formula: ${gateFormula}`
        },
        {
          stepNumber: 2,
          title: 'Complete Truth Table',
          explanation: `${gate} Gate ke sabhi possible input combinations:`,
          subSteps:
            gate === 'NOT'
              ? ['Input A = 0 → Output Y = 1', 'Input A = 1 → Output Y = 0']
              : truthTable.map(([a, b, y]) => `Input A = ${a}, B = ${b} → Output Y = ${y}`)
        },
        {
          stepNumber: 3,
          title: `Tested Input: A=${inA}${gate !== 'NOT' ? `, B=${inB}` : ''}`,
          explanation: `Output: ${testOutput}`,
          mathDetail: `${gate}(${inA}${gate !== 'NOT' ? `, ${inB}` : ''}) = ${testOutput}`,
          highlight: true
        }
      ];

      return {
        title: `${gate} Logic Gate Analysis`,
        input: gate === 'NOT' ? `A=${inA}` : `Gate: ${gate}, A=${inA}, B=${inB}`,
        type,
        finalAnswer: `Output Y = ${testOutput}`,
        steps,
        additionalInfo: {
          tableHeaders: gate === 'NOT' ? ['Input A', 'Output Y (Ā)'] : ['Input A', 'Input B', `Output Y (${gate})`],
          tableRows: gate === 'NOT' ? [[0, 1], [1, 0]] : truthTable
        }
      };
    }

    // ------------------------------------------------------------------------
    // 15. K-Map basics
    // ------------------------------------------------------------------------
    case 'kmap': {
      const vars = options?.kmapVars || (cleanInput1.includes('3') ? 3 : 2);
      const minterms = options?.kmapMinterms || [1, 3];

      if (vars === 2) {
        const grid = [
          [minterms.includes(0) ? 1 : 0, minterms.includes(1) ? 1 : 0],
          [minterms.includes(2) ? 1 : 0, minterms.includes(3) ? 1 : 0]
        ];

        const mintermLabels = ['m0 (ĀB̄)', 'm1 (ĀB)', 'm2 (AB̄)', 'm3 (AB)'];
        const activeMintermsList = minterms.filter((m) => m >= 0 && m <= 3).sort((a, b) => a - b);

        let simplifiedSOP = '';
        if (activeMintermsList.length === 0) simplifiedSOP = '0';
        else if (activeMintermsList.length === 4) simplifiedSOP = '1 (All cells filled)';
        else if (activeMintermsList.length === 2) {
          if (activeMintermsList[0] === 0 && activeMintermsList[1] === 1) simplifiedSOP = 'Ā';
          else if (activeMintermsList[0] === 2 && activeMintermsList[1] === 3) simplifiedSOP = 'A';
          else if (activeMintermsList[0] === 0 && activeMintermsList[1] === 2) simplifiedSOP = 'B̄';
          else if (activeMintermsList[0] === 1 && activeMintermsList[1] === 3) simplifiedSOP = 'B';
          else simplifiedSOP = activeMintermsList.map((m) => mintermLabels[m].split(' ')[1].replace(/[()]/g, '')).join(' + ');
        } else {
          simplifiedSOP = activeMintermsList.map((m) => mintermLabels[m].split(' ')[1].replace(/[()]/g, '')).join(' + ');
        }

        const steps: StepItem[] = [
          {
            stepNumber: 1,
            title: '2-Variable K-Map Structure Samjho',
            explanation: `2 variables (A, B) ke liye total 2² = 4 cells hote hain.`,
            mathDetail: 'Cells: m0=(0,0), m1=(0,1), m2=(1,0), m3=(1,1)'
          },
          {
            stepNumber: 2,
            title: 'Minterms ko Plot Karo',
            explanation: `Active minterms Σm(${activeMintermsList.join(', ')}) ko grid mein '1' likhein.`,
            mathDetail: `m0=${grid[0][0]}, m1=${grid[0][1]}, m2=${grid[1][0]}, m3=${grid[1][1]}`
          },
          {
            stepNumber: 3,
            title: 'Grouping & Simplified SOP',
            explanation: 'Group size hamesha 2^n (1, 2, 4) hota hai.',
            mathDetail: `Simplified Expression: Y = ${simplifiedSOP}`,
            highlight: true
          }
        ];

        return {
          title: '2-Variable K-Map Solver',
          input: `Variables: A, B | Minterms: Σm(${activeMintermsList.join(', ')})`,
          type,
          finalAnswer: `Simplified SOP: Y = ${simplifiedSOP}`,
          steps,
          additionalInfo: {
            tableHeaders: ['Minterm', 'Binary (A, B)', 'Cell Value (1/0)'],
            tableRows: [
              ['m0', 'A=0, B=0', grid[0][0]],
              ['m1', 'A=0, B=1', grid[0][1]],
              ['m2', 'A=1, B=0', grid[1][0]],
              ['m3', 'A=1, B=1', grid[1][1]]
            ]
          }
        };
      } else {
        const activeMintermsList = minterms.filter((m) => m >= 0 && m <= 7).sort((a, b) => a - b);

        const steps: StepItem[] = [
          {
            stepNumber: 1,
            title: '3-Variable K-Map Structure & Gray Code Order',
            explanation: `3 variables (A, B, C) ke liye 2³ = 8 cells hote hain. Gray code sequence: 00, 01, 11, 10.`,
            mathDetail: 'Row A=0: m0, m1, m3, m2 | Row A=1: m4, m5, m7, m6'
          },
          {
            stepNumber: 2,
            title: 'Minterms Plotting',
            explanation: `Active minterms Σm(${activeMintermsList.join(', ')}) ko fill karein.`,
            mathDetail: `Minterms: ${activeMintermsList.map((m) => `m${m}`).join(', ')}`
          },
          {
            stepNumber: 3,
            title: 'Grouping Guidelines (Octet, Quad, Pair)',
            explanation: 'Adjacent 1s ke 8, 4, ya 2 ke groups banayein.',
            mathDetail: `Canonical SOP = Σm(${activeMintermsList.join(', ')})`,
            highlight: true
          }
        ];

        return {
          title: '3-Variable K-Map Solver',
          input: `Variables: A, B, C | Minterms: Σm(${activeMintermsList.join(', ')})`,
          type,
          finalAnswer: `Canonical SOP: Σm(${activeMintermsList.join(', ')})`,
          steps,
          additionalInfo: {
            tableHeaders: ['Row / Col', 'BC = 00', 'BC = 01', 'BC = 11', 'BC = 10'],
            tableRows: [
              [
                'A = 0',
                activeMintermsList.includes(0) ? '1 (m0)' : '0 (m0)',
                activeMintermsList.includes(1) ? '1 (m1)' : '0 (m1)',
                activeMintermsList.includes(3) ? '1 (m3)' : '0 (m3)',
                activeMintermsList.includes(2) ? '1 (m2)' : '0 (m2)'
              ],
              [
                'A = 1',
                activeMintermsList.includes(4) ? '1 (m4)' : '0 (m4)',
                activeMintermsList.includes(5) ? '1 (m5)' : '0 (m5)',
                activeMintermsList.includes(7) ? '1 (m7)' : '0 (m7)',
                activeMintermsList.includes(6) ? '1 (m6)' : '0 (m6)'
              ]
            ]
          }
        };
      }
    }

    // ------------------------------------------------------------------------
    // 16. Binary Multiplication
    // ------------------------------------------------------------------------
    case 'bin-mul': {
      return solveBaseMultiplication(2, cleanInput1, cleanInput2 || '101');
    }

    // ------------------------------------------------------------------------
    // 17. Binary Division
    // ------------------------------------------------------------------------
    case 'bin-div': {
      return solveBaseDivision(2, cleanInput1, cleanInput2 || '10');
    }

    // ------------------------------------------------------------------------
    // Octal Specific Arithmetic (+, -, *, /)
    // ------------------------------------------------------------------------
    case 'oct-add': {
      return solveBaseAddition(8, cleanInput1, cleanInput2 || '25');
    }
    case 'oct-sub': {
      return solveBaseSubtraction(8, cleanInput1, cleanInput2 || '14');
    }
    case 'oct-mul': {
      return solveBaseMultiplication(8, cleanInput1, cleanInput2 || '5');
    }
    case 'oct-div': {
      return solveBaseDivision(8, cleanInput1, cleanInput2 || '4');
    }

    // ------------------------------------------------------------------------
    // Hexadecimal Specific Arithmetic (+, -, *, /)
    // ------------------------------------------------------------------------
    case 'hex-add': {
      return solveBaseAddition(16, cleanInput1, cleanInput2 || 'A5');
    }
    case 'hex-sub': {
      return solveBaseSubtraction(16, cleanInput1, cleanInput2 || '1F');
    }
    case 'hex-mul': {
      return solveBaseMultiplication(16, cleanInput1, cleanInput2 || 'B');
    }
    case 'hex-div': {
      return solveBaseDivision(16, cleanInput1, cleanInput2 || '4');
    }

    // ------------------------------------------------------------------------
    // 18. Octal Arithmetic (+, -, *, /)
    // ------------------------------------------------------------------------
    case 'oct-arithmetic': {
      const op = options?.arithmeticOp || '+';
      if (op === '+') return solveBaseAddition(8, cleanInput1, cleanInput2 || '25');
      if (op === '-') return solveBaseSubtraction(8, cleanInput1, cleanInput2 || '14');
      if (op === '*') return solveBaseMultiplication(8, cleanInput1, cleanInput2 || '5');
      if (op === '/') return solveBaseDivision(8, cleanInput1, cleanInput2 || '4');
      return solveBaseAddition(8, cleanInput1, cleanInput2 || '25');
    }

    // ------------------------------------------------------------------------
    // 19. Hexadecimal Arithmetic (+, -, *, /)
    // ------------------------------------------------------------------------
    case 'hex-arithmetic': {
      const op = options?.arithmeticOp || '+';
      if (op === '+') return solveBaseAddition(16, cleanInput1, cleanInput2 || 'A5');
      if (op === '-') return solveBaseSubtraction(16, cleanInput1, cleanInput2 || '1F');
      if (op === '*') return solveBaseMultiplication(16, cleanInput1, cleanInput2 || 'B');
      if (op === '/') return solveBaseDivision(16, cleanInput1, cleanInput2 || '4');
      return solveBaseAddition(16, cleanInput1, cleanInput2 || 'A5');
    }

    // ------------------------------------------------------------------------
    // 20. Universal Base Arithmetic (Any Base: 2, 8, 10, 16 with +, -, *, /)
    // ------------------------------------------------------------------------
    case 'base-arithmetic': {
      const b = options?.arithmeticBase || 8;
      const op = options?.arithmeticOp || '+';
      const defaultB = b === 2 ? '101' : b === 8 ? '25' : b === 16 ? 'A5' : '15';
      const secInput = cleanInput2 || defaultB;

      if (op === '+') return solveBaseAddition(b, cleanInput1, secInput);
      if (op === '-') return solveBaseSubtraction(b, cleanInput1, secInput);
      if (op === '*') return solveBaseMultiplication(b, cleanInput1, secInput);
      if (op === '/') return solveBaseDivision(b, cleanInput1, secInput);
      return solveBaseAddition(b, cleanInput1, secInput);
    }

    default:
      throw new Error(`Unsupported question type: ${type}`);
  }
}
