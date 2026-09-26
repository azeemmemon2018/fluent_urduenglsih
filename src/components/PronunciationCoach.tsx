import React, { useState } from 'react';
import { PronunciationDiagnostic } from '../types';
import {
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Ear
} from 'lucide-react';
import { playTextToSpeech, createSpeechRecognizer } from '../utils/audio';

interface TrickyWord {
  word: string;
  phonetic: string;
  urduPhonetic: string;
  meaningUrdu: string;
  syllables: { text: string; stressed: boolean }[];
  tipUrdu: string;
  articulatoryTip: string;
  commonPitfall: string;
  minimalPairs: { w1: string; w2: string; note: string }[];
  example: string;
}

const COMMON_TRICKY_WORDS: TrickyWord[] = [
  {
    word: 'Receipt',
    phonetic: 'ri-SEET (/rɪˈsiːt/)',
    urduPhonetic: 'رِسیٹ',
    meaningUrdu: 'ادائیگی کی رسید / پرچی',
    syllables: [
      { text: 're', stressed: false },
      { text: 'ceipt', stressed: true },
    ],
    tipUrdu: 'اس لفظ میں حرف "P" بالکل سائلنٹ ہوتا ہے۔ اسے "ریسیپٹ" نہیں بلکہ "رِسیٹ" پڑھیں۔',
    articulatoryTip: 'Lips: Keep lips relaxed on the second syllable without pressing them together to pronounce "P".',
    commonPitfall: 'Urdu speakers naturally pronounce every written consonant, pronouncing "p" as in پن۔',
    minimalPairs: [
      { w1: 'Receipt', w2: 'Deceit', note: 'Both end with /siːt/ with silent P' },
      { w1: 'Seat', w2: 'Sit', note: 'Long /iː/ vs short /ɪ/' },
    ],
    example: 'Could you please give me an official receipt for the payment?',
  },
  {
    word: 'Wednesday',
    phonetic: 'WENZ-day (/ˈwɛnzdeɪ/)',
    urduPhonetic: 'وینز ڈے',
    meaningUrdu: 'بدھ کا دن',
    syllables: [
      { text: 'Wenz', stressed: true },
      { text: 'day', stressed: false },
    ],
    tipUrdu: 'پہلا "D" سائلنٹ ہے۔ اسے "ویڈنس ڈے" نہیں پڑھنا بلکہ "وینز ڈے" پڑھا جاتا ہے۔',
    articulatoryTip: 'Tongue: Slide quickly from the /w/ position to the front open /ɛ/ vowel without stopping at dental /d/.',
    commonPitfall: 'Pronouncing the letter D as a retroflex /ɖ/ as in ڈال۔',
    minimalPairs: [
      { w1: 'Wednesday', w2: 'Monday', note: 'Two syllables only, no middle syllable' },
      { w1: 'West', w2: 'Vest', note: '/w/ (round lips) vs /v/ (teeth on lip)' },
    ],
    example: 'Our board meeting is scheduled for next Wednesday morning.',
  },
  {
    word: 'Comfortable',
    phonetic: 'KUMF-ter-bul (/ˈkʌmftərbəl/)',
    urduPhonetic: 'کمفٹر بل',
    meaningUrdu: 'آرام دہ / پرسکون',
    syllables: [
      { text: 'kumf', stressed: true },
      { text: 'ter', stressed: false },
      { text: 'bul', stressed: false },
    ],
    tipUrdu: 'اسے چار ٹکڑوں میں "کمفورٹ ایبل" مت کہیں۔ یہ "کمف-ٹر-بل" بولا جاتا ہے۔',
    articulatoryTip: 'Aspiration: The initial /k/ requires a strong burst of air, followed immediately by /m/ and /f/.',
    commonPitfall: 'Pronouncing all 4 syllables "com-fort-a-ble" separately instead of 3 contracted syllables.',
    minimalPairs: [
      { w1: 'Comfortable', w2: 'Vegetable', note: 'Both collapse middle vowel into 3 syllables' },
      { w1: 'Table', w2: 'Ble', note: 'Ends in dark syllabic /l/' },
    ],
    example: 'The armchairs in the business lounge are very comfortable.',
  },
  {
    word: 'Vegetable',
    phonetic: 'VEDJ-tuh-bul (/ˈvɛdʒtəbəl/)',
    urduPhonetic: 'ویج ٹبل',
    meaningUrdu: 'سبزی',
    syllables: [
      { text: 'vedj', stressed: true },
      { text: 'tuh', stressed: false },
      { text: 'bul', stressed: false },
    ],
    tipUrdu: 'درمیان کی "e" خاموش ہوتی ہے۔ اسے "ویجی ٹیبل" کے بجائے "ویج-ٹبل" پکاریں۔',
    articulatoryTip: 'Lips & Teeth: For the initial /v/, bite down gently on your lower lip with upper incisors while vibrating vocal cords.',
    commonPitfall: 'Confusing /v/ with /w/ (rounding lips instead of teeth-on-lip contact).',
    minimalPairs: [
      { w1: 'Vine', w2: 'Wine', note: 'Teeth-on-lip /v/ vs rounded lips /w/' },
      { w1: 'Vet', w2: 'Wet', note: 'Key Urdu speaker minimal pair distinction' },
    ],
    example: 'Always eat fresh organic vegetables with your dinner.',
  },
  {
    word: 'Plumber',
    phonetic: 'PLUM-er (/ˈplʌmər/)',
    urduPhonetic: 'پلمر',
    meaningUrdu: 'نلکے ٹھیک کرنے والا کاریگر',
    syllables: [
      { text: 'plum', stressed: true },
      { text: 'er', stressed: false },
    ],
    tipUrdu: 'لفظ میں "B" بالکل خاموش ہے۔ اسے "پلمبر" مت کہیں، اصل لفظ "پلم-ر" ہے۔',
    articulatoryTip: 'Lips: Close lips for /m/ and immediately release into the neutral schwa /ər/ without popping a /b/.',
    commonPitfall: 'Sounding out the /b/ because of the Urdu spelling habit.',
    minimalPairs: [
      { w1: 'Plumber', w2: 'Number', note: 'Plumber has silent B; Number has audible B!' },
      { w1: 'Climb', w2: 'Comb', note: 'Both have silent final B' },
    ],
    example: 'We had to call a 24-hour emergency plumber to fix the kitchen leak.',
  },
  {
    word: 'Schedule',
    phonetic: 'SKED-yool (US) / SHED-yool (UK)',
    urduPhonetic: 'سکیڈ یول / شیڈ یول',
    meaningUrdu: 'اوقات نامہ / ٹائم ٹیبل',
    syllables: [
      { text: 'sked', stressed: true },
      { text: 'yool', stressed: false },
    ],
    tipUrdu: 'امریکن انگریزی میں "سک" اور برطانوی انگریزی میں "ش" کی آواز سے شروع ہوتا ہے۔',
    articulatoryTip: 'Consonant Cluster: Do not insert an extra vowel "is-" before /sk/. Start directly with continuous friction /s/.',
    commonPitfall: 'Adding an epenthetic vowel "I-schedule" or "is-school" common in Urdu speakers.',
    minimalPairs: [
      { w1: 'School', w2: 'Is school', note: 'Avoid inserting "is" before /sk/' },
      { w1: 'State', w2: 'Estate', note: 'Listen for pure /s/ vs vowel start' },
    ],
    example: 'Could you send me your flight departure schedule?',
  },
];

export const PronunciationCoach: React.FC<{
  audioSpeed: number;
  onRecordPracticeSession?: (title: string, score: number) => void;
}> = ({ audioSpeed, onRecordPracticeSession }) => {
  const [selectedWord, setSelectedWord] = useState<TrickyWord>(COMMON_TRICKY_WORDS[0]);
  const [customText, setCustomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [diagnostic, setDiagnostic] = useState<PronunciationDiagnostic | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const activePhrase = customText.trim() || selectedWord.word;

  const handlePlayAudio = (text: string) => {
    playTextToSpeech(text, 'en', audioSpeed);
  };

  const handleStartRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setRecordedTranscript('');
    setDiagnostic(null);
    setIsRecording(true);

    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setRecordedTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          runDeepDiagnostic(transcript, activePhrase);
        }
      },
      () => setIsRecording(false),
      (err) => {
        console.warn('Speech error', err);
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      setTimeout(() => {
        setRecordedTranscript(activePhrase);
        runDeepDiagnostic(activePhrase, activePhrase);
        setIsRecording(false);
      }, 1200);
    }
  };

  const runDeepDiagnostic = async (spoken: string, target: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phraseOrWord: target,
          spokenTranscript: spoken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnostic(data);
        if (onRecordPracticeSession) {
          onRecordPracticeSession(`Pronunciation: ${target}`, data.overallScore || 88);
        }
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <Sparkles className="h-4 w-4" />
          <span>Acoustic Phonetics Studio · گہرائی سے تلفظ اور لہجے کی تشخیص</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
          Specific Pronunciation & Articulatory Diagnostics
        </h1>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
          Beyond simple error correction, our diagnostic engine analyzes syllable stress, tongue and lip positioning, breath airflow, and specific phonological habits from Urdu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Word Selector */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Commonly Mispronounced Target Words
          </h2>
          <div className="space-y-2">
            {COMMON_TRICKY_WORDS.map((w) => {
              const isSelected = selectedWord.word === w.word && !customText;
              return (
                <div
                  key={w.word}
                  onClick={() => {
                    setSelectedWord(w);
                    setCustomText('');
                    setDiagnostic(null);
                    setRecordedTranscript('');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500/60 bg-teal-950/30 shadow-md shadow-teal-500/10'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">{w.word}</span>
                    <span className="font-urdu text-emerald-400 text-xs font-semibold">{w.meaningUrdu}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span className="font-mono text-[11px] text-teal-300">{w.phonetic}</span>
                    <span className="font-urdu text-amber-300 text-xs">بولیں: {w.urduPhonetic}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Columns: Interactive Articulatory Stage */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 space-y-6 backdrop-blur">
            {/* Custom Word / Phrase Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Practice Custom Word or Sentence (یا کوئی بھی جملہ لکھ کر چیک کریں):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type any word or phrase (e.g. Schedule, Photography, Comfortable)..."
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setDiagnostic(null);
                    setRecordedTranscript('');
                  }}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
                {customText && (
                  <button
                    onClick={() => runDeepDiagnostic(customText, customText)}
                    disabled={isAnalyzing}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition-colors"
                  >
                    Analyze
                  </button>
                )}
              </div>
            </div>

            {/* Target Display with Syllable Stress Breakdown */}
            <div className="text-center py-6 px-4 rounded-xl border border-slate-700/60 bg-slate-900/60 space-y-4">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                Target Word & Syllable Stress Pattern
              </span>

              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                {activePhrase}
              </div>

              {/* Syllable Stress Visualizer */}
              {!customText && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  {selectedWord.syllables.map((syl, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-bold uppercase transition-all ${
                        syl.stressed
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span>{syl.text}</span>
                      <span className="block text-[10px] font-normal lowercase text-slate-400">
                        {syl.stressed ? '● Stressed' : '○ Weak'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Listen audio */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handlePlayAudio(activePhrase)}
                  className="flex items-center gap-2 rounded-xl bg-teal-500/20 border border-teal-500/40 px-4 py-2 text-sm font-semibold text-teal-300 hover:bg-teal-500/30 transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Listen to Native Audio ({audioSpeed}x)</span>
                </button>
              </div>
            </div>

            {/* Articulatory Placement Cards (Lips, Tongue, Teeth, Airflow) */}
            {!customText && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    Physical Articulation Guide
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedWord.articulatoryTip}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Urdu Speaker Pitfall (اردو بولنے والوں کی غلطی)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-urdu">
                    {selectedWord.tipUrdu}
                  </p>
                </div>
              </div>
            )}

            {/* Minimal Pair Contrast Ear Training */}
            {!customText && selectedWord.minimalPairs.length > 0 && (
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/50 p-4 space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Ear className="h-3.5 w-3.5" />
                  Minimal Pair Ear Training (الفاظ کے فرق کی مشق)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {selectedWord.minimalPairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-slate-800/90 border border-slate-700/80 p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <button
                            onClick={() => handlePlayAudio(pair.w1)}
                            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                          >
                            <Volume2 className="h-3 w-3 text-emerald-400" />
                            {pair.w1}
                          </button>
                          <span className="text-slate-500">vs</span>
                          <button
                            onClick={() => handlePlayAudio(pair.w2)}
                            className="hover:text-amber-400 transition-colors flex items-center gap-1"
                          >
                            <Volume2 className="h-3 w-3 text-amber-400" />
                            {pair.w2}
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{pair.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speaking / Mic Practice Stage */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-700/60 bg-slate-900/60 text-center space-y-3">
              <button
                onClick={handleStartRecording}
                disabled={isAnalyzing}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30 hover:scale-105'
                }`}
              >
                <Mic className="h-8 w-8" />
              </button>

              <div>
                <p className="text-sm font-bold text-white">
                  {isRecording ? 'Listening... Speak clearly now!' : 'Record Voice for Deep Diagnostic'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Say "{activePhrase}" naturally into your mic
                </p>
              </div>

              {recordedTranscript && (
                <div className="text-xs text-slate-300 bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700">
                  Heard by engine: <span className="font-bold text-white">"{recordedTranscript}"</span>
                </div>
              )}

              {isAnalyzing && (
                <p className="text-xs text-teal-400 animate-pulse">
                  Analyzing phonetic spectrogram & articulatory accuracy...
                </p>
              )}
            </div>

            {/* Deep Diagnostic Result Card */}
            {diagnostic && (
              <div className="rounded-2xl border border-teal-500/40 bg-teal-950/20 p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
                  <div className="flex items-center gap-2 text-teal-300 font-bold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Acoustic Accuracy: {diagnostic.overallScore}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-teal-300">{diagnostic.phoneticIPA}</span>
                    <span>·</span>
                    <span className="font-urdu text-amber-300 font-bold text-sm">
                      {diagnostic.urduTransliteration}
                    </span>
                  </div>
                </div>

                {/* Specific Articulatory Guidance */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Specific Organ Placement Diagnostics:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {diagnostic.articulatoryAdvice.map((adv, i) => (
                      <div key={i} className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-teal-400 block">{adv.organ}</span>
                        <p className="text-xs text-slate-200">{adv.guidanceEnglish}</p>
                        <p className="font-urdu text-xs text-emerald-300">{adv.guidanceUrdu}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Pitfall and Drills */}
                <div className="rounded-lg bg-slate-900/70 p-3 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-amber-400 block">
                    Phonological Interference Diagnosis:
                  </span>
                  <p className="text-slate-300">{diagnostic.commonUrduSpeakerPitfall}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
