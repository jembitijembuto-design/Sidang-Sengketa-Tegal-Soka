import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsForPerson } from '@/lib/debate';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];

export default function PersonTester() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const currentQuestion = questions[currentIndex] ?? null;

  const choosePerson = (person: string) => {
    setSelectedPerson(person);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setWrongCount(0);
    setQuestions(getQuestionsForPerson(person));
  };

  const speakQuestion = (text: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore TTS errors silently
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;

    const correct = (currentQuestion.setIndex ?? 0) + 1;
    const isCorrect = selectedAnswer === correct;

    setShowResult(true);
    if (isCorrect) {
      setCorrectCount((v) => v + 1);
    } else {
      setWrongCount((v) => v + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((idx) => {
      const next = idx + 1;
      return next < questions.length ? next : idx;
    });
  };

  const previousQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const isFinished = currentIndex >= questions.length;

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

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => speakQuestion(currentQuestion.text)}>
                  Baca
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedAnswer(1)}>
                  Jawaban 1
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedAnswer(2)}>
                  Jawaban 2
                </Button>
              </div>

              <div className="mt-2 text-xs text-white/70">
                Pilihan saat ini: {selectedAnswer === null ? 'Belum dipilih' : `Jawaban ${selectedAnswer}`}
              </div>

              {showResult && (
                <div className={`rounded-md p-2 text-sm font-semibold ${
                  selectedAnswer === (currentQuestion.setIndex ?? 0) + 1 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {selectedAnswer === (currentQuestion.setIndex ?? 0) + 1 ? 'Benar' : 'Salah'}
                  {' — Jawaban benar: ' + ((currentQuestion.setIndex ?? 0) + 1)}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={checkAnswer}>Cek Jawaban</Button>
                <Button size="sm" variant="ghost" onClick={previousQuestion} disabled={currentIndex === 0}>
                  Sebelumnya
                </Button>
                <Button size="sm" variant="ghost" onClick={nextQuestion} disabled={currentIndex >= questions.length - 1}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}

          {questions.length === 0 && (
            <div className="text-white/60">Tidak ada pertanyaan untuk peserta ini.</div>
          )}

          {!isFinished && questions.length > 0 && currentIndex >= questions.length && (
            <div className="text-white/70">Semua pertanyaan selesai.</div>
          )}
        </div>
      )}
    </div>
  );
}
