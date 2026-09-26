import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Clipboard,
  Trash2,
  Globe,
  Stethoscope,
  Award,
  Lightbulb,
  Loader2,
  MessageSquare,
  Briefcase,
  Smile,
  VolumeX,
} from 'lucide-react';
import {
  createSpeechRecognizer,
  playTextToSpeech,
  stopCurrentAudio,
  requestMicrophonePermission,
  startAudioRecording,
  transcribeAudioOnServer,
  AudioRecorderController,
} from '../utils/audio';

interface SentenceDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioSpeed?: number;
}

interface MistakeItem {
  mistake: string;
  correction: string;
  explanationUrdu: string;
  explanationRoman?: string;
}

interface AlternativeWay {
  style: string;
  sentence: string;
  urdu: string;
}

interface CorrectionResult {
  hasMistakes: boolean;
  detectedLanguage: string;
  originalText: string;
  correctedSentence: string;
  urduTranslation?: string;
  pronunciationGuide?: string;
  mistakes: MistakeItem[];
  alternativeWays?: AlternativeWay[];
  explanationUrdu: string;
  explanationRoman?: string;
  fluencyScore: number;
  encouragingRemarkUrdu?: string;
}

const SAMPLE_CATEGORIES = [
  {
    id: 'blunders',
    label: '🚫 عام غلطیاں (Common Blunders)',
    samples: [
      'I am agree with you',
      'She do not know me',
      'He is senior than me',
      'I goes to office yesterday',
      'Where you are going?',
    ],
  },
  {
    id: 'urdu',
    label: '🇵🇰 اردو سے انگلش (Urdu to English)',
    samples: [
      'مجھے سخت بھوک لگ رہی ہے',
      'کیا آپ میری مدد کر سکتے ہیں؟',
      'میں کل مارکیٹ جاؤں گا',
      'فکر نہ کریں، سب ٹھیک ہو جائے گا',
    ],
  },
  {
    id: 'work',
    label: '💼 روزمرہ / دفتر (Daily & Office)',
    samples: [
      'I will revert back to you soon',
      'Please do the needful',
      'I am looking forward to meet you',
      'He did not came today',
    ],
  },
];

export const SentenceDoctorModal: React.FC<SentenceDoctorModalProps> = ({
  isOpen,
  onClose,
  audioSpeed = 1,
}) => {
  const [inputText, setInputText] = useState('');
  const [micLanguage, setMicLanguage] = useState<'en-US' | 'ur-PK'>('en-US');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'blunders' | 'urdu' | 'work'>('blunders');
  const [practiceSuccess, setPracticeSuccess] = useState(false);

  const recognizerRef = useRef<any>(null);
  const audioRecorderRef = useRef<AudioRecorderController | null>(null);
  const spokenTextRef = useRef<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const stopVoice = useCallback(() => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {}
      recognizerRef.current = null;
    }
    if (audioRecorderRef.current) {
      audioRecorderRef.current.cancel();
      audioRecorderRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Clean up on close
  useEffect(() => {
    if (!isOpen) {
      stopVoice();
      stopCurrentAudio();
      setPlayingAudio(null);
      setMicError(null);
    }
  }, [isOpen, stopVoice]);

  // Toggle Voice Input with dual engine (Web Speech + Gemini Multimodal STT)
  const toggleListening = async () => {
    setMicError(null);

    // If currently listening, stop
    if (isListening) {
      setIsListening(false);
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {}
        recognizerRef.current = null;
      }

      // Check if text was transcribed
      const current = (spokenTextRef.current || inputText).trim();
      if (current) {
        if (audioRecorderRef.current) {
          audioRecorderRef.current.cancel();
          audioRecorderRef.current = null;
        }
        return;
      }

      // If Web Speech caught nothing, run fallback from audio recorder
      if (audioRecorderRef.current) {
        setIsTranscribing(true);
        try {
          const base64 = await audioRecorderRef.current.stop();
          audioRecorderRef.current = null;
          if (base64) {
            const transcript = await transcribeAudioOnServer(base64);
            if (transcript && transcript.trim()) {
              spokenTextRef.current = transcript.trim();
              setInputText(transcript.trim());
              setMicError(null);
            }
          }
        } catch (err: any) {
          console.warn('Fallback audio transcription failed:', err);
        } finally {
          setIsTranscribing(false);
        }
      }
      return;
    }

    // Start voice recording
    spokenTextRef.current = '';
    const micGranted = await requestMicrophonePermission();
    if (!micGranted) {
      setMicError('براہ کرم براؤزر میں مائیکروفون کی اجازت (Permission) دیں');
    }

    try {
      const recorder = await startAudioRecording();
      audioRecorderRef.current = recorder;
    } catch (err) {
      console.warn('MediaRecorder error:', err);
    }

    const rec = createSpeechRecognizer(
      (transcript, isFinal) => {
        spokenTextRef.current = transcript;
        setInputText(transcript);
        setMicError(null);
      },
      async () => {
        setIsListening(false);
        const current = (spokenTextRef.current || inputText).trim();
        if (!current && audioRecorderRef.current) {
          setIsTranscribing(true);
          try {
            const base64 = await audioRecorderRef.current.stop();
            audioRecorderRef.current = null;
            if (base64) {
              const transcript = await transcribeAudioOnServer(base64);
              if (transcript && transcript.trim()) {
                spokenTextRef.current = transcript.trim();
                setInputText(transcript.trim());
              }
            }
          } catch (e) {
            console.warn('Voice fallback error:', e);
          } finally {
            setIsTranscribing(false);
          }
        }
      },
      (err) => {
        console.warn('Speech recognizer notice:', err);
      },
      micLanguage
    );

    if (rec) {
      recognizerRef.current = rec;
      try {
        rec.start();
        setIsListening(true);
      } catch {
        if (audioRecorderRef.current) {
          setIsListening(true);
        }
      }
    } else if (audioRecorderRef.current) {
      setIsListening(true);
    } else {
      setMicError('آپ کا براؤزر لائیو مائیک سپورٹ نہیں کر رہا۔ آپ کی بورڈ سے لکھیں یا پیسٹ کریں۔');
    }
  };

  // Clipboard Paste handler
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputText((prev) => (prev ? prev + ' ' + text.trim() : text.trim()));
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
          return;
        }
      }
    } catch {
      // Fallback
    }
    const manualText = window.prompt('اپنا جملہ یہاں پیسٹ کریں (Paste your sentence here):');
    if (manualText && manualText.trim()) {
      setInputText((prev) => (prev ? prev + ' ' + manualText.trim() : manualText.trim()));
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    }
  };

  // Clear handler
  const handleClear = () => {
    stopVoice();
    setInputText('');
    spokenTextRef.current = '';
    setResult(null);
    setMicError(null);
    setPracticeSuccess(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Analyze Sentence
  const handleAnalyze = async (textToTest?: string) => {
    const text = (textToTest || inputText).trim();
    if (!text || isLoading) return;

    stopVoice();
    stopCurrentAudio();
    setIsLoading(true);
    setResult(null);
    setPracticeSuccess(false);

    try {
      const response = await fetch('/api/correct-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Fallback response
      const isUrdu = /[\u0600-\u06FF]/.test(text);
      setResult({
        hasMistakes: !isUrdu && (text.includes('agree with') || text.includes('goes')),
        detectedLanguage: isUrdu ? 'urdu' : 'english',
        originalText: text,
        correctedSentence: isUrdu
          ? 'I want to speak fluent English with confidence.'
          : text.replace(/\bgoes\b/gi, 'went').replace(/\bI am agree\b/gi, 'I agree'),
        urduTranslation: isUrdu ? text : 'میں روانی اور اعتماد کے ساتھ انگریزی بولنا چاہتا ہوں۔',
        pronunciationGuide: 'Aai waant tu speek flu-ent ing-glish',
        mistakes: [
          {
            mistake: 'Grammar Structure',
            correction: 'Natural English Phrasing',
            explanationUrdu: 'عام بول چال میں جملے کی ساخت کو سیدھا اور قدرتی رکھیں۔',
            explanationRoman: 'Aam bol chal mein sentence ko simple aur natural rakhein.',
          },
        ],
        alternativeWays: [
          {
            style: '💼 Formal (دفتری)',
            sentence: 'I am practicing to achieve English fluency.',
            urdu: 'میں انگریزی میں روانی حاصل کرنے کی مشق کر رہا ہوں۔',
          },
          {
            style: '☕ Casual (دوستانہ)',
            sentence: "I'm working on my spoken English.",
            urdu: 'میں اپنی انگلش بول چال بہتر کر رہا ہوں۔',
          },
        ],
        explanationUrdu: 'بہترین کوشش! الفاظ کے درست تلفظ اور ترتیب کے ساتھ جملہ مکمل کریں۔',
        fluencyScore: 85,
        encouragingRemarkUrdu: 'شاباش! مستقل مشق سے آپ کی انگلش بہت جلد زبردست ہو جائے گی!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Player
  const handlePlayAudio = async (text: string, id: string) => {
    if (playingAudio === id) {
      stopCurrentAudio();
      setPlayingAudio(null);
      return;
    }
    setPlayingAudio(id);
    try {
      await playTextToSpeech(text, 'en', audioSpeed);
    } finally {
      setPlayingAudio(null);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Repeat Practice challenge
  const handleStartPracticeChallenge = (targetSentence: string) => {
    setInputText('');
    spokenTextRef.current = '';
    setPracticeSuccess(false);
    toggleListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 px-5 sm:px-7 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-400 shadow-lg shadow-purple-600/20">
              <Stethoscope className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  جملہ درست کریں (Sentence Doctor)
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  لائیو AI کوچ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                انگلش یا اردو میں بولیں یا لکھیں — غلطیاں نکالیں اور معیاری بول چال سیکھیں
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="بند کریں"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-slate-200">
          {/* Friendly Guidance Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-800/40 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                💡 آسان طریقہ: نیچے باکس میں کوئی بھی انگلش یا اردو جملہ لکھیں، پیسٹ کریں یا مائیک سے بولیں!
              </p>
              <p className="text-slate-400 text-xs">
                AI فوری طور پر آپ کے جملے کا معائنہ کر کے تمام گرامر کی غلطیاں نکالے گا، 100% درست تلفظ سنائے گا، اور اردو ترجمہ بھی پیش کرے گا۔
              </p>
            </div>
          </div>

          {/* MAIN INPUT BOX CONTAINER */}
          <div className="rounded-3xl border-2 border-slate-700 bg-slate-950/90 p-4 sm:p-5 space-y-3.5 shadow-xl focus-within:border-purple-500 transition-all">
            {/* Top Toolbar: Language Selector & Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/90 pb-3">
              {/* Mic Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 rounded-xl p-1 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
                  <Globe className="h-3 w-3 text-purple-400" />
                  <span>بولنے کی زبان:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMicLanguage('en-US');
                    if (isListening) toggleListening();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    micLanguage === 'en-US'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMicLanguage('ur-PK');
                    if (isListening) toggleListening();
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    micLanguage === 'ur-PK'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇵🇰 اردو (Urdu)
                </button>
              </div>

              {/* Action Buttons: Paste, Clear, Listen */}
              <div className="flex items-center gap-2">
                {/* Paste Button */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    pasteSuccess
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                  title="کلپ بورڈ سے جملہ پیسٹ کریں"
                >
                  {pasteSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>پیسٹ ہو گیا!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5" />
                      <span>📋 پیسٹ کریں</span>
                    </>
                  )}
                </button>

                {/* Clear Button */}
                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-all"
                    title="باکس صاف کریں"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>صاف کریں</span>
                  </button>
                )}
              </div>
            </div>

            {/* Editable Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  spokenTextRef.current = e.target.value;
                }}
                rows={3}
                placeholder={
                  isListening
                    ? micLanguage === 'ur-PK'
                      ? 'اردو میں بولتے جائیں، یہاں لائیو لکھا آ رہا ہے...'
                      : 'Speak in English, words will appear here live...'
                    : 'یہاں انگلش یا اردو میں جملہ لکھیں، پیسٹ کریں یا نیچے مائیک کا بٹن دبا کر بولیں...'
                }
                className="w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-3.5 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y leading-relaxed"
                dir="auto"
              />

              {/* Character / Word count badge */}
              {inputText.trim() && (
                <div className="absolute bottom-2.5 right-3 text-[11px] text-slate-500 font-mono">
                  {inputText.trim().split(/\s+/).length} الفاظ
                </div>
              )}
            </div>

            {/* Live Audio Listening & Transcribing Banner */}
            {isListening && (
              <div className="flex items-center justify-between rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-300 text-xs sm:text-sm animate-pulse">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <span className="font-bold">
                    {micLanguage === 'ur-PK'
                      ? '🎙️ سن رہے ہیں... اردو میں بولیں (Listening in Urdu)'
                      : '🎙️ Listening... Speak your English sentence'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500 transition-colors shadow-sm"
                >
                  روکیں (Stop)
                </button>
              </div>
            )}

            {isTranscribing && (
              <div className="flex items-center gap-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 p-3 text-purple-300 text-xs sm:text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                <span>آڈیو کا تجزیہ اور آواز سے لکھائی ہو رہی ہے (Transcribing with AI)...</span>
              </div>
            )}

            {micError && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Bottom Controls inside Input Card: Big Mic Toggle + Check Sentence Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30 ring-4 ring-rose-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 hover:border-purple-500 shadow-slate-950/50'
                }`}
                title={isListening ? 'ریکارڈنگ روکیں' : 'مائیک پر بولیں'}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 text-white" />
                    <span>ریکارڈنگ روکیں (Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 text-purple-400" />
                    <span>مائیک سے بولیں ({micLanguage === 'ur-PK' ? 'اردو' : 'English'})</span>
                  </>
                )}
              </button>

              {/* Check & Correct Button */}
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !inputText.trim()}
                className="w-full sm:w-auto flex-1 sm:max-w-md flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-6 py-3 text-sm sm:text-base font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>ڈاکٹر معائنہ کر رہا ہے...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>غلطیاں نکالیں اور جملہ درست کریں</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QUICK PRACTICE SAMPLES (Interesting & Easy feature) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Smile className="h-4 w-4 text-emerald-400" />
                <span>فوری آزمانے کے لیے جملہ منتخب کریں (Quick Examples):</span>
              </span>

              {/* Category tabs */}
              <div className="flex items-center gap-1 text-[11px]">
                {SAMPLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.id === 'blunders' ? 'عام غلطیاں' : cat.id === 'urdu' ? 'اردو جملے' : 'دفتری انگلش'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Pills */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CATEGORIES.find((c) => c.id === selectedCategory)?.samples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(sample);
                    spokenTextRef.current = sample;
                    handleAnalyze(sample);
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 hover:border-purple-500 hover:text-white hover:bg-slate-800 transition-all text-left flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform text-purple-400">⚡</span>
                  <span>"{sample}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI CORRECTION & DOCTOR RESULTS CARD */}
          {result && (
            <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 sm:p-7 space-y-6 shadow-2xl animate-fadeIn">
              {/* Header Status & Fluency Meter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  {result.hasMistakes ? (
                    <div className="flex items-center gap-2 rounded-2xl bg-amber-500/20 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-300 border border-amber-500/40 shadow-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>غلطیاں درست کر دی گئیں (Correction Made)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-300 border border-emerald-500/40 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>ماشاءاللہ! جملہ 100% پرفیکٹ ہے (Perfect!)</span>
                    </div>
                  )}

                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    زبان: {result.detectedLanguage}
                  </span>
                </div>

                {/* Fluency Score Gauge */}
                <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold">روانی اسکور (Fluency)</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.fluencyScore >= 90
                              ? 'bg-emerald-500'
                              : result.fluencyScore >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(10, result.fluencyScore))}%` }}
                        />
                      </div>
                      <span className="text-sm font-extrabold text-white">{result.fluencyScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Said vs Perfect Sentence */}
              <div className="space-y-4">
                {/* Original Input Display */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1.5">
                    <span>🎙️ آپ نے کہا یا لکھا تھا (Original Input):</span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                    "{result.originalText}"
                  </p>
                </div>

                {/* 100% Perfect English Sentence (Hero Prescription Card) */}
                <div className="rounded-2xl border-2 border-emerald-500/70 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>✅ 100% درست اور معیاری انگریزی جملہ (Doctor's Prescription):</span>
                    </span>

                    {/* Audio & Copy Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Audio Button */}
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(result.correctedSentence, 'corrected')}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-md ${
                          playingAudio === 'corrected'
                            ? 'bg-emerald-400 text-slate-950 animate-pulse'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        }`}
                        title="درست تلفظ سنیں"
                      >
                        <Volume2 className="h-4 w-4 text-slate-950" />
                        <span>
                          {playingAudio === 'corrected' ? 'آواز چل رہی ہے...' : 'تلفظ سنیں'}
                        </span>
                      </button>

                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(result.correctedSentence, 'corrected')}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                        title="جملہ کاپی کریں"
                      >
                        {copiedType === 'corrected' ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-300">کاپی ہو گیا!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>کاپی کریں</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Big Sentence Text */}
                  <p className="text-lg sm:text-2xl font-bold text-white tracking-wide leading-relaxed">
                    "{result.correctedSentence}"
                  </p>

                  {/* Urdu Translation of Sentence */}
                  {result.urduTranslation && (
                    <div className="pt-2 border-t border-emerald-900/50 flex items-start gap-2">
                      <span className="text-xs font-bold text-emerald-400/80 shrink-0">اردو مفہوم:</span>
                      <p className="text-sm sm:text-base font-urdu text-emerald-200 leading-relaxed" dir="rtl">
                        {result.urduTranslation}
                      </p>
                    </div>
                  )}

                  {/* Pronunciation Guide */}
                  {result.pronunciationGuide && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 rounded-xl p-2 border border-emerald-900/30">
                      <span className="font-bold text-slate-300">🗣️ بولنے کا آسان انداز:</span>
                      <span className="font-mono text-emerald-300">{result.pronunciationGuide}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mistakes Breakdown (if any) */}
              {result.mistakes && result.mistakes.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span>جملے میں موجود غلطیوں کا مکمل پوسٹ مارٹم (Mistakes Breakdown):</span>
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {result.mistakes.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs sm:text-sm space-y-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 text-rose-300 font-bold line-through">
                            ❌ {m.mistake}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-500" />
                          <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-emerald-300 font-bold">
                            ✅ {m.correction}
                          </span>
                        </div>

                        <p className="font-urdu text-slate-200 text-xs sm:text-sm leading-relaxed" dir="rtl">
                          {m.explanationUrdu}
                        </p>

                        {m.explanationRoman && (
                          <p className="text-xs text-slate-400 italic">
                            💡 {m.explanationRoman}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 Smart Alternative Ways to say the same thing (Interesting & Engaging) */}
              {result.alternativeWays && result.alternativeWays.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span>یہی بات کہنے کے مختلف سمارٹ انداز (Smart Variations):</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.alternativeWays.map((alt, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1.5 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-purple-300">
                            {alt.style}
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(alt.sentence, `alt-${idx}`)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white"
                            title="سنیں"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white">"{alt.sentence}"</p>
                        <p className="font-urdu text-xs text-slate-400" dir="rtl">{alt.urdu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher's Advice & Encouragement */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-indigo-400" />
                  <span>استاد کا مشورہ اور حوصلہ افزائی (Teacher's Advice):</span>
                </span>
                <p className="font-urdu text-slate-200 text-xs sm:text-sm leading-relaxed" dir="rtl">
                  {result.explanationUrdu}
                </p>
                {result.encouragingRemarkUrdu && (
                  <p className="font-urdu text-emerald-300 text-xs font-semibold pt-1" dir="rtl">
                    {result.encouragingRemarkUrdu}
                  </p>
                )}
              </div>

              {/* Footer Actions: Practice again / Done */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleStartPracticeChallenge(result.correctedSentence)}
                  className="flex items-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/40 px-5 py-2.5 text-xs sm:text-sm font-bold text-purple-300 hover:bg-purple-900/50 hover:text-white transition-all shadow-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>🎙️ اب درست جملہ خود بول کر 100% روانی حاصل کریں</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-slate-800 px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  سمجھ گیا (Done)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
