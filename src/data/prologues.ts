const prologs = [
  "Dengarkan baik-baik pertanyaan berikut!",
  "Siap-siap, pertanyaan penting datang!",
  "Fokus! Ini pertanyaan penentu.",
  "Perhatikan dengan seksama.",
  "Waktunya membuktikan kemampuanmu!",
];

export function getRandomProlog(index: number, person: string, allPersons: string[]): string {
  const randomProlog = prologs[Math.floor(Math.random() * prologs.length)];
  return `${randomProlog} Pertanyaan untuk ${person}.`;
}