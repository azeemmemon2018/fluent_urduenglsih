import React, { useState, useEffect, useRef } from 'react';
import { Character, ChatMessage, VocabularyWord, DifficultyLevel, SentenceCorrection } from '../types';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Languages,
  Play,
  Square,
  Headphones,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  Stethoscope,
  Loader2,
} from 'lucide-react';
import {
  playTextToSpeech,
  createSpeechRecognizer,
  stopCurrentAudio,
  requestMicrophonePermission,
  startAudioRecording,
  transcribeAudioOnServer,
  AudioRecorderController,
} from '../utils/audio';
import { SentenceDoctorModal } from './SentenceDoctorModal';

interface RolePlayChatProps {
  character: Character;
  onBack: () => void;
  audioSpeed: number;
  showUrduScript: boolean;
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  onRecordPracticeSession?: (title: string, score: number) => void;
}

export const RolePlayChat: React.FC<RolePlayChatProps> = ({
  character,
  onBack,
  audioSpeed,
  showUrduScript,
  difficulty,
  setDifficulty,
  onRecordPracticeSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [liveSpokenText, setLiveSpokenText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const audioRecorderRef = useRef<AudioRecorderController | null>(null);
  const spokenTextRef = useRef<string>('');

  // Complete Conversation Audio Player State
  const [isFullPlaying, setIsFullPlaying] = useState<boolean>(false);
  const [fullPlayIndex, setFullPlayIndex] = useState<number>(-1);
  const [fullPlayMode, setFullPlayMode] = useState<'bilingual' | 'en'>('bilingual');
  const fullPlayAbortRef = useRef<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with character greeting
  useEffect(() => {
    fullPlayAbortRef.current = true;
    stopCurrentAudio();
    setIsFullPlaying(false);
    setFullPlayIndex(-1);

    const initialGreeting: ChatMessage = {
      id: 'msg-greeting',
      sender: 'character',
      englishText: character.greetingEnglish,
      urduText: character.greetingUrdu,
      romanUrduText: character.greetingRomanUrdu,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      feedback: {
        score: 100,
        vocabularyLearned: [
          {
            english: 'Welcome',
            urdu: 'خوش آمدید',
            romanUrdu: 'Khush Aamdeed',
            partOfSpeech: 'Interjection',
            exampleSentence: 'Welcome! How can I assist you today?',
            urduMeaning: 'استقبال کرنا',
          },
        ],
      },
    };

    setMessages([initialGreeting]);

    if (autoPlayAudio) {
      playTextToSpeech(character.greetingEnglish, 'en', audioSpeed);
    }

    return () => {
      fullPlayAbortRef.current = true;
      stopCurrentAudio();
    };
  }, [character]);

  useEffect(() => {
    if (!isFullPlaying) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating, isFullPlaying, liveSpokenText]);

  // Full Conversation Player (aik option jis mein complete conversation sun saken)
  const handlePlayFullConversation = async (modeOverride?: 'bilingual' | 'en') => {
    const mode = modeOverride || fullPlayMode;

    if (isFullPlaying) {
      fullPlayAbortRef.current = true;
      await stopCurrentAudio();
      setIsFullPlaying(false);
      setFullPlayIndex(-1);
      return;
    }

    fullPlayAbortRef.current = false;
    setIsFullPlaying(true);

    for (let i = 0; i < messages.length; i++) {
      if (fullPlayAbortRef.current) break;
      setFullPlayIndex(i);
      const msg = messages[i];

      // Scroll message card into view
      const elem = document.getElementById(`chat-msg-${msg.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // 1. Play English
      setPlayingMessageId(`${msg.id}-en`);
      try {
        await playTextToSpeech(msg.englishText, 'en', audioSpeed);
      } catch (err) {
        console.warn('Full chat English error', err);
      }
      setPlayingMessageId(null);

      if (fullPlayAbortRef.current) break;

      // 2. Play Urdu if bilingual mode and Urdu exists
      if (mode === 'bilingual' && msg.urduText) {
        await new Promise((r) => setTimeout(r, 450));
        if (fullPlayAbortRef.current) break;

        setPlayingMessageId(`${msg.id}-ur`);
        try {
          await playTextToSpeech(msg.urduText, 'ur', audioSpeed);
        } catch (err) {
          console.warn('Full chat Urdu error', err);
        }
        setPlayingMessageId(null);
      }

      if (fullPlayAbortRef.current) break;
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsFullPlaying(false);
    setFullPlayIndex(-1);
    setPlayingMessageId(null);
  };

  // Play audio for a specific message
  const handlePlayMessageAudio = async (msgId: string, text: string, lang: 'en' | 'ur' = 'en') => {
    if (isFullPlaying) {
      fullPlayAbortRef.current = true;
      setIsFullPlaying(false);
      setFullPlayIndex(-1);
    }

    setPlayingMessageId(`${msgId}-${lang}`);
    try {
      await playTextToSpeech(text, lang, audioSpeed);
    } finally {
      setPlayingMessageId(null);
    }
  };

  // Toggle voice recording (STT) with continuous listening & live display
  const toggleListening = async () => {
    setMicError(null);

    // If currently listening, stop both and process fallback if needed
    if (isListening) {
      setIsListening(false);
      if (speechRecognizer) {
        try {
          speechRecognizer.stop();
        } catch {}
      }

      const currentSpoken = (spokenTextRef.current || liveSpokenText || inputText).trim();

      // If Web Speech API captured text, we're good!
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
              setInputText(transcript);
              setLiveSpokenText(transcript);
            } else {
              setMicError('آواز واضح نہیں تھی۔ براہ کرم مائیک کے قریب ہو کر دوبارہ بولیں۔');
            }
          }
        } catch (err: any) {
          console.warn('Fallback transcription failed:', err);
          setMicError('آواز ریکگنیشن میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔');
        } finally {
          setIsTranscribing(false);
        }
      }
      return;
    }

    spokenTextRef.current = '';
    setLiveSpokenText('');

    // Step 1: Prompt browser microphone permission if needed
    await requestMicrophonePermission();

    // Step 2: Start background MediaRecorder as guaranteed fallback
    try {
      const recorder = await startAudioRecording();
      audioRecorderRef.current = recorder;
    } catch (e) {
      console.warn('MediaRecorder error:', e);
    }

    // Step 3: Start browser speech recognition for instant real-time typing
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        spokenTextRef.current = transcript;
        setLiveSpokenText(transcript);
        setInputText(transcript);
      },
      async () => {
        // onEnd callback from recognition
        setIsListening(false);
        const currentSpoken = (spokenTextRef.current || liveSpokenText || inputText).trim();

        if (!currentSpoken && audioRecorderRef.current) {
          setIsTranscribing(true);
          try {
            const base64Audio = await audioRecorderRef.current.stop();
            audioRecorderRef.current = null;
            if (base64Audio) {
              const transcript = await transcribeAudioOnServer(base64Audio);
              if (transcript) {
                spokenTextRef.current = transcript;
                setInputText(transcript);
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
        console.warn('Speech recognition warning:', err);
        // Do not abort if audioRecorder is actively recording
      },
      'en-US'
    );

    if (recognizer) {
      setSpeechRecognizer(recognizer);
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err: any) {
        console.warn('Recognizer start error:', err);
        if (audioRecorderRef.current) {
          setIsListening(true);
        } else {
          setMicError('براؤزر میں مائیکروفون شروع نہیں ہو سکا۔ براؤزر کے اوپر مائیک Allow کریں۔');
        }
      }
    } else if (audioRecorderRef.current) {
      setIsListening(true);
    } else {
      setMicError('مائیکروفون دستیاب نہیں ہے۔ آپ نیچے دیے گئے سوالات پر کلک کر کے بھی ٹیسٹ کر سکتے ہیں۔');
    }
  };

  // Send message to Gemini server
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || liveSpokenText || inputText).trim();
    if (!messageContent || isGenerating) return;

    if (isListening && speechRecognizer) {
      speechRecognizer.stop();
      setIsListening(false);
    }

    if (isFullPlaying) {
      fullPlayAbortRef.current = true;
      setIsFullPlaying(false);
      setFullPlayIndex(-1);
    }

    stopCurrentAudio();
    setInputText('');
    setLiveSpokenText('');

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      englishText: messageContent,
      isVoiceInput: isListening || !!liveSpokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character.name,
          characterRole: character.role,
          characterSetting: character.setting,
          personaPrompt: character.personaPrompt,
          message: messageContent,
          difficulty,
          history: newMessages.map((m) => ({
            sender: m.sender,
            text: m.englishText,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();

      // Attach sentence correction to the user message
      if (data.sentenceCorrection) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessageId
              ? {
                  ...m,
                  correction: data.sentenceCorrection,
                  howToSayInEnglish: data.howToSayInEnglish,
                  userLanguageDetected: data.detectedLanguage,
                  englishTranslation: data.userEnglishTranslation,
                }
              : m
          )
        );
      }

      const characterReply: ChatMessage = {
        id: `char-${Date.now()}`,
        sender: 'character',
        englishText: data.characterEnglishReply,
        urduText: data.characterUrduReply,
        romanUrduText: data.characterRomanUrduReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userLanguageDetected: data.detectedLanguage,
        englishTranslation: data.userEnglishTranslation,
        howToSayInEnglish: data.howToSayInEnglish,
        feedback: {
          score: data.fluencyScore ?? 85,
          grammarNotesUrdu: data.coachingNotesUrdu,
          grammarNotesRoman: data.coachingNotesRoman,
          pronunciationTipUrdu: data.pronunciationTipUrdu,
          vocabularyLearned: data.vocabularyWords || [],
        },
      };

      setMessages((prev) => [...prev, characterReply]);
      setExpandedFeedbackId(characterReply.id);

      if (onRecordPracticeSession) {
        onRecordPracticeSession(`Roleplay: ${character.role}`, data.fluencyScore ?? 88);
      }

      if (autoPlayAudio) {
        handlePlayMessageAudio(characterReply.id, characterReply.englishText, 'en');
      }
    } catch (err: any) {
      console.error('Error generating chat reply:', err);
      const fallbackReply: ChatMessage = {
        id: `char-err-${Date.now()}`,
        sender: 'character',
        englishText: 'I understand what you mean. Could you please say that once again or ask another question?',
        urduText: 'میں آپ کی بات سمجھ گیا ہوں۔ کیا آپ دوبارہ دہرا سکتے ہیں یا کوئی دوسرا سوال پوچھ سکتے ہیں؟',
        romanUrduText: 'Main aap ki baat samajh gaya hoon. Dobara keh sakte hain?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRestartChat = () => {
    stopCurrentAudio();
    fullPlayAbortRef.current = true;
    setIsFullPlaying(false);
    setFullPlayIndex(-1);

    const initialGreeting: ChatMessage = {
      id: `msg-greeting-${Date.now()}`,
      sender: 'character',
      englishText: character.greetingEnglish,
      urduText: character.greetingUrdu,
      romanUrduText: character.greetingRomanUrdu,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      feedback: {
        score: 100,
        vocabularyLearned: [
          {
            english: 'Start Fresh',
            urdu: 'نئے سرے سے شروع کرنا',
            romanUrdu: 'Naye siray se shuru',
            partOfSpeech: 'Phrase',
            exampleSentence: 'Let us start fresh with great confidence!',
            urduMeaning: 'دوبارہ سے آغاز',
          },
        ],
      },
    };

    setMessages([initialGreeting]);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Dedicated Character Header */}
      <header className="shrink-0 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 py-3 sm:px-6 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Back button and Character Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fullPlayAbortRef.current = true;
                stopCurrentAudio();
                onBack();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              title="واپس تمام کرداروں پر جائیں"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>واپس (Back)</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl p-1.5 rounded-2xl bg-slate-800 border border-slate-700">
                {character.avatarIcon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-white text-base sm:text-lg leading-tight">
                    {character.name}
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    آن لائن
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="font-medium text-slate-300">{character.role}</span>
                  <span>·</span>
                  <span className="text-slate-400">{character.setting}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Controls & Full Conversation Player */}
          <div className="flex items-center gap-2">
            {/* Sentence Doctor Button */}
            <button
              onClick={() => setIsDoctorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition-all text-xs font-bold shadow-sm"
              title="بول کر جملے کی غلطیاں چیک کروائیں"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">جملہ چیکر</span>
            </button>

            {/* Complete Conversation Audio Player Button */}
            <div className="flex items-center rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-1">
              <button
                onClick={() => handlePlayFullConversation()}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  isFullPlaying
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
                title="تمام گفتگو شروع سے آخر تک سنیں"
              >
                {isFullPlaying ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span>روکیں (Stop)</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span className="hidden sm:inline">مکمل گفتگو سنیں</span>
                    <span className="sm:hidden">سنیں</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const nextMode = fullPlayMode === 'bilingual' ? 'en' : 'bilingual';
                  setFullPlayMode(nextMode);
                  if (isFullPlaying) {
                    handlePlayFullConversation(nextMode);
                  }
                }}
                className="ml-1 px-2 py-1 text-[11px] font-semibold text-indigo-300 hover:text-white rounded"
                title="انگلش صرف یا انگلش+اردو موڈ"
              >
                {fullPlayMode === 'bilingual' ? '🇬🇧+🇵🇰 دونوں' : '🇬🇧 صرف انگلش'}
              </button>
            </div>

            {/* Difficulty Toggle */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    difficulty === lvl
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'Beginner' ? 'آسان' : lvl === 'Intermediate' ? 'درمیانہ' : 'مشکل'}
                </button>
              ))}
            </div>

            {/* Auto-Play Toggle */}
            <button
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                autoPlayAudio
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
              title={autoPlayAudio ? 'Voice auto-play active' : 'Voice muted'}
            >
              {autoPlayAudio ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Restart Chat */}
            <button
              onClick={handleRestartChat}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Start fresh conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Suggested Quick Starter Chips */}
      <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>یہ کہہ سکتے ہیں:</span>
          </span>
          {character.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap rounded-full border border-slate-700/80 bg-slate-800/90 px-3.5 py-1 text-slate-200 hover:border-indigo-400 hover:bg-indigo-600/30 hover:text-white transition-all text-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isFeedbackOpen = expandedFeedbackId === msg.id;
            const isCurrentlyPlayingThis = isFullPlaying && fullPlayIndex === idx;
            const isEnglishPlaying = playingMessageId === `${msg.id}-en`;
            const isUrduPlaying = playingMessageId === `${msg.id}-ur`;

            return (
              <div
                key={msg.id}
                id={`chat-msg-${msg.id}`}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 transition-all ${
                  isCurrentlyPlayingThis ? 'scale-[1.01]' : ''
                }`}
              >
                {/* Sender Identity & Time */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'آپ (You)' : character.name}
                  </span>
                  {isUser && msg.isVoiceInput && (
                    <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] text-rose-300 font-bold border border-rose-500/30">
                      🎙️ بول کر کہا گیا
                    </span>
                  )}
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                  {isCurrentlyPlayingThis && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 animate-pulse">
                      Playing 🔊
                    </span>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm sm:text-base shadow-xl transition-all max-w-xl md:max-w-2xl ${
                    isCurrentlyPlayingThis
                      ? 'border-2 border-emerald-400 bg-slate-800 ring-4 ring-emerald-500/20 shadow-emerald-500/20'
                      : isUser
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Spoken English Text */}
                  <div className="font-medium text-white leading-relaxed text-base sm:text-lg">
                    "{msg.englishText}"
                  </div>

                  {/* Character Urdu & Roman Urdu translation */}
                  {!isUser && (msg.urduText || msg.romanUrduText) && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                      {msg.urduText && (
                        <p className="font-urdu text-base sm:text-lg font-medium text-emerald-400 leading-relaxed">
                          {msg.urduText}
                        </p>
                      )}
                      {msg.romanUrduText && (
                        <p className="text-xs text-slate-400 font-mono">
                          Roman: {msg.romanUrduText}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Audio Playback Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/40">
                    {/* Hear English */}
                    <button
                      onClick={() => handlePlayMessageAudio(msg.id, msg.englishText, 'en')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                        isEnglishPlaying
                          ? 'bg-emerald-500 text-slate-950 font-bold animate-pulse'
                          : 'bg-slate-700/60 text-slate-200 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title="Listen to English line"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{isEnglishPlaying ? 'انگلش بول رہے ہیں...' : isUser ? 'اپنا بولا گیا جملہ سنیں' : 'انگلش سنیں'}</span>
                    </button>

                    {/* Hear Urdu (plays authentic Urdu voice) */}
                    {!isUser && msg.urduText && (
                      <button
                        onClick={() => handlePlayMessageAudio(msg.id, msg.urduText!, 'ur')}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          isUrduPlaying
                            ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                            : 'bg-slate-700/60 text-slate-200 hover:bg-amber-600 hover:text-white'
                        }`}
                        title="Listen to Urdu audio"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>{isUrduPlaying ? 'اردو بول رہے ہیں...' : 'اردو سنیں'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Sentence Correction on USER's Spoken Sentence */}
                {isUser && msg.correction && (
                  <div className="w-full max-w-xl md:max-w-2xl rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-4 text-xs text-slate-300 space-y-3 shadow-lg">
                    {msg.correction.hasMistakes ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                            <span>جملے میں غلطیاں نکالی گئیں (Mistakes Corrected)</span>
                          </span>
                          <span className="text-[11px] font-bold text-indigo-400">
                            روانی: {msg.correction.fluencyScore}%
                          </span>
                        </div>

                        {/* Breakdown of mistakes */}
                        {msg.correction.mistakes && msg.correction.mistakes.length > 0 && (
                          <div className="space-y-1.5">
                            {msg.correction.mistakes.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 space-y-1"
                              >
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-rose-300 font-semibold line-through">
                                    {m.mistake}
                                  </span>
                                  <ArrowRight className="h-3 w-3 text-slate-500" />
                                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">
                                    {m.correction}
                                  </span>
                                </div>
                                <p className="font-urdu text-xs text-slate-300 pt-0.5 leading-relaxed">
                                  {m.explanationUrdu}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 100% Correct Sentence */}
                        <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/30 p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>درست انگلش جملہ (Correct English):</span>
                            </span>
                            <button
                              onClick={() =>
                                handlePlayMessageAudio(
                                  `${msg.id}-corr`,
                                  msg.correction!.correctedSentence,
                                  'en'
                                )
                              }
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                            >
                              <Volume2 className="h-3 w-3" />
                              <span>درست سنیں</span>
                            </button>
                          </div>
                          <p className="text-sm font-bold text-white leading-relaxed">
                            "{msg.correction.correctedSentence}"
                          </p>
                        </div>

                        {/* Urdu Explanation */}
                        {msg.correction.explanationUrdu && (
                          <p className="font-urdu text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                            💡 {msg.correction.explanationUrdu}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-emerald-400">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>ماشاءاللہ! آپ کا جملہ 100% درست اور پرفیکٹ ہے!</span>
                        </span>
                        <span className="text-[11px] font-bold text-indigo-400">
                          روانی: {msg.correction.fluencyScore}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Coaching & Smart Feedback Card on Character Reply */}
                {!isUser && msg.feedback && (
                  <div className="w-full max-w-xl md:max-w-2xl rounded-2xl border border-indigo-500/30 bg-indigo-950/25 p-3 sm:p-4 text-xs text-slate-300 space-y-2">
                    <div
                      onClick={() => setExpandedFeedbackId(isFeedbackOpen ? null : msg.id)}
                      className="flex items-center justify-between cursor-pointer font-bold text-indigo-300"
                    >
                      <span className="flex items-center gap-2 text-xs sm:text-sm">
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                        <span>انگلش کوچنگ اور رہنمائی ({msg.feedback.score}% Fluency)</span>
                      </span>
                      <span className="text-xs text-indigo-400 hover:underline">
                        {isFeedbackOpen ? 'بند کریں ▲' : 'مزید تفصیلات دیکھیں ▼'}
                      </span>
                    </div>

                    {isFeedbackOpen && (
                      <div className="space-y-3 pt-2 border-t border-indigo-500/20 animate-fadeIn">
                        {/* How to say in English */}
                        {msg.howToSayInEnglish && (
                          <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/40 p-3">
                            <span className="font-bold text-emerald-400 text-xs block mb-1">
                              💡 بہتر انگلش فقرہ (How to say this in English):
                            </span>
                            <span className="text-white text-sm sm:text-base font-semibold block">
                              "{msg.howToSayInEnglish}"
                            </span>
                          </div>
                        )}

                        {/* Urdu grammar coaching notes */}
                        {msg.feedback.grammarNotesUrdu && (
                          <div className="space-y-1">
                            <span className="text-slate-400 font-semibold block">گرامر اور انداز:</span>
                            <p className="font-urdu text-sm text-slate-200 leading-relaxed">
                              {msg.feedback.grammarNotesUrdu}
                            </p>
                          </div>
                        )}

                        {/* Pronunciation tip */}
                        {msg.feedback.pronunciationTipUrdu && (
                          <div className="space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/60">
                            <span className="text-amber-400 font-semibold block">تلفظ کی اہم ٹپ:</span>
                            <p className="font-urdu text-xs text-amber-200/90 leading-relaxed">
                              {msg.feedback.pronunciationTipUrdu}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isGenerating && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold p-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span>{character.name} جواب سوچ رہے ہیں... ({character.role} is typing...)</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Voice & Typing Input Bar */}
      <footer className="shrink-0 border-t border-slate-800 bg-slate-900/95 p-3 sm:p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Fallback Audio Transcribing Spinner */}
          {isTranscribing && (
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-300 text-xs sm:text-sm animate-pulse shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span>🎙️ آواز کا متن تیار کیا جا رہا ہے (Transcribing with AI)...</span>
            </div>
          )}

          {/* Mic Error Banner */}
          {micError && (
            <div className="flex items-center justify-between gap-2 p-2.5 bg-rose-950/70 border border-rose-500/40 rounded-xl text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{micError}</span>
              </div>
              <button
                onClick={() => setMicError(null)}
                className="text-slate-400 hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Live Voice Speech Display Banner (جب بولیں تو لائیو اسکرین پر الفاظ نظر آئیں) */}
          {isListening && (
            <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900 p-4 shadow-2xl ring-4 ring-emerald-500/20 animate-pulse">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    🎙️ آپ بول رہے ہیں... (Live Voice Recognition):
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendMessage(liveSpokenText || inputText)}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md"
                  >
                    ✅ بول لیا، بھیجیں اور غلطیاں دیکھیں
                  </button>
                  <button
                    onClick={() => {
                      if (speechRecognizer) {
                        try { speechRecognizer.stop(); } catch {}
                      }
                      if (audioRecorderRef.current) {
                        audioRecorderRef.current.cancel();
                        audioRecorderRef.current = null;
                      }
                      setIsListening(false);
                      setLiveSpokenText('');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                  >
                    منسوخ
                  </button>
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-emerald-300 min-h-[1.75rem] leading-relaxed">
                {liveSpokenText || inputText || 'اب بولیں، آپ کے بولے ہوئے الفاظ براہِ راست یہاں اور نیچے باکس میں لکھے جائیں گے...'}
              </p>
            </div>
          )}

          {/* Quick Suggested Sentences for 1-Tap Practice */}
          {character.suggestedQuestions && character.suggestedQuestions.length > 0 && !isListening && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">💡 نمونہ بولیں:</span>
              {character.suggestedQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(q);
                    setLiveSpokenText(q);
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs"
                >
                  "{q}"
                </button>
              ))}
            </div>
          )}

          {/* Input Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Big Voice Recording Button */}
            <button
              onClick={toggleListening}
              className={`flex items-center justify-center h-12 w-12 rounded-2xl transition-all shadow-xl shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/40 ring-4 ring-rose-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/20'
              }`}
              title={isListening ? 'بولنا مکمل کریں' : 'مائیک پر کلک کر کے بولیں'}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {/* Text Input Field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? '🎤 سن رہے ہیں، بولیں... (آپ کا جملہ یہاں لکھا جا رہا ہے)'
                    : 'انگلش یا اردو میں بات کریں (Type in English or Roman Urdu)...'
                }
                disabled={isGenerating}
                className={`w-full rounded-2xl border px-4 py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none transition-all ${
                  isListening
                    ? 'border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/30 font-semibold'
                    : 'border-slate-700 bg-slate-800/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={(!inputText.trim() && !liveSpokenText.trim()) || isGenerating || isTranscribing}
              className="flex items-center justify-center h-12 px-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 shrink-0"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">بھیجیں (Send)</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            💡 مائیک دبا کر بولیں، آپ کا جملہ فوری طور پر باکس میں لکھا ہوا آئے گا اور AI تمام غلطیاں درست کر کے بتائے گا۔
          </div>
        </div>
      </footer>

      {/* Sentence Doctor Modal */}
      <SentenceDoctorModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        audioSpeed={audioSpeed}
      />
    </div>
  );
};
