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

export function resolveCorrectAnswer(
  question: Partial<Question> & {
    setIndex?: number;
    correctAnswer?: number;
    answer?: number;
    answerIndex?: number;
  } | null | undefined
): number | null {
  if (!question) return null;
  if (typeof question.correctAnswer === 'number') return question.correctAnswer;
  if (typeof question.answer === 'number') return question.answer;
  if (typeof question.answerIndex === 'number') return question.answerIndex;
  if (typeof question.setIndex === 'number') return question.setIndex + 1;
  return null;
}

export function buildPersonModeQuestions(person: string): FlatQuestion[] {
  const pool = getQuestionsForPerson(person);

  const grouped: Record<string, FlatQuestion[]> = {};
  for (const q of pool) {
    const key = String(q.id ?? `${q.person}-${q.role}-${q.setIndex}`);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(q);
  }

  const picked = Object.values(grouped)
    .map((group) => {
      if (!group || group.length === 0) return null;
      const selected = group[Math.floor(Math.random() * group.length)];
      return {
        ...selected,
        correctAnswer: resolveCorrectAnswer(selected) ?? 1,
      } as FlatQuestion & { correctAnswer?: number };
    })
    .filter(Boolean) as Array<FlatQuestion & { correctAnswer?: number }>;

  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }

  return picked.map((q) => ({
    ...q,
    correctAnswer: undefined,
  }));
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
