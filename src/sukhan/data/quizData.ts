import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'identify_poet',
    sherLines: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle,',
      'Bohat nikle mere armaan lekin phir bhi kam nikle.'
    ],
    options: ['Mirza Ghalib', 'Mir Taqi Mir', 'Faiz Ahmad Faiz', 'Jaun Elia'],
    correctAnswer: 'Mirza Ghalib',
    poetName: 'Mirza Ghalib',
    explanationHinglish:
      'Ye sher Mirza Asadullah Khan Ghalib ki azeem tareen ghazal ka hissa hai, jisme insani aakankshaon ki be-panah gehrai bayan ki gayi hai.'
  },
  {
    id: 'q2',
    type: 'complete_couplet',
    sherLines: [
      'Ho gayi hai peer parvat si pighalni chahiye,',
      'Is Himalay se koi Ganga nikalni chahiye.'
    ],
    missingLineIndex: 1,
    options: [
      'Is Himalay se koi Ganga nikalni chahiye.',
      'Aag seene me nahi to roshni honi chahiye.',
      'Zulm ke aage kabhi sar na jhukana chahiye.',
      'Subah ki pehli kiran har ghar me aani chahiye.'
    ],
    correctAnswer: 'Is Himalay se koi Ganga nikalni chahiye.',
    poetName: 'Dushyant Kumar',
    explanationHinglish:
      'Dushyant Kumar ki krantikari Hindi ghazal "Saaye Mein Dhoop" ka ye sher Hindustani inqilabi adab ka parcham hai.'
  },
  {
    id: 'q3',
    type: 'identify_poet',
    sherLines: [
      'Kaun is ghar ki dekh-bhaal kare,',
      'Roz ek cheez toot jaati hai.'
    ],
    options: ['Jaun Elia', 'Ahmad Faraz', 'Bashir Badr', 'Parveen Shakir'],
    correctAnswer: 'Jaun Elia',
    poetName: 'Jaun Elia',
    explanationHinglish:
      'Jaun Elia ka ye mukhtasar sher insani dil aur rishton ke roz marra tootne ki be-bassi ko asani se rooh tak pahunchata hai.'
  },
  {
    id: 'q4',
    type: 'complete_couplet',
    sherLines: [
      'Ranjish hi sahi dil hi dukhane ke liye aa,',
      'Aa phir se mujhe chhod ke jaane ke liye aa.'
    ],
    missingLineIndex: 1,
    options: [
      'Aa phir se mujhe chhod ke jaane ke liye aa.',
      'Aa mere tute hue khwaab sajane ke liye aa.',
      'Ek baar mere haal pe hasne ke liye aa.',
      'Apne kiye waadon ko nibhane ke liye aa.'
    ],
    correctAnswer: 'Aa phir se mujhe chhod ke jaane ke liye aa.',
    poetName: 'Ahmad Faraz',
    explanationHinglish:
      'Ahmad Faraz ki is ghazal ko Mehdi Hassan saheb ne apni aawaz dekar aalam-e-mauseeqi me amar kar diya.'
  },
  {
    id: 'q5',
    type: 'identify_poet',
    sherLines: [
      'Patta patta boota boota haal hamara jaane hai,',
      'Jaane na jaane gul hi na jaane baagh toh saara jaane hai.'
    ],
    options: ['Mir Taqi Mir', 'Mirza Ghalib', 'Allama Iqbal', 'Firaq Gorakhpuri'],
    correctAnswer: 'Mir Taqi Mir',
    poetName: 'Mir Taqi Mir',
    explanationHinglish:
      'Khuda-e-Sukhan Mir Taqi Mir ka ye sher Hindustani zabaan ki saadgi aur soz ka aala tareen namoona hai.'
  },
  {
    id: 'q6',
    type: 'complete_couplet',
    sherLines: [
      'Sabhi ka khoon shamil hai yahan ki mitti mein,',
      'Kisi ke baap ka Hindustan thodi hai.'
    ],
    missingLineIndex: 1,
    options: [
      'Kisi ke baap ka Hindustan thodi hai.',
      'Ye watan har ek aashiq ka aashiyana hai.',
      'Humne lahu se seenchi hai is chaman ki bahaar.',
      'Zulm ki har deewar ko girana hoga.'
    ],
    correctAnswer: 'Kisi ke baap ka Hindustan thodi hai.',
    poetName: 'Rahat Indori',
    explanationHinglish:
      'Rahat Indori saheb ka ye inqilabi sher poore mulk me aam aawam ki buland tareen aawaz ban chuka hai.'
  },
  {
    id: 'q7',
    type: 'identify_poet',
    sherLines: [
      'Kabhi kisi ko mukammal jahan nahi milta,',
      'Kahin zameen to kahin aasmaan nahi milta.'
    ],
    options: ['Nida Fazli', 'Sahir Ludhianvi', 'Kaifi Azmi', 'Gulzar'],
    correctAnswer: 'Nida Fazli',
    poetName: 'Nida Fazli',
    explanationHinglish:
      'Nida Fazli saheb ka ye sher zindagi ki adhoori sacchayi aur qubooliyat ko behad dardanagez saadgi me pesh karta hai.'
  },
  {
    id: 'q8',
    type: 'complete_couplet',
    sherLines: [
      'Pothi padh padh jag mua pandit bhaya na koye,',
      'Dhai aakhar prem ka padhe so pandit hoye.'
    ],
    missingLineIndex: 1,
    options: [
      'Dhai aakhar prem ka padhe so pandit hoye.',
      'Jo prem na jaana so murakh hoye.',
      'Prem bina ye jeevan vyarth hoye.',
      'Gyan bina koi paar na hoye.'
    ],
    correctAnswer: 'Dhai aakhar prem ka padhe so pandit hoye.',
    poetName: 'Sant Kabir Das',
    explanationHinglish:
      'Kabir Das ji ka ye doha kitabi gyan ke muqable prem aur manavta ko sabse bada dharm saabit karta hai.'
  },
  {
    id: 'q9',
    type: 'identify_poet',
    sherLines: [
      'Koo-ba-koo phail gayi baat shanaasai ki,',
      'Us ne khushboo ki tarah meri paziraai ki.'
    ],
    options: ['Parveen Shakir', 'Fehmida Riaz', 'Kishwar Naheed', 'Amrita Pritam'],
    correctAnswer: 'Parveen Shakir',
    poetName: 'Parveen Shakir',
    explanationHinglish:
      'Parveen Shakir ki kitaab "Khushboo" ka ye sher unki khalis nazaakat aur mahak ka signature sher hai.'
  },
  {
    id: 'q10',
    type: 'complete_couplet',
    sherLines: [
      'Ujale apni yaadon ke hamare saath rehne do,',
      'Na jaane kis gali mein zindagi ki shaam ho jaye.'
    ],
    missingLineIndex: 1,
    options: [
      'Na jaane kis gali mein zindagi ki shaam ho jaye.',
      'Kahin ye aakhri raat na be-sahara ho jaye.',
      'Chalo kisi bahane se mulaqaat ho jaye.',
      'Andheri raahon me koi chirag roshan ho jaye.'
    ],
    correctAnswer: 'Na jaane kis gali mein zindagi ki shaam ho jaye.',
    poetName: 'Bashir Badr',
    explanationHinglish:
      'Dr. Bashir Badr ka ye sher be-panah rawani aur yaadon ke charagon ki hifazat ka paigham deta hai.'
  }
];
