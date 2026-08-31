import { useCallback, useRef, useState } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) {
      console.warn('Speech not supported');
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID';
    u.rate = 0.95;
    u.pitch = 1;
    callbackRef.current = onEnd || null;
    u.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    u.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      callbackRef.current?.();
      callbackRef.current = null;
    };
    u.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      callbackRef.current?.();
      callbackRef.current = null;
    };
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const speakFeedback = useCallback((text: string, onEnd?: () => void) => {
    speak(text, onEnd);
  }, [speak]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    callbackRef.current = null;
  }, []);

  return { speak, speakFeedback, pause, resume, stop, isSpeaking, isPaused };
}
