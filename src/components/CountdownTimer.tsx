import { useState, useEffect, useRef, useCallback } from 'react';

interface CountdownTimerProps {
  onTimeout: () => void;
  isRunning: boolean;
  duration?: number;
}

const COUNTDOWN_VOICES = ['siji', 'loro', 'kowe goblok!'];

function speakText(text: string, rate = 1, pitch = 0.8) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function CountdownTimer({ onTimeout, isRunning, duration = 3 }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTimedOutRef = useRef(false);
  const tickRef = useRef(0);

  useEffect(() => {
    setTimeLeft(duration);
    hasTimedOutRef.current = false;
    tickRef.current = 0;
  }, [duration, isRunning]);

  const handleTimeout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      const voiceIndex = tickRef.current;
      if (voiceIndex < COUNTDOWN_VOICES.length) {
        speakText(COUNTDOWN_VOICES[voiceIndex], voiceIndex === 2 ? 0.9 : 0.85, voiceIndex === 2 ? 0.6 : 0.8);
      }
      tickRef.current += 1;

      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Panggil onTimeout di effect terpisah (cara yang benar)
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !hasTimedOutRef.current) {
      hasTimedOutRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      const timeoutId = setTimeout(() => {
        handleTimeout();
      }, 1200);
      return () => clearTimeout(timeoutId);
    }
  }, [timeLeft, isRunning, handleTimeout]);

  const percentage = (timeLeft / duration) * 100;
  const isCritical = timeLeft <= 1;
  const isUrgent = timeLeft <= 2;

  const voiceLabel = tickRef.current > 0 && tickRef.current <= COUNTDOWN_VOICES.length
    ? COUNTDOWN_VOICES[tickRef.current - 1]
    : null;

  return (
    <div className="mt-3 w-full max-w-md">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-bold ${isCritical ? 'text-red-400 animate-pulse' : isUrgent ? 'text-yellow-400' : 'text-white/60'}`}>
          ⏱️ Waktu Menjawab
        </span>
        <span
          className={`text-2xl font-black tabular-nums ${
            isCritical ? 'text-red-400 animate-bounce' : isUrgent ? 'text-yellow-400' : 'text-white'
          }`}
          style={{
            textShadow: isCritical
              ? '0 0 20px rgba(248,113,113,0.8)'
              : isUrgent
              ? '0 0 15px rgba(250,204,21,0.6)'
              : 'none',
          }}
        >
          {timeLeft}s
        </span>
      </div>

      {voiceLabel && (
        <div className={`text-center text-lg font-black mt-1 ${isCritical ? 'text-red-400 text-2xl animate-pulse' : 'text-yellow-300'}`}>
          🔊 {voiceLabel.toUpperCase()}
        </div>
      )}

      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm mt-1">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' : isUrgent ? 'bg-yellow-500' : 'bg-cyan-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}