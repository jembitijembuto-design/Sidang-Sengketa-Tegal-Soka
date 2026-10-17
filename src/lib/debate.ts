import { duelSets } from '../data/duelMode';

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

export function getQuestionsForPerson(person: string): FlatQuestion[] {
  const personQuestions = duelSets.find((entry) => entry.person === person);
  if (!personQuestions) return [];

  const flat: FlatQuestion[] = [];
  let globalIndex = 0;

  personQuestions.sets.forEach((set, setIndex) => {
    set.forEach((question) => {
      flat.push({
        ...question,
        globalIndex: globalIndex++,
        person,
        setIndex,
      });
    });
  });

  return flat;
}

export function getAllQuestions(): FlatQuestion[] {
  const flat: FlatQuestion[] = [];
  let globalIndex = 0;

  duelSets.forEach((personSet) => {
    personSet.sets.forEach((set, setIndex) => {
      set.forEach((question) => {
        flat.push({
          ...question,
          globalIndex: globalIndex++,
          person: personSet.person,
          setIndex,
        });
      });
    });
  });

  return flat;
}

export const allPersonSets: PersonSet[] = duelSets;
