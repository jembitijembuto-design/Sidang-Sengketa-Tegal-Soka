import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsForPerson as getDuelQuestions } from '@/data/duelMode';
import { getQuestionsForPerson as getPendalamanQuestions } from '@/data/pendalaman';
import { questions as sidangNyataQuestions } from '@/data/questions';
import { buildPersonModeQuestions } from '@/lib/debate';
import { resolveCorrectAnswer } from '@/lib/debate';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];

type Phase = 'idle' | 'question' | 'waitAnswer' | 'result' | 'done';

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playApplause() {
  try {
    const a = new Audio('/audio/applause1.mp3');
    a.volume = 1;
    a.play().catch(() => {});
  } catch {}
}

export default function UjiNyaliTester() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const currentQuestion = questions[currentIndex] ?? null;

  const speakQuestion = useCallback((text: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setPhase('question');
      utterance.onend = () => setPhase('waitAnswer');
      utterance.onerror = () => setTimeout(() => setPhase('waitAnswer'), 400);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      setTimeout(() => setPhase('waitAnswer'), 600);
    }
  }, []);

  const goToQuestion = useCallback((index: number) => {
    const safeIndex = Math.min(Math.max(index, 0), Math.max(questions.length - 1, 0));
    setCurrentIndex(safeIndex);
    setSelectedAnswer(null);
    setPhase('question');
    const q = questions[safeIndex];
    if (q) speakQuestion(q.text);
  }, [questions, speakQuestion]);

  const submitAnswer = useCallback((answer: number | null) => {
    if (!currentQuestion) return;
    const correctAnswer = resolveCorrectAnswer(currentQuestion);
    const isCorrect = answer !== null && correctAnswer !== null && answer === correctAnswer;

    setPhase('result');
    setSelectedAnswer(answer);

    if (isCorrect) {
      setCorrectCount((v) => v + 1);
      playApplause();
    } else {
      setWrongCount((v) => v + 1);
    }

    const nextDelay = 1200;
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) goToQuestion(nextIndex);
      else setPhase('done');
    }, nextDelay);
  }, [currentQuestion, currentIndex, questions.length, goToQuestion]);

  const prepareQuestionsForPerson = useCallback((person: string) => {
    const duel = (getDuelQuestions(person) || []).map((q: any) => ({ ...q }));
    const pend = (getPendalamanQuestions(person) || []).map((q: any) => ({ ...q }));
    const sidang = (sidangNyataQuestions || []).filter((q: any) => String(q.person).toLowerCase() === person.toLowerCase()).map((q: any) => ({ ...q }));
    // include any person-mode variations (may sample) so we don't miss those variants
    const personMode = (buildPersonModeQuestions(person) || []).map((q: any) => ({ ...q }));

    const combined = [...duel, ...pend, ...sidang, ...personMode];

    // dedupe by text + setIndex + id + person
    const seen = new Set<string>();
    const deduped: any[] = [];
    for (const it of combined) {
      const key = `${String(it.person || person)}|${String(it.id ?? '')}|${String(it.setIndex ?? '')}|${String(it.text ?? '')}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(it);
      }
    }

    return shuffle(deduped);
  }, []);

  const startForPerson = (person: string) => {
    const pool = prepareQuestionsForPerson(person);
    setSelectedPerson(person);
    setQuestions(pool);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setWrongCount(0);
    setPhase('idle');

    if (pool.length > 0) {
      setTimeout(() => {
        setCurrentIndex(0);
        setPhase('question');
        speakQuestion(pool[0].text);
      }, 150);
    } else {
      setPhase('done');
    }
  };

  useEffect(() => {
    if (!selectedPerson || questions.length === 0 || phase !== 'idle') return;
    if (questions[0]) {
      setCurrentIndex(0);
      speakQuestion(questions[0].text);
    }
  }, [selectedPerson, questions, phase, speakQuestion]);

  const isFinished = phase === 'done' || (questions.length > 0 && currentIndex >= questions.length);

  return (
    <div className="p-4 text-sm">
      <div className="flex flex-wrap gap-2">
        {ALL_PERSONS.map((person) => (
          <Button key={person} size="sm" onClick={() => startForPerson(person)}>
            {person}
          </Button>
        ))}
      </div>

      {selectedPerson && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-bold text-white">Uji Nyali: {selectedPerson}</h3>
            <div className="text-xs text-white/70">Skor: {correctCount} benar / {wrongCount} salah</div>
          </div>

          {questions.length > 0 && currentQuestion && !isFinished && (
            <div className="space-y-3">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-xs text-amber-300">Pertanyaan {currentIndex + 1} / {questions.length}</div>
                <div className="mt-2 text-white">{currentQuestion.text}</div>
              </div>

              {phase === 'question' && (
                <div className="text-xs text-cyan-300 font-semibold">🔊 Membacakan pertanyaan…</div>
              )}

              {phase === 'waitAnswer' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => submitAnswer(1)}>Jawaban 1</Button>
                  <Button size="sm" variant="outline" onClick={() => submitAnswer(2)}>Jawaban 2</Button>
                </div>
              )}

              {phase === 'result' && (
                <div className={`rounded-md p-2 text-sm font-semibold ${
                  selectedAnswer === resolveCorrectAnswer(currentQuestion) ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {selectedAnswer === resolveCorrectAnswer(currentQuestion) ? 'Benar' : 'Salah'}{' '}
                  {'— Jawaban benar: ' + (resolveCorrectAnswer(currentQuestion) ?? 'N/A')}
                </div>
              )}
            </div>
          )}

          {questions.length === 0 && (
            <div className="text-white/60">Tidak ada pertanyaan untuk peserta ini di semua bank.</div>
          )}

          {phase === 'done' && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 font-semibold">Selesai. Skor akhir: {correctCount} benar / {wrongCount} salah.</div>
          )}
        </div>
      )}
    </div>
  );
}
