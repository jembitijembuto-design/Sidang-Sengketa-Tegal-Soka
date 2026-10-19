import { useState, useEffect, FormEvent, useRef } from 'react';

const ACCESS_CODE = 'akukudukatam';
const MUSIC_URL = 'https://files.catbox.moe/fskarq.mp3';

interface LoginGateProps {
  onSuccess: () => void;
}

export default function LoginGate({ onSuccess }: LoginGateProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [enlargedKey, setEnlargedKey] = useState(false);

  const isLooping = useRef(true);
  const resumeIntervalRef = useRef<number | null>(null);
  const hasStartedSpeech = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedMusic = useRef(false);

  const announcementSentences = [
    'Salam rahayu.',
    'PEMBALASAN ALAM PASTI SECEPAT KILAT',
  ];

  // ===== Musik Background =====
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.75;
    audioRef.current = audio;

    const startMusic = () => {
      if (hasStartedMusic.current || !audioRef.current) return;
      hasStartedMusic.current = true;
      audioRef.current.play().catch(() => {});
    };

    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const clearResumeHack = () => {
    if (resumeIntervalRef.current !== null) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
  };

  const speakChunk = (text: string, onComplete: () => void) => {
    if (!window.speechSynthesis || !isLooping.current) {
      onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.86;
    utterance.pitch = 1.05;
    utterance.volume = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          (v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang.startsWith('id')) &&
          /google/i.test(v.name) &&
          /female|perempuan|woman|id-id-w|standard-a|wavenet-a|neural2-a/i.test(v.name)
      ) ||
      voices.find(
        (v) =>
          (v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang.startsWith('id')) &&
          /female|perempuan|woman|cewek|putri/i.test(v.name)
      ) ||
      voices.find(
        (v) =>
          (v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang.startsWith('id')) &&
          /google/i.test(v.name)
      ) ||
      voices.find((v) => v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang.startsWith('id')) ||
      voices.find((v) => v.lang.toLowerCase().includes('id'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang.replace('_', '-');
    }

    utterance.onstart = () => {
      clearResumeHack();
      resumeIntervalRef.current = window.setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearResumeHack();
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 12000);
    };

    utterance.onend = () => {
      clearResumeHack();
      onComplete();
    };

    utterance.onerror = () => {
      clearResumeHack();
      onComplete();
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakAnnouncement = () => {
    if (!window.speechSynthesis || !isLooping.current) return;

    window.speechSynthesis.cancel();
    clearResumeHack();

    let index = 0;

    const speakNext = () => {
      if (!isLooping.current) return;
      if (index >= announcementSentences.length) return;

      const sentence = announcementSentences[index];
      index += 1;
      speakChunk(sentence, speakNext);
    };

    speakNext();
  };

  const startSpeechAfterUserGesture = () => {
    if (hasStartedSpeech.current) return;
    hasStartedSpeech.current = true;

    const tryStart = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setTimeout(() => speakAnnouncement(), 400);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setTimeout(() => speakAnnouncement(), 400);
        };
        setTimeout(() => {
          if (isLooping.current && !window.speechSynthesis.speaking) {
            speakAnnouncement();
          }
        }, 1500);
      }
    };

    tryStart();
  };

  useEffect(() => {
    return () => {
      isLooping.current = false;
      clearResumeHack();
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      isLooping.current = false;
      clearResumeHack();
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setError(false), 2500);
    }
  };

  // ===== Watermark Keys Data =====
  const floatingKeys = [
    { id: 1, top: '8%', left: '5%', size: 28, delay: '0s', duration: '18s' },
    { id: 2, top: '15%', left: '78%', size: 22, delay: '2s', duration: '22s' },
    { id: 3, top: '28%', left: '12%', size: 34, delay: '4s', duration: '16s' },
    { id: 4, top: '42%', left: '85%', size: 26, delay: '1s', duration: '20s' },
    { id: 5, top: '55%', left: '8%', size: 30, delay: '3s', duration: '19s' },
    { id: 6, top: '68%', left: '70%', size: 24, delay: '5s', duration: '17s' },
    { id: 7, top: '78%', left: '25%', size: 32, delay: '1.5s', duration: '21s' },
    { id: 8, top: '12%', left: '45%', size: 20, delay: '2.5s', duration: '15s' },
    { id: 9, top: '35%', left: '55%', size: 36, delay: '0.8s', duration: '23s' },
    { id: 10, top: '62%', left: '40%', size: 25, delay: '3.5s', duration: '18s' },
    { id: 11, top: '85%', left: '60%', size: 29, delay: '4.2s', duration: '20s' },
    { id: 12, top: '22%', left: '90%', size: 21, delay: '1.2s', duration: '16s' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black font-mono">
      {/* Background Fortiguard */}
      <iframe
        src="https://www.fortiguard.com/"
        title="Fortinet FortiGuard"
        className="absolute inset-0 w-full h-full border-0 opacity-55"
        allow="fullscreen"
      />

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-black/55" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ===== WATERMARK KUNCI EMAS MEWAH + 1 KUNCI BESAR ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        {floatingKeys.map((key) => (
          <div
            key={key.id}
            className="absolute flex items-center justify-center select-none"
            style={{
              top: key.top,
              left: key.left,
              width: `${key.size * 1.9}px`,
              height: `${key.size * 1.9}px`,
              animation: `floatAndSpin ${key.duration} ease-in-out infinite`,
              animationDelay: key.delay,
            }}
          >
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full"
              style={{
                filter:
                  'drop-shadow(0 0 8px rgba(250,204,21,0.95)) drop-shadow(0 0 18px rgba(234,179,8,0.7))',
                animation: `glowGold 2.8s ease-in-out infinite`,
                animationDelay: key.delay,
              }}
            >
              <defs>
                <linearGradient id={`goldGrad-${key.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fefce8" />
                  <stop offset="20%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#facc15" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </linearGradient>
                <linearGradient id={`goldHighlight-${key.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#fef08a" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.15" />
                </linearGradient>
                <filter id={`keyShadow-${key.id}`}>
                  <feDropShadow dx="1.8" dy="2.5" stdDeviation="2.2" floodColor="#78350f" floodOpacity="0.65" />
                </filter>
              </defs>

              <g filter={`url(#keyShadow-${key.id})`}>
                <circle cx="18" cy="18" r="13.5" fill={`url(#goldGrad-${key.id})`} stroke="#78350f" strokeWidth="1.4" />
                <circle cx="18" cy="18" r="9.5" fill="none" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />
                <circle cx="18" cy="18" r="6.2" fill="#0f172a" stroke="#78350f" strokeWidth="1.2" />
                <circle cx="18" cy="11.5" r="1.4" fill="#fef08a" opacity="0.9" />
                <circle cx="12.5" cy="18" r="1.2" fill="#fef08a" opacity="0.8" />
                <circle cx="23.5" cy="18" r="1.2" fill="#fef08a" opacity="0.8" />
                <circle cx="18" cy="24.5" r="1.4" fill="#fef08a" opacity="0.9" />
                <rect x="28" y="14.2" width="29" height="7.6" rx="1.8" fill={`url(#goldGrad-${key.id})`} stroke="#78350f" strokeWidth="1.1" />
                <rect x="29" y="15" width="27" height="2.4" rx="1" fill={`url(#goldHighlight-${key.id})`} />
                <path
                  d="M53 14.2 L58 14.2 L58 21.8 L55.2 21.8 L55.2 19.2 L52.5 19.2 L52.5 21.8 L49.8 21.8 L49.8 17 L47 17 L47 21.8 L44.2 21.8 L44.2 14.2 Z"
                  fill={`url(#goldGrad-${key.id})`}
                  stroke="#78350f"
                  strokeWidth="0.9"
                />
              </g>

              <text
                x="42.5"
                y="20.1"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="5.4"
                fontWeight="700"
                letterSpacing="0.6"
                fill="#451a03"
                stroke="#78350f"
                strokeWidth="0.35"
                style={{ paintOrder: 'stroke fill' }}
              >
                YcDev
              </text>
              <text
                x="42.5"
                y="19.7"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="5.4"
                fontWeight="700"
                letterSpacing="0.6"
                fill="none"
                stroke="#fef08a"
                strokeWidth="0.45"
                opacity="0.7"
              >
                YcDev
              </text>
            </svg>
          </div>
        ))}

        {/* ===== KUNCI BESAR YANG BISA DIKLIK ===== */}
        <div
          className="absolute bottom-8 right-8 z-20 pointer-events-auto cursor-pointer select-none transition-all duration-500"
          style={{
            width: enlargedKey ? '220px' : '110px',
            height: enlargedKey ? '220px' : '110px',
            filter: enlargedKey
              ? 'drop-shadow(0 0 25px rgba(250,204,21,1)) drop-shadow(0 0 50px rgba(234,179,8,0.9))'
              : 'drop-shadow(0 0 12px rgba(250,204,21,0.9)) drop-shadow(0 0 25px rgba(234,179,8,0.7))',
            animation: enlargedKey ? 'none' : 'floatAndSpin 14s ease-in-out infinite',
          }}
          onClick={() => setEnlargedKey(!enlargedKey)}
          title={enlargedKey ? 'Klik untuk mengecilkan' : 'Klik untuk memperbesar'}
        >
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="goldGradBig" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="15%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="65%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="goldHighlightBig" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
                <stop offset="35%" stopColor="#fef08a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.2" />
              </linearGradient>
              <filter id="keyShadowBig">
                <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor="#78350f" floodOpacity="0.7" />
              </filter>
            </defs>

            <g filter="url(#keyShadowBig)">
              <circle cx="18" cy="18" r="14" fill="url(#goldGradBig)" stroke="#78350f" strokeWidth="1.6" />
              <circle cx="18" cy="18" r="10" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.8" />
              <circle cx="18" cy="18" r="6.5" fill="#0f172a" stroke="#78350f" strokeWidth="1.3" />
              <circle cx="18" cy="10.8" r="1.8" fill="#fef08a" />
              <circle cx="11.8" cy="18" r="1.5" fill="#fef08a" />
              <circle cx="24.2" cy="18" r="1.5" fill="#fef08a" />
              <circle cx="18" cy="25.2" r="1.8" fill="#fef08a" />
              <circle cx="14.2" cy="13.5" r="1.1" fill="#fde68a" opacity="0.9" />
              <circle cx="21.8" cy="13.5" r="1.1" fill="#fde68a" opacity="0.9" />
              <circle cx="14.2" cy="22.5" r="1.1" fill="#fde68a" opacity="0.9" />
              <circle cx="21.8" cy="22.5" r="1.1" fill="#fde68a" opacity="0.9" />
              <rect x="28" y="13.8" width="30" height="8.4" rx="2" fill="url(#goldGradBig)" stroke="#78350f" strokeWidth="1.3" />
              <rect x="29.2" y="14.8" width="27.5" height="2.6" rx="1.2" fill="url(#goldHighlightBig)" />
              <path
                d="M53.5 13.8 L59 13.8 L59 22.2 L56 22.2 L56 19.4 L53.2 19.4 L53.2 22.2 L50.2 22.2 L50.2 16.8 L47.2 16.8 L47.2 22.2 L44.2 22.2 L44.2 13.8 Z"
                fill="url(#goldGradBig)"
                stroke="#78350f"
                strokeWidth="1"
              />
            </g>

            <text
              x="43"
              y="20.3"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="6.8"
              fontWeight="700"
              letterSpacing="0.8"
              fill="#3f1c0a"
              stroke="#78350f"
              strokeWidth="0.45"
              style={{ paintOrder: 'stroke fill' }}
            >
              YcDev
            </text>
            <text
              x="43"
              y="19.7"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="6.8"
              fontWeight="700"
              letterSpacing="0.8"
              fill="none"
              stroke="#fef08a"
              strokeWidth="0.55"
              opacity="0.85"
            >
              YcDev
            </text>
          </svg>

          {enlargedKey && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-yellow-300/90 font-semibold whitespace-nowrap">
              Klik untuk mengecilkan
            </div>
          )}
        </div>
      </div>

      {/* ===== TAHAP 1: Tombol Akses ===== */}
      {!showLoginForm ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
          <button
            type="button"
            onClick={() => {
              startSpeechAfterUserGesture();
              setShowLoginForm(true);
            }}
            className="pointer-events-auto group relative flex items-center justify-center p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl"
            title="AUTHENTICATION ACCESS"
          >
            <span className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-80 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-center gap-2.5 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full border border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.8)]">
              <svg className="w-7 h-7 fill-current drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
              </svg>
              <span
                className="font-extrabold text-lg tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse"
                style={{ textShadow: '0 0 12px #ffffff, 0 0 20px #ff4d4d' }}
              >
                YcDev
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* ===== TAHAP 2: Kartu Login + Api di Pinggir ===== */
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <div
            className={`relative transition-all duration-300 ${
              shaking ? 'animate-[shake_0.55s_ease-in-out]' : ''
            }`}
            style={{
              transform: 'perspective(1200px) rotateX(6deg) rotateY(-5deg)',
              transformStyle: 'preserve-3d',
              animation: 'cardFloat 6s ease-in-out infinite',
            }}
          >
            <div
              className="relative w-72 h-80 sm:w-80 sm:h-88 rounded-full overflow-visible border-4 border-orange-400/90 z-10 cursor-pointer"
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).tagName !== 'INPUT' &&
                  (e.target as HTMLElement).tagName !== 'BUTTON'
                ) {
                  const el = e.currentTarget.parentElement;
                  if (el) {
                    el.classList.remove('animate-[cardRock_0.7s_ease-in-out]');
                    void el.offsetWidth;
                    el.classList.add('animate-[cardRock_0.7s_ease-in-out]');
                  }
                }
              }}
              style={{
                background: 'radial-gradient(circle at 30% 25%, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
                boxShadow: `
                  0 0 40px rgba(249, 115, 22, 0.5),
                  0 0 80px rgba(239, 68, 68, 0.35),
                  0 25px 50px rgba(0,0,0,0.9),
                  inset 0 0 35px rgba(249, 115, 22, 0.12)
                `,
                transform: 'translateZ(40px)',
              }}
            >
              {/* Efek Api di Pinggir */}
              <div className="absolute -inset-6 rounded-full pointer-events-none z-0 overflow-visible">
                <div
                  className="absolute inset-0 rounded-full border-[14px] border-transparent"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0%, #f97316 8%, #ef4444 18%, #eab308 28%, transparent 40%, transparent 60%, #f97316 68%, #ef4444 78%, #eab308 88%, transparent 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    animation: 'fireRotate 4s linear infinite',
                    filter: 'blur(4px) brightness(1.3)',
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full border-[10px] border-transparent"
                  style={{
                    background:
                      'conic-gradient(from 40deg, transparent 0%, #fb923c 10%, #f87171 22%, #facc15 32%, transparent 45%, transparent 55%, #fb923c 65%, #f87171 77%, #facc15 88%, transparent 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    animation: 'fireRotate 3.2s linear infinite reverse',
                    filter: 'blur(2.5px) brightness(1.4)',
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full border-[7px] border-transparent"
                  style={{
                    background:
                      'conic-gradient(from 80deg, transparent 0%, #fdba74 12%, #fca5a5 25%, #fde047 38%, transparent 50%, transparent 50%, #fdba74 62%, #fca5a5 75%, #fde047 88%, transparent 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    animation: 'fireRotate 2.6s linear infinite',
                    filter: 'blur(1.5px) brightness(1.5)',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-[fireFlicker_1.4s_ease-in-out_infinite] opacity-80"
                  style={{
                    background:
                      'radial-gradient(circle, transparent 55%, rgba(249,115,22,0.35) 70%, rgba(239,68,68,0.25) 85%, transparent 100%)',
                  }}
                />
              </div>

              <div className="absolute -inset-1 rounded-full border-2 border-orange-400/60 animate-[spin_7s_linear_infinite]" />
              <div className="absolute -inset-3 rounded-full border border-red-500/40 animate-[spin_11s_linear_infinite_reverse]" />

              {/* Logo YcDev */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none pt-6 z-20">
                <div className="relative">
                  <span
                    className="absolute inset-0 text-4xl sm:text-5xl font-black tracking-tighter blur-md opacity-90"
                    style={{
                      background: 'linear-gradient(90deg, #f97316, #ef4444, #eab308, #f97316)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'glowShift 2.5s ease-in-out infinite',
                    }}
                  >
                    YcDev
                  </span>
                  <span
                    className="relative text-4xl sm:text-5xl font-black tracking-tighter"
                    style={{
                      background: 'linear-gradient(90deg, #fb923c, #f87171, #facc15, #fb923c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 25px rgba(249,115,22,0.9), 0 0 50px rgba(239,68,68,0.6)',
                      animation: 'glowShift 2.5s ease-in-out infinite',
                    }}
                  >
                    YcDev
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] tracking-[0.35em] text-orange-300/90 uppercase font-semibold">
                  Secure Node
                </div>
              </div>

              {/* Form Login */}
              <div className="absolute bottom-14 left-4 right-4 z-20">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Kode Akses"
                    autoFocus
                    className="w-full px-3 py-2.5 bg-black/85 border border-orange-500/70 rounded-full text-orange-50 placeholder-orange-700/70 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/70 text-xs tracking-widest text-center shadow-inner"
                  />

                  {error && (
                    <p className="text-red-400 text-[10px] font-bold text-center animate-pulse">
                      ⚠ KODE DITOLAK
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLoginForm(false)}
                      className="flex-1 py-2 bg-slate-900/95 hover:bg-slate-800 border border-slate-600 text-slate-300 font-medium rounded-full text-[10px] transition tracking-wider"
                    >
                      BATAL
                    </button>
                    <button
                      type="submit"
                      className="flex-[1.6] py-2 bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 hover:from-orange-500 hover:via-red-400 hover:to-yellow-400 text-black font-bold rounded-full text-[10px] shadow-[0_0_25px_rgba(249,115,22,0.75)] transition active:scale-95 tracking-wider uppercase"
                    >
                      AUTH
                    </button>
                  </div>
                </form>
              </div>

              {/* LED Status */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              </div>

              {/* FOOTER */}
              <div className="absolute bottom-3 left-0 right-0 text-center z-20">
                <span
                  className="text-[9px] tracking-[0.25em] font-semibold uppercase"
                  style={{
                    background: 'linear-gradient(90deg, #f97316, #ef4444, #eab308)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 10px rgba(249,115,22,0.7)',
                  }}
                >
                  YcDev-security node
                </span>
              </div>
            </div>

            <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-52 h-10 bg-orange-500/35 blur-3xl rounded-full"
              style={{ transform: 'translateZ(-50px)' }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes glowShift {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(25deg) brightness(1.25); }
        }
        @keyframes glowGold {
          0%, 100% { 
            filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.7)) drop-shadow(0 0 12px rgba(234, 179, 8, 0.5));
            opacity: 0.8;
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(250, 204, 21, 1)) drop-shadow(0 0 25px rgba(234, 179, 8, 0.9));
            opacity: 1;
          }
        }
        @keyframes floatAndSpin {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(40px, -45px) rotate(90deg) scale(1.08); }
          40% { transform: translate(-30px, -75px) rotate(180deg) scale(0.94); }
          60% { transform: translate(50px, -30px) rotate(270deg) scale(1.12); }
          80% { transform: translate(-20px, -55px) rotate(360deg) scale(0.97); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        @keyframes fireRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fireFlicker {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          25% { opacity: 1; transform: scale(1.04); }
          50% { opacity: 0.65; transform: scale(0.97); }
          75% { opacity: 0.95; transform: scale(1.06); }
        }
        @keyframes cardFloat {
          0%, 100% {
            transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateY(0px);
          }
          50% {
            transform: perspective(1200px) rotateX(4deg) rotateY(3deg) translateY(-10px);
          }
        }
        @keyframes cardRock {
          0% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) rotateZ(0deg); }
          20% { transform: perspective(1200px) rotateX(8deg) rotateY(8deg) rotateZ(-6deg); }
          40% { transform: perspective(1200px) rotateX(3deg) rotateY(-10deg) rotateZ(7deg); }
          60% { transform: perspective(1200px) rotateX(7deg) rotateY(6deg) rotateZ(-4deg); }
          80% { transform: perspective(1200px) rotateX(4deg) rotateY(-7deg) rotateZ(5deg); }
          100% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) rotateZ(0deg); }
        }
        @keyframes shake {
          0%, 100% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateX(0); }
          20% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateX(-10px); }
          40% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateX(10px); }
          60% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateX(-6px); }
          80% { transform: perspective(1200px) rotateX(6deg) rotateY(-5deg) translateX(6px); }
        }
      `}</style>
    </div>
  );
}
