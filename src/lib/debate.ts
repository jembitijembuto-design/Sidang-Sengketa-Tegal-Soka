export type Role = 'duit semilyar' | 'urip kepenak' | 'Kamulyan jagad';

export interface Question {
  id: number;
  role: Role;
  text: string;
}

export interface PersonSet {
  person: string;
  sets: Question[][];
}

export interface FlatQuestion extends Question {
  globalIndex: number;
  person: string;
  setIndex: number;
}

export function getAllQuestions(): FlatQuestion[] {
  // Sementara return kosong, nanti diisi dari questions.ts
  return [];
}

export const allPersonSets: PersonSet[] = [];