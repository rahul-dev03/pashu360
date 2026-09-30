/**
 * Client-side Voice Interface connecting to Server-side Sarvam AI endpoints.
 * Never handles or exposes API keys.
 */

export interface STTClientOptions {
  audioBlob?: Blob;
  languageCode?: string; // 'hi-IN' | 'en-IN' | 'mr-IN'
  stepContext?: string;
  promptHint?: string;
}

export interface STTClientResponse {
  transcript: string;
  languageCode: string;
  confidence?: number;
  isPlaceholder?: boolean;
}

export interface TTSClientResponse {
  audioBase64: string;
  mimeType: string;
  isPlaceholder?: boolean;
}

/**
 * Converts a Blob to a Base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Calls server-side speech-to-text endpoint (Sarvam saaras:v3)
 */
export async function callSpeechToText(options: STTClientOptions): Promise<STTClientResponse> {
  try {
    let audioBase64: string | undefined;
    let mimeType = 'audio/webm';

    if (options.audioBlob) {
      audioBase64 = await blobToBase64(options.audioBlob);
      mimeType = options.audioBlob.type || 'audio/webm';
    }

    const response = await fetch('/api/sarvam/stt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBase64,
        mimeType,
        languageCode: options.languageCode || 'hi-IN',
        stepContext: options.stepContext,
        promptHint: options.promptHint,
      }),
    });

    if (response.ok) {
      const data: STTClientResponse = await response.json();
      return data;
    } else {
      console.warn('STT API response not ok:', response.status);
    }
  } catch (err) {
    console.warn('Error calling /api/sarvam/stt:', err);
  }

  // Graceful client fallback
  return {
    transcript: options.promptHint || 'Gauri gave 10.2 litres this morning.',
    languageCode: options.languageCode || 'hi-IN',
    confidence: 0.9,
    isPlaceholder: true,
  };
}

/**
 * Calls server-side text-to-speech endpoint (Sarvam bulbul:v3)
 */
export async function callTextToSpeech(
  text: string,
  languageCode: string = 'hi-IN',
  speaker: string = 'kavya'
): Promise<TTSClientResponse | null> {
  try {
    const response = await fetch('/api/sarvam/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        languageCode,
        speaker,
      }),
    });

    if (response.ok) {
      const data: TTSClientResponse = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Error calling /api/sarvam/tts:', err);
  }
  return null;
}

/**
 * Plays base64 audio and returns a promise that resolves when playback ends.
 * Synchronizes with waveform through onStart and onEnd callbacks.
 */
export function playAudioFromBase64(
  base64Data: string,
  mimeType = 'audio/wav',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audioUrl = base64Data.startsWith('data:')
        ? base64Data
        : `data:${mimeType};base64,${base64Data}`;

      const audio = new Audio(audioUrl);

      const cleanup = () => {
        if (onEnd) onEnd();
        resolve();
      };

      audio.onplay = () => {
        if (onStart) onStart();
      };
      audio.onended = cleanup;
      audio.onerror = (e) => {
        console.warn('Audio playback error:', e);
        cleanup();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play was prevented or failed:', err);
          cleanup();
        });
      }
    } catch (err) {
      console.warn('Failed to initialize Audio():', err);
      if (onEnd) onEnd();
      resolve();
    }
  });
}

/**
 * Native SpeechSynthesis helper as spoken voice fallback if needed
 * Configured with calm Indian female voice parameters and slow conversational rhythm
 */
export function speakWithBrowserSynthesis(
  text: string,
  lang = 'hi-IN',
  onStart?: () => void,
  onEnd?: () => void,
  onWordBoundary?: (wordIndex: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[“”—]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = 0.88; // Slow, calm conversational rhythm
      utterance.pitch = 1.05; // Warm, natural female pitch

      // Select natural Indian female voice if available in the browser
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Preferred female Indian voices
        const indianFemale = voices.find(
          (v) =>
            (v.lang === lang || v.lang.startsWith(lang.slice(0, 2)) || v.lang.includes('IN')) &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('kavya') ||
              v.name.toLowerCase().includes('priya') ||
              v.name.toLowerCase().includes('veena') ||
              v.name.toLowerCase().includes('lekha') ||
              v.name.toLowerCase().includes('swara') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('geeta') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('neerja'))
        );

        const anyLangVoice = voices.find(
          (v) => v.lang === lang || v.lang.startsWith(lang.slice(0, 2))
        );

        if (indianFemale) {
          utterance.voice = indianFemale;
        } else if (anyLangVoice) {
          utterance.voice = anyLangVoice;
        }
      }

      let wordCount = 0;
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          wordCount++;
          if (onWordBoundary) onWordBoundary(wordCount);
        }
      };

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
      resolve();
    }
  });
}

/**
 * Real-time Speech Streamer using Web Speech Recognition
 * Streams live Hindi/Hinglish interim results directly to the transcript box.
 */
export class LiveSpeechStreamer {
  private recognition: any = null;
  private isRunning: boolean = false;

  constructor(
    private onInterim: (text: string) => void,
    private onFinal: (text: string) => void,
    private lang: string = 'hi-IN'
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = this.lang;

        recog.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }
          if (interim) this.onInterim(interim);
          if (final) this.onFinal(final);
        };

        recog.onerror = (e: any) => {
          // Non-fatal, MediaRecorder will still provide audio for Sarvam STT
          if (e.error !== 'no-speech') {
            console.log('Interim recognition event:', e.error);
          }
        };

        this.recognition = recog;
      } catch (err) {
        console.warn('Speech recognition not available:', err);
      }
    }
  }

  start() {
    if (this.recognition && !this.isRunning) {
      try {
        this.isRunning = true;
        this.recognition.start();
      } catch {
        this.isRunning = false;
      }
    }
  }

  stop() {
    if (this.recognition && this.isRunning) {
      try {
        this.isRunning = false;
        this.recognition.stop();
      } catch {
        this.isRunning = false;
      }
    }
  }
}
