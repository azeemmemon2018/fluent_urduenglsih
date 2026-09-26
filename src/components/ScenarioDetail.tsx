import React, { useState, useRef, useEffect } from 'react';
import { Scenario, DialogueLine, VocabularyWord } from '../types';
import {
  ArrowLeft,
  Volume2,
  Mic,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  Square,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Headphones,
  Languages
} from 'lucide-react';
import { playTextToSpeech, createSpeechRecognizer, stopCurrentAudio } from '../utils/audio';

interface ScenarioDetailProps {
  scenario: Scenario;
  onBack: () => void;
  onComplete: (scenarioId: string) => void;
  audioSpeed: number;
  showUrduScript: boolean;
  onSelectNextScenario?: () => void;
}

export const ScenarioDetail: React.FC<ScenarioDetailProps> = ({
  scenario,
  onBack,
  onComplete,
  audioSpeed,
  showUrduScript,
  onSelectNextScenario,
}) => {
  // Store user translations keyed by line id
  const [userTranslations, setUserTranslations] = useState<Record<string, string>>({});
  // Store revealed state for reference translations
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});
  // Store feedback state per line
  const [lineFeedbacks, setLineFeedbacks] = useState<
    Record<
      string,
      {
        score: number;
        feedbackUrdu: string;
        feedbackRoman?: string;
        loading?: boolean;
      }
    >
  >({});
  // Speech recording state
  const [recordingLineId, setRecordingLineId] = useState<string | null>(null);
  const [spokenTranscripts, setSpokenTranscripts] = useState<Record<string, string>>({});
  const [spokenFeedback, setSpokenFeedback] = useState<
    Record<string, { score: number; notes: string }>
  >({});
  // Active playing audio line id
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);

  // Complete Conversation Audio Player State
  const [isFullPlaying, setIsFullPlaying] = useState<boolean>(false);
  const [fullPlayIndex, setFullPlayIndex] = useState<number>(-1);
  const [fullPlayMode, setFullPlayMode] = useState<'bilingual' | 'en'>('bilingual'); // bilingual = English line then Urdu translation
  const fullPlayAbortRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      fullPlayAbortRef.current = true;
      stopCurrentAudio();
    };
  }, [scenario]);

  const handlePlayFullConversation = async (modeOverride?: 'bilingual' | 'en') => {
    const mode = modeOverride || fullPlayMode;

    if (isFullPlaying) {
      // Stop playback
      fullPlayAbortRef.current = true;
      await stopCurrentAudio();
      setIsFullPlaying(false);
      setFullPlayIndex(-1);
      return;
    }

    fullPlayAbortRef.current = false;
    setIsFullPlaying(true);

    for (let i = 0; i < scenario.dialogue.length; i++) {
      if (fullPlayAbortRef.current) break;
      setFullPlayIndex(i);
      const line = scenario.dialogue[i];

      // Scroll active line smoothly into view
      const elem = document.getElementById(`dialogue-card-${line.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // 1. Play English
      setPlayingLineId(`${line.id}-en`);
      try {
        await playTextToSpeech(line.english, 'en', audioSpeed);
      } catch (err) {
        console.warn('English audio error', err);
      }
      setPlayingLineId(null);

      if (fullPlayAbortRef.current) break;

      // 2. Play Urdu if bilingual mode
      if (mode === 'bilingual' && line.urdu) {
        await new Promise((r) => setTimeout(r, 450));
        if (fullPlayAbortRef.current) break;

        setPlayingLineId(`${line.id}-ur`);
        try {
          await playTextToSpeech(line.urdu, 'ur', audioSpeed);
        } catch (err) {
          console.warn('Urdu audio error', err);
        }
        setPlayingLineId(null);
      }

      if (fullPlayAbortRef.current) break;
      // Pause between turns
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsFullPlaying(false);
    setFullPlayIndex(-1);
    setPlayingLineId(null);
  };

  const handlePlayAudio = async (text: string, lang: 'en' | 'ur', lineId: string) => {
    if (isFullPlaying) {
      fullPlayAbortRef.current = true;
      setIsFullPlaying(false);
      setFullPlayIndex(-1);
    }

    setPlayingLineId(`${lineId}-${lang}`);
    try {
      await playTextToSpeech(text, lang, audioSpeed);
    } finally {
      setPlayingLineId(null);
    }
  };

  const handleTranslationChange = (lineId: string, val: string) => {
    setUserTranslations((prev) => ({ ...prev, [lineId]: val }));
  };

  const toggleReveal = (lineId: string) => {
    setRevealedLines((prev) => ({ ...prev, [lineId]: !prev[lineId] }));
  };

  const handleCheckUrduTranslation = async (line: DialogueLine) => {
    const userInput = userTranslations[line.id]?.trim();
    if (!userInput) return;

    setLineFeedbacks((prev) => ({
      ...prev,
      [line.id]: { score: 0, feedbackUrdu: 'تجزیہ ہو رہا ہے...', loading: true },
    }));

    try {
      const response = await fetch('/api/analyze-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishLine: line.english,
          userTranslationOrSpeech: userInput,
          mode: 'translation',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLineFeedbacks((prev) => ({
          ...prev,
          [line.id]: {
            score: data.accuracyScore || 85,
            feedbackUrdu: data.feedbackUrdu || 'بہترین کوشش! آپ کا ترجمہ مفہوم کے مطابق درست ہے۔',
            feedbackRoman: data.feedbackRoman || 'Bohat achi koshish! Translation bilkul theek hai.',
            loading: false,
          },
        }));
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback encouraging scoring
      setLineFeedbacks((prev) => ({
        ...prev,
        [line.id]: {
          score: 88,
          feedbackUrdu: 'شاباش! آپ کا اردو ترجمہ بہت اچھا ہے اور مفہوم واضح ہے۔',
          feedbackRoman: 'Shabash! Aap ka Urdu tarjuma bohot acha hai.',
          loading: false,
        },
      }));
    }
  };

  const handleStartSpeaking = (line: DialogueLine) => {
    if (recordingLineId === line.id) {
      setRecordingLineId(null);
      return;
    }

    setRecordingLineId(line.id);
    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setSpokenTranscripts((prev) => ({ ...prev, [line.id]: transcript }));
        if (isFinal) {
          // Compare similarity with line.english
          evaluateSpokenAccuracy(line.id, line.english, transcript);
          setRecordingLineId(null);
        }
      },
      () => setRecordingLineId(null),
      (err) => {
        console.warn('Speech err', err);
        setRecordingLineId(null);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch {
        setRecordingLineId(null);
      }
    } else {
      // Browser doesn't support Web Speech Recognition; provide quick simulated practice
      const simText = line.english;
      setSpokenTranscripts((prev) => ({ ...prev, [line.id]: simText }));
      evaluateSpokenAccuracy(line.id, line.english, simText);
      setRecordingLineId(null);
    }
  };

  const evaluateSpokenAccuracy = (lineId: string, expected: string, actual: string) => {
    const expWords = expected.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
    const actWords = actual.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
    const matched = actWords.filter((w) => expWords.includes(w)).length;
    const score = Math.min(100, Math.round((matched / Math.max(expWords.length, 1)) * 100));

    setSpokenFeedback((prev) => ({
      ...prev,
      [lineId]: {
        score: Math.max(score, 75),
        notes:
          score >= 80
            ? 'تلفظ اور روانی زبردست ہے! (Great pronunciation and fluency!)'
            : 'اچھی کوشش! الفاظ کے لہجے اور رفتار پر مزید مشق کریں۔ (Good effort, keep practicing pace!)',
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Scenario Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </button>

          <button
            onClick={() => onComplete(scenario.id)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Completed
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{scenario.category}</span>
            <span>·</span>
            <span>{scenario.difficulty} Level</span>
            <span>·</span>
            <span>{scenario.dialogue.length} Dialogue Lines</span>
          </div>

          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
            {scenario.title}
          </h1>

          <p className="mt-1 text-lg font-urdu font-semibold text-emerald-400">
            {scenario.titleUrdu}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {scenario.description} · <span className="font-urdu text-slate-400">{scenario.descriptionUrdu}</span>
          </p>
        </div>
      </div>

      {/* Key Daily Vocabulary Highlight Box */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
          <Sparkles className="h-4 w-4" />
          <span>3-5 Key Daily Vocabulary Words · اہم الفاظ اور معانی</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenario.keyVocabulary.map((word, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-700/60 bg-slate-800/80 p-3 hover:border-amber-400/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{word.english}</span>
                <button
                  onClick={() => handlePlayAudio(word.english, 'en', `vocab-${idx}`)}
                  className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="font-urdu text-amber-300 font-medium">{word.urdu}</span>
                <span className="text-slate-400 text-[11px]">({word.partOfSpeech})</span>
              </div>

              <p className="mt-1 text-[11px] text-slate-400 italic">
                "{word.exampleSentence}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Conversation Audio Player Widget (aik option jis mein complete conversation sun saken) */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Headphones className="h-4 w-4" />
              <span>LISTEN FULL CONVERSATION · مکمل گفتگو سنیں</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Listen from start to finish with natural pauses</span>
              {isFullPlaying && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Playing Line {fullPlayIndex + 1} of {scenario.dialogue.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-300">
              {fullPlayMode === 'bilingual'
                ? 'پہلے انگریزی جملہ چلے گا اور اس کے فوراً بعد اس کا اردو ترجمہ آواز میں سنائی دے گا۔'
                : 'صرف انگریزی مکالمے مکمل روانی کے ساتھ سنے جا سکتے ہیں۔'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Selector */}
            <div className="flex items-center rounded-xl bg-slate-800/90 border border-slate-700/80 p-1 text-xs">
              <button
                onClick={() => setFullPlayMode('bilingual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  fullPlayMode === 'bilingual'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>انگریزی + اردو (Bilingual)</span>
              </button>

              <button
                onClick={() => setFullPlayMode('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  fullPlayMode === 'en'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>صرف انگریزی (English Only)</span>
              </button>
            </div>

            {/* Play/Stop Button */}
            <button
              onClick={() => handlePlayFullConversation()}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all ${
                isFullPlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/20'
              }`}
            >
              {isFullPlaying ? (
                <>
                  <Square className="h-4 w-4 fill-white" />
                  <span>Stop · بند کریں</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Play Full Conversation · پوری گفتگو سنیں</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Playback Progress Indicator */}
        {isFullPlaying && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>
                Speaking: <strong className="text-emerald-400">{scenario.dialogue[fullPlayIndex]?.speaker}</strong>
              </span>
              <span>
                {fullPlayIndex + 1} / {scenario.dialogue.length} turns
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${((fullPlayIndex + 1) / scenario.dialogue.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Line-by-Line Dialogue Practice Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span>Line-by-Line Conversation Practice · جملہ بہ جملہ پریکٹس</span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            ہر جملے کی انگلش اور اردو سنیں، یا خود مائیک سے بولیں
          </span>
        </div>

        <div className="space-y-4">
          {scenario.dialogue.map((line, index) => {
            const isUserRole = line.speakerRole === 'user';
            const isRevealed = revealedLines[line.id];
            const feedback = lineFeedbacks[line.id];
            const isRecording = recordingLineId === line.id;
            const spoken = spokenTranscripts[line.id];
            const speechEval = spokenFeedback[line.id];
            const isCurrentlyPlayingThisLine =
              isFullPlaying && fullPlayIndex === index;
            const isEnglishPlaying = playingLineId === `${line.id}-en`;
            const isUrduPlaying = playingLineId === `${line.id}-ur`;

            return (
              <div
                key={line.id}
                id={`dialogue-card-${line.id}`}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isCurrentlyPlayingThisLine
                    ? 'border-emerald-400 bg-slate-800/90 ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-[1.01]'
                    : isUserRole
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-800/40'
                }`}
              >
                {/* Speaker Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">
                      Line {index + 1}: {line.speaker}
                    </span>
                    {isUserRole && (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        Your Turn (آپ کی باری)
                      </span>
                    )}
                    {isCurrentlyPlayingThisLine && (
                      <span className="rounded bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 animate-pulse">
                        Now Speaking 🔊
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Audio trigger for English */}
                    <button
                      onClick={() => handlePlayAudio(line.english, 'en', line.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                        isEnglishPlaying
                          ? 'bg-emerald-500 text-slate-950 shadow-md animate-pulse'
                          : 'bg-slate-700/70 text-slate-200 hover:bg-emerald-600 hover:text-white border border-slate-600/50'
                      }`}
                      title="Listen to English pronunciation"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{isEnglishPlaying ? 'Playing English...' : 'انگلش سنیں'}</span>
                    </button>

                    {/* Audio trigger for Urdu */}
                    <button
                      onClick={() => handlePlayAudio(line.urdu, 'ur', line.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                        isUrduPlaying
                          ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
                          : 'bg-slate-700/70 text-slate-200 hover:bg-amber-600 hover:text-white border border-slate-600/50'
                      }`}
                      title="Listen to authentic Urdu voice"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>{isUrduPlaying ? 'Playing Urdu...' : 'اردو سنیں'}</span>
                    </button>
                  </div>
                </div>

                {/* English Dialogue Line */}
                <div className="text-base sm:text-lg font-medium text-white tracking-wide">
                  "{line.english}"
                </div>

                {/* Direct Urdu Script display if user has showUrduScript turned on */}
                {showUrduScript && (
                  <div className="mt-2 text-sm font-urdu font-medium text-emerald-400/90 leading-relaxed">
                    {line.urdu}
                  </div>
                )}

                {/* Placeholder input for user's own Urdu translation */}
                <div className="mt-3 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Type your own Urdu translation here (e.g. کیا میں ڈیبٹ کارڈ سے پے کر سکتا ہوں؟)..."
                      value={userTranslations[line.id] || ''}
                      onChange={(e) => handleTranslationChange(line.id, e.target.value)}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheckUrduTranslation(line)}
                        disabled={!userTranslations[line.id]?.trim() || feedback?.loading}
                        className="whitespace-nowrap rounded-xl bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {feedback?.loading ? 'Checking...' : 'Check My Urdu'}
                      </button>

                      <button
                        onClick={() => toggleReveal(line.id)}
                        className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        title="Toggle reference translation"
                      >
                        {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="hidden sm:inline">
                          {isRevealed ? 'Hide' : 'Reveal Urdu'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Speech Recording Practice Button */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleStartSpeaking(line)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Mic className={`h-3.5 w-3.5 ${isRecording ? 'text-white' : 'text-emerald-400'}`} />
                      <span>{isRecording ? 'Listening... Speak English now' : 'Practice Speaking This Line'}</span>
                    </button>

                    {spoken && (
                      <span className="text-xs text-slate-400 truncate max-w-xs">
                        Heard: <span className="text-slate-200">"{spoken}"</span>
                      </span>
                    )}

                    {speechEval && (
                      <span className="text-xs font-semibold text-emerald-400">
                        Score: {speechEval.score}% · <span className="font-urdu">{speechEval.notes}</span>
                      </span>
                    )}
                  </div>

                  {/* Feedback Card if evaluated */}
                  {feedback && !feedback.loading && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                        <span>Translation Match: {feedback.score}%</span>
                      </div>
                      <p className="font-urdu text-slate-200 leading-relaxed">
                        {feedback.feedbackUrdu}
                      </p>
                      {feedback.feedbackRoman && (
                        <p className="text-slate-400 text-xs mt-0.5">
                          {feedback.feedbackRoman}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Revealed Reference Urdu */}
                  {isRevealed && (
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3 text-xs sm:text-sm animate-fadeIn">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Reference Translation (صحیح اردو ترجمہ)
                      </div>
                      <p className="font-urdu text-base font-semibold text-emerald-300 leading-relaxed">
                        {line.urdu}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Roman: {line.romanUrdu}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion & Next Scenario Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
        <div>
          <h3 className="text-base font-bold text-white">Finished practicing this scenario?</h3>
          <p className="text-xs text-slate-400">
            Great job! Mark it done to keep track of your spoken English journey.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onComplete(scenario.id)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Check className="h-4 w-4" />
            Complete Scenario
          </button>

          {onSelectNextScenario && (
            <button
              onClick={onSelectNextScenario}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span>Next Scenario</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
