export interface GermanUnitSeed {
  level: 'A1' | 'A2';
  unitNumber: number;
  title: string;
  targetMonth: number;
}

export const germanUnits: GermanUnitSeed[] = [
  { level: 'A1', unitNumber: 1, title: 'Greetings and Self-Introduction', targetMonth: 1 },
  { level: 'A1', unitNumber: 2, title: 'Numbers, Dates, and Times', targetMonth: 1 },
  { level: 'A1', unitNumber: 3, title: 'Present Tense — Verb Conjugation', targetMonth: 1 },
  { level: 'A1', unitNumber: 4, title: 'Nouns and Articles — der/die/das and Cases', targetMonth: 1 },
  { level: 'A1', unitNumber: 5, title: 'Common Phrases — Asking for Help, Directions, Shopping', targetMonth: 2 },
  { level: 'A1', unitNumber: 6, title: 'Negative Sentences — nicht and kein', targetMonth: 2 },
  { level: 'A1', unitNumber: 7, title: 'Question Words — Wer, Was, Wo, Wann, Wie', targetMonth: 3 },
  { level: 'A1', unitNumber: 8, title: 'Modal Verbs — können, müssen, wollen, dürfen', targetMonth: 3 },
  { level: 'A1', unitNumber: 9, title: 'Separable Verbs', targetMonth: 3 },
  { level: 'A1', unitNumber: 10, title: 'Revision — A1 Goethe Exam Format and Sample Test', targetMonth: 3 },
  { level: 'A2', unitNumber: 1, title: 'Past Tense — Perfekt and Präteritum', targetMonth: 4 },
  { level: 'A2', unitNumber: 2, title: 'Dative Case and Prepositions', targetMonth: 4 },
  { level: 'A2', unitNumber: 3, title: 'Comparatives and Superlatives', targetMonth: 5 },
  { level: 'A2', unitNumber: 4, title: 'Subordinate Clauses — weil, wenn, dass', targetMonth: 5 },
  { level: 'A2', unitNumber: 5, title: 'Work and Professional Vocabulary', targetMonth: 6 },
  { level: 'A2', unitNumber: 6, title: 'Talking About Your Job', targetMonth: 6 },
  { level: 'A2', unitNumber: 7, title: 'Reading a German Job Posting — Vocabulary Guide', targetMonth: 7 },
  { level: 'A2', unitNumber: 8, title: 'Writing a Formal Email in German', targetMonth: 7 },
  { level: 'A2', unitNumber: 9, title: 'Phone Calls and Appointments', targetMonth: 8 },
  { level: 'A2', unitNumber: 10, title: 'German Interview Phrases — 20 Essential Sentences', targetMonth: 9 },
  { level: 'A2', unitNumber: 11, title: 'Apartment Hunting Vocabulary', targetMonth: 11 },
  { level: 'A2', unitNumber: 12, title: 'Revision — A2 Goethe Exam Format and Sample Test', targetMonth: 9 },
];
