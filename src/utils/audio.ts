// Audio Player, Speech Recognition & Gemini Live PCM Streaming Utilities

export function pcmToAudioBuffer(
  audioCtx: AudioContext,
  base64Data: string,
  sampleRate: number = 24000
): AudioBuffer {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const numSamples = int16.length;

  const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    channelData[i] = int16[i] / 32768.0;
  }
  return audioBuffer;
}

export function float32To16BitPCMBase64(inputData: Float32Array): string {
  const output = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    const s = Math.max(-1, Math.min(1, inputData[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(output.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let activeAudioSource: AudioBufferSourceNode | null = null;
let sharedAudioContext: AudioContext | null = null;
let currentAudioElement: HTMLAudioElement | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

export async function stopCurrentAudio() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.removeAttribute('src');
      currentAudioElement.load();
    } catch {}
    currentAudioElement = null;
  }
  if (activeAudioSource) {
    try {
      activeAudioSource.stop();
    } catch {}
    activeAudioSource = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export async function playTextToSpeech(
  text: string,
  language: 'en' | 'ur' = 'en',
  rate: number = 1.0,
  voiceName?: string
): Promise<void> {
  await stopCurrentAudio();

  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();

  if (!cleanText) return;

  // Primary: Use robust streaming audio endpoint (delivers high-quality native Urdu & English MP3)
  try {
    const audioUrl = `/api/tts-audio?text=${encodeURIComponent(cleanText)}&lang=${language}`;
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.playbackRate = Math.max(0.5, Math.min(2.0, rate || 1.0));
    currentAudioElement = audio;

    await new Promise<void>((resolve, reject) => {
      let isSettled = false;

      const finish = () => {
        if (!isSettled) {
          isSettled = true;
          if (currentAudioElement === audio) {
            currentAudioElement = null;
          }
          resolve();
        }
      };

      const fail = (err: any) => {
        if (!isSettled) {
          isSettled = true;
          if (currentAudioElement === audio) {
            currentAudioElement = null;
          }
          reject(err);
        }
      };

      audio.onended = finish;
      audio.onerror = fail;

      audio.src = audioUrl;
      audio.play().catch(fail);
    });

    return;
  } catch (audioStreamErr) {
    console.warn('Audio streaming failed, falling back to Web Speech Synthesis:', audioStreamErr);
  }

  // Fallback: Browser Web Speech API
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported on this browser');
      resolve();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();
      if (language === 'ur') {
        // Try Urdu, else Hindi (mutually intelligible phonetics in Hindustani)
        const urduOrHindi = voices.find(
          (v) =>
            v.lang.startsWith('ur') ||
            v.lang.startsWith('hi') ||
            v.name.toLowerCase().includes('urdu') ||
            v.name.toLowerCase().includes('hindi')
        );
        if (urduOrHindi) {
          utterance.voice = urduOrHindi;
          utterance.lang = urduOrHindi.lang;
        } else {
          utterance.lang = 'en-US';
        }
      } else {
        utterance.lang = 'en-US';
        const enVoice = voices.find(
          (v) =>
            (v.lang.startsWith('en') && v.name.includes('Natural')) ||
            v.name.includes('Google') ||
            v.lang === 'en-US' ||
            v.lang === 'en-GB'
        );
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

// Browser Speech Recognition (STT) interface
export interface SpeechRecognitionResultState {
  transcript: string;
  isListening: boolean;
  error?: string;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

// Explicitly prompt the browser for microphone permission
export async function requestMicrophonePermission(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately so mic isn't held open
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission denied or not available:', err);
    return false;
  }
}

// MediaRecorder controller for capturing audio as fallback STT
export interface AudioRecorderController {
  stop: () => Promise<string | null>;
  cancel: () => void;
}

export async function startAudioRecording(): Promise<AudioRecorderController | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let mimeType = 'audio/webm';
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
    }

    const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.start(200);

    return {
      stop: (): Promise<string | null> => {
        return new Promise((resolve) => {
          mediaRecorder.onstop = () => {
            stream.getTracks().forEach((track) => track.stop());
            if (chunks.length === 0) {
              resolve(null);
              return;
            }
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          };

          try {
            if (mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        });
      },
      cancel: () => {
        try {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        } catch {}
        stream.getTracks().forEach((track) => track.stop());
      },
    };
  } catch (err) {
    console.warn('Failed to start audio recording:', err);
    return null;
  }
}

// Transcribe audio using Gemini on server
export async function transcribeAudioOnServer(base64Audio: string): Promise<string> {
  const response = await fetch('/api/transcribe-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioData: base64Audio }),
  });
  if (!response.ok) {
    throw new Error('Transcription service returned an error');
  }
  const data = await response.json();
  return data.transcript || '';
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (errorMsg: string) => void,
  lang: string = 'en-US'
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const res = event.results[i];
        const text = res[0]?.transcript || '';
        if (res.isFinal) {
          finalTranscript += text + ' ';
        } else {
          interimTranscript += text;
        }
      }

      const combined = (finalTranscript + interimTranscript).trim();
      if (combined) {
        onResult(combined, false);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error || 'speech_error';
      if (err === 'no-speech') {
        // Paused or silent moment; do not abort recognition
        return;
      }
      let userFriendlyMsg = 'مائیکروفون میں مسئلہ پیش آیا۔';
      if (err === 'not-allowed') {
        userFriendlyMsg = 'مائیکروفون کی اجازت نہیں ملی۔ براہ کرم براؤزر کے اوپر مائیکروفون Allow کریں۔';
      } else if (err === 'audio-capture') {
        userFriendlyMsg = 'کوئی مائیکروفون نہیں ملا۔ اپنا مائیک چیک کریں۔';
      } else if (err === 'network') {
        userFriendlyMsg = 'نیٹ ورک یا براؤزر اسپیچ سروس میں تاخیر ہے۔';
      }
      onError(userFriendlyMsg);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (err: any) {
    console.warn('SpeechRecognition initialization failed:', err);
    return null;
  }
}
