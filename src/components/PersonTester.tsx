import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsForPerson } from '@/lib/debate';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];

export default function PersonTester() {
  const [selected, setSelected] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Autoplay / TTS
  const playingRef = useRef(false);
  const currentReadIndexRef = useRef<number>(0);

  const show = (p: string) => {
    setSelected(p);
    try {
      setQuestions(getQuestionsForPerson(p));
    } catch {
      setQuestions([]);
    }
  };

  const readText = (text: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      // optional: set voice/lang here
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // simple feedback
      // toast? but keep dependency-free here
      // eslint-disable-next-line no-alert
      alert('Teks disalin ke clipboard');
    } catch {
      // ignore
    }
  };

  const stopPlaying = () => {
    playingRef.current = false;
    currentReadIndexRef.current = 0;
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
  };

  const playAll = (startIndex = 0) => {
    if (!questions || questions.length === 0) return;
    if (!('speechSynthesis' in window)) return;
    playingRef.current = true;
    currentReadIndexRef.current = startIndex;

    const speakIndex = (i: number) => {
      if (!playingRef.current) return;
      if (i >= questions.length) {
        stopPlaying();
        return;
      }
      const q = questions[i];
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`${q.role}. ${q.text}`);
      u.onend = () => {
        currentReadIndexRef.current = i + 1;
        // small delay between items
        setTimeout(() => speakIndex(i + 1), 400);
      };
      window.speechSynthesis.speak(u);
    };

    speakIndex(startIndex);
  };

  return (
    <div className="person-tester text-sm">
      <div className="flex gap-2 items-center">
        {ALL_PERSONS.map(p => (
          <Button key={p} size="sm" onClick={() => show(p)} className="px-2">
            {p}
          </Button>
        ))}
      </div>

      {selected && (
        <div className="mt-2 p-3 bg-black/50 rounded-lg max-h-72 overflow-auto border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <strong className="text-white">Pertanyaan: {selected}</strong>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => playAll(0)} className="px-2">Mulai Tes</Button>
              <Button size="sm" variant="outline" onClick={() => stopPlaying()}>Stop</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Tutup</Button>
            </div>
          </div>

          {questions.length === 0 ? (
            <p className="text-white/60">Tidak ada pertanyaan.</p>
          ) : (
            <ol className="space-y-2">
              {questions.map((q: any, idx: number) => (
                <li key={`${q.person}-${q.globalIndex}`} className="text-white bg-black/30 p-2 rounded-md flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-amber-200">{q.role} · Set {q.setIndex + 1}</div>
                      <div className="text-sm mt-1">{q.text}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="xs" onClick={() => readText(q.text)}>Baca</Button>
                      <Button size="xs" variant="outline" onClick={() => copyText(q.text)}>Salin</Button>
                      <Button size="xs" variant="ghost" onClick={() => playAll(idx)}>Mulai dari sini</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
