import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllQuestions, flattenSets, FlatQuestion } from '@/data/questions';
import { pendalamanSets } from '@/data/pendalaman';
import { allPersonSets as sidangNyataSets } from '@/data/sidangNyata';
import { duelSets } from '@/data/duelMode';
import { keputusanSidangSets } from '@/data/keputusanSidang';
import PersonTester from '@/components/PersonTester';
import SidangNyataPunishment from '@/components/SidangNyataPunishment';
import { useSpeech } from '@/hooks/useSpeech';
import QuestionCard from '@/components/QuestionCard';
import AnswerButtons from '@/components/AnswerButtons';
import PunishmentButtons from '@/components/PunishmentButtons';
import RewardButtons from '@/components/RewardButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, ShieldAlert, MessageSquareWarning, BookOpen, Gavel, Landmark, Dices, Swords } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { getRandomProlog } from '@/data/prologues';
import LoginGate from './LoginGate';
import { resolveCorrectAnswer } from '@/lib/debate';

function shuffleVariedPattern(questions: FlatQuestion[]): FlatQuestion[] {
  const groups: Record<string, FlatQuestion[]> = {};
  for (const q of questions) {
    if (!groups[q.person]) groups[q.person] = [];
    groups[q.person].push(q);
  }
  const persons = Object.keys(groups);
  for (const key of persons) {
    const g = groups[key];
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]];
    }
  }
  const buckets: Record<string, FlatQuestion[]> = {};
  for (const p of persons) buckets[p] = [...groups[p]];
  const result: FlatQuestion[] = [];
  let lastPerson = '';
  while (Object.values(buckets).some(b => b.length > 0)) {
    const available = persons.filter(p => buckets[p].length > 0);
    if (available.length === 0) break;
    const candidates = available.filter(p => p !== lastPerson);
    const pickPerson = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : available[0];
    const rand = Math.random();
    const burstSize = rand < 0.6 ? 1 : rand < 0.9 ? 2 : 3;
    const actualBurst = Math.min(burstSize, buckets[pickPerson].length);
    for (let i = 0; i < actualBurst; i++) {
      result.push(buckets[pickPerson].shift()!);
    }
    lastPerson = pickPerson;
  }
  return result;
}

function shuffleDecoy(questions: FlatQuestion[]): FlatQuestion[] {
  const clusters: Record<string, FlatQuestion[]> = {};
  for (const q of questions) {
    const key = `${q.role}-${q.id}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(q);
  }
  const clusterKeys = Object.keys(clusters);
  for (const key of clusterKeys) {
    const arr = clusters[key];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  const roleOrder: Array<'duit semilyar' | 'urip kepenak' | 'Kamulyan jagad'> = ['duit semilyar', 'urip kepenak', 'Kamulyan jagad'];
  for (let i = roleOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roleOrder[i], roleOrder[j]] = [roleOrder[j], roleOrder[i]];
  }
  const result: FlatQuestion[] = [];
  for (const role of roleOrder) {
    const roleKeys = clusterKeys.filter(k => k.startsWith(role));
    for (let i = roleKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roleKeys[i], roleKeys[j]] = [roleKeys[j], roleKeys[i]];
    }
    for (const key of roleKeys) {
      const group = clusters[key];
      const sorted: FlatQuestion[] = [];
      const byPerson: Record<string, FlatQuestion[]> = {};
      for (const q of group) {
        if (!byPerson[q.person]) byPerson[q.person] = [];
        byPerson[q.person].push(q);
      }
      const persons = Object.keys(byPerson);
      for (let i = persons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [persons[i], persons[j]] = [persons[j], persons[i]];
      }
      let lastP = '';
      while (persons.some(p => byPerson[p].length > 0)) {
        const avail = persons.filter(p => byPerson[p].length > 0);
        const cands = avail.filter(p => p !== lastP);
        const pick = cands.length > 0 ? cands[Math.floor(Math.random() * cands.length)] : avail[0];
        sorted.push(byPerson[pick].shift()!);
        lastP = pick;
      }
      result.push(...sorted);
    }
  }
  return result;
}

function buildDuelMixedQuestions(players: string[]): FlatQuestion[] {
  const safeFlatten = (sets: any): FlatQuestion[] => {
    try {
      if (!sets) return [];
      const result = flattenSets(sets);
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  };

  const fromDuel = safeFlatten(duelSets).filter(q => q && players.includes(q.person));
  const fromOther = [
    ...(getAllQuestions() || []),
    ...safeFlatten(pendalamanSets),
    ...safeFlatten(sidangNyataSets),
    ...safeFlatten(keputusanSidangSets)
  ].filter(q => q && players.includes(q.person));

  const byId: Record<number, FlatQuestion[]> = {};
  for (const q of fromDuel) {
    if (q?.id == null) continue;
    if (!byId[q.id]) byId[q.id] = [];
    byId[q.id].push(q);
  }

  const ids = Object.keys(byId).map(Number);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  const ordered: FlatQuestion[] = [];
  for (const id of ids) {
    const group = byId[id];
    if (!group || group.length === 0) continue;

    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
    ordered.push(...group);
  }

  for (let i = fromOther.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fromOther[i], fromOther[j]] = [fromOther[j], fromOther[i]];
  }

  return [...ordered, ...fromOther.slice(0, Math.floor(fromOther.length * 0.3))];
}
const personGlowColors: Record<string, string> = {
  Edi: 'text-violet-400',
  Ridwan: 'text-emerald-400',
  Susanto: 'text-sky-400',
  Suprapti: 'text-rose-400',
  Eka: 'text-amber-400',
  Jumiati: 'text-teal-400'
};

const personGlowShadows: Record<string, string> = {
  Edi: '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3)',
  Ridwan: '0 0 20px rgba(52,211,153,0.6), 0 0 40px rgba(52,211,153,0.3)',
  Susanto: '0 0 20px rgba(56,189,248,0.6), 0 0 40px rgba(56,189,248,0.3)',
  Suprapti: '0 0 20px rgba(251,113,133,0.6), 0 0 40px rgba(251,113,133,0.3)',
  Eka: '0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(251,191,36,0.3)',
  Jumiati: '0 0 20px rgba(45,212,191,0.6), 0 0 40px rgba(45,212,191,0.3)'
};

type Phase = 'idle' | 'prolog' | 'playing' | 'waitAnswer' | 'feedback' | 'reward' | 'rewarding' | 'punishment' | 'punishing' | 'duelIdentify';

const ALL_PERSONS = ['Edi', 'Ridwan', 'Susanto', 'Suprapti', 'Eka', 'Jumiati'];

const APPLAUSE_URLS = ['/audio/applause1.mp3', '/audio/applause2.mp3', '/audio/applause3.mp3'];
const OCEAN_AUDIO_URL = '/audio/ocean.mp3';
const OCEAN_VIDEO_URL = '/media/ocean.mp4';
const JOGET_VIDEO_URL = '/media/joget.mp4';
const DUEL_BET = 100_000;
const DUEL_START_SALDO = 500_000;

const STORAGE_KEY_SALDO = 'nationalist_duel_saldo';
const STORAGE_KEY_SCORES = 'nationalist_scores';

function loadSaldo(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALDO);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch { /* ignore */ }
  return {};
}

function saveSaldo(saldo: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY_SALDO, JSON.stringify(saldo));
  } catch { /* ignore */ }
}

function loadScores(): Record<string, { correct: number; wrong: number }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch { /* ignore */ }
  return {};
}

function saveScores(scores: Record<string, { correct: number; wrong: number }>) {
  try {
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
  } catch { /* ignore */ }
}

function createInitialScores(): Record<string, { correct: number; wrong: number }> {
  const saved = loadScores();
  const init: Record<string, { correct: number; wrong: number }> = {};
  ALL_PERSONS.forEach(p => {
    init[p] = saved[p] ?? { correct: 0, wrong: 0 };
  });
  return init;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [decoyMode, setDecoyMode] = useState(false);
  const decoyModeRef = useRef(false);
  const [prologMode, setPrologMode] = useState(false);
  const prologModeRef = useRef(false);
  const [deepMode, setDeepMode] = useState(false);
  const deepModeRef = useRef(false);
  const [sidangNyataMode, setSidangNyataMode] = useState(false);
  const sidangNyataModeRef = useRef(false);
  const [keputusanMode, setKeputusanMode] = useState(false);
  const keputusanModeRef = useRef(false);
  const [undianMode, setUndianMode] = useState(false);
  const undianModeRef = useRef(false);
  const [duelMode, setDuelMode] = useState(false);
  const duelModeRef = useRef(false);
  const [duelPlayers, setDuelPlayers] = useState<string[]>([]);
  const duelPlayersRef = useRef<string[]>([]);
  const [duelRound, setDuelRound] = useState<{
    questions: FlatQuestion[];
    targetPerson: string;
  } | null>(null);

  const [duelSaldo, setDuelSaldo] = useState<Record<string, number>>(() => loadSaldo());
  const duelSaldoRef = useRef(duelSaldo);

  const [scores, setScores] = useState<Record<string, { correct: number; wrong: number }>>(createInitialScores);
  const scoresRef = useRef(scores);

  const [currentProlog, setCurrentProlog] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<FlatQuestion[]>(() => shuffleVariedPattern(getAllQuestions()));
  const [sessionCount, setSessionCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [isOceanMuted, setIsOceanMuted] = useState(false);
  const [jogetVideo, setJogetVideo] = useState(false);
  const jogetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    speak,
    speakFeedback,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused
  } = useSpeech();

  const autoPlayRef = useRef(false);
  const currentIndexRef = useRef(0);
  const questionsRef = useRef(shuffledQuestions);
  const speakQuestionRef = useRef<(index: number) => void>(() => {});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const oceanAudioRef = useRef<HTMLAudioElement | null>(null);
  const applauseRef = useRef<HTMLAudioElement | null>(null);
  const applauseUnlockedRef = useRef(false);

  useEffect(() => { duelSaldoRef.current = duelSaldo; }, [duelSaldo]);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  useEffect(() => { saveSaldo(duelSaldo); }, [duelSaldo]);
  useEffect(() => { saveScores(scores); }, [scores]);

  useEffect(() => {
    const TEN_MINUTES = 10 * 60 * 1000;
    const announceStandings = () => {
      const currentScores = scoresRef.current;
      const currentSaldo = duelSaldoRef.current;
      const parts: string[] = ['Update skor sepuluh menit sekali.'];
      ALL_PERSONS.forEach(person => {
        const s = currentScores[person] ?? { correct: 0, wrong: 0 };
        const saldo = currentSaldo[person] ?? 0;
        parts.push(`${person}: benar ${s.correct}, salah ${s.wrong}, saldo ${saldo.toLocaleString('id-ID')} rupiah.`);
      });
      const text = parts.join(' ');
      speak(text);
    };
    const intervalId = setInterval(announceStandings, TEN_MINUTES);
    return () => clearInterval(intervalId);
  }, [speak]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch(() => {});
    }
    const audio = new Audio(OCEAN_AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    oceanAudioRef.current = audio;
    const preloadApplause = new Audio(APPLAUSE_URLS[0]);
    preloadApplause.preload = 'auto';
    preloadApplause.volume = 0.01;
    preloadApplause.load();
    applauseRef.current = preloadApplause;
    const unlockMedia = () => {
      if (video) video.play().catch(() => {});
      if (audio) {
        audio.volume = 0.85;
        audio.play().catch(() => {});
      }
      if (applauseRef.current && !applauseUnlockedRef.current) {
        const a = applauseRef.current;
        a.volume = 0.01;
        a.play().then(() => {
          a.pause();
          a.currentTime = 0;
          a.volume = 1.0;
          applauseUnlockedRef.current = true;
        }).catch(() => {});
      }
      document.removeEventListener('click', unlockMedia);
      document.removeEventListener('touchstart', unlockMedia);
    };
    audio.play().catch(() => {});
    document.addEventListener('click', unlockMedia);
    document.addEventListener('touchstart', unlockMedia);
    return () => {
      document.removeEventListener('click', unlockMedia);
      document.removeEventListener('touchstart', unlockMedia);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleOceanSound = useCallback(() => {
    if (!oceanAudioRef.current) return;
    if (isOceanMuted) {
      oceanAudioRef.current.volume = 0.85;
      oceanAudioRef.current.play().catch(() => {});
    } else oceanAudioRef.current.volume = 0;
    setIsOceanMuted(!isOceanMuted);
  }, [isOceanMuted]);

  const playApplause = useCallback(() => {
    try {
      if (applauseRef.current) {
        applauseRef.current.pause();
        applauseRef.current.currentTime = 0;
      }
      const main = new Audio(APPLAUSE_URLS[Math.floor(Math.random() * APPLAUSE_URLS.length)]);
      main.volume = 1;
      main.preload = 'auto';
      applauseRef.current = main;
      const layer = new Audio(APPLAUSE_URLS[Math.floor(Math.random() * APPLAUSE_URLS.length)]);
      layer.volume = 0.8;
      main.play().catch(() => {});
      setTimeout(() => layer.play().catch(() => {}), 150);
      setTimeout(() => {
        main.pause();
        layer.pause();
      }, 6000);
    } catch {/* */}
  }, []);

  const transferDuel = useCallback((fromPerson: string, toPerson: string, amount: number) => {
    if (!duelModeRef.current || fromPerson === toPerson) return;
    setDuelSaldo(prev => {
      const next = { ...prev };
      next[fromPerson] = (next[fromPerson] ?? 0) - amount;
      next[toPerson] = (next[toPerson] ?? 0) + amount;
      return next;
    });
    toast(`💸 ${fromPerson} −Rp${amount.toLocaleString('id-ID')} → ${toPerson} +Rp${amount.toLocaleString('id-ID')}`);
  }, []);

  const payOpponents = useCallback((loser: string, opponents: string[]) => {
    if (!duelModeRef.current || opponents.length === 0) return;
    const per = Math.floor(DUEL_BET / opponents.length);
    const remainder = DUEL_BET - per * opponents.length;
    setDuelSaldo(prev => {
      const next = { ...prev };
      next[loser] = (next[loser] ?? 0) - DUEL_BET;
      opponents.forEach((op, i) => {
        next[op] = (next[op] ?? 0) + per + (i === 0 ? remainder : 0);
      });
      return next;
    });
    toast(`💸 ${loser} −Rp${DUEL_BET.toLocaleString('id-ID')} → dibagi ke ${opponents.join(', ')}`);
  }, []);

  const winDuelBet = useCallback((person: string) => {
    if (!duelModeRef.current) return;
    setDuelSaldo(prev => ({
      ...prev,
      [person]: (prev[person] ?? 0) + DUEL_BET
    }));
    toast(`💰 ${person} +Rp${DUEL_BET.toLocaleString('id-ID')}`);
  }, []);

  useEffect(() => { decoyModeRef.current = decoyMode; }, [decoyMode]);
  useEffect(() => { prologModeRef.current = prologMode; }, [prologMode]);
  useEffect(() => { deepModeRef.current = deepMode; }, [deepMode]);
  useEffect(() => { sidangNyataModeRef.current = sidangNyataMode; }, [sidangNyataMode]);
  useEffect(() => { keputusanModeRef.current = keputusanMode; }, [keputusanMode]);
  useEffect(() => { undianModeRef.current = undianMode; }, [undianMode]);
  useEffect(() => { duelModeRef.current = duelMode; }, [duelMode]);
  useEffect(() => { duelPlayersRef.current = duelPlayers; }, [duelPlayers]);
  useEffect(() => { autoPlayRef.current = isAutoPlaying; }, [isAutoPlaying]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { questionsRef.current = shuffledQuestions; }, [shuffledQuestions]);

  const getQuestions = useCallback(() => {
    if (duelModeRef.current) {
      return buildDuelMixedQuestions(duelPlayersRef.current.length ? duelPlayersRef.current : ALL_PERSONS);
    }
    if (undianModeRef.current) {
      const all = [...flattenSets(keputusanSidangSets), ...flattenSets(pendalamanSets), ...flattenSets(sidangNyataSets)];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      return all;
    }
    if (keputusanModeRef.current) return flattenSets(keputusanSidangSets);
    if (sidangNyataModeRef.current) return flattenSets(sidangNyataSets);
    return deepModeRef.current ? flattenSets(pendalamanSets) : getAllQuestions();
  }, []);

  const startQuizFromIndex = useCallback((index: number) => {
    const safeIndex = Math.min(Math.max(index, 0), Math.max(shuffledQuestions.length - 1, 0));
    setCurrentIndex(safeIndex);
    setPhase('playing');
    setLastResult(null);
    setIsAutoPlaying(true);
    speakQuestionRef.current(safeIndex);
  }, [shuffledQuestions.length]);

  const advanceToNext = useCallback(() => {
    const qs = questionsRef.current;
    const next = currentIndexRef.current + 1;
    setLastResult(null);
    setPhase('idle');
    setDuelRound(null);
    if (next >= qs.length) {
      const newQuestions = decoyModeRef.current ? shuffleDecoy(getQuestions()) : shuffleVariedPattern(getQuestions());
      setShuffledQuestions(newQuestions);
      setCurrentIndex(0);
      setSessionCount(c => c + 1);
      toast.success('Sesi selesai! Diacak ulang!');
      if (autoPlayRef.current) startQuizFromIndex(0);
      return;
    }
    setCurrentIndex(next);
    if (autoPlayRef.current) speakQuestionRef.current(next);
  }, [getQuestions, startQuizFromIndex]);

  const resetScores = useCallback(() => {
    const init: Record<string, { correct: number; wrong: number }> = {};
    ALL_PERSONS.forEach(p => {
      init[p] = { correct: 0, wrong: 0 };
    });
    setScores(init);
  }, []);

  const clearOtherModes = () => {
    setDeepMode(false);
    deepModeRef.current = false;
    setSidangNyataMode(false);
    sidangNyataModeRef.current = false;
    setKeputusanMode(false);
    keputusanModeRef.current = false;
    setUndianMode(false);
    undianModeRef.current = false;
    setDuelMode(false);
    duelModeRef.current = false;
    setDuelPlayers([]);
    duelPlayersRef.current = [];
  };

  const handleToggleProlog = useCallback(() => {
    const newMode = !prologModeRef.current;
    setPrologMode(newMode);
    prologModeRef.current = newMode;
    toast.success(newMode ? '🎙️ Prolog AKTIF!' : '🔇 Prolog dimatikan.');
  }, []);

  const handleToggleDecoy = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !decoyModeRef.current;
    setDecoyMode(newMode);
    decoyModeRef.current = newMode;
    setShuffledQuestions(newMode ? shuffleDecoy(getQuestions()) : shuffleVariedPattern(getQuestions()));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    resetScores();
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(newMode ? '🎭 Pengecoh AKTIF!' : '🔀 Normal aktif!');
  }, [stop, resetScores, getQuestions, startQuizFromIndex]);

  const handleToggleDeep = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !deepModeRef.current;
    if (newMode) clearOtherModes();
    setDeepMode(newMode);
    deepModeRef.current = newMode;
    const qs = newMode ? flattenSets(pendalamanSets) : getAllQuestions();
    setShuffledQuestions(decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    resetScores();
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(newMode ? '📖 Pendalaman AKTIF!' : '📝 Standar aktif!');
  }, [stop, resetScores, startQuizFromIndex]);

  const handleToggleSidangNyata = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !sidangNyataModeRef.current;
    if (newMode) clearOtherModes();
    setSidangNyataMode(newMode);
    sidangNyataModeRef.current = newMode;
    const qs = newMode ? flattenSets(sidangNyataSets) : getAllQuestions();
    setShuffledQuestions(decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    resetScores();
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(newMode ? '⚖️ Sidang Nyata AKTIF!' : '📝 Standar aktif!');
  }, [stop, resetScores, startQuizFromIndex]);

  const handleToggleKeputusan = useCallback(() => {
    const newMode = !keputusanModeRef.current;
    if (newMode) clearOtherModes();
    setKeputusanMode(newMode);
    keputusanModeRef.current = newMode;
    const qs = newMode ? flattenSets(keputusanSidangSets) : getAllQuestions();
    setShuffledQuestions(decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    resetScores();
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(newMode ? '🏛️ Keputusan Sidang AKTIF!' : '📝 Standar aktif!');
  }, [resetScores, startQuizFromIndex]);

  const handleToggleUndian = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !undianModeRef.current;
    if (newMode) clearOtherModes();
    setUndianMode(newMode);
    undianModeRef.current = newMode;
    const qs = newMode ? (() => {
      const all = [...flattenSets(keputusanSidangSets), ...flattenSets(pendalamanSets), ...flattenSets(sidangNyataSets)];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      return all;
    })() : getAllQuestions();
    setShuffledQuestions(shuffleVariedPattern(qs));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setDuelRound(null);
    resetScores();
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(newMode ? '🎲 Undian AKTIF!' : '📝 Standar aktif!');
  }, [stop, resetScores, startQuizFromIndex]);

  const startDuel = useCallback((size: 2 | 3 | 4 | 5 | 6) => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    setDeepMode(false);
    deepModeRef.current = false;
    setSidangNyataMode(false);
    sidangNyataModeRef.current = false;
    setKeputusanMode(false);
    keputusanModeRef.current = false;
    setUndianMode(false);
    undianModeRef.current = false;

    const shuffled = [...ALL_PERSONS].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, size);
    setDuelPlayers(picked);
    duelPlayersRef.current = picked;
    setDuelMode(true);
    duelModeRef.current = true;

    setDuelSaldo(prev => {
      const next = { ...prev };
      picked.forEach(p => {
        if (next[p] === undefined) {
          next[p] = DUEL_START_SALDO;
        }
      });
      return next;
    });

    const qs = buildDuelMixedQuestions(picked);
    setShuffledQuestions(decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success(`⚔️ DUEL ${size}: ${picked.join(' vs ')} · Saldo tetap tersimpan · Taruhan Rp${DUEL_BET.toLocaleString('id-ID')}`);
  }, [stop, startQuizFromIndex]);

  const stopDuel = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setDuelMode(false);
    duelModeRef.current = false;
    setDuelPlayers([]);
    duelPlayersRef.current = [];
    setDuelRound(null);
    setShuffledQuestions(shuffleVariedPattern(getAllQuestions()));
    setCurrentIndex(0);
    toast.success('📝 Mode Standar aktif kembali! Saldo tetap tersimpan.');
  }, [stop]);

  const handleDuelIdentify = useCallback((selectedIndex: number) => {
    if (!duelRound) return;
    const cq = questionsRef.current[currentIndexRef.current];
    const selectedQ = duelRound.questions[selectedIndex];
    if (selectedQ.person === cq.person) {
      speakFeedback(`Tepat! Itu memang pertanyaan ${cq.person}! Sekarang jawab, jawaban satu atau dua?`, () => setPhase('waitAnswer'));
    } else {
      transferDuel(cq.person, selectedQ.person, DUEL_BET);
      setPhase('feedback');
      setLastResult('wrong');
      setScores(prev => ({
        ...prev,
        [cq.person]: {
          ...prev[cq.person],
          wrong: prev[cq.person].wrong + 1
        }
      }));
      const correctIdx = duelRound.questions.findIndex(rq => rq.person === cq.person);
      const label = String.fromCharCode(65 + Math.max(0, correctIdx));
      speakFeedback(`Salah! Itu milik ${selectedQ.person}! ${cq.person} bayar ke ${selectedQ.person}. Yang benar Pertanyaan ${label}!`, () => setPhase('punishment'));
    }
  }, [duelRound, speakFeedback, transferDuel]);

  const handleReshuffle = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    setShuffledQuestions(decoyModeRef.current ? shuffleDecoy(getQuestions()) : shuffleVariedPattern(getQuestions()));
    setSessionCount(c => c + 1);
    setCurrentIndex(0);
    setCurrentProlog(null);
    setDuelRound(null);
    setIsAutoPlaying(true);
    startQuizFromIndex(0);
    toast.success('Diacak ulang! Saldo & skor tetap tersimpan.');
  }, [stop, getQuestions, startQuizFromIndex]);

  const speakQuestionDirect = useCallback((index: number) => {
    const q = questionsRef.current[index];
    setPhase('playing');
    setCurrentProlog(null);
    speak(`Dari ${q.role}. ${q.text}`, () => setPhase('waitAnswer'));
  }, [speak]);

  const speakQuestion = useCallback((index: number) => {
    const qs = questionsRef.current;
    if (index >= qs.length) {
      setIsAutoPlaying(false);
      toast.success('Selesai semua pertanyaan.');
      return;
    }
    const q = qs[index];
    setLastResult(null);
    if (duelModeRef.current) {
      const players = duelPlayersRef.current;
      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
      const opponents = players.filter(p => p !== q.person);
      const decoys: FlatQuestion[] = [];
      for (const op of opponents) {
        const candidate = qs.find(sq => sq.id === q.id && sq.person === op) || qs.find(sq => sq.role === q.role && sq.person === op) || qs.find(sq => sq.person === op);
        if (candidate) decoys.push(candidate);
      }
      const roundQs = [q, ...decoys].sort(() => Math.random() - 0.5);
      setDuelRound({ questions: roundQs, targetPerson: q.person });
      const parts = [`Duel ${players.length} peserta! Yang ikut: ${players.join(', ')}. Dengarkan baik-baik!`];
      for (let i = 0; i < roundQs.length; i++) {
        parts.push(`Pertanyaan ${labels[i]}. Dari ${roundQs[i].role}. ${roundQs[i].text}`);
      }
      parts.push(`Pertanyaan mana milik ${q.person}?`);
      setPhase('playing');
      setCurrentProlog(null);
      speak(parts.join('. '), () => setPhase('duelIdentify'));
      return;
    }
    if (prologModeRef.current) {
      const prolog = getRandomProlog(index, q.person, ALL_PERSONS);
      setCurrentProlog(prolog);
      setPhase('prolog');
      speakFeedback(prolog, () => setTimeout(() => speakQuestionDirect(index), 600));
    } else {
      setPhase('playing');
      speak(`Dari ${q.role}. ${q.text}`, () => setPhase('waitAnswer'));
    }
  }, [speak, speakFeedback, speakQuestionDirect]);

  useEffect(() => {
    speakQuestionRef.current = speakQuestion;
  }, [speakQuestion]);

  const handleAnswer = useCallback((chosenAnswer: 1 | 2) => {
    const q = questionsRef.current[currentIndexRef.current];
    const correctAnswer = resolveCorrectAnswer(q) ?? q.setIndex + 1;
    const isCorrect = chosenAnswer === correctAnswer;
    setPhase('feedback');
    setLastResult(isCorrect ? 'correct' : 'wrong');
    setScores(prev => ({
      ...prev,
      [q.person]: {
        correct: prev[q.person].correct + (isCorrect ? 1 : 0),
        wrong: prev[q.person].wrong + (isCorrect ? 0 : 1)
      }
    }));
    if (duelModeRef.current) {
      if (isCorrect) {
        winDuelBet(q.person);
      } else {
        const opsFromRound = duelRound ? duelRound.questions.map(x => x.person).filter(p => p !== q.person) : [];
        const opponents = opsFromRound.length > 0 ? opsFromRound : duelPlayersRef.current.filter(p => p !== q.person);
        payOpponents(q.person, opponents);
      }
    }
    const formal = sidangNyataModeRef.current || keputusanModeRef.current || undianModeRef.current;
    const resultText = isCorrect ? formal ? 'Anda layak dapat sertifikat tanah!' : ' Kowe Jenule josss jisss!' : formal ? 'Anda tidak layak!' : 'Kowe ra sido entuk duit!';
    const fullFeedback = `${resultText} Pertanyaan ini punya ${q.person}.${isCorrect ? '' : ` Jawaban yang benar adalah nomor ${correctAnswer}.`}`;
    if (isCorrect) playApplause();
    speakFeedback(fullFeedback, () => {
      if (isCorrect) setTimeout(() => advanceToNext(), 800); else setPhase('punishment');
    });
  }, [speakFeedback, playApplause, advanceToNext, winDuelBet, payOpponents, duelRound]);

  const handleTimeout = useCallback(() => {
    const q = questionsRef.current[currentIndexRef.current];
    const correctAnswer = resolveCorrectAnswer(q) ?? q.setIndex + 1;
    setPhase('feedback');
    setLastResult('wrong');
    setScores(prev => ({
      ...prev,
      [q.person]: {
        ...prev[q.person],
        wrong: prev[q.person].wrong + 1
      }
    }));
    if (duelModeRef.current) {
      const opponents = duelPlayersRef.current.filter(p => p !== q.person);
      payOpponents(q.person, opponents);
    }
    const formal = sidangNyataModeRef.current || keputusanModeRef.current || undianModeRef.current;
    speakFeedback(formal ? `Waktunya habis! Anda tidak layak! Punya ${q.person}. Benar nomor ${correctAnswer}.` : `Waktunya habis! Kowe kok Washik! Punya ${q.person}. Benar nomor ${correctAnswer}.`, () => {
      setTimeout(() => advanceToNext(), 1000);
    });
  }, [speakFeedback, payOpponents, advanceToNext]);

  const handleReward = useCallback((t: string) => {
    setPhase('rewarding');
    speakFeedback(t, () => setTimeout(() => advanceToNext(), 1000));
  }, [speakFeedback, advanceToNext]);

  const handlePunishment = useCallback((t: string) => {
    setPhase('punishing');
    speakFeedback(t, () => setTimeout(() => advanceToNext(), 1000));
  }, [speakFeedback, advanceToNext]);

  const handleJoget = useCallback(() => {
    setPhase('punishing');
    speakFeedback('Hukumanmu joget tagin menit!', () => {});
    setJogetVideo(true);
    jogetTimerRef.current = setTimeout(() => {
      setJogetVideo(false);
      setTimeout(() => advanceToNext(), 500);
    }, 3 * 60 * 1000);
  }, [speakFeedback, advanceToNext]);

  const closeJogetVideo = useCallback(() => {
    setJogetVideo(false);
    if (jogetTimerRef.current) clearTimeout(jogetTimerRef.current);
    setTimeout(() => advanceToNext(), 500);
  }, [advanceToNext]);

  const handlePlay = useCallback(() => {
    if (isPaused) {
      resume();
      return;
    }
    if (['waitAnswer', 'punishment', 'reward', 'prolog', 'duelIdentify'].includes(phase)) return;
    setIsAutoPlaying(true);
    speakQuestion(currentIndex);
  }, [currentIndex, isPaused, resume, speakQuestion, phase]);

  const handlePause = useCallback(() => pause(), [pause]);

  const handleStop = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    setCurrentProlog(null);
    setDuelRound(null);
  }, [stop]);

  const handleNext = useCallback(() => {
    stop();
    setPhase('idle');
    setCurrentProlog(null);
    setDuelRound(null);
    const next = Math.min(currentIndex + 1, shuffledQuestions.length - 1);
    setCurrentIndex(next);
    if (isAutoPlaying) speakQuestion(next);
  }, [currentIndex, isAutoPlaying, shuffledQuestions.length, speakQuestion, stop]);

  const handlePrev = useCallback(() => {
    stop();
    setPhase('idle');
    setLastResult(null);
    setDuelRound(null);
    const prev = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prev);
    if (isAutoPlaying) speakQuestion(prev);
  }, [currentIndex, isAutoPlaying, speakQuestion, stop]);

  const currentQ = shuffledQuestions[currentIndex];
  const progress = (currentIndex + (isSpeaking ? 0.5 : 0)) / Math.max(shuffledQuestions.length, 1) * 100;
  const isActive = phase !== 'idle' && phase !== 'prolog';
  const formalMode = sidangNyataMode || keputusanMode || undianMode;

  if (!isAuthenticated) {
    return <LoginGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto" className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover" >
          <source src={OCEAN_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      <Toaster />

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="container mx-auto px-4 pt-3 flex items-start justify-between pointer-events-auto">
          <div className='backdrop-blur-md border border-white/10 bg-[#08a61380] px-[5px] py-[5px] rounded-[2px] shadow-lg opacity-[0]'>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Narator Sidang SOKO
            </h1>
            <p className="text-[10px] text-white/60 mt-0.5">
              {duelMode ? `⚔️ Duel ${duelPlayers.length}: ${duelPlayers.join(', ')}` : undianMode ? '🎲 Undian' : sidangNyataMode ? '⚖️ Sidang Nyata' : keputusanMode ? '🏛️ Keputusan Sidang' : deepMode ? '📖 Pendalaman' : '📝 Standar'}
              {decoyMode ? ' • 🎭 Pengecoh' : ' • 🔀 Acak'}
              {prologMode ? ' • 🎙️ Prolog' : ''}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button onClick={toggleOceanSound} className="glow-btn glow-btn--cyan" title="Ombek">
              {isOceanMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0fe7f2]" />}
            </button>
            <button onClick={handleToggleProlog} className={`glow-btn ${prologMode ? 'glow-btn--active glow-btn--yellow' : 'glow-btn--yellow'}`}>
              <MessageSquareWarning className="w-4 h-4 text-[#fa0af6]" />
            </button>
            <button onClick={handleToggleDecoy} className={`glow-btn ${decoyMode ? 'glow-btn--active glow-btn--purple' : 'glow-btn--purple'}`}>
              <ShieldAlert className="w-4 h-4 text-[#ed0707]" />
            </button>
            <button onClick={handleToggleDeep} className={`glow-btn ${deepMode ? 'glow-btn--active glow-btn--emerald' : 'glow-btn--emerald'}`}>
              <BookOpen className="w-4 h-4 text-[#27e01d]" />
            </button>
            <button onClick={handleToggleSidangNyata} className={`glow-btn ${sidangNyataMode ? 'glow-btn--active glow-btn--red' : 'glow-btn--red'}`}>
              <Gavel className="w-4 h-4 text-[#fa1111]" />
            </button>
            <button onClick={handleToggleKeputusan} className={`glow-btn ${keputusanMode ? 'glow-btn--active glow-btn--orange' : 'glow-btn--orange'}`}>
              <Landmark className="w-4 h-4 text-[#0c17f0]" />
            </button>
            <button onClick={handleToggleUndian} className={`glow-btn ${undianMode ? 'glow-btn--active glow-btn--pink' : 'glow-btn--pink'}`}>
              <Dices className="w-4 h-4" />
            </button>

            {([2, 3, 4, 5, 6] as const).map(n => (
              <button key={n} onClick={() => startDuel(n)} className={`glow-btn ${duelMode && duelPlayers.length === n ? 'glow-btn--active glow-btn--amber' : 'glow-btn--amber'}`} title={`Duel ${n}`}>
                <Swords className="w-3 h-3 text-[#f5a30c]" />
                <span className="text-[10px] ml-0.5 text-amber-200">{n}</span>
              </button>
            ))}
            {duelMode && (
              <button onClick={stopDuel} className="glow-btn glow-btn--red" title="Stop Duel">
                <span className="text-[10px] text-white">Stop</span>
              </button>
            )}

            <button onClick={handleReshuffle} className="glow-btn glow-btn--sky">
              <Shuffle className="w-4 h-4" />
            </button>
            <Badge className="bg-black/50 text-white/80 border-white/20 text-[10px]">
              {currentIndex + 1}/{shuffledQuestions.length}
            </Badge>
            <Badge className="bg-black/50 text-white/80 border-white/20 text-[10px]">
              Sesi {sessionCount}
            </Badge>
          </div>
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-4">
          <PersonTester />
        </div>

        {Object.keys(duelSaldo).length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 justify-center max-w-lg">
            {ALL_PERSONS.filter(p => duelSaldo[p] !== undefined).map(p => (
              <div key={p} className="bg-black/60 border border-amber-400/40 rounded-lg px-3 py-1 text-xs text-white">
                <span className={`font-bold ${personGlowColors[p]}`}>{p}</span>
                <span className={`ml-2 font-semibold ${(duelSaldo[p] ?? 0) >= DUEL_START_SALDO ? 'text-emerald-300' : (duelSaldo[p] ?? 0) > 0 ? 'text-amber-300' : 'text-red-400'}`}>
                  Rp{(duelSaldo[p] ?? 0).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}

        {currentProlog && phase === 'prolog' && (
          <div className="mb-4 text-center">
            <p className="text-base font-bold italic text-cyan-300 animate-pulse px-4" style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
              🎙️ &ldquo;{currentProlog}&rdquo;
            </p>
          </div>
        )}

        {currentQ && isActive && !duelMode && (
          <div className="mb-2 text-center flex flex-col items-center gap-0.5 bg-[#3d1111]">
            <span className="text-[#0cf70c]" style={{ textShadow: personGlowShadows[currentQ.person] }}>{currentQ.person}</span>
            <span className="text-[#0ef00e]" style={{ opacity: 0.85 }}>Jawaban {resolveCorrectAnswer(currentQ) ?? currentQ.setIndex + 1}</span>
          </div>
        )}

        {duelMode && duelRound && isActive && (
          <div className="mb-3 text-center">
            <p className="text-amber-400 font-bold text-sm mb-2 tracking-widest">⚔️ DUEL {duelPlayers.length} · Rp{DUEL_BET.toLocaleString('id-ID')} pindah tangan ⚔️</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {duelPlayers.map(p => (
                <span key={p} className={`text-xl sm:text-2xl font-black ${personGlowColors[p]} animate-pulse`} style={{ textShadow: personGlowShadows[p] }}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {lastResult && (
          <div className="mb-3 text-center">
            <span className="text-[#ebdada]">
              {lastResult === 'correct' ? formalMode ? '📜 LAYAK SERTIFIKAT!' : '🔥 JOSSS JISSS!' : formalMode ? '⚖️ TIDAK LAYAK!' : '❌ RA SIDO ENTUK DUIT!'}
            </span>
            {currentQ && (
              <p className="text-sm text-white/70 mt-1">
                Punya <strong className="text-white">{currentQ.person}</strong>
                {lastResult === 'wrong' && (
                  <span className="block font-bold text-[#ede1e1]">
                    Benar: Jawaban {resolveCorrectAnswer(currentQ) ?? currentQ.setIndex + 1}
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {currentQ && phase !== 'duelIdentify' && (
          <div className="w-full max-w-md" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <QuestionCard question={{ ...currentQ, globalIndex: currentIndex + 1 }} isActive={isSpeaking} isCurrent showPerson={phase !== 'idle' && phase !== 'prolog'} />
          </div>
        )}

        {phase === 'duelIdentify' && duelRound && currentQ && (
          <div className="mt-4 w-full max-w-md space-y-3">
            <p className="text-center text-white font-bold text-lg mb-4" style={{ textShadow: '0 0 20px rgba(251,191,36,0.7)' }}>
              ⚔️ Pertanyaan mana milik{' '}
              <span className={personGlowColors[currentQ.person]} style={{ textShadow: personGlowShadows[currentQ.person] }}>{currentQ.person}</span>
              ?
            </p>
            {duelRound.questions.map((dq, i) => (
              <button key={i} onClick={() => handleDuelIdentify(i)} className='w-full p-4 rounded-xl bg-black/50 border border-white/20 text-white text-left hover:border-amber-400/50 transition-colors'>
                <span className="font-bold text-amber-400">Pertanyaan {String.fromCharCode(65 + i)}</span>
                <p className="mt-2 text-sm text-white/90">{dq.text}</p>
              </button>
            ))}
          </div>
        )}

        {phase === 'waitAnswer' && currentQ && (
          <div className="mt-2 w-full max-w-md">
            <AnswerButtons onAnswer={handleAnswer} person={currentQ.person} />
          </div>
        )}

        {phase === 'reward' && (
          <div className="mt-4 w-full max-w-md">
            <RewardButtons onReward={handleReward} />
          </div>
        )}

        {phase === 'punishment' && (
          <div className="mt-4 w-full max-w-md">
            {formalMode ? <SidangNyataPunishment onPunishment={handlePunishment} /> : <PunishmentButtons onPunishment={handlePunishment} onJoget={handleJoget} />}
          </div>
        )}

        <div className="mt-3 w-full max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0 || ['waitAnswer', 'punishment', 'reward', 'duelIdentify'].includes(phase)} className="bg-black/40 border-white/20 text-white">
            <SkipBack className="w-4 h-4" />
          </Button>
          {isSpeaking && !isPaused ? (
            <Button size="sm" onClick={handlePause} className="px-6">
              <Pause className="w-4 h-4 mr-1" /> Jeda
            </Button>
          ) : (
            <Button size="sm" onClick={handlePlay} className="px-6" disabled={['waitAnswer', 'punishment', 'punishing', 'reward', 'rewarding', 'duelIdentify'].includes(phase)}>
              <Play className="w-4 h-4 mr-1 text-[#1af00e]" />
              {isPaused ? 'Lanjut' : isAutoPlaying ? 'Lanjut' : 'Mulai'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleStop} disabled={phase === 'idle'} className="bg-black/40 border-white/20 text-white">
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentIndex >= shuffledQuestions.length - 1} className="bg-black/40 border-white/20 text-white">
            <SkipForward className="w-4 h-4 text-[#1d0eeb]" />
          </Button>
        </div>
      </main>

      {jogetVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden border-2 border-yellow-400/50">
            <video autoPlay loop muted playsInline preload="auto" src={JOGET_VIDEO_URL} className="w-full h-full" />
          </div>
          <p className="text-yellow-300 font-bold text-lg mt-4 animate-pulse">💃 Joget 3 menit!</p>
          <Button variant="outline" size="sm" onClick={closeJogetVideo} className="mt-3 border-white/30 text-white">⏭️ Lewati</Button>
        </div>
      )}
    </div>
  );
}
