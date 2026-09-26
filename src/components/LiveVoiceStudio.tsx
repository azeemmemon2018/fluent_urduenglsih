import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Zap,
  Activity,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import {
  pcmToAudioBuffer,
  float32To16BitPCMBase64,
  getAudioContext,
  playTextToSpeech,
  createSpeechRecognizer,
  stopCurrentAudio
} from '../utils/audio';

interface LiveVoiceStudioProps {
  audioSpeed: number;
  onRecordPracticeSession: (title: string, score: number) => void;
}

export const LiveVoiceStudio: React.FC<LiveVoiceStudioProps> = ({
  audioSpeed,
  onRecordPracticeSession,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [transcriptLog, setTranscriptLog] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: "Hello! I am your real-time conversational speaking companion powered by Gemini Live voice. Tap 'Start Live Voice' to start speaking freely!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const startLiveSession = async () => {
    stopCurrentAudio();

    try {
      // Setup output audio context at 24kHz for Gemini Live model output
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;

      // Connect to server WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        // Start microphone capture at 16kHz
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });
          mediaStreamRef.current = stream;

          inputAudioCtxRef.current = new AudioCtx({ sampleRate: 16000 });
          const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
          const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            const channel = e.inputBuffer.getChannelData(0);

            // Compute volume for visualizer
            let sum = 0;
            for (let i = 0; i < channel.length; i++) {
              sum += channel[i] * channel[i];
            }
            const rms = Math.sqrt(sum / channel.length);
            setAudioLevel(Math.min(100, Math.round(rms * 400)));

            // Convert Float32 to 16-bit PCM Base64 and send
            const base64Audio = float32To16BitPCMBase64(channel);
            ws.send(JSON.stringify({ audio: base64Audio }));
          };

          source.connect(processor);
          processor.connect(inputAudioCtxRef.current.destination);
          setIsSpeaking(true);
        } catch (micErr) {
          console.warn('Microphone permission or capture error:', micErr);
          // Enable fallback simulated speech interaction
          startFallbackVoiceInteraction();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.audio) {
            setIsAiResponding(true);
            playLiveAudioChunk(data.audio);
          }

          if (data.interrupted) {
            setIsAiResponding(false);
            if (outputAudioCtxRef.current) {
              nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
          }

          if (data.event === 'connected') {
            console.log('Gemini Live session connected');
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      };

      ws.onerror = () => {
        startFallbackVoiceInteraction();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsSpeaking(false);
        setIsAiResponding(false);
      };
    } catch (err) {
      console.warn('Starting live session error, starting fallback:', err);
      startFallbackVoiceInteraction();
    }
  };

  const playLiveAudioChunk = (base64Data: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    try {
      const buffer = pcmToAudioBuffer(ctx, base64Data, 24000);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = audioSpeed;

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.connect(ctx.destination);
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration / audioSpeed;

      source.onended = () => {
        if (ctx.currentTime >= nextStartTimeRef.current - 0.05) {
          setIsAiResponding(false);
        }
      };
    } catch (e) {
      console.error('Error playing live chunk:', e);
    }
  };

  const startFallbackVoiceInteraction = () => {
    setIsConnected(true);
    setIsSpeaking(true);

    const recognizer = createSpeechRecognizer(
      async (transcript, isFinal) => {
        if (isFinal) {
          setTranscriptLog((prev) => [
            ...prev,
            { sender: 'user', text: transcript, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ]);

          // Get Gemini flash response + TTS
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                characterName: 'Gemini Voice Coach',
                characterRole: 'Conversational Partner',
                characterSetting: 'Daily Life Dialogue',
                personaPrompt: 'You are a warm, fluent conversational English speaker. Reply in 1-2 engaging spoken sentences.',
                message: transcript,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const reply = data.characterEnglishReply || 'That is great, tell me more!';
              setTranscriptLog((prev) => [
                ...prev,
                { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              ]);
              await playTextToSpeech(reply, 'en', audioSpeed);
              onRecordPracticeSession('Live Conversational Practice', 90);
            }
          } catch (e) {
            console.error('Fallback chat error:', e);
          }
        }
      },
      () => {},
      () => {}
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch {}
    }
  };

  const stopLiveSession = () => {
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setIsAiResponding(false);
    setAudioLevel(0);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Radio className="h-4 w-4 animate-pulse text-purple-400" />
              <span>Gemini Live Voice API · قدرتی اور بے ساختہ آواز میں گفتگو</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
              Real-Time Conversational Voice Experience
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Experience seamless, low-latency live voice interaction with Gemini Live. Speak naturally into your microphone and hear immediate conversational replies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                isConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                }`}
              />
              <span>{isConnected ? 'Session Live' : 'Disconnected'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden backdrop-blur shadow-2xl">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ${
            isConnected ? 'opacity-100' : 'opacity-20'
          }`}
        />

        {/* Pulsing Audio Sphere */}
        <div className="relative flex items-center justify-center my-4">
          {/* Animated concentric rings */}
          {isConnected && (
            <>
              <div
                className="absolute h-48 w-48 rounded-full bg-purple-500/15 animate-ping"
                style={{ animationDuration: '3s' }}
              />
              <div
                className="absolute h-36 w-36 rounded-full bg-indigo-500/20 animate-pulse"
                style={{ animationDuration: '1.5s' }}
              />
            </>
          )}

          <div
            className={`h-28 w-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isAiResponding
                ? 'bg-gradient-to-tr from-purple-500 to-indigo-400 scale-110 shadow-purple-500/50'
                : isSpeaking
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 scale-105 shadow-emerald-500/40'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}
          >
            {isAiResponding ? (
              <Headphones className="h-12 w-12 text-slate-950 animate-bounce" />
            ) : isSpeaking ? (
              <Mic className="h-12 w-12 text-slate-950" />
            ) : (
              <MicOff className="h-10 w-10 text-slate-500" />
            )}
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">
            {isAiResponding
              ? 'Gemini Live is Speaking...'
              : isSpeaking
              ? 'Listening to you... Speak in English or Urdu'
              : 'Live Voice Session Idle'}
          </h2>
          <p className="text-xs text-slate-400 font-urdu">
            {isAiResponding
              ? 'جیمینائی آپ کو آواز میں جواب دے رہا ہے...'
              : isSpeaking
              ? 'مائیکروفون میں بولیں، ہم آپ کی آواز سن رہے ہیں'
              : 'لائیو آواز کی گفتگو شروع کرنے کے لیے بٹن دبائیں'}
          </p>
        </div>

        {/* Audio Wave Meter */}
        {isConnected && (
          <div className="flex items-center gap-1.5 h-6">
            {[40, 70, 100, 60, 90, 45, 80, 50, 75, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-emerald-400 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(6, (audioLevel / 100) * h)}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Big Action Button */}
        <div>
          {!isConnected ? (
            <button
              onClick={startLiveSession}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
            >
              <Radio className="h-5 w-5 animate-pulse" />
              <span>Start Live Voice Conversation</span>
            </button>
          ) : (
            <button
              onClick={stopLiveSession}
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
            >
              <MicOff className="h-4 w-4" />
              <span>End Live Voice Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Dialogue Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-purple-400" />
            Live Voice Session Transcripts
          </h3>
          <span className="text-xs text-slate-500">Real-Time Speech Stream</span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {transcriptLog.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs sm:text-sm flex flex-col ${
                t.sender === 'user'
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-white ml-8'
                  : 'border-slate-800 bg-slate-900/60 text-slate-200 mr-8'
              }`}
            >
              <span className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
                <span>{t.sender === 'user' ? 'You (Spoken)' : 'Gemini Live Voice'}</span>
                <span>{t.time}</span>
              </span>
              <p className="leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
