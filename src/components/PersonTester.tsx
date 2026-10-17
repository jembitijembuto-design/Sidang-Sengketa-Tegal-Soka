import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsForPerson } from '@/lib/debate';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];

export default function PersonTester() {
  const [selected, setSelected] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const show = (p: string) => {
    setSelected(p);
    try {
      setQuestions(getQuestionsForPerson(p));
    } catch {
      setQuestions([]);
    }
  };

  return (
    <div className="person-tester text-sm">
      <div className="flex gap-1 items-center">
        {ALL_PERSONS.map(p => (
          <Button key={p} size="sm" onClick={() => show(p)} className="px-2">
            {p}
          </Button>
        ))}
      </div>

      {selected && (
        <div className="mt-2 p-3 bg-black/50 rounded-lg max-h-64 overflow-auto border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <strong className="text-white">Pertanyaan: {selected}</strong>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Tutup</Button>
          </div>

          {questions.length === 0 ? (
            <p className="text-white/60">Tidak ada pertanyaan.</p>
          ) : (
            <ol className="space-y-2">
              {questions.map(q => (
                <li key={`${q.person}-${q.globalIndex}`} className="text-white">
                  <div className="font-semibold text-amber-200">{q.role} · Set {q.setIndex + 1}</div>
                  <div className="text-sm mt-1">{q.text}</div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
