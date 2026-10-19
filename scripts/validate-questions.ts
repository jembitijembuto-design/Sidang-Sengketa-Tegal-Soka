import { resolveCorrectAnswer, getAllQuestions as getDebateQuestions } from '../src/lib/debate';
import { getAllQuestions as getSidangQuestions, flattenSets } from '../src/data/questions';
import { pendalamanSets } from '../src/data/pendalaman';
import { duelSets } from '../src/data/duelMode';

function checkList(list: any[], sourceName: string) {
  const problems: any[] = [];
  list.forEach((q, idx) => {
    const res = resolveCorrectAnswer(q);
    if (res === null) {
      problems.push({ index: idx, question: q });
    }
  });
  if (problems.length > 0) {
    console.log(`\n[WARN] ${problems.length} question(s) without resolvable answer in ${sourceName}:`);
    problems.slice(0, 20).forEach((p, i) => {
      console.log(` - #${p.index}: person=${p.question.person ?? 'N/A'} id=${p.question.id ?? 'N/A'} setIndex=${p.question.setIndex ?? 'N/A'} text=${String(p.question.text).slice(0,80)}`);
    });
  } else {
    console.log(`\n[OK] All questions in ${sourceName} have resolvable answers.`);
  }
  return problems.length;
}

function main() {
  console.log('Validate question -> answer mapping across repo datasets');

  // 1) Duel/debate questions
  const debateQs = getDebateQuestions();
  let totalProblems = checkList(debateQs, 'debate / duelSets (getAllQuestions)');

  // 2) Sidang nyata / questions.ts
  const sidangQs = getSidangQuestions();
  totalProblems += checkList(sidangQs, 'sidang (src/data/questions.getAllQuestions)');

  // 3) Pendalaman sets (flatten)
  const pendQs = flattenSets(pendalamanSets as any);
  totalProblems += checkList(pendQs, 'pendalaman (flattened)');

  // 4) duelSets raw (cluster structure): ensure inner items
  const rawDuelFlat = duelSets.flatMap(ps => ps.sets.flatMap((set, setIndex) => set.map(q => ({ ...q, person: ps.person, setIndex }))));
  totalProblems += checkList(rawDuelFlat, 'duelMode raw clusters (flattened)');

  console.log(`\nValidation complete. Total problems found: ${totalProblems}`);
  if (totalProblems > 0) process.exitCode = 2;
}

main();
