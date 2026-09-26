import React, { useState, useEffect, useRef } from 'react';
import { SupportChatMessage, SentenceCorrection } from '../types';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  X,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Mic,
  MicOff,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Globe,
  Loader2,
} from 'lucide-react';
import {
  playTextToSpeech,
  stopCurrentAudio,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  requestMicrophonePermission,
  startAudioRecording,
  transcribeAudioOnServer,
  AudioRecorderController,
} from '../utils/audio';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  audioSpeed: number;
  userProgressSummary: string;
}

export const SupportChat: React.FC<SupportChatProps> = ({
  isOpen,
  onClose,
  audioSpeed,
  userProgressSummary,
}) => {
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Assalam-o-Alaikum! I am Ustad AI & Grammar Doctor (استاد اے آئی اور گرامر ڈاکٹر). You can ask me any English grammar questions (e.g. 'What is the difference between since and for?') or click the microphone to speak a sentence — I will show your spoken words live on screen, identify any grammar mistakes, and provide the correct sentence with Urdu explanations.",
      urduText:
        "السلام علیکم! میں استاد اے آئی اور گرامر ڈاکٹر ہوں۔ آپ مجھ سے گرامر کا کوئی بھی سوال پوچھ سکتے ہیں یا نیچے مائیکروفون پر کلک کر کے کوئی بھی انگلش جملہ بولیں — آپ کے بولے ہوئے الفاظ اسکرین پر لائیو نظر آئیں گے اور اگر کوئی غلطی ہوئی تو میں اس کی تصحیح اور اردو میں مکمل وضاحت کروں گا۔",
      romanUrduText:
        "Aap grammar ka koi bhi sawal pooch saktay hain ya mike par click kar ke bolain, hum mistakes nikal kar theek karenge.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [liveSpokenText, setLiveSpokenText] = useState('');
  const [micLang, setMicLang] = useState<'en-US' | 'ur-PK'>('en-US');
  const [micError, setMicError] = useState<string | null>(null);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRecorderRef = useRef<AudioRecorderController | null>(null);
  const spokenTextRef = useRef<string>('');

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What is the difference between "since" and "for"?',
    'Correct this sentence: "I goes to market yesterday"',
    'Explain Present Perfect vs Past Simple tenses',
    'When should I use "in", "on", and "at" for time?',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (isListening && speechRecognizer) {
        speechRecognizer.stop();
      }
      setIsListening(false);
      setLiveSpokenText('');
      stopCurrentAudio();
    }
  }, [messages, isOpen, isListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (speechRecognizer) {
        try {
          speechRecognizer.stop();
        } catch {}
      }
      stopCurrentAudio();
    };
  }, [speechRecognizer]);

  // Toggle Voice Recognition with Gemini Audio fallback
  const toggleListening = async () => {
    setMicError(null);

    if (isListening) {
      setIsListening(false);
      if (speechRecognizer) {
        try {
          speechRecognizer.stop();
        } catch {}
      }

      const currentSpoken = (spokenTextRef.current || liveSpokenText || inputVal).trim();

      // If Web Speech already wrote into the box, we are done
      if (currentSpoken) {
        if (audioRecorderRef.current) {
          audioRecorderRef.current.cancel();
          audioRecorderRef.current = null;
        }
        return;
      }

      // If Web Speech was silent or failed, use Gemini audio recording fallback
      if (audioRecorderRef.current) {
        setIsTranscribing(true);
        try {
          const base64Audio = await audioRecorderRef.current.stop();
          audioRecorderRef.current = null;
          if (base64Audio) {
            const transcript = await transcribeAudioOnServer(base64Audio);
            if (transcript) {
              spokenTextRef.current = transcript;
              setInputVal(transcript);
              setLiveSpokenText(transcript);
            } else {
              setMicError('آواز ریکارڈ نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔');
            }
          }
        } catch (err: any) {
          console.warn('Fallback transcription failed:', err);
          setMicError('آواز ریکگنیشن میں مسئلہ پیش آیا۔');
        } finally {
          setIsTranscribing(false);
        }
      }
      return;
    }

    spokenTextRef.current = '';
    setLiveSpokenText('');

    // Step 1: Prompt browser microphone permission explicitly
    await requestMicrophonePermission();

    // Step 2: Start background MediaRecorder as guaranteed fallback
    try {
      const recorder = await startAudioRecording();
      audioRecorderRef.current = recorder;
    } catch (e) {
      console.warn('MediaRecorder error:', e);
    }

    // Step 3: Start browser speech recognition
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        spokenTextRef.current = transcript;
        setLiveSpokenText(transcript);
        setInputVal(transcript);
      },
      async () => {
        setIsListening(false);
        const currentSpoken = (spokenTextRef.current || liveSpokenText || inputVal).trim();
        if (!currentSpoken && audioRecorderRef.current) {
          setIsTranscribing(true);
          try {
            const base64Audio = await audioRecorderRef.current.stop();
            audioRecorderRef.current = null;
            if (base64Audio) {
              const transcript = await transcribeAudioOnServer(base64Audio);
              if (transcript) {
                spokenTextRef.current = transcript;
                setInputVal(transcript);
                setLiveSpokenText(transcript);
              }
            }
          } catch (e) {
            console.warn('Speech onend fallback failed:', e);
          } finally {
            setIsTranscribing(false);
          }
        }
      },
      (err) => {
        console.warn('Speech Recognition warning:', err);
      },
      micLang
    );

    if (recognizer) {
      setSpeechRecognizer(recognizer);
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err: any) {
        console.warn('Failed to start recognizer:', err);
        if (audioRecorderRef.current) {
          setIsListening(true);
        } else {
          setMicError('مائیکروفون شروع نہیں ہو سکا۔ براؤزر کے اوپر مائیک Allow کریں۔');
        }
      }
    } else if (audioRecorderRef.current) {
      setIsListening(true);
    } else {
      setMicError('مائیکروفون دستیاب نہیں ہے۔ نیچے دیے گئے آزمائشی جملوں سے ٹیسٹ کریں۔');
    }
  };

  const handleSendMessage = async (textToSend?: string, wasVoice: boolean = false) => {
    const text = (textToSend || liveSpokenText || inputVal).trim();
    if (!text || isLoading) return;

    if (isListening && speechRecognizer) {
      speechRecognizer.stop();
      setIsListening(false);
    }

    const isVoiceUsed = wasVoice || isListening || !!liveSpokenText;
    setInputVal('');
    setLiveSpokenText('');
    setMicError(null);
    stopCurrentAudio();

    const userMsg: SupportChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      isVoiceInput: isVoiceUsed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userProgressSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: SupportChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.replyEnglish || 'I am here to guide your English learning.',
          urduText: data.replyUrdu,
          romanUrduText: data.replyRomanUrdu,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: data.category,
          grammarBreakdown: data.grammarBreakdown,
          correction: data.sentenceCorrection,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.suggestedFollowups && Array.isArray(data.suggestedFollowups)) {
          setSuggestedQuestions(data.suggestedFollowups);
        }
      } else {
        throw new Error('Support Chat error');
      }
    } catch (e) {
      // Intelligent fallback with tailored grammar explanation
      const fallbackMsg: SupportChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `Here is the grammar analysis for your input: "${text}". When speaking English, make sure the subject and verb match, and use the correct tense forms.`,
        urduText: `آپ کے جملے کا جائزہ لیا گیا ہے۔ انگریزی بولتے وقت Subject اور Verb کے تعلق کا خیال رکھیں اور جملے کے زمانے (Tense) کے مطابق الفاظ استعمال کریں۔`,
        romanUrduText:
          'Subject aur verb agreement ka khayal rakhain aur right tense use karain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'grammar',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (id: string, text: string, lang: 'en' | 'ur' = 'en') => {
    setPlayingAudioId(id);
    try {
      await playTextToSpeech(text, lang, audioSpeed);
    } finally {
      setPlayingAudioId(null);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Ustad AI & Grammar Doctor</h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Voice & Doctor
              </span>
            </div>
            <p className="text-xs font-urdu text-emerald-400">
              استاد اے آئی اور گرامر ڈاکٹر · جملہ درستگی اور آواز معاون
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Close Support"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Voice Recognition Language Bar & Mode */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <span>مائیکروفون زبان:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setMicLang('en-US')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                micLang === 'en-US'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English (US)
            </button>
            <button
              onClick={() => setMicLang('ur-PK')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                micLang === 'ur-PK'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>
        <span className="text-[11px] text-emerald-400/90 font-medium hidden sm:inline">
          مائیک دبائیں اور بولیں
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full space-y-2`}
            >
              {/* Message Meta Info */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-1">
                <span className="font-semibold text-slate-400">
                  {isUser ? 'You (آپ)' : 'Ustad AI (استاد اے آئی)'}
                </span>
                {isUser && m.isVoiceInput && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                    <Mic className="h-2.5 w-2.5" /> آواز سے بولا گیا
                  </span>
                )}
                <span>·</span>
                <span>{m.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-sm shadow-md w-full max-w-[92%] ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none ml-auto'
                    : 'bg-slate-800/95 border border-slate-700/80 text-slate-100 rounded-tl-none mr-auto'
                }`}
              >
                {/* Spoken Text */}
                <p className="leading-relaxed text-sm sm:text-base font-medium">
                  {m.text}
                </p>

                {/* Urdu Explanation */}
                {m.urduText && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 font-urdu text-sm sm:text-base text-emerald-300 leading-relaxed">
                    {m.urduText}
                  </div>
                )}

                {/* Roman Urdu */}
                {m.romanUrduText && (
                  <div className="mt-1 text-xs text-slate-400 font-mono">
                    Roman: {m.romanUrduText}
                  </div>
                )}

                {/* Audio Listen Button */}
                {!isUser && (
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-700/40">
                    <button
                      onClick={() => handlePlayAudio(`msg-${m.id}`, m.text, 'en')}
                      disabled={playingAudioId === `msg-${m.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-700/60 hover:bg-emerald-600 hover:text-white px-2.5 py-1 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>
                        {playingAudioId === `msg-${m.id}` ? 'بول رہے ہیں...' : 'انگلش تلفظ سنیں'}
                      </span>
                    </button>
                    {m.urduText && (
                      <button
                        onClick={() => handlePlayAudio(`msg-ur-${m.id}`, m.urduText!, 'ur')}
                        disabled={playingAudioId === `msg-ur-${m.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-700/60 hover:bg-amber-600 hover:text-white px-2.5 py-1 text-xs font-semibold text-slate-200 transition-colors"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>
                          {playingAudioId === `msg-ur-${m.id}` ? 'اردو آڈیو جاری ہے...' : 'اردو سنیں'}
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {/* SPECIFIC GRAMMAR BREAKDOWN CARD */}
                {!isUser && m.grammarBreakdown && (
                  <div className="mt-3.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 p-3.5 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-indigo-300">
                      <BookOpen className="h-4 w-4 text-indigo-400" />
                      <span>گرامر کا اصول: {m.grammarBreakdown.topic}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-white font-medium text-xs sm:text-sm">
                        {m.grammarBreakdown.ruleEnglish}
                      </p>
                      <p className="font-urdu text-emerald-300 text-xs sm:text-sm leading-relaxed">
                        {m.grammarBreakdown.ruleUrdu}
                      </p>
                      {m.grammarBreakdown.ruleRomanUrdu && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          {m.grammarBreakdown.ruleRomanUrdu}
                        </p>
                      )}
                    </div>

                    {/* Example Sentences */}
                    {m.grammarBreakdown.examples && m.grammarBreakdown.examples.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-indigo-500/20">
                        <span className="font-semibold text-indigo-200 block text-[11px]">
                          🌟 روزمرہ مثالیں (Examples):
                        </span>
                        {m.grammarBreakdown.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between gap-2 bg-slate-900/60 p-2 rounded-lg border border-indigo-500/20"
                          >
                            <div className="space-y-0.5">
                              <span className="font-semibold text-white text-xs block">
                                • {ex.en}
                              </span>
                              <span className="font-urdu text-emerald-400 text-xs block">
                                {ex.ur}
                              </span>
                            </div>
                            <button
                              onClick={() => handlePlayAudio(`ex-${m.id}-${i}`, ex.en, 'en')}
                              className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                              title="Listen Example"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.grammarBreakdown.commonMistakes && (
                      <div className="pt-2 border-t border-indigo-500/20 text-rose-300 text-[11px]">
                        <span className="font-bold text-rose-400">⚠️ عام غلطی (Avoid this):</span>{' '}
                        {m.grammarBreakdown.commonMistakes}
                      </div>
                    )}
                  </div>
                )}

                {/* SENTENCE CORRECTION & MISTAKE IDENTIFICATION CARD */}
                {!isUser && m.correction && (
                  <div className="mt-3.5 rounded-xl border border-emerald-500/40 bg-slate-900/90 p-3.5 space-y-3 text-xs shadow-lg">
                    {m.correction.hasMistakes ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                            <span>جملے میں غلطیاں نکالی گئیں (Mistakes Detected)</span>
                          </span>
                          {m.correction.fluencyScore !== undefined && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300 text-[10px] border border-amber-500/30">
                              درستگی: {m.correction.fluencyScore}%
                            </span>
                          )}
                        </div>

                        {/* List of Identified Mistakes */}
                        {m.correction.mistakes && m.correction.mistakes.length > 0 && (
                          <div className="space-y-2">
                            {m.correction.mistakes.map((mis, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 space-y-1.5"
                              >
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="rounded bg-rose-500/20 text-rose-300 px-2 py-0.5 line-through font-mono border border-rose-500/30">
                                    ❌ {mis.mistake}
                                  </span>
                                  <ArrowRight className="h-3 w-3 text-slate-500" />
                                  <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-bold font-mono border border-emerald-500/30">
                                    ✅ {mis.correction}
                                  </span>
                                </div>
                                <p className="font-urdu text-xs text-slate-300 leading-relaxed pt-1">
                                  💡 <span className="text-amber-300 font-semibold">وجہ:</span>{' '}
                                  {mis.explanationUrdu}
                                </p>
                                {mis.explanationRoman && (
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {mis.explanationRoman}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Perfect Correct Sentence Display */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/50 p-3 space-y-2">
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            مکمل درست جملہ (Corrected English):
                          </span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white font-bold text-sm sm:text-base leading-snug">
                              "{m.correction.correctedSentence}"
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() =>
                                  handlePlayAudio(
                                    `corr-${m.id}`,
                                    m.correction!.correctedSentence,
                                    'en'
                                  )
                                }
                                disabled={playingAudioId === `corr-${m.id}`}
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 transition-colors"
                                title="Listen to corrected English"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleCopy(`corr-${m.id}`, m.correction!.correctedSentence)
                                }
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Copy Corrected Sentence"
                              >
                                {copiedId === `corr-${m.id}` ? (
                                  <Check className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Overall Urdu coaching note */}
                        {m.correction.explanationUrdu && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block">
                              استاد کا مشورہ:
                            </span>
                            <p className="font-urdu text-xs text-slate-300 leading-relaxed">
                              {m.correction.explanationUrdu}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Celebration when 100% correct */
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          ماشاءاللہ! آپ کا بولا گیا جملہ گرامر کے اعتبار سے 100% درست ہے!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 animate-pulse">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-urdu text-sm">
              استاد اے آئی جملے کی گرامر چیک کر رہے ہیں... (Analyzing sentence & grammar)...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* LIVE VOICE RECORDING & TRANSCRIPT DISPLAY BANNER */}
      {isListening && (
        <div className="p-3 bg-slate-950 border-t border-emerald-500/50 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="font-bold text-white text-xs sm:text-sm">
                🎙️ آپ بول رہے ہیں... (Live Voice Recognition):
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSendMessage(liveSpokenText, true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow"
              >
                ✅ بھیجیں اور درستگی دیکھیں
              </button>
              <button
                onClick={() => {
                  if (speechRecognizer) speechRecognizer.stop();
                  setIsListening(false);
                  setLiveSpokenText('');
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                منسوخ
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-slate-900 border border-emerald-500/40 p-2.5 min-h-[2.5rem]">
            <p className="text-sm sm:text-base font-bold text-emerald-300 leading-relaxed">
              {liveSpokenText || inputVal || 'اب بولیں، آپ کے بولے ہوئے الفاظ براہِ راست یہاں اور نیچے باکس میں لکھے جائیں گے...'}
            </p>
          </div>
        </div>
      )}

      {/* Fallback Audio Transcribing Spinner */}
      {isTranscribing && (
        <div className="p-3 bg-purple-950/80 border-t border-purple-500/40 text-xs sm:text-sm text-purple-300 flex items-center justify-center gap-2 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>🎙️ آواز کا متن تیار کیا جا رہا ہے (Transcribing with AI)...</span>
        </div>
      )}

      {/* Mic Error Banner */}
      {micError && (
        <div className="p-2.5 bg-rose-950/60 border-t border-rose-500/40 text-xs text-rose-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{micError}</span>
          </span>
          <button
            onClick={() => setMicError(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Suggested Followups & Test Sentences */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-400" /> تجویز کردہ سوالات / جملے:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs text-slate-200 hover:border-emerald-500 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form with Voice Button */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Big Voice Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all shadow-md shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30 ring-4 ring-rose-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/20'
            }`}
            title={isListening ? 'بولنا مکمل کریں' : 'مائیک پر کلک کر کے بولیں'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isListening
                ? '🎤 سن رہے ہیں، بولیں... (آپ کا جملہ یہاں لکھا جا رہا ہے)'
                : 'گرامر کا سوال پوچھیں یا جملہ بولیں / لکھیں...'
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            className={`flex-1 rounded-xl border px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-all ${
              isListening
                ? 'border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/30 font-semibold'
                : 'border-slate-700 bg-slate-800/90 focus:border-emerald-500'
            }`}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputVal.trim() && !liveSpokenText.trim()) || isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors shadow-md shadow-emerald-600/20 shrink-0"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
