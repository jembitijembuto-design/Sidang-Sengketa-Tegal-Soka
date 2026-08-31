import React from 'react';
import type { FlatQuestion } from '../data/questions';

interface QuestionCardProps {
  question: FlatQuestion & { globalIndex?: number };
  isActive?: boolean;
  isCurrent?: boolean;
  showPerson?: boolean;
}

const personPhotos: Record<string, string> = {
  Edi: '/photos/edi.jpg',
  Ridwan: '/photos/ridwan.png',
  Susanto: '/photos/susanto.png',
  Suprapti: '/photos/suprapti.png',
  Eka: '/photos/eka.png',
  Jumiati: '/photos/jumiati.png',
};

const roleLabels: Record<string, string> = {
  'duit semilyar': 'Duit Semilyar',
  'urip kepenak': 'Urip Kepenak',
  'Kamulyan jagad': 'Kamulyan Jagad'
};

export default function QuestionCard({
  question,
  isActive,
  isCurrent,
  showPerson
}: QuestionCardProps) {
  const photo = personPhotos[question.person];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes moveHorizontalSlowly {
          0% { transform: translateX(30px) scale(var(--card-scale, 0.75)); }
          50% { transform: translateX(-30px) scale(var(--card-scale, 0.75)); }
          100% { transform: translateX(30px) scale(var(--card-scale, 0.75)); }
        }
        @keyframes shineSwipe {
          0% { left: -150%; }
          20% { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 35px rgba(0,174,239,0.5), 0 10px 20px rgba(0,0,0,0.4); }
        }
        .atm-card-final {
          animation: moveHorizontalSlowly 10s ease-in-out infinite, glowPulse 4s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          --card-scale: 0.75;
          z-index: 10;
        }
        .atm-card-final.is-expanded {
          --card-scale: 1.05;
          z-index: 50;
        }
        .shiny-overlay {
          position: absolute;
          top: 0;
          width: 80px;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg);
          animation: shineSwipe 5s infinite;
          z-index: 20;
          pointer-events: none;
        }
      `}} />

      <div className="relative w-full flex justify-center py-6 overflow-visible">
        <div
          onClick={(e) => e.currentTarget.classList.toggle('is-expanded')}
          className="atm-card-final relative overflow-hidden rounded-2xl flex flex-col"
          style={{
            width: '290px',
            minHeight: '220px',
            background: 'linear-gradient(135deg, #0055A5 0%, #003D7A 40%, #002855 100%)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          {/* Efek Kilauan Cahaya */}
          <div className="shiny-overlay" />

          {/* Header BCA & Chip */}
          <div className="relative z-30 flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 border border-white/50 flex items-center justify-center text-[8px] font-black text-white">BCA</div>
              <div>
                <div className="text-white font-bold text-[10px] tracking-wide">Bank Central Asia</div>
                <div className="text-white/60 text-[7px] uppercase tracking-tighter">Debit Card</div>
              </div>
            </div>
            <div className="w-9 h-6 rounded-md bg-gradient-to-br from-yellow-600 to-yellow-300 shadow-inner" />
          </div>

          {/* Nomor Kartu */}
          <div className="relative z-30 px-4 mt-2">
            <div className="text-white/80 font-mono text-[10px] tracking-[0.2em]">
              5412 {String(question.globalIndex || 1).padStart(4, '0')}
            </div>
          </div>

          {/* Area Foto + Nama */}
          <div className="relative z-30 flex items-center gap-3 px-4 mt-2">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 border-white/60 shadow-md">
              {photo ? (
                <img src={photo} alt={question.person} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-900" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-xs truncate uppercase tracking-tight">{question.person}</div>
              <div className="text-cyan-200/90 text-[9px] font-medium leading-none">{roleLabels[question.role] || question.role}</div>
            </div>
          </div>

          {/* Teks Pertanyaan (Di bawah Foto) */}
          <div className="relative z-30 mx-4 mt-3 mb-8 px-3 py-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-center">
            <p className="text-[10px] font-semibold text-white leading-tight drop-shadow-sm">
              "{question.text}"
            </p>
            {showPerson && (
              <div className="text-[8px] text-cyan-300/80 mt-1 uppercase font-bold tracking-tighter">
                Batch #{question.setIndex + 1}
              </div>
            )}
          </div>

          {/* Magnetic Stripe & Logo VISA */}
          <div className="mt-auto w-full h-9 flex items-center justify-end px-4 bg-gradient-to-b from-[#1a1a1a] to-black border-t border-white/5">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" 
              alt="Visa" 
              className="h-3 brightness-0 invert opacity-80"
            />
          </div>
        </div>
      </div>
    </>
  );
}