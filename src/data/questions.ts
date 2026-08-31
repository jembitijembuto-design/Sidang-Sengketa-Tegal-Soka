import { allPersonSets } from './sidangNyata';

export interface FlatQuestion {
  id: number | string;
  text: string;
  person: string;
  role: 'duit semilyar' | 'urip kepenak' | 'Kamulyan jagad' | string;
  setIndex: number;
  options?: string[];
  answer?: string;
}

// Tambahkan logika untuk meratakan data dari source lain jika ingin dijadikan data utama
export const questions: FlatQuestion[] = allPersonSets.flatMap(ps =>
  ps.sets.flatMap((set: any[], setIndex: number) =>
    set.map((q: any) => ({
      ...q,
      person: ps.person,
      setIndex,
    }))
  )
);

/**
 * Meratakan array PersonSet[] atau array apapun yang berisi object { person, sets }.
 * Menghasilkan FlatQuestion[] dengan setIndex yang benar.
 */
export const flattenSets = (sets: any): FlatQuestion[] => {
  if (!Array.isArray(sets)) return [];
  return sets.flatMap((item: any) => {
    // PersonSet: { person: string, sets: Question[][] }
    if (item && typeof item === 'object' && 'person' in item && 'sets' in item && Array.isArray(item.sets)) {
      return item.sets.flatMap((set: any[], setIndex: number) =>
        set.map((q: any) => ({
          id: q.id,
          text: q.text,
          role: q.role,
          person: item.person,
          setIndex,
        }))
      );
    }
    // Bukan PersonSet — kembalikan kosong
    return [];
  });
};

export function getAllQuestions(): FlatQuestion[] {
  return questions;
}