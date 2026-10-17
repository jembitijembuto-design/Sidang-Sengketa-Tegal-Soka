import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsForPerson } from '@/lib/debate';
import CountdownTimer from '@/components/CountdownTimer';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];
type Phase = 'idle' | 'question' | 'waitAnswer' | 'result' | 'done';

export default function PersonTester() {
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
    if (q) {
      speakQuestion(q.text);
    }
  }, [questions, speakQuestion]);

  const submitAnswer = useCallback((answer: number | null) => {
    if (!currentQuestion) return;
    const correctAnswer = (currentQuestion.setIndex ?? 0) + 1;
    const isCorrect = answer !== null && answer === correctAnswer;

    setPhase('result');
    setSelectedAnswer(answer);

    if (isCorrect) {
      setCorrectCount((v) => v + 1);
    } else {
      setWrongCount((v) => v + 1);
    }

    const nextDelay = 1400;
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        goToQuestion(nextIndex);
      } else {
        setPhase('done');
      }
    }, nextDelay);
  }, [currentQuestion, currentIndex, questions.length, goToQuestion]);

  const choosePerson = (person: string) => {
    const list = getQuestionsForPerson(person);
    setSelectedPerson(person);
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setWrongCount(0);
    setPhase('idle');

    if (list.length > 0) {
      setTimeout(() => {
        const q = list[0];
        setCurrentIndex(0);
        setPhase('question');
        if (q) {
          speakQuestion(q.text);
        }
      }, 150);
    } else {
      setPhase('done');
    }
  };

  const handleAnswerClick = (answer: 1 | 2) => {
    if (phase !== 'waitAnswer') return;
    submitAnswer(answer);
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
          <Button key={person} size="sm" onClick={() => choosePerson(person)}>
            {person}
          </Button>
        ))}
      </div>

      {selectedPerson && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-bold text-white">Peserta: {selectedPerson}</h3>
            <div className="text-xs text-white/70">
              Skor: {correctCount} benar / {wrongCount} salah
            </div>
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
                <>
                  <div className="text-xs text-yellow-300 font-semibold">⏱️ Pilih jawaban sekarang…</div>
                  <CountdownTimer onTimeout={() => submitAnswer(null)} isRunning duration={3} />
                </>
              )}

              {phase === 'result' && (
                <div className={`rounded-md p-2 text-sm font-semibold ${
                  selectedAnswer === ((currentQuestion.setIndex ?? 0) + 1) ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {selectedAnswer === ((currentQuestion.setIndex ?? 0) + 1) ? 'Benar' : 'Salah'}
                  {' — Jawaban benar: ' + (((currentQuestion.setIndex ?? 0) + 1))}
                </div>
              )}

              {phase === 'waitAnswer' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAnswerClick(1)}>Jawaban 1</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAnswerClick(2)}>Jawaban 2</Button>
                </div>
              )}
            </div>
          )}

          {questions.length === 0 && (
            <div className="text-white/60">Tidak ada pertanyaan untuk peserta ini.</div>
          )}

          {phase === 'done' && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 font-semibold">
              Selesai. Skor akhir: {correctCount} benar / {wrongCount} salah.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
