import { PromptChip } from '../types';

export const JARVIS_PROMPT_CHIPS: PromptChip[] = [
  {
    label: '🔥 Mast Roast Maar',
    prompt: 'Mujhe ek pyara sa filmy aur cringe roast maar bhai!',
    mode: 'chad-cringe',
    iconName: 'Flame'
  },
  {
    label: '🎓 BCA Exam Me Top Kaise Karein?',
    prompt: 'BCA 1st sem ke exams me top karne ka secret formula batao.',
    mode: 'tech-bro',
    iconName: 'GraduationCap'
  },
  {
    label: '❤️ Crush Ko Impress Karne Ka Formula',
    prompt: 'Crush se baat shuru karne ka ek mast aur thoda cringe tareeqa bata.',
    mode: 'philosopher',
    iconName: 'Heart'
  },
  {
    label: '💻 C Programming Ka Sach',
    prompt: 'Pointers aur Memory management itna aasan bhasha me samjha ki 5 saal ka bacha bhi samajh jaye.',
    mode: 'genius',
    iconName: 'Code2'
  },
  {
    label: '🛡️ Hacker Banne Ki Reality',
    prompt: 'Zero se ethical hacking seekh kar 1 saal me expert kaise banein?',
    mode: 'tech-bro',
    iconName: 'Shield'
  },
  {
    label: '🧠 Life Ka Sabse Bada Sach',
    prompt: 'Zindagi ka sabse gehra philosophical sach batao jo sabko pata hona chahiye.',
    mode: 'philosopher',
    iconName: 'Sparkles'
  }
];

export function getJarvisSmartOfflineResponse(prompt: string, mode: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('roast') || p.includes('cringe') || mode === 'chad-cringe') {
    return `Arre arre ustaad! Prince Thakur ne mujhe itna high-IQ banaya hai ki tere dimaag ka RAM 2MB lag raha hai mere quantum server ke samne! 😎🔥

Dekh bhai, reality yeh hai:
Tu WhatsApp par 'Online' reh kar sochta hai ki kismat badal jayegi, par coding ya padhai ke naam par syntax error dekh kar phone lock kar leta hai! Par koi baat nahi, tu Prince Thakur ki suite ka shaan hai. Bol, aur kya jhatka chahiye ya serious sawal puchenge huzoor?`;
  }

  if (p.includes('bca') || p.includes('exam') || p.includes('top')) {
    return `BCA me Top karne ka JARVIS formula (Light, Simple & Lethal): 🎓✨

1. **Number System & Logic Gates**: Yeh 100% free ke marks hain — Binary, Hexadecimal, 2's Complement step-by-step likho full marks fix.
2. **C Programs me Diagram & Output**: Sirf code mat likho! Dry run table aur expected output box banao, examiner impress hokar poore 10/10 dega.
3. **Von Neumann Architecture**: Diagram clean banao — CPU, ALU, CU, Registers, Bus hierarchy.
4. **Viva hack**: Jab external examiner aaye, hamesha confidence se bolo: "Sir, C me pointers memory direct manipulate karte hain, isliye faster hain." Examiner bolega — shabaash beta!

Simple h na boss? Abhi se 2 ghante padho, topper list me naam tay hai!`;
  }

  if (p.includes('crush') || p.includes('propose') || p.includes('love')) {
    return `Hahaha! Dekh bhai, Prince Thakur ke JARVIS ke paas 100% success rate wala cringe aur filmy tareeqa hai: 💖🌹

Formula:
Unke samne jaao, thoda filmy smile do aur bolo:
*"Aapka aur mera rishta bilkul C language ke Pointer aur Variable jaisa hai — aap jahan jahan jaate ho, mera dil wahi ka memory address store kar leta hai!"* 

Agar wo thoda hansi to samajh lo mission 50% successful! Aur agar block kar diya to seedhe Simple C Compiler kholna aur code likhna, career banega to line lag jayegi boss! 😉`;
  }

  if (p.includes('c programming') || p.includes('pointer') || p.includes('memory')) {
    return `Pointers itna simple hai bhai ki sun kar hansi aayegi: 🧠💡

Soch ek ghar hai (Variable \`a = 10\`), aur us ghar ki deewar par likha hai uska address (jaise \`House No. 402\`).
- Normal variable me saman rehta hai (\`10\`).
- Pointer (\`*p\`) wo postman hai jiske hath me sirf wo parchi hai jisme \`House No. 402\` likha hai (\`p = &a\`).

Jab tu \`*p = 20\` bolta hai, to postman 402 number ghar me ghus kar andar ka saman badal deta hai!
Zero confusion, high IQ explanation! Prince Thakur ka JARVIS kabhi faltu ghumata nahi! 🚀`;
  }

  // General high-IQ light response
  return `Arre shabaash mere cheeteh! Prince Thakur ka JARVIS bilkul hazir hai. 🦾✨

Aapne pucha: "${prompt}"

**JARVIS Quick Breakdown (Simple & Impressive):**
1. **Core Fact**: Yeh sawal lagta complex hai, par iska basic funda bilkul seedha hai — focus on core logic, not the noise.
2. **Practical Step**: Hamesha pehle 1st principle se socho — input kya hai, process kya hona chahiye, aur final result kya chahiye.
3. **Pro Advice**: Tension lene se sirf CPU ka fan tez chalta hai, solution nahi nikalta! Chill karo aur execute karo.

Aur kuch puchna hai ya ek kadak shayari sunau boss? 😉`;
}
