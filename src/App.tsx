import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllQuestions, flattenSets, FlatQuestion } from '@/data/questions';
import { pendalamanSets } from '@/data/pendalaman';
import { allPersonSets as sidangNyataSets } from '@/data/sidangNyata';
import { duelSets } from '@/data/duelMode';
import { keputusanSidangSets } from '@/data/keputusanSidang';
import PersonTester from '@/components/PersonTester';
import UjiNyaliTester from '@/components/UjiNyaliTester';
import SidangNyataPunishment from '@/components/SidangNyataPunishment';
import { useSpeech } from '@/hooks/useSpeech';
import QuestionCard from '@/components/QuestionCard';
import AnswerButtons from '@/components/AnswerButtons';
import PunishmentButtons from '@/components/PunishmentButtons';
import RewardButtons from '@/components/RewardButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, ShieldAlert, MessageSquareWarning, BookOpen, Gavel, Landmark, Dices, Swords, Users } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { getRandomProlog } from '@/data/prologues';
import LoginGate from './LoginGate';
import { resolveCorrectAnswer, buildPersonModeQuestions } from '@/lib/debate';

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
  const [personMode, setPersonMode] = useState(false);
  const personModeRef = useRef(false);
  const [personTarget, setPersonTarget] = useState<string | null>(null);
  // Uji Nyali mode
  const [ujiNyaliMode, setUjiNyaliMode] = useState(false);
  const ujiNyaliModeRef = useRef(false);
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
  const [isModeSwitching, setIsModeSwitching] = useState(false);
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

  const applyQuestions = useCallback((nextQuestions: FlatQuestion[]) => {
    setIsModeSwitching(true);
    stop();
    setShuffledQuestions(nextQuestions);
    questionsRef.current = nextQuestions;
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setSessionCount(c => c + 1);
    setPhase('idle');
    setLastResult(null);
    setDuelRound(null);
    setCurrentProlog(null);
    setIsAutoPlaying(true);
    autoPlayRef.current = true;
    setTimeout(() => {
      speakQuestionRef.current(0);
      setIsModeSwitching(false);
    }, 80);
  }, [stop]);

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
  useEffect(() => { personModeRef.current = personMode; }, [personMode]);
+  useEffect(() => { ujiNyaliModeRef.current = ujiNyaliMode; }, [ujiNyaliMode]);
  useEffect(() => { duelPlayersRef.current = duelPlayers; }, [duelPlayers]);
  useEffect(() => { autoPlayRef.current = isAutoPlaying; }, [isAutoPlaying]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { questionsRef.current = shuffledQuestions; }, [shuffledQuestions]);

  const getQuestions = useCallback(() => {
    if (duelModeRef.current) {
      return buildDuelMixedQuestions(duelPlayersRef.current.length ? duelPlayersRef.current : ALL_PERSONS);
    }
    if (personModeRef.current && personTarget) {
      return buildPersonModeQuestions(personTarget);
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
  }, [personTarget]);

  const startQuizFromIndex = useCallback((index: number) => {
    const qs = questionsRef.current.length ? questionsRef.current : shuffledQuestions;
    const safeIndex = Math.min(Math.max(index, 0), Math.max(qs.length - 1, 0));
    setCurrentIndex(safeIndex);
    currentIndexRef.current = safeIndex;
    setPhase('playing');
    setLastResult(null);
    setIsAutoPlaying(true);
    autoPlayRef.current = true;
    speakQuestionRef.current(safeIndex);
  }, [shuffledQuestions]);

  const advanceToNext = useCallback(() => {
    const qs = questionsRef.current;
    const next = currentIndexRef.current + 1;
    setLastResult(null);
    setPhase('idle');
    setDuelRound(null);
    if (next >= qs.length) {
      const newQuestions = decoyModeRef.current ? shuffleDecoy(getQuestions()) : shuffleVariedPattern(getQuestions());
      applyQuestions(newQuestions);
      setSessionCount(c => c + 1);
      toast.success('Sesi selesai! Diacak ulang!');
      return;
    }
    setCurrentIndex(next);
    currentIndexRef.current = next;
    if (autoPlayRef.current) speakQuestionRef.current(next);
  }, [applyQuestions, getQuestions]);

  const resetScores = useCallback(() => {
    const init: Record<string, { correct: number; wrong: number }> = {};
    ALL_PERSONS.forEach(p => {
      init[p] = { correct: 0, wrong: 0 };
    });
    setScores(init);
  }, []);

  const clearOtherModes = useCallback(() => {
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
    setPersonMode(false);
    personModeRef.current = false;
    setPersonTarget(null);
    // nonaktifkan uji nyali juga
    setUjiNyaliMode(false);
    ujiNyaliModeRef.current = false;
  }, []);

  const handleToggleProlog = useCallback(() => {
    const newMode = !prologModeRef.current;
    setPrologMode(newMode);
    prologModeRef.current = newMode;
    toast.success(newMode ? '🎙️ Prolog AKTIF!' : '🔇 Prolog dimatikan.');
  }, []);

  const handleToggleDecoy = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !decoyModeRef.current;
    setDecoyMode(newMode);
    decoyModeRef.current = newMode;
    const qs = getQuestions();
    const prepared = newMode ? shuffleDecoy(qs) : shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(newMode ? '🎭 Pengecoh AKTIF!' : '🔀 Normal aktif!');
  }, [applyQuestions, getQuestions, isModeSwitching, stop]);

  const handleToggleDeep = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !deepModeRef.current;
    if (newMode) clearOtherModes();
    setDeepMode(newMode);
    deepModeRef.current = newMode;
    const qs = newMode ? flattenSets(pendalamanSets) : getAllQuestions();
    const prepared = decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(newMode ? '📖 Pendalaman AKTIF!' : '📝 Standar aktif!');
  }, [applyQuestions, clearOtherModes, isModeSwitching, stop]);

  const handleToggleSidangNyata = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const newMode = !sidangNyataModeRef.current;
    if (newMode) clearOtherModes();
    setSidangNyataMode(newMode);
    sidangNyataModeRef.current = newMode;
    const qs = newMode ? flattenSets(sidangNyataSets) : getAllQuestions();
    const prepared = decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(newMode ? '⚖️ Sidang Nyata AKTIF!' : '📝 Standar aktif!');
  }, [applyQuestions, clearOtherModes, isModeSwitching, stop]);

  const handleToggleKeputusan = useCallback(() => {
    if (isModeSwitching) return;
    const newMode = !keputusanModeRef.current;
    if (newMode) clearOtherModes();
    setKeputusanMode(newMode);
    keputusanModeRef.current = newMode;
    const qs = newMode ? flattenSets(keputusanSidangSets) : getAllQuestions();
    const prepared = decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(newMode ? '🏛️ Keputusan Sidang AKTIF!' : '📝 Standar aktif!');
  }, [applyQuestions, clearOtherModes, isModeSwitching]);

  const handleToggleUndian = useCallback(() => {
    if (isModeSwitching) return;
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
    const prepared = shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(newMode ? '🎲 Undian AKTIF!' : '📝 Standar aktif!');
  }, [applyQuestions, clearOtherModes, getAllQuestions, isModeSwitching, stop]);

  const startDuel = useCallback((size: 2 | 3 | 4 | 5 | 6) => {
    if (isModeSwitching) return;
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
    setPersonMode(false);
    personModeRef.current = false;
    setPersonTarget(null);

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
    const prepared = decoyModeRef.current ? shuffleDecoy(qs) : shuffleVariedPattern(qs);
    applyQuestions(prepared);
    toast.success(`⚔️ DUEL ${size}: ${picked.join(' vs ')} · Saldo tetap tersimpan · Taruhan Rp${DUEL_BET.toLocaleString('id-ID')}`);
  }, [applyQuestions, isModeSwitching, stop]);

  const stopDuel = useCallback(() => {
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setDuelMode(false);
    duelModeRef.current = false;
    setDuelPlayers([]);
    duelPlayersRef.current = [];
    setDuelRound(null);
    const prepared = shuffleVariedPattern(getAllQuestions());
    applyQuestions(prepared);
    toast.success('📝 Mode Standar aktif kembali! Saldo tetap tersimpan.');
  }, [applyQuestions, stop]);

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
    if (isModeSwitching) return;
    stop();
    setIsAutoPlaying(false);
    setPhase('idle');
    setLastResult(null);
    const prepared = decoyModeRef.current ? shuffleDecoy(getQuestions()) : shuffleVariedPattern(getQuestions());
    applyQuestions(prepared);
    toast.success('Diacak ulang! Saldo & skor tetap tersimpan.');
  }, [applyQuestions, getQuestions, isModeSwitching, stop]);

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
    if (personModeRef.current) {
      setPhase('playing');
      speak(`Dari ${q.role}. ${q.text}`, () => setPhase('waitAnswer'));
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
    const fullFeedback = `${resultText} Pertanyaan ini punya ${q.person}.${isCorrect ? '' : ` Jawaban yang benar adalah nomor ${correctAnswer}.`} `;
    if (isCorrect) playApplause();
    speakFeedback(fullFeedback, () => {
      if (isCorrect) setTimeout(() => advanceToNext(), 800); else setPhase('punishment');
    });
  }, [advanceToNext, duelRound, payOpponents, playApplause, speakFeedback, winDuelBet]);

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
  }, [advanceToNext, payOpponents, speakFeedback]);

  const handleReward = useCallback((t: string) => {
    setPhase('rewarding');
    speakFeedback(t, () => setTimeout(() => advanceToNext(), 1000));
  }, [advanceToNext, speakFeedback]);

  const handlePunishment = useCallback((t: string) => {
    setPhase('punishing');
    speakFeedback(t, () => setTimeout(() => advanceToNext(), 1000));
  }, [advanceToNext, speakFeedback]);

  const handleJoget = useCallback(() => {
    setPhase('punishing');
    speakFeedback('Hukumanmu joget tagin menit!', () => {});
    setJogetVideo(true);
    jogetTimerRef.current = setTimeout(() => {
      setJogetVideo(false);
      setTimeout(() => advanceToNext(), 500);
    }, 3 * 60 * 1000);
  }, [advanceToNext, speakFeedback]);

  const closeJogetVideo = useCallback(() => {
    setJogetVideo(false);
    if (jogetTimerRef.current) clearTimeout(jogetTimerRef.current);
    setTimeout(() => advanceToNext(), 500);
  }, [advanceToNext]);

  const handlePlay = useCallback(() => {
    if (isModeSwitching) return;
    if (isPaused) {
      resume();
      return;
    }
    if (['waitAnswer', 'punishment', 'reward', 'prolog', 'duelIdentify'].includes(phase)) return;
    setIsAutoPlaying(true);
    autoPlayRef.current = true;
    speakQuestion(currentIndex);
  }, [currentIndex, isModeSwitching, isPaused, phase, resume, speakQuestion]);

  const handlePause = useCallback(() => {
    if (isModeSwitching) return;
    pause();
  }, [isModeSwitching, pause]);

  const handleStop = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
    setPhase('idle');
    setLastResult(null);
    setCurrentProlog(null);
    setDuelRound(null);
  }, [isModeSwitching, stop]);

  const handleNext = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setPhase('idle');
    setCurrentProlog(null);
    setDuelRound(null);
    const next = Math.min(currentIndex + 1, shuffledQuestions.length - 1);
    setCurrentIndex(next);
    currentIndexRef.current = next;
    if (isAutoPlaying) speakQuestion(next);
  }, [currentIndex, isAutoPlaying, isModeSwitching, shuffledQuestions.length, speakQuestion, stop]);

  const handlePrev = useCallback(() => {
    if (isModeSwitching) return;
    stop();
    setPhase('idle');
    setLastResult(null);
    setDuelRound(null);
    const prev = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prev);
    currentIndexRef.current = prev;
    if (isAutoPlaying) speakQuestion(prev);
  }, [currentIndex, isAutoPlaying, isModeSwitching, speakQuestion, stop]);

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
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto" className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cove[...]
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
            {duelMode ? `⚔️ Duel ${duelPlayers.length}: ${duelPlayers.join(', ')}` : personMode ? personTarget ? `👤 Mode Person · ${personTarget}` : '👤 Mode Person' : undianMode ? '�[...]
            {decoyMode ? ' • 🎭 Pengecoh' : ' • 🔀 Acak'}
            {prologMode ? ' • 🎙️ Prolog' : ''}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button onClick={toggleOceanSound} className="glow-btn glow-btn--cyan" title="Ombek" disabled={isModeSwitching}>
            {isOceanMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0fe7f2]" />}
          </button>
          <button onClick={handleToggleProlog} className={`glow-btn ${prologMode ? 'glow-btn--active glow-btn--yellow' : 'glow-btn--yellow'}`} disabled={isModeSwitching}>
            <MessageSquareWarning className="w-4 h-4 text-[#fa0af6]" />
          </button>
          <button onClick={handleToggleDecoy} className={`glow-btn ${decoyMode ? 'glow-btn--active glow-btn--purple' : 'glow-btn--purple'}`} disabled={isModeSwitching}>
            <ShieldAlert className="w-4 h-4 text-[#ed0707]" />
          </button>
          <button onClick={handleToggleDeep} className={`glow-btn ${deepMode ? 'glow-btn--active glow-btn--emerald' : 'glow-btn--emerald'}`} disabled={isModeSwitching}>
            <BookOpen className="w-4 h-4 text-[#27e01d]" />
          </button>
          <button onClick={handleToggleSidangNyata} className={`glow-btn ${sidangNyataMode ? 'glow-btn--active glow-btn--red' : 'glow-btn--red'}`} disabled={isModeSwitching}>
            <Gavel className="w-4 h-4 text-[#fa1111]" />
          </button>
          <button onClick={handleToggleKeputusan} className={`glow-btn ${keputusanMode ? 'glow-btn--active glow-btn--orange' : 'glow-btn--orange'}`} disabled={isModeSwitching}>
            <Landmark className="w-4 h-4 text-[#0c17f0]" />
          </button>
          <button onClick={handleToggleUndian} className={`glow-btn ${undianMode ? 'glow-btn--active glow-btn--pink' : 'glow-btn--pink'}`} disabled={isModeSwitching}>
            <Dices className="w-4 h-4" />
          </button>

          <button onClick={() => {
            if (isModeSwitching) return;
            clearOtherModes();
            setPersonMode(true);
            personModeRef.current = true;
            setPersonTarget(null);
            setIsAutoPlaying(true);
            autoPlayRef.current = true;
            setPhase('idle');
            setCurrentProlog(null);
            toast.success('👤 Mode Person aktif — pilih peserta.');
          }} className={`glow-btn ${personMode ? 'glow-btn--active glow-btn--cyan' : 'glow-btn--cyan'}`} title="Mode Person" disabled={isModeSwitching}>
            <Users className="w-4 h-4" />
          </button>

+            <button
+              onClick={() => {
+                if (isModeSwitching) return;
+                clearOtherModes();
+                setUjiNyaliMode(true);
+                ujiNyaliModeRef.current = true;
+                setPersonMode(false);
+                personModeRef.current = false;
+                setDuelMode(false);
+                duelModeRef.current = false;
+                setSidangNyataMode(false);
+                sidangNyataModeRef.current = false;
+                setDeepMode(false);
+                deepModeRef.current = false;
+                setKeputusanMode(false);
+                keputusanModeRef.current = false;
+                setUndianMode(false);
+                undianModeRef.current = false;
+                setPersonTarget(null);
+                setPhase('idle');
+                setCurrentProlog(null);
+                toast.success('🧠 Uji Nyali aktif — pilih peserta di panel Uji Nyali.');
+              }}
+              className={`glow-btn ${ujiNyaliMode ? 'glow-btn--active glow-btn--indigo' : 'glow-btn--indigo'}`}
+              title="Uji Nyali"
+              disabled={isModeSwitching}
+            >
+              <Users className="w-4 h-4" />
+            </button>

          {([2, 3, 4, 5, 6] as const).map(n => (
            <button key={n} onClick={() => startDuel(n)} className={`glow-btn ${duelMode && duelPlayers.length === n ? 'glow-btn--active glow-btn--amber' : 'glow-btn--amber'}`} title={`Duel ${n[...]
              <Swords className="w-3 h-3 text-[#f5a30c]" />
              <span className="text-[10px] ml-0.5 text-amber-200">{n}</span>
            </button>
          ))}
 [TRUNCATED]
